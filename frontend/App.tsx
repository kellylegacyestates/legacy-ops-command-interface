import React from 'react';
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
import { DOMAINS } from './constants';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/intake" element={<IntakeForm />} />
        <Route path="/admin" element={<AdminPanel />} />
        
        <Route element={<CommandLayout />}>
          <Route path="/command" element={<AgentWorkspace />} />
          <Route path="/dashboard" element={<DomainCards />} />
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

export default App;
