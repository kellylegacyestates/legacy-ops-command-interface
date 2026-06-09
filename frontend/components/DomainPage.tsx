import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShieldAlert, FileCheck, Activity, Lock, 
  Play, FileSearch, FilePlus, ClipboardList, CheckCircle2, Clock, Database
} from 'lucide-react';
import { DomainStatus, RiskLevel, EvidenceStatus, RecordStatus, ReportEntry } from '../types';
import { RiskBadge } from './ui/Badge';
import { KlatNotice } from './ui/KlatNotice';
import { reportService } from '../services/reportService';

interface DomainPageProps {
  domain: DomainStatus;
}

export const DomainPage: React.FC<DomainPageProps> = ({ domain }) => {
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);
  
  // Operational State
  const [evidenceStatus, setEvidenceStatus] = useState<EvidenceStatus>(EvidenceStatus.NOT_REVIEWED);
  const [recordStatus, setRecordStatus] = useState<RecordStatus>(RecordStatus.NOT_STARTED);
  const [activeFinding, setActiveFinding] = useState<Partial<ReportEntry> | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleStartReview = () => {
    setRecordStatus(RecordStatus.REVIEW_ACTIVE);
    showToast('Review sequence initiated. Gathering on-chain state...');
  };

  const handleRequestRecords = () => {
    setEvidenceStatus(EvidenceStatus.RECORDS_REQUESTED);
    showToast('Record request dispatched to archival nodes.');
    // Simulate records arriving
    setTimeout(() => {
      setEvidenceStatus(EvidenceStatus.PARTIAL_EVIDENCE);
      showToast('Partial evidence received from registry.');
    }, 3000);
  };

  const handleGenerateFinding = () => {
    setRecordStatus(RecordStatus.FINDING_GENERATED);
    setEvidenceStatus(EvidenceStatus.VERIFIED);
    setActiveFinding({
      domainTitle: domain.title,
      classification: `${domain.title} Anomaly Detected`,
      riskLevel: domain.status === RiskLevel.GREEN ? RiskLevel.YELLOW : domain.status,
      observation: `Automated review of ${domain.title.toLowerCase()} indicates a deviation from standard operational parameters.`,
      impact: 'Potential degradation of governance continuity if left unaddressed.',
      recommendedControl: 'Enforce strict adherence to Protocol Ops Policy v2.1 and require manual sign-off for next 3 actions.',
      recordInstruction: `Log anomaly in Governance Registry under ${domain.id}-ops-exception.`,
      status: 'Draft'
    });
    showToast('Intelligence finding generated.');
  };

  const handleCreateReportEntry = () => {
    if (!activeFinding) return;
    
    reportService.addEntry({
      domainTitle: activeFinding.domainTitle!,
      classification: activeFinding.classification!,
      riskLevel: activeFinding.riskLevel!,
      observation: activeFinding.observation!,
      impact: activeFinding.impact!,
      recommendedControl: activeFinding.recommendedControl!,
      recordInstruction: activeFinding.recordInstruction!,
      status: 'Committed'
    });
    
    setRecordStatus(RecordStatus.ADDED_TO_REPORT);
    setActiveFinding(prev => prev ? { ...prev, status: 'Committed' } : null);
    showToast('Finding committed to official report.');
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-obsidian flex flex-col relative">
      {toast && (
        <div className="fixed top-6 right-6 bg-cyan-950 border border-cyan-500 text-cyan-400 px-4 py-3 text-xs font-mono flex items-center gap-3 z-50 shadow-2xl">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      <div className="max-w-6xl w-full mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-xs font-mono text-zinc-500 hover:text-cyan-400 flex items-center gap-2 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> RETURN TO COMMAND INTERFACE
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-mono text-platinum tracking-tight mb-2 uppercase">{domain.title}</h1>
            <p className="text-sm text-zinc-400 font-mono">{domain.description}</p>
          </div>
        </div>

        {/* Command Status Strip */}
        <div className="bg-charcoal-900 border border-charcoal-800 p-4 mb-6 overflow-x-auto">
          <div className="flex items-center gap-6 text-[10px] md:text-xs font-mono whitespace-nowrap min-w-max">
            <div className="flex flex-col gap-1">
              <span className="text-zinc-600 uppercase tracking-wider">Active Domain</span>
              <span className="text-platinum flex items-center gap-2"><Activity size={12} className="text-cyan-500"/> {domain.title}</span>
            </div>
            <div className="w-px h-8 bg-charcoal-700"></div>
            <div className="flex flex-col gap-1">
              <span className="text-zinc-600 uppercase tracking-wider">Evidence Status</span>
              <span className={`flex items-center gap-2 ${
                evidenceStatus === EvidenceStatus.VERIFIED ? 'text-emerald-400' : 
                evidenceStatus === EvidenceStatus.NOT_REVIEWED ? 'text-zinc-400' : 'text-amber-400'
              }`}>
                <Database size={12} /> {evidenceStatus}
              </span>
            </div>
            <div className="w-px h-8 bg-charcoal-700"></div>
            <div className="flex flex-col gap-1">
              <span className="text-zinc-600 uppercase tracking-wider">Risk Level</span>
              <RiskBadge level={domain.status} />
            </div>
            <div className="w-px h-8 bg-charcoal-700"></div>
            <div className="flex flex-col gap-1">
              <span className="text-zinc-600 uppercase tracking-wider">Required Records</span>
              <span className="text-platinum">{domain.records.length} Documents</span>
            </div>
            <div className="w-px h-8 bg-charcoal-700"></div>
            <div className="flex flex-col gap-1">
              <span className="text-zinc-600 uppercase tracking-wider">Record Status</span>
              <span className={`flex items-center gap-2 ${
                recordStatus === RecordStatus.ADDED_TO_REPORT ? 'text-cyan-400' : 'text-platinum'
              }`}>
                <Clock size={12} /> {recordStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button 
            onClick={handleStartReview}
            disabled={recordStatus !== RecordStatus.NOT_STARTED}
            className="px-4 py-2 bg-obsidian border border-charcoal-700 hover:border-cyan-600 text-platinum text-xs font-mono flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={14} className={recordStatus === RecordStatus.NOT_STARTED ? "text-cyan-500" : "text-zinc-600"} /> START REVIEW
          </button>
          <button 
            onClick={handleRequestRecords}
            disabled={recordStatus === RecordStatus.NOT_STARTED || evidenceStatus === EvidenceStatus.VERIFIED}
            className="px-4 py-2 bg-obsidian border border-charcoal-700 hover:border-cyan-600 text-platinum text-xs font-mono flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSearch size={14} className="text-zinc-400" /> REQUEST RECORDS
          </button>
          <button 
            onClick={handleGenerateFinding}
            disabled={recordStatus === RecordStatus.NOT_STARTED || recordStatus === RecordStatus.ADDED_TO_REPORT}
            className="px-4 py-2 bg-obsidian border border-charcoal-700 hover:border-cyan-600 text-platinum text-xs font-mono flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FilePlus size={14} className="text-zinc-400" /> GENERATE FINDING
          </button>
          <button 
            onClick={handleCreateReportEntry}
            disabled={!activeFinding || recordStatus === RecordStatus.ADDED_TO_REPORT}
            className="px-4 py-2 bg-cyan-950/20 border border-cyan-900/50 hover:border-cyan-500 text-cyan-400 text-xs font-mono flex items-center gap-2 transition-colors md:ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ClipboardList size={14} /> CREATE REPORT ENTRY
          </button>
        </div>

        {/* Finding Panel */}
        {activeFinding && (
          <div className="mb-8 bg-obsidian border border-charcoal-700 p-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-charcoal-800 pb-4 mb-4">
              <h2 className="text-sm font-mono text-platinum uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert size={16} className="text-cyan-500" />
                Generated Intelligence Finding
              </h2>
              <span className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider border ${
                activeFinding.status === 'Committed' ? 'border-emerald-900 text-emerald-400 bg-emerald-950/30' : 'border-amber-900 text-amber-400 bg-amber-950/30'
              }`}>
                {activeFinding.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Finding ID</div>
                  <div className="text-sm font-mono text-platinum">FND-{Date.now().toString().slice(-6)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Domain</div>
                  <div className="text-sm font-mono text-platinum">{activeFinding.domainTitle}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Risk Level</div>
                  <RiskBadge level={activeFinding.riskLevel!} />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Observation</div>
                  <div className="text-sm font-mono text-zinc-300 leading-relaxed">{activeFinding.observation}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Impact</div>
                  <div className="text-sm font-mono text-zinc-300 leading-relaxed">{activeFinding.impact}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-charcoal-800 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Recommended Control</div>
                <div className="text-sm font-mono text-cyan-400 leading-relaxed">{activeFinding.recommendedControl}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Recordkeeping Instruction</div>
                <div className="text-sm font-mono text-zinc-400 leading-relaxed flex items-start gap-2">
                  <Database size={14} className="mt-0.5 flex-shrink-0" />
                  {activeFinding.recordInstruction}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Core Domain Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-charcoal-900 border border-charcoal-800 p-6">
            <h3 className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={14} /> Purpose
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{domain.purpose}</p>
          </div>

          <div className="bg-charcoal-900 border border-charcoal-800 p-6">
            <h3 className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldAlert size={14} /> Risk Indicators
            </h3>
            <ul className="space-y-2">
              {domain.risks.map((risk, idx) => (
                <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2">
                  <span className="text-rose-500 mt-1">•</span> {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-charcoal-900 border border-charcoal-800 p-6">
            <h3 className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FileCheck size={14} /> What Legacy Ops™ Reviews
            </h3>
            <ul className="space-y-2">
              {domain.reviews.map((review, idx) => (
                <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2">
                  <span className="text-cyan-500 mt-1">•</span> {review}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-charcoal-900 border border-charcoal-800 p-6">
            <h3 className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Lock size={14} /> Recommended Controls
            </h3>
            <ul className="space-y-2">
              {domain.controls.map((control, idx) => (
                <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span> {control}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {domain.id === 'token' && (
          <div className="mt-12 p-4 bg-charcoal-900/50 border border-charcoal-800">
            <KlatNotice />
          </div>
        )}
      </div>
    </div>
  );
};
