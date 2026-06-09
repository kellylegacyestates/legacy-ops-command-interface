import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DOMAINS } from '../constants';
import { RiskBadge } from './ui/Badge';
import { ArrowUpRight } from 'lucide-react';

export const DomainCards: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 h-full overflow-y-auto bg-obsidian">
      <div className="mb-8">
        <h1 className="text-2xl font-mono text-platinum tracking-tight">Intelligence Domains</h1>
        <p className="text-sm text-zinc-500 mt-2 font-mono">Select a domain to initiate a targeted operational review.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DOMAINS.map((domain) => (
          <div 
            key={domain.id} 
            onClick={() => navigate(domain.path)}
            className="bg-charcoal-900 border border-charcoal-800 p-5 flex flex-col h-full hover:border-cyan-900 transition-colors group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-mono text-sm text-platinum uppercase tracking-wider pr-4">{domain.title}</h3>
              <RiskBadge level={domain.status} />
            </div>
            
            <p className="text-xs text-zinc-400 leading-relaxed flex-grow mb-6">
              {domain.description}
            </p>
            
            <div className="mt-auto pt-4 border-t border-charcoal-800 flex justify-between items-center">
              <span className="text-[10px] font-mono text-zinc-600">
                Last: {new Date(domain.lastReviewed).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
              <button className="text-[10px] font-mono text-cyan-500 hover:text-cyan-400 flex items-center gap-1 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                Review <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
