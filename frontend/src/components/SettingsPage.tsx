import React, { useState } from 'react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    autoRefresh: true,
    language: 'en',
  });

  return (
    <div className="h-full bg-obsidian p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-platinum mb-2">
          Settings
        </h1>
        <p className="text-sm text-zinc-500 font-mono">
          Manage platform configuration and preferences.
        </p>
      </div>

      {/* Settings Sections */}
      <div className="max-w-2xl space-y-8">
        {/* Display Settings */}
        <div className="bg-charcoal-900 border border-charcoal-700 p-6 rounded-none">
          <h2 className="font-mono font-bold text-platinum mb-4 uppercase tracking-wider">
            Display
          </h2>
          <div className="space-y-4">
            <SettingRow
              label="Theme"
              value={settings.theme}
              onChange={(val) => setSettings({ ...settings, theme: val })}
              options={['dark', 'light']}
            />
            <SettingRow
              label="Language"
              value={settings.language}
              onChange={(val) => setSettings({ ...settings, language: val })}
              options={['en', 'es', 'fr', 'de']}
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-charcoal-900 border border-charcoal-700 p-6 rounded-none">
          <h2 className="font-mono font-bold text-platinum mb-4 uppercase tracking-wider">
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-platinum">
                Enable Notifications
              </span>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    notifications: !settings.notifications,
                  })
                }
                className={`w-10 h-6 rounded-none transition-colors ${
                  settings.notifications
                    ? 'bg-gold-600'
                    : 'bg-charcoal-700'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-none transition-transform ${
                    settings.notifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-mono text-sm text-platinum">
                Auto-Refresh Data
              </span>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    autoRefresh: !settings.autoRefresh,
                  })
                }
                className={`w-10 h-6 rounded-none transition-colors ${
                  settings.autoRefresh ? 'bg-gold-600' : 'bg-charcoal-700'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-none transition-transform ${
                    settings.autoRefresh ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="bg-charcoal-900 border border-charcoal-700 p-6 rounded-none">
          <h2 className="font-mono font-bold text-platinum mb-4 uppercase tracking-wider">
            API Configuration
          </h2>
          <div className="space-y-3 font-mono text-xs text-zinc-400">
            <p>
              Proxy: <span className="text-platinum">/api-proxy</span>
            </p>
            <p>
              WebSocket: <span className="text-platinum">/ws-proxy</span>
            </p>
            <p>
              Status: <span className="text-green-500">Connected</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-gold-600 text-obsidian font-mono font-bold text-xs uppercase tracking-wider hover:bg-gold-500 transition-colors rounded-none">
            Save Settings
          </button>
          <button className="px-6 py-2 border-2 border-charcoal-700 text-zinc-400 font-mono font-bold text-xs uppercase tracking-wider hover:border-gold-600 transition-colors rounded-none">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

interface SettingRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const SettingRow: React.FC<SettingRowProps> = ({
  label,
  value,
  onChange,
  options,
}) => (
  <div className="flex justify-between items-center">
    <span className="font-mono text-sm text-platinum">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-charcoal-800 border border-charcoal-700 px-3 py-1 font-mono text-xs text-platinum focus:outline-none focus:border-gold-600 transition-colors"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
