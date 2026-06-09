import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FileText, CheckCircle2, Trash2, Plus, Archive, Eye } from 'lucide-react';
import { reportService } from '../services/reportService';
import { ReportEntry, RiskLevel } from '../types';

export const ReportBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<ReportEntry[]>([]);
  const [reportStatus, setReportStatus] = useState<'Draft' | 'Ready for Review' | 'Archived'>('Draft');

  useEffect(() => {
    setEntries(reportService.getEntries());
  }, []);

  const handleExport = () => {
    alert("PDF Export functionality is marked for future integration. Report data is ready.");
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all findings from this report?")) {
      reportService.clearEntries();
      setEntries([]);
      setReportStatus('Draft');
    }
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.RED: return 'text-rose-400 border-rose-900/50 bg-rose-950/10';
      case RiskLevel.YELLOW: return 'text-amber-400 border-amber-900/50 bg-amber-950/10';
      case RiskLevel.GREEN: return 'text-emerald-400 border-emerald-900/50 bg-emerald-950/10';
      default: return 'text-zinc-400 border-charcoal-700 bg-obsidian';
    }
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-obsidian flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-mono text-platinum tracking-tight">Governance Report Builder</h1>
            <p className="text-sm text-zinc-500 mt-2 font-mono">Generate export-ready executive governance deliverables.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => navigate('/command')}
              className="px-4 py-2 bg-obsidian border border-charcoal-700 hover:border-cyan-600 text-platinum font-mono text-xs flex items-center gap-2 transition-colors"
            >
              <Plus size={14} /> ADD FINDING
            </button>
            <button 
              onClick={() => setReportStatus('Ready for Review')}
              disabled={reportStatus !== 'Draft'}
              className="px-4 py-2 bg-obsidian border border-charcoal-700 hover:border-cyan-600 text-platinum font-mono text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Eye size={14} /> MARK READY
            </button>
            <button 
              onClick={() => setReportStatus('Archived')}
              disabled={reportStatus === 'Archived'}
              className="px-4 py-2 bg-obsidian border border-charcoal-700 hover:border-cyan-600 text-platinum font-mono text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Archive size={14} /> ARCHIVE
            </button>
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-charcoal-800 border border-charcoal-700 hover:border-cyan-600 text-platinum font-mono text-xs flex items-center gap-2 transition-colors"
            >
              <Download size={14} /> EXPORT PDF
            </button>
            <button 
              onClick={handleClear}
              className="px-4 py-2 bg-obsidian border border-charcoal-700 hover:border-rose-900 hover:text-rose-400 text-zinc-400 font-mono text-xs flex items-center gap-2 transition-colors"
            >
              <Trash2 size={14} /> CLEAR
            </button>
          </div>
        </div>

        {/* Report Preview Paper */}
        <div className="bg-charcoal-900 border border-charcoal-700 p-6 md:p-10 shadow-2xl relative">
          {/* Status Watermark */}
          <div className="absolute top-4 right-4 px-3 py-1 border border-charcoal-700 text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-obsidian">
            Status: {reportStatus}
          </div>

          {/* Header */}
          <div className="border-b-2 border-charcoal-800 pb-6 mb-8 mt-4 flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="font-mono text-xl font-bold tracking-widest text-platinum mb-1">LEGACY OPS™</div>
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Operations Intelligence Report</div>
            </div>
            <div className="text-left md:text-right font-mono text-xs text-zinc-400 space-y-1">
              <div>Report ID: <span className="text-platinum">REP-{new Date().toISOString().split('T')[0].replace(/-/g, '')}-A</span></div>
              <div>Assessment Date: <span className="text-platinum">{new Date().toLocaleDateString()}</span></div>
              <div>Organization: <span className="text-platinum">Decentralized Entity Alpha</span></div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 font-mono">
            <section>
              <h2 className="text-sm text-cyan-500 uppercase tracking-widest mb-3 border-b border-charcoal-800 pb-1">1. Review Type & Scope</h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Comprehensive assessment of operational workflows, access controls, and governance continuity based on active intelligence findings.
              </p>
            </section>

            <section>
              <h2 className="text-sm text-cyan-500 uppercase tracking-widest mb-3 border-b border-charcoal-800 pb-1">2. Governance Domains Assessed</h2>
              {entries.length === 0 ? (
                <p className="text-sm text-zinc-500 italic">No domains assessed in current report session.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from(new Set(entries.map(e => e.domainTitle))).map((domain, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-zinc-300">
                      <CheckCircle2 size={14} className="text-cyan-500" /> {domain}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-sm text-cyan-500 uppercase tracking-widest mb-3 border-b border-charcoal-800 pb-1">3. Risk Observations & Generated Findings</h2>
              {entries.length === 0 ? (
                <div className="bg-obsidian border border-charcoal-800 p-4 text-sm text-zinc-500 italic">
                  No findings committed to this report yet. Use the Command Agent or Domain pages to generate findings.
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div key={entry.id} className={`border p-4 ${getRiskColor(entry.riskLevel)}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-xs uppercase tracking-wider font-bold">
                          {entry.classification}
                        </div>
                        <div className="text-[10px] uppercase tracking-widest opacity-80">{entry.riskLevel}</div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider opacity-70 block mb-1">Observation</span>
                          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{entry.observation}</p>
                        </div>
                        {entry.impact && (
                          <div>
                            <span className="text-[10px] uppercase tracking-wider opacity-70 block mb-1">Impact</span>
                            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{entry.impact}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-sm text-cyan-500 uppercase tracking-widest mb-3 border-b border-charcoal-800 pb-1">4. Corrective Action Plan</h2>
              {entries.length === 0 ? (
                <p className="text-sm text-zinc-500 italic">No actions required.</p>
              ) : (
                <ul className="list-disc list-inside text-sm text-zinc-300 space-y-3 leading-relaxed">
                  {entries.map((entry, idx) => (
                    <li key={idx} className="pl-2">
                      <span className="font-bold text-zinc-400">[{entry.domainTitle}]</span> {entry.recommendedControl}
                      {entry.implementationStep && (
                        <div className="pl-6 mt-1 text-xs text-zinc-400">Step: {entry.implementationStep}</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="text-sm text-cyan-500 uppercase tracking-widest mb-3 border-b border-charcoal-800 pb-1">5. Recordkeeping Instructions</h2>
              <div className="flex items-start gap-3 bg-charcoal-800/50 p-4">
                <FileText size={16} className="text-zinc-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-2 w-full">
                  {entries.length === 0 ? (
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Standard operational logging applies. No specific exceptions noted.
                    </p>
                  ) : (
                    entries.map((entry, idx) => (
                      <p key={idx} className="text-xs text-zinc-400 leading-relaxed border-b border-charcoal-700/50 pb-2 last:border-0 last:pb-0">
                        {entry.recordInstruction}
                      </p>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-6 border-t border-charcoal-800 text-center">
            <p className="text-[10px] text-zinc-600 font-mono">Generated by Legacy AI™ Command Agent • Governed by KLAT</p>
          </div>
        </div>
      </div>
    </div>
  );
};
