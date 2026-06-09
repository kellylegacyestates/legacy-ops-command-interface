import React, { useState } from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { AgentConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AgentConfig;
  onSave: (config: AgentConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [localConfig, setLocalConfig] = useState<AgentConfig>(config);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 backdrop-blur-sm">
      <div className="bg-charcoal-900 border border-charcoal-700 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-charcoal-800">
          <h2 className="text-sm font-mono text-platinum uppercase tracking-widest">Secure Agent Configuration</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-platinum transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-amber-950/30 border border-amber-900/50 p-3 flex gap-3 items-start">
            <ShieldAlert size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-200/70 font-mono leading-relaxed">
              Connection parameters for Legacy AI™ Command Agent. Ensure you are operating within a secured network perimeter.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Project ID</label>
            <input 
              type="text" 
              value={localConfig.projectId}
              onChange={(e) => setLocalConfig({...localConfig, projectId: e.target.value})}
              className="w-full bg-charcoal-800 border border-charcoal-700 text-platinum text-sm p-2 focus:outline-none focus:border-cyan-600 font-mono transition-colors"
              placeholder="e.g., legacy-ops-prod"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Location</label>
            <input 
              type="text" 
              value={localConfig.location}
              onChange={(e) => setLocalConfig({...localConfig, location: e.target.value})}
              className="w-full bg-charcoal-800 border border-charcoal-700 text-platinum text-sm p-2 focus:outline-none focus:border-cyan-600 font-mono transition-colors"
              placeholder="e.g., us-central1"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Agent ID</label>
            <input 
              type="text" 
              value={localConfig.agentId}
              onChange={(e) => setLocalConfig({...localConfig, agentId: e.target.value})}
              className="w-full bg-charcoal-800 border border-charcoal-700 text-platinum text-sm p-2 focus:outline-none focus:border-cyan-600 font-mono transition-colors"
              placeholder="Reasoning Engine ID"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-platinum transition-colors"
            >
              CANCEL
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-xs font-mono bg-cyan-600 text-obsidian hover:bg-cyan-500 transition-colors font-semibold"
            >
              SAVE CONFIGURATION
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
