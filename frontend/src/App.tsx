import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { CommandLayout } from './components/CommandLayout';
import { AgentWorkspace } from './components/AgentWorkspace';
import { DomainCards } from './components/DomainCards';
import { ReportBuilder } from './components/ReportBuilder';
import { SettingsPage } from './components/SettingsPage';
import { IntakeForm } from './components/IntakeForm';
import { AdminPanel } from './components/AdminPanel';
import { DomainPage } from './components/DomainPage';
import DocumentIntelligence from './components/DocumentIntelligence';
import { DOMAINS } from './constants';

const App: React.FC = () => {
  const [showDocumentIntelligence, setShowDocumentIntelligence] = useState(false);

  if (showDocumentIntelligence) {
    return (
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <DocumentIntelligence />
        <button
          onClick={() => setShowDocumentIntelligence(false)}
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            padding: '8px 16px',
            background: '#2C3E50',
            color: '#F5F0E8',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
            fontSize: '12px',
            fontWeight: '700',
            borderRadius: '2px',
            zIndex: 1000,
          }}
        >
          ✕ Close Engine
        </button>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/intake" element={<IntakeForm />} />
        <Route path="/admin" element={<AdminPanel />} />
        
        <Route element={<CommandLayout />}>
          <Route path="/command" element={<AgentWorkspace />} />
          <Route path="/dashboard" element={<DashboardWithEngine onOpenEngine={() => setShowDocumentIntelligence(true)} />} />
          <Route path="/reports" element={<ReportBuilder />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Dynamic Domain Routes */}
          {DOMAINS.map(domain => (
            <Route 
              key={domain.id} 
              path={domain.path} 
              element={<DomainPage domain={domain} />} 
            />
          ))}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

interface DashboardWithEngineProps {
  onOpenEngine: () => void;
}

const DashboardWithEngine: React.FC<DashboardWithEngineProps> = ({ onOpenEngine }) => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-obsidian">
      <div className="mb-8">
        <h1 className="text-2xl font-mono text-platinum tracking-tight">Intelligence Domains</h1>
        <p className="text-sm text-zinc-500 mt-2 font-mono">Select a domain to initiate a targeted operational review.</p>
      </div>

      {/* Document Intelligence Engine Card */}
      <div className="mb-8">
        <button
          onClick={() => window.location.href = "/dashboard"}
          className="w-full bg-gradient-to-r from-cyan-900 to-cyan-800 border-2 border-cyan-700 p-6 hover:from-cyan-800 hover:to-cyan-700 hover:border-cyan-600 transition-all group cursor-pointer text-left"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-mono text-sm text-cyan-100 uppercase tracking-wider pr-4 font-bold">
              Legacy Document Intelligence Engine™
            </h3>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-900 px-2 py-1 rounded">NEW</span>
          </div>
          
          <p className="text-xs text-cyan-50 leading-relaxed mb-6">
            Build structured records from scattered documents, timelines, facts, assumptions, and missing information. Organize, classify, and generate comprehensive record reports.
          </p>
          
          <div className="mt-auto pt-4 border-t border-cyan-700 flex justify-between items-center">
            <span className="text-[10px] font-mono text-cyan-300">
              6 Active Tabs
            </span>
            <button className="text-[10px] font-mono text-cyan-100 hover:text-cyan-50 uppercase tracking-wider opacity-100 transition-opacity">
              Open Engine →
            </button>
          </div>
        </button>
      </div>

      {/* Existing Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <DomainCards />
      </div>
    </div>
  );
};

export default App;
