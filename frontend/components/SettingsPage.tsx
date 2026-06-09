import React, { useState, useEffect } from 'react';
import { ShieldAlert, Save, RefreshCw, Activity } from 'lucide-react';
import { AgentConfig } from '../types';
import { KlatNotice } from './ui/KlatNotice';

export const SettingsPage: React.FC = () => {
  const [config, setConfig] = useState<AgentConfig>({
    projectId: '',
    location: '',
    agentId: '',
    proxyUrl: ''
  });
  const [saved, setSaved] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'Disconnected' | 'Testing' | 'Connected' | 'Failed'>('Disconnected');

  useEffect(() => {
    const stored = localStorage.getItem('legacy_ops_agent_config');
    if (stored) {
      setConfig(JSON.parse(stored));
      setConnectionStatus('Connected'); // Assume connected if config exists for UI purposes
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('legacy_ops_agent_config', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestConnection = () => {
    setConnectionStatus('Testing');
    // Mock connection test
    setTimeout(() => {
      if (config.projectId || config.proxyUrl) {
        setConnectionStatus('Connected');
      } else {
        setConnectionStatus('Failed');
      }
    }, 1500);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the configuration?")) {
      localStorage.removeItem('legacy_ops_agent_config');
      setConfig({ projectId: '', location: '', agentId: '', proxyUrl: '' });
      setConnectionStatus('Disconnected');
    }
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-obsidian flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-mono text-platinum tracking-tight uppercase">System Configuration</h1>
          <p className="text-sm text-zinc-500 mt-2 font-mono">Secure connection parameters for Legacy AI™ Command Agent.</p>
        </div>

        <form onSubmit={handleSave} className="bg-charcoal-900 border border-charcoal-800 p-6 md:p-8 space-y-6">
          <div className="bg-amber-950/30 border border-amber-900/50 p-4 flex gap-3 items-start">
            <ShieldAlert size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-xs text-amber-200/90 font-mono leading-relaxed font-bold uppercase tracking-wider">
                Production Security Notice
              </p>
              <p className="text-xs text-amber-200/70 font-mono leading-relaxed">
                Production agent calls must route through a secure backend proxy or Cloud Function. Browser-side bearer tokens are temporary testing only and must not be used in production.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-obsidian border border-charcoal-700 p-4">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Connection Status</span>
            <div className="flex items-center gap-2">
              {connectionStatus === 'Testing' && <RefreshCw size={14} className="text-cyan-500 animate-spin" />}
              {connectionStatus === 'Connected' && <Activity size={14} className="text-emerald-500" />}
              {connectionStatus === 'Failed' && <ShieldAlert size={14} className="text-rose-500" />}
              <span className={`text-xs font-mono uppercase tracking-wider ${
                connectionStatus === 'Connected' ? 'text-emerald-400' :
                connectionStatus === 'Failed' ? 'text-rose-400' :
                connectionStatus === 'Testing' ? 'text-cyan-400' : 'text-zinc-500'
              }`}>
                {connectionStatus}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-mono text-cyan-500 uppercase tracking-widest border-b border-charcoal-800 pb-2">Agent Connection</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Project ID</label>
                <input 
                  type="text" 
                  value={config.projectId}
                  onChange={(e) => setConfig({...config, projectId: e.target.value})}
                  className="w-full bg-obsidian border border-charcoal-700 text-platinum text-sm p-3 focus:outline-none focus:border-cyan-600 font-mono transition-colors"
                  placeholder="e.g., legacy-ops-prod"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Location</label>
                <input 
                  type="text" 
                  value={config.location}
                  onChange={(e) => setConfig({...config, location: e.target.value})}
                  className="w-full bg-obsidian border border-charcoal-700 text-platinum text-sm p-3 focus:outline-none focus:border-cyan-600 font-mono transition-colors"
                  placeholder="e.g., us-central1"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Agent ID (Reasoning Engine)</label>
              <input 
                type="text" 
                value={config.agentId}
                onChange={(e) => setConfig({...config, agentId: e.target.value})}
                className="w-full bg-obsidian border border-charcoal-700 text-platinum text-sm p-3 focus:outline-none focus:border-cyan-600 font-mono transition-colors"
                placeholder="projects/.../locations/.../reasoningEngines/..."
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-mono text-cyan-500 uppercase tracking-widest border-b border-charcoal-800 pb-2">Secure Routing</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Backend Proxy URL (Optional)</label>
              <input 
                type="text" 
                value={config.proxyUrl || ''}
                onChange={(e) => setConfig({...config, proxyUrl: e.target.value})}
                className="w-full bg-obsidian border border-charcoal-700 text-platinum text-sm p-3 focus:outline-none focus:border-cyan-600 font-mono transition-colors"
                placeholder="https://api.yourdomain.com/agent-proxy"
              />
              <p className="text-[10px] text-zinc-600 font-mono mt-1">If provided, all agent requests will be routed here instead of directly to Google APIs.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-charcoal-800 flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={handleTestConnection}
                className="px-4 py-2 bg-obsidian border border-charcoal-700 hover:border-cyan-600 text-platinum font-mono text-xs flex items-center gap-2 transition-colors"
              >
                TEST CONNECTION
              </button>
              <button 
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-obsidian border border-charcoal-700 hover:border-rose-900 hover:text-rose-400 text-zinc-400 font-mono text-xs flex items-center gap-2 transition-colors"
              >
                RESET
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-emerald-500">{saved ? 'Configuration Saved' : ''}</span>
              <button 
                type="submit"
                className="px-6 py-3 bg-cyan-600 text-obsidian font-mono text-sm font-bold tracking-wider hover:bg-cyan-500 transition-colors flex items-center gap-2"
              >
                <Save size={16} /> SAVE CONFIGURATION
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 text-center">
          <KlatNotice />
        </div>
      </div>
    </div>
  );
};
