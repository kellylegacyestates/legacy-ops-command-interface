import { useState } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Palette: institutional slate, warm parchment, deep navy, brass accent, red alert
// #0D1B2A — deep navy (primary authority)
// #F5F0E8 — parchment (background)
// #B8923A — brass (accent, fiduciary gold)
// #2C3E50 — slate (secondary text)
// #E8E0D0 — warm rule (dividers)
// #C0392B — alert red (missing / unverified)
// #1A5276 — archival blue (confirmed / verified)
// Type: "Georgia" for headers (institutional gravitas), system-ui for body

const TOKEN = {
  navy:      "#0D1B2A",
  parchment: "#F5F0E8",
  brass:     "#B8923A",
  slate:     "#2C3E50",
  rule:      "#E8E0D0",
  alert:     "#C0392B",
  archive:   "#1A5276",
  midGray:   "#7F8C8D",
  offWhite:  "#FDFAF5",
};

// ─── STATIC DATA ──────────────────────────────────────────────────────────────

const CLASSIFICATION_SYSTEM = [
  {
    id: "personal",
    label: "Personal Records",
    icon: "◈",
    description: "Identity, vital statistics, health, legal standing of the individual.",
    examples: ["Birth certificate", "Passport / ID", "Social Security documentation", "Medical records", "Will / advance directive", "Divorce / marriage records"],
  },
  {
    id: "family",
    label: "Family Records",
    icon: "◉",
    description: "Shared history, estate lineage, household agreements, generational continuity.",
    examples: ["Family trust documents", "Estate inventories", "Shared property records", "Genealogical records", "Minor children records", "Caregiver agreements"],
  },
  {
    id: "business",
    label: "Business Records",
    icon: "◧",
    description: "Operational, contractual, and commercial documentation of any enterprise.",
    examples: ["Operating agreements / bylaws", "Vendor contracts", "Employment agreements", "Client records", "Tax filings (EIN, returns)", "IP registrations"],
  },
  {
    id: "governance",
    label: "Governance Records",
    icon: "⬡",
    description: "Fiduciary obligations, institutional authority, policy, and oversight documentation.",
    examples: ["Board resolutions", "Trustee records", "Power of attorney", "Fiduciary duty logs", "Compliance records", "Policy manuals"],
  },
  {
    id: "financial",
    label: "Financial Records",
    icon: "◈",
    description: "Asset, liability, transaction, and account documentation.",
    examples: ["Bank statements", "Investment account records", "Loan / debt instruments", "Tax returns", "Asset appraisals", "Beneficiary designations"],
  },
  {
    id: "educational",
    label: "Educational Records",
    icon: "▣",
    description: "Credentials, transcripts, certifications, professional licenses.",
    examples: ["Diplomas / transcripts", "Professional licenses", "Certifications", "Training records", "Continuing education logs", "Academic petitions"],
  },
  {
    id: "administrative",
    label: "Administrative Records",
    icon: "▤",
    description: "Procedural, regulatory, and institutional process documentation.",
    examples: ["Court filings", "Agency correspondence", "Permit / license applications", "Regulatory submissions", "Inspection records", "Grievance records"],
  },
  {
    id: "decision",
    label: "Decision Records",
    icon: "▦",
    description: "Documented rationale, deliberation, and authorization for material choices.",
    examples: ["Meeting minutes", "Resolution logs", "Approval records", "Delegation of authority", "Risk acceptance memos", "Policy exception records"],
  },
  {
    id: "communication",
    label: "Communication Records",
    icon: "▨",
    description: "Written exchanges that create, modify, or evidence obligations or agreements.",
    examples: ["Emails confirming agreements", "Certified mail records", "Text message logs (relevant)", "Formal notices", "Demand letters", "Settlement correspondence"],
  },
];

const WORKFLOW_STEPS = [
  {
    step: "01",
    label: "Intake",
    action: "Receive and log the document. Assign a unique record ID, intake date, and source. No analysis yet.",
    output: "Record ID assigned. Intake log entry created.",
  },
  {
    step: "02",
    label: "Identification",
    action: "Identify document type, issuing authority, parties named, and governing date range.",
    output: "Document header: type, issuer, parties, date range.",
  },
  {
    step: "03",
    label: "Classification",
    action: "Assign to one or more categories from the Master Classification System. Apply subcategory tag.",
    output: "Classification label applied. Filed in category index.",
  },
  {
    step: "04",
    label: "Timeline",
    action: "Extract all dates from the document. Map each date to an event. Integrate into the master chronology.",
    output: "Timeline entries added. Chronological position confirmed.",
  },
  {
    step: "05",
    label: "Verification",
    action: "Cross-reference against existing record. Flag inconsistencies, gaps, or unverifiable claims.",
    output: "Verification status: Confirmed / Pending / Disputed. Notes recorded.",
  },
  {
    step: "06",
    label: "Missing Information Review",
    action: "Identify what the document references that is not in the record. Flag each gap explicitly.",
    output: "Missing items list generated. Priority level assigned to each gap.",
  },
  {
    step: "07",
    label: "Summary Report",
    action: "Generate a structured record summary based only on confirmed facts. Assumptions excluded.",
    output: "Legacy Record Report™ produced.",
  },
  {
    step: "08",
    label: "Action Checklist",
    action: "Derive specific, sequenced next steps from the record. No action without record support.",
    output: "Prioritized action checklist with responsible party and deadline fields.",
  },
];

const INTAKE_QUESTIONS = [
  {
    id: "q1",
    category: "Situation",
    question: "Describe the situation you are organizing records for — in one or two factual sentences.",
    placeholder: "Example: I am organizing documents related to my mother's estate following her death in March 2026. There is a dispute among three siblings regarding the distribution of real property.",
    required: true,
  },
  {
    id: "q2",
    category: "Urgency",
    question: "Is there a deadline, hearing date, or time-sensitive event connected to this matter?",
    placeholder: "Example: A court hearing is scheduled for July 14, 2026. Or: No immediate deadline — this is ongoing organization.",
    required: true,
  },
  {
    id: "q3",
    category: "Parties",
    question: "Who are the individuals, entities, or institutions involved? List each with their role.",
    placeholder: "Example: Margaret Chen — decedent. James Chen — eldest son, claimant. Pacific Trust Bank — institutional trustee. Attorney Diallo — legal representative for estate.",
    required: true,
  },
  {
    id: "q4",
    category: "Documents in Hand",
    question: "What documents do you currently have access to? List each item.",
    placeholder: "Example: Will dated 2019, two bank statements, three emails from attorney, one deed of property, photographs of personal property.",
    required: true,
  },
  {
    id: "q5",
    category: "Documents Missing",
    question: "What documents do you believe should exist but have not yet been located?",
    placeholder: "Example: A second will referenced in a 2023 letter. Investment account statements. A property appraisal.",
    required: false,
  },
  {
    id: "q6",
    category: "Objective",
    question: "What is the specific outcome you are working toward through this organization?",
    placeholder: "Example: To prepare a complete record for my attorney before the July hearing. To settle the estate equitably and close accounts.",
    required: true,
  },
  {
    id: "q7",
    category: "Professional Involvement",
    question: "Are any licensed professionals currently involved — attorney, CPA, financial advisor, mediator?",
    placeholder: "Example: Attorney retained. CPA to be engaged. No mediator yet.",
    required: false,
  },
];

const ROADMAP = [
  {
    version: "Version 1",
    title: "Basic Document Intelligence",
    status: "Current",
    objective: "Establish the foundational record-building workflow for individual users and single matters.",
    capabilities: [
      "Intake and classification of uploaded documents",
      "Manual timeline construction",
      "Facts vs. assumptions separation",
      "Missing information identification",
      "One-page Legacy Record Report™ generation",
      "7-Day Action Plan tracking",
    ],
    users: "Individuals with a single active matter requiring organization.",
  },
  {
    version: "Version 2",
    title: "Family Operating System",
    status: "Planned",
    objective: "Extend the record system across multiple family members and intergenerational matters.",
    capabilities: [
      "Multi-party record management (household, estate, family trust)",
      "Role-based access per family member",
      "Estate document repository with succession mapping",
      "Shared timeline across all family matters",
      "Beneficiary and trustee record tracking",
      "Generational continuity documentation",
    ],
    users: "Families managing estates, trusts, caregiving, or multi-party assets.",
  },
  {
    version: "Version 3",
    title: "Business Governance Dashboard",
    status: "Roadmap",
    objective: "Provide structured operational, contractual, and compliance record management for small and mid-size entities.",
    capabilities: [
      "Entity-level record organization (LLC, trust, corporation)",
      "Contract lifecycle tracking with expiration alerts",
      "Board and governance resolution log",
      "Vendor and client record management",
      "Regulatory compliance calendar",
      "Financial record audit trail",
    ],
    users: "Business owners, operators, boards, and institutional fiduciaries.",
  },
  {
    version: "Version 4",
    title: "AI-Powered Institutional Record Management",
    status: "Roadmap",
    objective: "Deploy AI-assisted analysis, pattern recognition, and procedural drafting at institutional scale.",
    capabilities: [
      "Automated document classification and tagging",
      "AI-assisted gap analysis and verification flags",
      "Procedural drafting support for governance documents",
      "Cross-matter pattern recognition and risk flagging",
      "Audit-ready record packages on demand",
      "Integration with legal, financial, and compliance platforms",
    ],
    users: "Institutions, fiduciaries, compliance departments, and governance bodies operating at scale.",
  },
];

// ─── REPORT TEMPLATE STATE ────────────────────────────────────────────────────

const EMPTY_REPORT = {
  recordSummary: "",
  importantDates: "",
  peopleRoles: "",
  documentInventory: "",
  verifiedFacts: "",
  openQuestions: "",
  missingItems: "",
  recommendedSteps: "",
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "system-ui, sans-serif",
      fontSize: "10px",
      fontWeight: "700",
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: TOKEN.brass,
      marginBottom: "6px",
    }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ borderTop: `1px solid ${TOKEN.rule}`, margin: "24px 0" }} />;
}

function Badge({ children, color }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: "2px",
      fontSize: "10px",
      fontWeight: "700",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      background: color === "current" ? TOKEN.brass : color === "planned" ? TOKEN.archive : TOKEN.midGray,
      color: "#fff",
    }}>
      {children}
    </span>
  );
}

function NavTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        borderBottom: active ? `2px solid ${TOKEN.brass}` : "2px solid transparent",
        color: active ? TOKEN.navy : TOKEN.midGray,
        fontFamily: "Georgia, serif",
        fontSize: "13px",
        fontWeight: active ? "700" : "400",
        padding: "10px 16px",
        cursor: "pointer",
        transition: "color 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function OverviewPanel() {
  return (
    <div>
      {/* Hero statement */}
      <div style={{
        background: TOKEN.navy,
        borderLeft: `4px solid ${TOKEN.brass}`,
        padding: "28px 32px",
        marginBottom: "28px",
      }}>
        <div style={{
          fontFamily: "Georgia, serif",
          fontSize: "22px",
          fontWeight: "700",
          color: TOKEN.parchment,
          lineHeight: "1.35",
          marginBottom: "10px",
        }}>
          Legacy Document Intelligence Engine™
        </div>
        <div style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "13px",
          color: TOKEN.brass,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}>
          Kelly Legacy Institute · Office of the Fiduciary
        </div>
        <div style={{
          fontFamily: "Georgia, serif",
          fontSize: "15px",
          color: "#C5B99A",
          lineHeight: "1.7",
          fontStyle: "italic",
        }}>
          "Memory → Record. Reaction → Response. Chaos → Structure."
        </div>
      </div>

      {/* Purpose grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
        {[
          {
            label: "Purpose",
            body: "Transform unstructured, scattered information into organized, verifiable, defensible records — across personal, family, business, and institutional matters.",
          },
          {
            label: "Primary Users",
            body: "Individuals, families, fiduciaries, business operators, estate administrators, and governance professionals requiring structured record systems.",
          },
          {
            label: "Problems Solved",
            body: "Eliminates reliance on memory as evidence. Converts reactive habits into structured response. Surfaces missing documentation before it becomes a liability.",
          },
          {
            label: "System Boundaries",
            body: "This system organizes and analyzes records. It does not constitute legal, financial, or professional advice, and does not replace licensed counsel or fiduciary professionals.",
          },
        ].map((card) => (
          <div key={card.label} style={{
            background: TOKEN.offWhite,
            border: `1px solid ${TOKEN.rule}`,
            padding: "18px 20px",
          }}>
            <SectionLabel>{card.label}</SectionLabel>
            <div style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "13px",
              color: TOKEN.slate,
              lineHeight: "1.65",
            }}>
              {card.body}
            </div>
          </div>
        ))}
      </div>

      {/* Core functions */}
      <SectionLabel>Core Functions</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {[
          "Document intake, classification, and indexing",
          "Timeline construction from extracted dates and events",
          "Facts vs. assumptions separation and verification status tracking",
          "Missing information identification and gap prioritization",
          "Legacy Record Report™ generation — based solely on confirmed record",
          "7-Day Action Plan administration",
          "Personal Operating System maintenance scheduling",
        ].map((fn, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            padding: "10px 14px",
            background: TOKEN.offWhite,
            border: `1px solid ${TOKEN.rule}`,
          }}>
            <span style={{
              fontFamily: "Georgia, serif",
              fontSize: "11px",
              color: TOKEN.brass,
              fontWeight: "700",
              minWidth: "20px",
              paddingTop: "1px",
            }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: "13px",
              color: TOKEN.slate,
              lineHeight: "1.5",
            }}>
              {fn}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassificationPanel() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <SectionLabel>Master Classification System</SectionLabel>
        <div style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "13px",
          color: TOKEN.midGray,
          lineHeight: "1.6",
        }}>
          Every record entering the system is assigned to one or more of the following nine categories. Classification determines filing location, retrieval priority, and cross-reference linkage.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {CLASSIFICATION_SYSTEM.map((cat) => (
          <div key={cat.id}
            style={{
              border: `1px solid ${expanded === cat.id ? TOKEN.brass : TOKEN.rule}`,
              background: expanded === cat.id ? "#FBF8F2" : TOKEN.offWhite,
              transition: "border-color 0.15s",
            }}
          >
            <button
              onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{
                fontFamily: "Georgia, serif",
                fontSize: "18px",
                color: TOKEN.brass,
                minWidth: "22px",
              }}>
                {cat.icon}
              </span>
              <span style={{
                fontFamily: "Georgia, serif",
                fontSize: "14px",
                fontWeight: "700",
                color: TOKEN.navy,
                flex: 1,
              }}>
                {cat.label}
              </span>
              <span style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "11px",
                color: TOKEN.midGray,
              }}>
                {expanded === cat.id ? "▲" : "▼"}
              </span>
            </button>

            {expanded === cat.id && (
              <div style={{ padding: "0 18px 18px 54px" }}>
                <div style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "13px",
                  color: TOKEN.slate,
                  lineHeight: "1.65",
                  marginBottom: "12px",
                }}>
                  {cat.description}
                </div>
                <SectionLabel>Record Examples</SectionLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {cat.examples.map((ex) => (
                    <span key={ex} style={{
                      fontFamily: "system-ui, sans-serif",
                      fontSize: "11px",
                      color: TOKEN.archive,
                      background: "#EAF2FB",
                      padding: "3px 9px",
                      border: `1px solid #BED3E8`,
                    }}>
         
