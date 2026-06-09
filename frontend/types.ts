export interface AgentConfig {
  projectId: string;
  location: string;
  agentId: string;
  proxyUrl?: string;
}

export interface Session {
  id: string;
  app_name?: string;
  userId?: string;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: number;
  structuredData?: StructuredIntelligence;
}

export interface StructuredIntelligence {
  classification?: string;
  factsPresented?: string[];
  operationalIssue?: string;
  riskAssessment?: 'GREEN' | 'YELLOW' | 'RED';
  recommendedAction?: string;
  recordkeepingInstruction?: string;
  implementationStep?: string;
}

export enum RiskLevel {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED'
}

export enum EvidenceStatus {
  NOT_REVIEWED = 'Not Reviewed',
  RECORDS_REQUESTED = 'Records Requested',
  PARTIAL_EVIDENCE = 'Partial Evidence',
  VERIFIED = 'Verified'
}

export enum RecordStatus {
  NOT_STARTED = 'Not Started',
  REVIEW_ACTIVE = 'Review Active',
  FINDING_GENERATED = 'Finding Generated',
  ADDED_TO_REPORT = 'Added to Report',
  CLOSED = 'Closed'
}

export interface DomainStatus {
  id: string;
  path: string;
  title: string;
  description: string;
  status: RiskLevel;
  lastReviewed: string;
  purpose: string;
  reviews: string[];
  records: string[];
  risks: string[];
  controls: string[];
}

export interface DemoRequest {
  id: string;
  organization: string;
  name: string;
  email: string;
  role: string;
  need: string;
  status: 'new' | 'in-progress' | 'closed';
  priority: 'low' | 'normal' | 'high';
  source: string;
  createdAt: number;
  updatedAt: number;
  assignedTo?: string;
  followUpStatus?: string;
  reviewOutcome?: string;
  adminNotes?: string;
  closedAt?: number;
}

export interface ReportEntry {
  id: string;
  domainTitle: string;
  classification: string;
  riskLevel: RiskLevel;
  observation: string;
  impact: string;
  recommendedControl: string;
  recordInstruction: string;
  implementationStep?: string;
  status: string;
  timestamp: number;
}
