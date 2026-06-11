import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  accessLevel: string;
  status: 'active' | 'pending' | 'restricted';
  joinedDate: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    email: 'sarah@kellylegacyestates.com',
    role: 'Fiduciary Officer',
    accessLevel: 'Executive',
    status: 'active',
    joinedDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'James Patterson',
    email: 'james@kellylegacyestates.com',
    role: 'Governance Specialist',
    accessLevel: 'Administrative',
    status: 'active',
    joinedDate: '2024-02-20',
  },
  {
    id: '3',
    name: 'Diana Chen',
    email: 'diana@kellylegacyestates.com',
    role: 'Records Manager',
    accessLevel: 'Member',
    status: 'active',
    joinedDate: '2024-03-10',
  },
];

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedTab, setSelectedTab] = useState<'users' | 'audit' | 'system'>('users');

  return (
    <div className="h-full bg-obsidian p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-platinum mb-2">
          Administrative Panel
        </h1>
        <p className="text-sm text-zinc-500 font-mono">
          Platform administration and user management.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b border-charcoal-700">
        {['users', 'audit', 'system'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab as typeof selectedTab)}
            className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
              selectedTab === tab
                ? 'text-gold-600 border-b-2 border-gold-600'
                : 'text-zinc-400 hover:text-platinum'
            }`}
          >
            {tab === 'users'
              ? 'User Management'
              : tab === 'audit'
              ? 'Audit Log'
              : 'System Status'}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {selectedTab === 'users' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="font-mono font-bold text-platinum text-lg">
              Active Users
            </h2>
            <button className="px-4 py-2 bg-gold-600 text-obsidian font-mono font-bold text-xs uppercase tracking-wider hover:bg-gold-500 transition-colors rounded-none">
              Add User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-charcoal-700">
                <tr>
                  <th className="text-left px-4 py-3 font-mono text-xs font-bold text-platinum uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-mono text-xs font-bold text-platinum uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-mono text-xs font-bold text-platinum uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 font-mono text-xs font-bold text-platinum uppercase tracking-wider">
                    Access Level
                  </th>
                  <th className="text-left px-4 py-3 font-mono text-xs font-bold text-platinum uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-mono text-xs font-bold text-platinum uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-charcoal-800 hover:bg-charcoal-900 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-platinum">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-400">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-400">
                      {user.role}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-400">
                      {user.accessLevel}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      <span
                        className={`px-2 py-1 rounded-none font-bold ${
                          user.status === 'active'
                            ? 'bg-green-900 text-green-300'
                            : 'bg-yellow-900 text-yellow-300'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="text-xs font-mono text-gold-500 hover:text-gold-400">
                        Edit
                      </button>
                      <button className="text-xs font-mono text-zinc-500 hover:text-red-500">
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Tab */}
      {selectedTab === 'audit' && (
        <div>
          <h2 className="font-mono font-bold text-platinum text-lg mb-6">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {[
              'User sarah@kellylegacyestates.com logged in',
              'Report generated by james@kellylegacyestates.com',
              'Settings updated by admin',
              'User diana@kellylegacyestates.com accessed Fiduciary domain',
            ].map((log, idx) => (
              <div
                key={idx}
                className="bg-charcoal-900 border border-charcoal-700 p-3 font-mono text-xs text-zinc-400"
              >
                <span className="text-gold-500">[{new Date().toLocaleTimeString()}]</span>{' '}
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Tab */}
      {selectedTab === 'system' && (
        <div className="grid grid-cols-2 gap-4 max-w-2xl">
          <StatCard title="API Status" value="Operational" color="green" />
          <StatCard title="Database" value="Connected" color="green" />
          <StatCard title="Active Sessions" value="12" color="blue" />
          <StatCard title="System Uptime" value="99.9%" color="green" />
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  color: 'green' | 'blue' | 'yellow' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  const colorMap = {
    green: 'text-green-500 bg-green-950',
    blue: 'text-blue-500 bg-blue-950',
    yellow: 'text-yellow-500 bg-yellow-950',
    red: 'text-red-500 bg-red-950',
  };

  return (
    <div className={`border border-charcoal-700 p-6 rounded-none ${colorMap[color]}`}>
      <p className="font-mono text-xs text-zinc-400 mb-2">{title}</p>
      <p className="font-mono text-2xl font-bold">{value}</p>
    </div>
  );
};
