import React from 'react';
import { Domain } from '@/constants';
import { Link } from 'react-router-dom';

interface DomainPageProps {
  domain: Domain;
}

export const DomainPage: React.FC<DomainPageProps> = ({ domain }) => {
  return (
    <div className="h-full bg-obsidian p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{domain.icon}</span>
          <div>
            <h1 className="font-mono text-3xl font-bold text-platinum">
              {domain.title}
            </h1>
            <p className="text-sm text-zinc-500 font-mono mt-1">
              {domain.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono px-2 py-1 bg-charcoal-800 border border-charcoal-700 text-platinum uppercase tracking-wider font-bold">
            Status: {domain.status}
          </span>
          <span className="text-xs font-mono text-zinc-400">
            ID: {domain.id}
          </span>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
        {/* Overview */}
        <div className="bg-charcoal-900 border border-charcoal-700 p-6 rounded-none">
          <h2 className="font-mono font-bold text-platinum mb-4 uppercase tracking-wider text-sm">
            Overview
          </h2>
          <div className="space-y-3 text-xs text-zinc-400 font-mono">
            <p>
              <span className="text-platinum">Domain:</span> {domain.name}
            </p>
            <p>
              <span className="text-platinum">Path:</span> {domain.path}
            </p>
            <p>
              <span className="text-platinum">Status:</span>{' '}
              <span className="text-green-500 font-bold">Operational</span>
            </p>
            <p>
              <span className="text-platinum">Last Updated:</span>{' '}
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-charcoal-900 border border-charcoal-700 p-6 rounded-none">
          <h2 className="font-mono font-bold text-platinum mb-4 uppercase tracking-wider text-sm">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-gold-600 text-obsidian font-mono font-bold text-xs uppercase tracking-wider hover:bg-gold-500 transition-colors rounded-none">
              Generate Report
            </button>
            <button className="w-full px-4 py-2 border-2 border-gold-600 text-gold-500 font-mono font-bold text-xs uppercase tracking-wider hover:bg-charcoal-800 transition-colors rounded-none">
              View Details
            </button>
            <button className="w-full px-4 py-2 border-2 border-charcoal-700 text-zinc-400 font-mono font-bold text-xs uppercase tracking-wider hover:border-gold-600 transition-colors rounded-none">
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Content */}
      <div className="mt-8 bg-charcoal-900 border border-charcoal-700 p-6 rounded-none">
        <h2 className="font-mono font-bold text-platinum mb-4 uppercase tracking-wider text-sm">
          Recent Activity
        </h2>
        <div className="space-y-2 text-xs font-mono text-zinc-400">
          <p className="text-zinc-500">
            • Document analyzed and classified
          </p>
          <p className="text-zinc-500">• Compliance verification completed</p>
          <p className="text-zinc-500">• Report generated and archived</p>
          <p className="text-zinc-500">
            • User access logged and recorded
          </p>
          <p className="text-zinc-500">
            • System health check: All systems operational
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex gap-4">
        <Link
          to="/dashboard"
          className="px-6 py-2 border-2 border-charcoal-700 text-zinc-400 font-mono font-bold text-xs uppercase tracking-wider hover:border-gold-600 transition-colors rounded-none"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};
