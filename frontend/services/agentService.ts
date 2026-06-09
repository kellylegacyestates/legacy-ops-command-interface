import { AgentConfig, Session } from '../types';
import { MOCK_AGENT_RESPONSE } from '../constants';

/**
 * Service to interact with Vertex AI Agent Development Kit (ADK)
 * Note: In a true production environment, these calls should be routed through
 * a secure backend proxy to handle authentication.
 */

export class AgentService {
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  private getBaseUrl(): string {
    if (this.config.proxyUrl) {
      return this.config.proxyUrl;
    }
    return `https://${this.config.location}-aiplatform.googleapis.com/v1/projects/${this.config.projectId}/locations/${this.config.location}/reasoningEngines/${this.config.agentId}`;
  }

  async createSession(userId: string): Promise<Session> {
    try {
      const response = await fetch(`${this.getBaseUrl()}:query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { user_id: userId },
          classMethod: 'async_create_session'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.statusText}`);
      }

      const data = await response.json();
      return data.output as Session;
    } catch (error) {
      console.error("AgentService: Error creating session", error);
      return { id: `mock-session-${Date.now()}`, userId };
    }
  }

  async streamQuery(
    sessionId: string,
    userId: string,
    message: string,
    onChunk: (text: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.getBaseUrl()}:streamQuery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {
            user_id: userId,
            session_id: sessionId,
            message: message
          },
          classMethod: 'async_stream_query'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to stream query: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const decoder = new TextDecoder();
      for await (const chunk of response.body as any) {
        const chunkText = decoder.decode(chunk, { stream: true });
        try {
          const parsed = JSON.parse(chunkText);
          if (parsed.content && parsed.content.parts && parsed.content.parts.length > 0) {
            onChunk(parsed.content.parts[0].text);
          }
        } catch (e) {
          console.warn("Failed to parse chunk", chunkText);
        }
      }
    } catch (error) {
      console.error("AgentService: Error streaming query", error);
      throw error;
    }
  }
}

/**
 * SINGLE INTEGRATION POINT FOR AGENT API CALLS
 * This function handles both real API calls (if configured) and mock responses.
 */
export const sendCommandAgentRequest = async (
  input: string,
  config: AgentConfig,
  session: Session | null,
  onChunk: (text: string) => void
): Promise<void> => {
  
  // If no real config is provided, use the mock engine
  if (!config.projectId || !config.location || !config.agentId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        onChunk(MOCK_AGENT_RESPONSE);
        resolve();
      }, 1500);
    });
  }

  // Real ADK call
  const service = new AgentService(config);
  const activeSession = session || await service.createSession('operator-01');
  
  const structuredPrompt = `Analyze the following operational request and provide output strictly in these sections: CLASSIFICATION, FACTS PRESENTED, OPERATIONAL ISSUE, RISK ASSESSMENT, RECOMMENDED ACTION, RECORDKEEPING INSTRUCTION, IMPLEMENTATION STEP.\n\nRequest: ${input}`;
  
  await service.streamQuery(activeSession.id, 'operator-01', structuredPrompt, onChunk);
};
