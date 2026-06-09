import React from 'react';
import { Activity, ShieldAlert, FileCheck, ArrowRight, Database } from 'lucide-react';
import { RiskBadge } from './ui/Badge';
import { RiskLevel } from '../types';

export const RightPanel: React.FC = () => {
  return (
    <div className="w-80 bg-charcoal-900 border-l border-charcoal-800 flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-charcoal-800">
        <h2 className="text-xs font-mono text-platinum uppercase tracking-widest flex items-center gap-2">
          <Activity size={14} className="text-cyan-500" />
          Intelligence Summary
        </h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Status Block */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Current Review Status</div>
          <div className="bg-obsidian border border-charcoal-700 p-3 flex justify-between items-center">
            <span className="text-sm font-mono text-platinum">Active Session</span>
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          </div>
        </div>

        {/* Risk Level */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">System Risk Level</div>
          <div className="bg-obsidian border border-charcoal-700 p-3 flex items-center gap-3">
            <ShieldAlert size={16} className="text-amber-500" />
            <span className="text-sm font-mono text-platinum flex-grow">Elevated</span>
            <RiskBadge level={RiskLevel.YELLOW} />
          </div>
        </div>

        {/* Evidence Status */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Evidence Status</div>
          <div className="bg-obsidian border border-charcoal-700 p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">On-chain Records</span>
              <span className="text-emerald-400">VERIFIED</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">Governance Docs</span>
              <span className="text-amber-400">PENDING</span>
            </div>
          </div>
        </div>

        {/* Required Records */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Required Records</div>
          <div className="bg-obsidian border border-charcoal-700 p-3">
            <ul className="space-y-2 text-xs font-mono text-zinc-400">
              <li className="flex items-start gap-2">
                <FileCheck size={14} className="text-cyan-600 mt-0.5 flex-shrink-0" />
                <span>Multisig modification proposal #442</span>
              </li>
              <li className="flex items-start gap-2">
                <FileCheck size={14} className="text-cyan-600 mt-0.5 flex-shrink-0" />
                <span>Contributor credential issuance log</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Recommended Next Action</div>
          <div className="bg-cyan-950/30 border border-cyan-900/50 p-3">
            <p className="text-xs font-mono text-cyan-100 leading-relaxed">
              Initiate credential verification workflow for proposed treasury signer before proceeding with multisig modification.
            </p>
            <button className="mt-3 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-wider">
              Execute Workflow <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Recordkeeping */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Recordkeeping Instruction</div>
          <div className="bg-obsidian border border-charcoal-700 p-3 flex items-start gap-3">
            <Database size={14} className="text-zinc-500 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
              All queries in this session are logged to the immutable governance registry under ID: <span className="text-zinc-300">LOG-883-A</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
