import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, Key, Users, BadgeCheck, 
  Landmark, GitMerge, FileText, AlertTriangle, BarChart3, Settings, Terminal
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/command', label: 'Command Agent', icon: Terminal },
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/wallets', label: 'Wallet Intelligence', icon: Wallet },
    { path: '/token-access', label: 'Token Access', icon: Key },
    { path: '/contributors', label: 'Contributors', icon: Users },
    { path: '/credentials', label: 'Credentials', icon: BadgeCheck },
    { path: '/treasury', label: 'Treasury', icon: Landmark },
    { path: '/governance', label: 'Governance Workflows', icon: GitMerge },
    { path: '/records', label: 'Records', icon: FileText },
    { path: '/risk', label: 'Risk Review', icon: AlertTriangle },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-charcoal-900 border-r border-charcoal-800 flex flex-col h-full">
      <div className="p-4 border-b border-charcoal-800 flex items-center gap-3">
        <div className="w-6 h-6 bg-obsidian border border-charcoal-700 flex items-center justify-center">
          <div className="w-2 h-2 bg-cyan-500"></div>
        </div>
        <Link to="/" className="font-mono text-sm font-bold tracking-widest text-platinum hover:text-cyan-400 transition-colors">
          LEGACY OPS™
        </Link>
      </div>
      
      <div className="flex-grow overflow-y-auto py-4">
        <div className="px-4 mb-2">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Command Modules</span>
        </div>
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-mono transition-colors ${
                  isActive 
                    ? 'bg-charcoal-800 text-cyan-400 border-l-2 border-cyan-500' 
                    : 'text-zinc-400 hover:bg-charcoal-800/50 hover:text-platinum border-l-2 border-transparent'
                }`}
              >
                <item.icon size={16} className={isActive ? 'text-cyan-500' : 'text-zinc-500'} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-charcoal-800">
        <Link 
          to="/settings"
          onClick={onCloseMobile}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-mono transition-colors ${
            currentPath === '/settings' ? 'text-cyan-400' : 'text-zinc-500 hover:text-platinum'
          }`}
        >
          <Settings size={16} />
          System Config
        </Link>
      </div>
    </div>
  );
};
