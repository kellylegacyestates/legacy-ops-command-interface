import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Activity, Database, Lock, ChevronRight } from 'lucide-react';
import { KlatNotice } from './ui/KlatNotice';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-obsidian flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      <header className="w-full p-6 flex justify-between items-center z-10 border-b border-charcoal-800/50 bg-obsidian/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-charcoal-800 border border-charcoal-700 flex items-center justify-center">
            <Shield size={16} className="text-cyan-500" />
          </div>
          <span className="font-mono text-lg font-semibold tracking-widest text-platinum">LEGACY OPS<span className="text-cyan-600">™</span></span>
        </div>
        <button 
          onClick={() => navigate('/command')}
          className="text-xs font-mono text-zinc-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
        >
          SYSTEM LOGIN <ChevronRight size={14} />
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 z-10 max-w-5xl mx-auto w-full py-20">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-charcoal-900 border border-charcoal-700 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">System Online • Governed by KLAT</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-platinum leading-tight">
            Web3 Operations <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-700">Intelligence Platform</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
            Legacy Ops™ transforms Web3 participation into Operations Intelligence™ by connecting wallet access, KLAT verification, contributor records, credential issuance, treasury separation, governance workflows, and institutional records into one governed operating layer.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button 
              onClick={() => navigate('/command')}
              className="w-full sm:w-auto px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-obsidian font-mono text-sm font-bold tracking-wider transition-all flex items-center justify-center gap-2"
            >
              ENTER COMMAND INTERFACE <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => navigate('/intake')}
              className="w-full sm:w-auto px-8 py-4 bg-charcoal-900 border border-charcoal-700 hover:border-charcoal-500 text-platinum font-mono text-sm tracking-wider transition-all"
            >
              REQUEST OPERATIONS REVIEW
            </button>
          </div>

          <div className="pt-16 border-t border-charcoal-800/50 mt-16">
            <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest">
              Verification precedes access. Contribution precedes recognition. Records preserve accountability.
            </p>
          </div>
        </div>

        <div id="intelligence-domains" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24">
          {[
            { icon: Lock, title: 'Access Control', desc: 'Governed wallet intelligence and credential verification.' },
            { icon: Activity, title: 'Workflow Intelligence', desc: 'Structured governance and operational continuity.' },
            { icon: Database, title: 'Immutable Records', desc: 'Institutional-grade logging of all operational decisions.' }
          ].map((feature, idx) => (
            <div key={idx} className="bg-charcoal-900/50 border border-charcoal-800 p-6 flex flex-col items-start gap-4 hover:border-charcoal-600 transition-colors">
              <feature.icon size={24} className="text-cyan-600" />
              <h3 className="font-mono text-sm text-platinum uppercase tracking-wider">{feature.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full p-6 border-t border-charcoal-800/50 bg-charcoal-900/30 z-10 mt-auto">
        <div className="max-w-5xl mx-auto text-center">
          <KlatNotice className="max-w-4xl mx-auto" />
          <div className="mt-4 text-[10px] text-zinc-700 font-mono">
            © {new Date().getFullYear()} Legacy Ops™. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
