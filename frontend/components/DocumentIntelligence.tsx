import React, { useState, ReactNode } from 'react';
import { FileText, Brain, Workflow, Edit, BarChart3, Zap } from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface SectionLabelProps {
  children: ReactNode;
}

interface BadgeProps {
  children: ReactNode;
  color?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet';
}

interface NavTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: ReactNode;
}

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────

const TOKEN = {
  navy: '#0D1B2A',
  parchment: '#F5F0E8',
  brass: '#B8923A',
  slate: '#2C3E50',
  rule: '#E8E0D0',
  alert: '#C0392B',
  archive: '#1A5276',
  midGray: '#7F8C8D',
  offWhite: '#FDFAF5',
};

// ─── STATIC DATA ───────────────────────────────────────────────────────────────

const CLASSIFICATION_SYSTEM = [
  {
    id: 'personal',
    label: 'Personal Records',
    icon: '◈',
    description: 'Identity, vital statistics, health, legal standing of the individual.',
    examples: ['Birth certificate', 'Passport / ID', 'Social Security documentation', 'Medical records', 'Will / advance directive', 'Divorce / marriage records'],
  },
  {
    id: 'family',
    label: 'Family Records',
    icon: '◉',
    description: 'Shared history, estate lineage, household agreements, generational continuity.',
    examples: ['Family trust documents', 'Estate inventories', 'Shared property records', 'Genealogical records', 'Minor children records', 'Caregiver agreements'],
  },
  {
    id: 'business',
    label: 'Business Records',
    icon: '◧',
    description: 'Operational, contractual, and commercial documentation of any enterprise.',
    examples: ['Operating agreements / bylaws', 'Vendor contracts', 'Employment agreements', 'Client records', 'Tax filings (EIN, returns)', 'IP registrations'],
  },
  {
    id: 'governance',
    label: 'Governance Records',
    icon: '⬡',
    description: 'Fiduciary obligations, institutional authority, policy, and oversight documentation.',
    examples: ['Board resolutions', 'Trustee records', 'Power of attorney', 'Fiduciary duty logs', 'Compliance records', 'Policy manuals'],
  },
  {
    id: 'financial',
    label: 'Financial Records',
    icon: '◈',
    description: 'Asset, liability, transaction, and account documentation.',
    examples: ['Bank statements', 'Investment account records', 'Loan / debt instruments', 'Tax returns', 'Asset appraisals', 'Beneficiary designations'],
  },
  {
    id: 'educational',
    label: 'Educational Records',
    icon: '▣',
    description: 'Credentials, transcripts, certifications, professional licenses.',
    examples: ['Diplomas / transcripts', 'Professional licenses', 'Certifications', 'Training records', 'Continuing education logs', 'Academic petitions'],
  },
  {
    id: 'administrative',
    label: 'Administrative Records',
    icon: '▤',
    description: 'Procedural, regulatory, and institutional process documentation.',
    examples: ['Court filings', 'Agency correspondence', 'Permit / license applications', 'Regulatory submissions', 'Inspection records', 'Grievance records'],
  },
  {
    id: 'decision',
    label: 'Decision Records',
    icon: '▦',
    description: 'Documented rationale, deliberation, and authorization for material choices.',
    examples: ['Meeting minutes', 'Resolution logs', 'Approval records', 'Delegation of authority', 'Risk acceptance memos', 'Policy exception records'],
  },
  {
    id: 'communication',
    label: 'Communication Records',
    icon: '▨',
    description: 'Written exchanges that create, modify, or evidence obligations or agreements.',
    examples: ['Emails confirming agreements', 'Certified mail records', 'Text message logs (relevant)', 'Formal notices', 'Demand letters', 'Settlement correspondence'],
  },
];

const WORKFLOW_STEPS = [
  { step: '01', label: 'Intake', action: 'Receive and log the document. Assign a unique record ID, intake date, and source. No analysis yet.', output: 'Record ID assigned. Intake log entry created.' },
  { step: '02', label: 'Identification', action: 'Identify document type, issuing authority, parties named, and governing date range.', output: 'Document header: type, issuer, parties, date range.' },
  { step: '03', label: 'Classification', action: 'Assign to one or more categories from the Master Classification System. Apply subcategory tag.', output: 'Classification label applied. Filed in category index.' },
  { step: '04', label: 'Timeline', action: 'Extract all dates from the document. Map each date to an event. Integrate into the master chronology.', output: 'Timeline entries added. Chronological position confirmed.' },
  { step: '05', label: 'Verification', action: 'Cross-reference against existing record. Flag inconsistencies, gaps, or unverifiable claims.', output: 'Verification status: Confirmed / Pending / Disputed. Notes recorded.' },
  { step: '06', label: 'Missing Information Review', action: 'Identify what the document references that is not in the record. Flag each gap explicitly.', output: 'Missing items list generated. Priority level assigned to each gap.' },
  { step: '07', label: 'Summary Report', action: 'Generate a structured record summary based only on confirmed facts. Assumptions excluded.', output: 'Legacy Record Report™ produced.' },
  { step: '08', label: 'Action Checklist', action: 'Derive specific, sequenced next steps from the record. No action without record support.', output: 'Prioritized action checklist with responsible party and deadline fields.' },
];

const INTAKE_QUESTIONS = [
  { id: 'q1', category: 'Situation', question: 'Describe the situation you are organizing records for — in one or two factual sentences.', placeholder: 'Example: I am organizing documents related to my mother\'s estate...', required: true },
  { id: 'q2', category: 'Urgency', question: 'Is there a deadline, hearing date, or time-sensitive event connected to this matter?', placeholder: 'Example: A court hearing is scheduled for July 14, 2026...', required: true },
  { id: 'q3', category: 'Parties', question: 'Who are the individuals, entities, or institutions involved? List each with their role.', placeholder: 'Example: Margaret Chen — decedent...', required: true },
  { id: 'q4', category: 'Documents in Hand', question: 'What documents do you currently have access to? List each item.', placeholder: 'Example: Will dated 2019, two bank statements...', required: true },
  { id: 'q5', category: 'Documents Missing', question: 'What documents do you believe should exist but have not yet been located?', placeholder: 'Example: A second will referenced in a 2023 letter...', required: false },
  { id: 'q6', category: 'Objective', question: 'What is the specific outcome you are working toward through this organization?', placeholder: 'Example: To prepare a complete record for my attorney...', required: true },
  { id: 'q7', category: 'Professional Involvement', question: 'Are any licensed professionals currently involved — attorney, CPA, financial advisor, mediator?', placeholder: 'Example: Attorney retained...', required: false },
];

const ROADMAP = [
  {
    version: 'Version 1',
    title: 'Basic Document Intelligence',
    status: 'Current',
    objective: 'Establish the foundational record-building workflow for individual users and single matters.',
    capabilities: ['Intake and classification of uploaded documents', 'Manual timeline construction', 'Facts vs. assumptions separation', 'Missing information identification', 'One-page Legacy Record Report™ generation', '7-Day Action Plan tracking'],
    users: 'Individuals with a single active matter requiring organization.',
  },
  {
    version: 'Version 2',
    title: 'Family Operating System',
    status: 'Planned',
    objective: 'Extend the record system across multiple family members and intergenerational matters.',
    capabilities: ['Multi-party record management', 'Role-based access per family member', 'Estate document repository', 'Shared timeline across all family matters', 'Beneficiary and trustee record tracking'],
    users: 'Families managing estates, trusts, caregiving, or multi-party assets.',
  },
];

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

const SectionLabel: React.FC<SectionLabelProps> = ({ children }) => (
  <h2 style={{
    fontFamily: 'system-ui, sans-serif',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: TOKEN.brass,
    marginBottom: '6px',
  }}>
    {children}
  </h2>
);

const Badge: React.FC<BadgeProps> = ({ children, color = 'cyan' }) => {
  const colorMap: Record<string, string> = {
    cyan: '#BED3E8',
    emerald: '#BEE5BE',
    amber: '#F5D5A8',
    rose: '#F5A8A8',
    violet: '#D8BEE5',
  };

  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '2px',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      background: colorMap[color] || colorMap['cyan'],
      color: TOKEN.navy,
    }}>
      {children}
    </span>
  );
};

const NavTab: React.FC<NavTabProps> = ({ label, active, onClick, icon }) => (
  <button
    onClick={onClick}
    style={{
      background: 'none',
      border: 'none',
      borderBottom: active ? `2px solid ${TOKEN.brass}` : '2px solid transparent',
      color: active ? TOKEN.navy : TOKEN.midGray,
      fontFamily: 'Georgia, serif',
      fontSize: '13px',
      fontWeight: active ? '700' : '400',
      padding: '10px 16px',
      cursor: 'pointer',
      transition: 'color 0.15s',
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    }}
  >
    {icon && <span>{icon}</span>}
    {label}
  </button>
);

const OverviewPanel: React.FC = () => (
  <div>
    <div style={{ background: TOKEN.navy, borderLeft: `4px solid ${TOKEN.brass}`, padding: '28px 32px', marginBottom: '28px' }}>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: '700', color: TOKEN.parchment, lineHeight: '1.35', marginBottom: '10px' }}>
        Legacy Document Intelligence Engine™
      </div>
      <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: TOKEN.brass, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
        Kelly Legacy Institute · Office of the Fiduciary
      </div>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: '#C5B99A', lineHeight: '1.7', fontStyle: 'italic' }}>
        "Memory → Record. Reaction → Response. Chaos → Structure."
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
      {[
        { label: 'Purpose', body: 'Transform unstructured information into organized, verifiable records across personal, family, business, and institutional matters.' },
        { label: 'Primary Users', body: 'Individuals, families, fiduciaries, business operators, estate administrators, and governance professionals.' },
        { label: 'Problems Solved', body: 'Eliminates reliance on memory as evidence. Converts reactive habits into structured response. Surfaces missing documentation before it becomes a liability.' },
        { label: 'System Boundaries', body: 'This system organizes records. It does not constitute legal, financial, or professional advice, and does not replace licensed counsel.' },
      ].map((card) => (
        <div key={card.label} style={{ background: TOKEN.offWhite, border: `1px solid ${TOKEN.rule}`, padding: '18px 20px' }}>
          <SectionLabel>{card.label}</SectionLabel>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: TOKEN.slate, lineHeight: '1.65' }}>
            {card.body}
          </div>
        </div>
      ))}
    </div>

    <SectionLabel>Core Functions</SectionLabel>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {['Document intake, classification, and indexing', 'Timeline construction from extracted dates and events', 'Facts vs. assumptions separation and verification status tracking', 'Missing information identification and gap prioritization', 'Legacy Record Report™ generation', '7-Day Action Plan administration'].map((fn, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 14px', background: TOKEN.offWhite, border: `1px solid ${TOKEN.rule}` }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '11px', color: TOKEN.brass, fontWeight: '700', minWidth: '20px' }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: TOKEN.slate, lineHeight: '1.5' }}>
            {fn}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ClassificationPanel: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <SectionLabel>Master Classification System</SectionLabel>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: TOKEN.midGray, lineHeight: '1.6' }}>
          Every record entering the system is assigned to one or more of the following nine categories. Classification determines filing location and retrieval priority.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {CLASSIFICATION_SYSTEM.map((cat) => (
          <div key={cat.id} style={{ border: `1px solid ${expanded === cat.id ? TOKEN.brass : TOKEN.rule}`, background: expanded === cat.id ? '#FBF8F2' : TOKEN.offWhite }}>
            <button
              onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
              style={{ width: '100%', background: 'none', border: 'none', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: TOKEN.brass, minWidth: '22px' }}>
                {cat.icon}
              </span>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: '700', color: TOKEN.navy, flex: 1 }}>
                {cat.label}
              </span>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: TOKEN.midGray }}>
                {expanded === cat.id ? '▲' : '▼'}
              </span>
            </button>

            {expanded === cat.id && (
              <div style={{ padding: '0 18px 18px 54px' }}>
                <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: TOKEN.slate, lineHeight: '1.65', marginBottom: '12px' }}>
                  {cat.description}
                </div>
                <SectionLabel>Record Examples</SectionLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {cat.examples.map((ex) => (
                    <span key={ex} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: TOKEN.archive, background: '#EAF2FB', padding: '3px 9px', border: `1px solid #BED3E8` }}>
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const WorkflowPanel: React.FC = () => (
  <div>
    <SectionLabel>Processing Pipeline</SectionLabel>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {WORKFLOW_STEPS.map((ws) => (
        <div key={ws.step} style={{ background: TOKEN.offWhite, border: `1px solid ${TOKEN.rule}`, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: '700', color: TOKEN.brass, minWidth: '40px' }}>
              {ws.step}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: '700', color: TOKEN.navy, marginBottom: '6px' }}>
                {ws.label}
              </div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: TOKEN.slate, marginBottom: '8px', lineHeight: '1.5' }}>
                {ws.action}
              </div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: TOKEN.brass, fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                OUTPUT: {ws.output}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const IntakePanel: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setAnswers({ ...answers, [id]: value });
  };

  return (
    <div>
      <SectionLabel>Context & Document Intake</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {INTAKE_QUESTIONS.map((q) => (
          <div key={q.id} style={{ background: TOKEN.offWhite, border: `1px solid ${TOKEN.rule}`, padding: '16px 18px' }}>
            <label style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: '700', color: TOKEN.navy, marginBottom: '4px', display: 'block' }}>
              {q.question} {q.required && <span style={{ color: TOKEN.alert }}>*</span>}
            </label>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: TOKEN.brass, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
              {q.category}
            </div>
            <textarea
              value={answers[q.id] || ''}
              onChange={(e) => handleChange(q.id, e.target.value)}
              placeholder={q.placeholder}
              style={{ width: '100%', padding: '10px', fontFamily: 'system-ui, sans-serif', fontSize: '12px', border: `1px solid ${TOKEN.rule}`, borderRadius: '2px', minHeight: '80px', boxSizing: 'border-box' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const RecordReportPanel: React.FC = () => (
  <div>
    <div style={{ background: TOKEN.navy, borderLeft: `4px solid ${TOKEN.brass}`, padding: '18px 20px', marginBottom: '24px' }}>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: '700', color: TOKEN.parchment, marginBottom: '4px' }}>
        Legacy Record Report™
      </div>
      <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: TOKEN.brass, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Summary of verified facts and open questions
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      {[
        { label: 'Record Summary', count: 0 },
        { label: 'Important Dates', count: 0 },
        { label: 'People & Roles', count: 0 },
        { label: 'Document Inventory', count: 0 },
        { label: 'Verified Facts', count: 0 },
        { label: 'Open Questions', count: 0 },
      ].map((item) => (
        <div key={item.label} style={{ background: TOKEN.offWhite, border: `1px solid ${TOKEN.rule}`, padding: '14px 16px' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '12px', fontWeight: '700', color: TOKEN.navy, marginBottom: '6px' }}>
            {item.label}
          </div>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '16px', fontWeight: '700', color: TOKEN.brass }}>
            {item.count}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const RoadmapPanel: React.FC = () => (
  <div>
    <SectionLabel>Feature Roadmap</SectionLabel>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {ROADMAP.map((release) => (
        <div key={release.version} style={{ background: TOKEN.offWhite, border: `1px solid ${TOKEN.rule}`, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '14px', fontWeight: '700', color: TOKEN.navy }}>
                {release.title}
              </div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: TOKEN.brass, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px' }}>
                {release.version}
              </div>
            </div>
            <Badge color={release.status === 'Current' ? 'emerald' : 'amber'}>
              {release.status}
            </Badge>
          </div>
          <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: TOKEN.slate, marginBottom: '8px' }}>
            {release.objective}
          </div>
          <SectionLabel>Capabilities</SectionLabel>
          <ul style={{ fontFamily: 'system-ui, sans-serif', fontSize: '11px', color: TOKEN.slate, paddingLeft: '18px', margin: '0' }}>
            {release.capabilities.map((cap) => (
              <li key={cap} style={{ marginBottom: '3px' }}>
                {cap}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function DocumentIntelligence(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const tabs: Array<{ id: string; label: string; icon: ReactNode }> = [
    { id: 'overview', label: 'Overview', icon: <Brain size={14} /> },
    { id: 'classification', label: 'Classification', icon: <BarChart3 size={14} /> },
    { id: 'workflow', label: 'Workflow', icon: <Workflow size={14} /> },
    { id: 'intake', label: 'Intake', icon: <Edit size={14} /> },
    { id: 'report', label: 'Record Report™', icon: <FileText size={14} /> },
    { id: 'roadmap', label: 'Roadmap', icon: <Zap size={14} /> },
  ];

  const renderContent = (): JSX.Element => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPanel />;
      case 'classification':
        return <ClassificationPanel />;
      case 'workflow':
        return <WorkflowPanel />;
      case 'intake':
        return <IntakePanel />;
      case 'report':
        return <RecordReportPanel />;
      case 'roadmap':
        return <RoadmapPanel />;
      default:
        return <OverviewPanel />;
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: TOKEN.parchment, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: TOKEN.navy, borderBottom: `2px solid ${TOKEN.brass}`, padding: '24px 32px' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: '700', color: TOKEN.parchment, marginBottom: '6px' }}>
          Legacy Document Intelligence Engine™
        </div>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: TOKEN.brass, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Build structured records from scattered documents, timelines, facts, assumptions, and missing information.
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: TOKEN.parchment, borderBottom: `1px solid ${TOKEN.rule}`, padding: '0 32px', display: 'flex', overflowX: 'auto' }}>
        {tabs.map((tab) => (
          <NavTab
            key={tab.id}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
          />
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto', background: TOKEN.parchment }}>
        {renderContent()}
      </div>
    </div>
  );
}
