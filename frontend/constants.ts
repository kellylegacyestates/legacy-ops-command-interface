import { DomainStatus, RiskLevel } from './types';

export const KLAT_NOTICE = "KLAT is used as a governed access, verification, participation, and routing layer. It is not represented as an investment instrument, equity interest, security, passive yield mechanism, profit vehicle, speculative asset, or guaranteed value instrument.";

export const DOMAINS: DomainStatus[] = [
  { 
    id: 'wallet', path: '/wallets', title: 'Wallet Intelligence', description: 'Access control and signature verification.', status: RiskLevel.GREEN, lastReviewed: '2023-10-27T08:00:00Z',
    purpose: 'Verify the operational integrity and authorization level of interacting addresses.',
    reviews: ['Signature validity', 'Historical transaction patterns', 'Sanctions screening', 'Multisig participation'],
    records: ['Signature logs', 'Address authorization registry', 'Key rotation events'],
    risks: ['Compromised keys', 'Unauthorized access attempts', 'Orphaned addresses'],
    controls: ['Hardware wallet mandates', 'Time-locked access', 'Periodic re-verification']
  },
  { 
    id: 'token', path: '/token-access', title: 'Token Access Intelligence', description: 'Gated entry and holding requirements.', status: RiskLevel.GREEN, lastReviewed: '2023-10-27T08:15:00Z',
    purpose: 'Ensure participants meet the required tokenized thresholds for specific operational actions.',
    reviews: ['Current balance verification', 'Holding duration', 'Delegation status', 'Vesting schedules'],
    records: ['Snapshot block records', 'Delegation registries', 'Access grant logs'],
    risks: ['Flash loan attacks', 'Sybil delegation', 'Sudden balance drops'],
    controls: ['Time-weighted balances', 'Delegation caps', 'Continuous monitoring']
  },
  { 
    id: 'contributor', path: '/contributors', title: 'Contributor Intelligence', description: 'Activity tracking and role assignment.', status: RiskLevel.YELLOW, lastReviewed: '2023-10-26T14:30:00Z',
    purpose: 'Map on-chain and off-chain activities to verified contributor identities.',
    reviews: ['Commit history', 'Proposal participation', 'Bounty completion', 'Role active status'],
    records: ['Contributor registry', 'Activity proofs', 'Role assignment logs'],
    risks: ['Inactive operators', 'Over-permissioned roles', 'Identity spoofing'],
    controls: ['Activity-based role decay', 'Peer verification', 'Mandatory KLAT routing']
  },
  { 
    id: 'credential', path: '/credentials', title: 'Credential Intelligence', description: 'Issuance and revocation of operational badges.', status: RiskLevel.GREEN, lastReviewed: '2023-10-25T09:00:00Z',
    purpose: 'Manage the lifecycle of verifiable credentials used for operational access.',
    reviews: ['Issuance criteria met', 'Revocation status', 'Expiration dates', 'Issuer validity'],
    records: ['Credential issuance logs', 'Revocation registries', 'Verification proofs'],
    risks: ['Expired credentials in use', 'Rogue issuers', 'Credential sharing'],
    controls: ['Automated expiration', 'Multi-party issuance', 'Soulbound enforcement']
  },
  { 
    id: 'treasury', path: '/treasury', title: 'Treasury Intelligence', description: 'Multisig controls and asset separation.', status: RiskLevel.RED, lastReviewed: '2023-10-27T10:45:00Z',
    purpose: 'Safeguard institutional assets through strict operational controls and separation of duties.',
    reviews: ['Signer composition', 'Threshold health', 'Transaction queuing', 'Asset diversification'],
    records: ['Multisig transaction logs', 'Signer addition/removal records', 'Policy exception logs'],
    risks: ['Signer collusion', 'Lost keys dropping threshold', 'Unauthorized asset routing'],
    controls: ['Geographic signer distribution', 'Strict threshold minimums', 'Time-locked execution']
  },
  { 
    id: 'governance', path: '/governance', title: 'Governance Workflow', description: 'Proposal tracking and execution paths.', status: RiskLevel.YELLOW, lastReviewed: '2023-10-24T11:20:00Z',
    purpose: 'Ensure all operational changes follow the approved governance lifecycle.',
    reviews: ['Proposal formatting', 'Quorum achievement', 'Voting period compliance', 'Execution payload validity'],
    records: ['Proposal registries', 'Vote tallies', 'Execution receipts'],
    risks: ['Malicious payloads', 'Quorum manipulation', 'Bypassed timelocks'],
    controls: ['Payload simulation', 'Optimistic rollups for voting', 'Emergency pause capabilities']
  },
  { 
    id: 'records', path: '/records', title: 'Records Intelligence', description: 'Immutable logging of operational decisions.', status: RiskLevel.GREEN, lastReviewed: '2023-10-27T07:00:00Z',
    purpose: 'Maintain an institutional-grade, tamper-evident audit trail of all operations.',
    reviews: ['Log continuity', 'Hash integrity', 'Storage redundancy', 'Access patterns'],
    records: ['Master audit trail', 'State root commitments', 'Archival proofs'],
    risks: ['Data unavailability', 'Log tampering', 'Incomplete state capture'],
    controls: ['Decentralized storage (IPFS/Arweave)', 'Periodic state anchoring', 'Read-only access layers']
  },
  { 
    id: 'risk', path: '/risk', title: 'Risk Intelligence', description: 'Continuity and exposure assessment.', status: RiskLevel.YELLOW, lastReviewed: '2023-10-27T12:00:00Z',
    purpose: 'Continuously evaluate the ecosystem for operational, technical, and continuity risks.',
    reviews: ['Dependency health', 'Smart contract vulnerabilities', 'Operational bottlenecks', 'Regulatory exposure'],
    records: ['Risk assessment reports', 'Incident response logs', 'Mitigation tracking'],
    risks: ['Unpatched vulnerabilities', 'Single points of failure', 'Regulatory non-compliance'],
    controls: ['Continuous auditing', 'Automated circuit breakers', 'Legal wrapper alignment']
  },
];

export const MOCK_AGENT_RESPONSE = `
**CLASSIFICATION:** Treasury Access Modification Request
**FACTS PRESENTED:**
- Request to add new signer (0x7aB...3f9) to primary operational multisig.
- Current threshold: 3/5. Proposed threshold: 4/6.
- Requesting entity holds valid 'Treasury Operator' credential.
**OPERATIONAL ISSUE:**
- The proposed signer address has no prior interaction history within the governed ecosystem.
- Adding a signer without prior contributor verification violates Protocol Ops Policy v2.1.
**RISK ASSESSMENT:** RED (Critical Exposure)
**RECOMMENDED ACTION:**
- Reject immediate addition to primary multisig.
- Require proposed signer to complete KLAT verification and hold a 'Verified Contributor' credential for 30 days prior to treasury access.
**RECORDKEEPING INSTRUCTION:**
- Log this request attempt and rejection reason in the Governance Registry under category 'Access Control Exception'.
**IMPLEMENTATION STEP:**
- Route request back to proposer with policy citation. Initiate credential issuance workflow for new address if requested.
`;
