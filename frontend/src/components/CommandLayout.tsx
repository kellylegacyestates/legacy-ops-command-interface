import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { INSTITUTIONAL_INFO, DOMAINS } from '@/constants';

export const CommandLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="h-screen bg-obsidian text-platinum flex flex-col">
      {/* Top Navigation */}
      <nav className="border-b border-charcoal-700 bg-charcoal-900">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80">
            <div className="w-6 h-6 bg-gold-600 rounded-none flex items-center justify-center">
              <span className="text-obsidian font-mono font-bold text-xs">
                KLE
              </span>
            </div>
            <span className="font-mono text-sm font-bold text-platinum">
              {INSTITUTIONAL_INFO.platform}
            </span>
          </Link>

          <div className="flex gap-1">
            {[
              { path: '/dashboard', label: 'Dashboard' },
              { path: '/command', label: 'Command' },
              { path: '/reports', label: 'Reports' },
              { path: '/settings', label: 'Settings' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-colors ${
                  location.pathname === item.path
                    ? 'text-obsidian bg-gold-600'
                    : 'text-platinum hover:text-gold-500 hover:bg-charcoal-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="text-xs font-mono text-zinc-400">
            <span>Session Active</span>
          </div>
        </div>
      </nav>

      {/* Main Content with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Domains Navigation */}
        <aside className="w-64 border-r border-charcoal-700 bg-charcoal-900 overflow-y-auto">
          <div className="p-4 border-b border-charcoal-700">
            <h3 className="font-mono text-xs font-bold text-platinum uppercase tracking-wider mb-3">
              Intelligence Domains
            </h3>
            <div className="space-y-2">
              {DOMAINS.map((domain) => (
                <Link
                  key={domain.id}
                  to={domain.path}
                  className={`block px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-none transition-colors ${
                    location.pathname === domain.path
                      ? 'bg-gold-600 text-obsidian font-bold'
                      : 'text-zinc-400 hover:text-platinum hover:bg-charcoal-800'
                  }`}
                >
                  <span className="mr-2">{domain.icon}</span>
                  {domain.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="p-4 text-xs text-zinc-500 font-mono space-y-3">
            <div>
              <p className="font-bold text-platinum mb-1">Access Level</p>
              <p className="text-zinc-400">Administrative</p>
            </div>
            <div>
              <p className="font-bold text-platinum mb-1">Last Activity</p>
              <p className="text-zinc-400">Just now</p>
            </div>
            <button className="w-full mt-4 px-3 py-2 border border-gold-600 text-gold-500 text-xs font-bold hover:bg-gold-600 hover:text-obsidian transition-colors rounded-none">
              Logout
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
