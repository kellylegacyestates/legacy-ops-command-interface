/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Intercepts fetch requests to Google Cloud AI APIs and 
 * proxies them to the local Node.js backend server.
 */

declare global {
  interface Window {
    fetch: typeof fetch;
    WebSocket: typeof WebSocket;
  }
}

const originalFetch = window.fetch;
const originalWebSocket = window.WebSocket;

function isValidUrl(url: string): boolean {
  try {
    const HOST_NAME = 'aiplatform.googleapis.com';
    const MODEL_METHODS = ['generateContent', 'predict', 'streamGenerateContent'];
    const AGENT_METHODS = ['query', 'streamQuery'];

    const isSafePathSegment = (val: string): boolean =>
      val && encodeURIComponent(val) === val;

    const urlObj = new URL(url);

    if (!urlObj.hostname.endsWith(HOST_NAME)) {
      return false;
    }

    const pathSegments = urlObj.pathname.split('/');

    // Publisher models
    if (
      pathSegments.length === 6 &&
      pathSegments[0] === '' &&
      pathSegments[2] === 'publishers' &&
      pathSegments[3] === 'google' &&
      pathSegments[4] === 'models' &&
      urlObj.hostname === HOST_NAME
    ) {
      if (!isSafePathSegment(pathSegments[1])) {
        return false;
      }
      const modelAndMethod = pathSegments[5].split(':');
      return (
        modelAndMethod.length === 2 &&
        isSafePathSegment(modelAndMethod[0]) &&
        MODEL_METHODS.includes(modelAndMethod[1])
      );
    }

    // Reasoning Engines
    if (
      pathSegments.length === 8 &&
      pathSegments[0] === '' &&
      pathSegments[2] === 'projects' &&
      pathSegments[4] === 'locations' &&
      pathSegments[6] === 'reasoningEngines' &&
      urlObj.hostname.endsWith(`-${HOST_NAME}`)
    ) {
      if (
        !isSafePathSegment(pathSegments[1]) ||
        !isSafePathSegment(pathSegments[3]) ||
        !isSafePathSegment(pathSegments[5])
      ) {
        return false;
      }
      const idAndMethod = pathSegments[7].split(':');
      return (
        idAndMethod.length === 2 &&
        isSafePathSegment(idAndMethod[0]) &&
        AGENT_METHODS.includes(idAndMethod[1])
      );
    }

    // Live API (WebSocket)
    if (
      url ===
      'wss://aiplatform.googleapis.com//ws/google.cloud.aiplatform.v1beta1.LlmBidiService/BidiGenerateContent'
    ) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
}

console.log(
  '[Vertex AI Proxy Interceptor] Initialized. Intercepting for Cloud AI API URLs'
);

// Intercept WebSocket connections
(window as any).WebSocket = function (
  url: string | URL,
  protocols?: string | string[]
) {
  const inputUrl =
    typeof url === 'string' ? url : url instanceof URL ? url.href : null;

  if (inputUrl && isValidUrl(inputUrl)) {
    console.log('[Vertex AI Proxy Interceptor] Intercepted WebSocket request:', inputUrl);
    const targetUrl = encodeURIComponent(inputUrl);
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const proxyUrl = `${protocol}//${host}/ws-proxy?target=${targetUrl}`;
    return new originalWebSocket(proxyUrl, protocols);
  }

  return new originalWebSocket(url, protocols);
};

(window as any).WebSocket.prototype = originalWebSocket.prototype;
(window as any).WebSocket.CONNECTING = originalWebSocket.CONNECTING;
(window as any).WebSocket.OPEN = originalWebSocket.OPEN;
(window as any).WebSocket.CLOSING = originalWebSocket.CLOSING;
(window as any).WebSocket.CLOSED = originalWebSocket.CLOSED;

// Intercept fetch requests
(window as any).fetch = async function (
  url: string | Request,
  options?: RequestInit
): Promise<Response> {
  const inputUrl =
    typeof url === 'string' ? url : url instanceof Request ? url.url : null;
  const normalizedUrl =
    typeof inputUrl === 'string' ? inputUrl.split('?')[0] : null;

  if (normalizedUrl && isValidUrl(normalizedUrl)) {
    console.log('[Vertex AI Proxy Interceptor] Intercepted API request:', normalizedUrl);

    const requestDetails = {
      originalUrl: normalizedUrl,
      headers: options?.headers
        ? Object.fromEntries(new Headers(options.headers).entries())
        : {},
      method: options?.method || 'POST',
      body: options?.body,
    };

    try {
      const proxyFetchOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Proxy': 'd6ukDHVq03TLAx1yHpvfRJPSV9Bm_7pA',
        },
        body: JSON.stringify(requestDetails),
      };

      console.log('[Vertex AI Proxy Interceptor] Proxying to /api-proxy');
      const proxyResponse = await originalFetch('/api-proxy', proxyFetchOptions);

      if (proxyResponse.status === 401) {
        console.error('[Vertex AI Proxy Interceptor] Authentication failed (401)');
        return proxyResponse;
      }

      if (!proxyResponse.ok) {
        console.error(
          `[Vertex AI Proxy Interceptor] Proxy request failed: ${proxyResponse.status} ${proxyResponse.statusText}`
        );
        return proxyResponse;
      }

      return proxyResponse;
    } catch (error) {
      console.error('[Vertex AI Proxy Interceptor] Error:', error);
      return new Response(
        JSON.stringify({
          error: 'Proxying failed',
          details: error instanceof Error ? error.message : String(error),
          name: error instanceof Error ? error.name : 'Unknown',
          proxiedUrl: inputUrl,
        }),
        {
          status: 503,
          statusText: 'Local Proxy Unavailable',
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  return originalFetch.apply(window, [url, options] as Parameters<typeof fetch>);
};

export {};
