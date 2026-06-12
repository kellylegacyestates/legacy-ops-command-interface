import { useState, useRef } from "react";

const CATEGORIES = [
  "Business Strategy", "Marketing Campaigns", "Sales Funnels", "Content Creation",
  "AI Agents", "Automation Workflows", "Product Creation", "Digital Courses",
  "Legal/Admin Document Organization", "Research Systems", "Personal Productivity",
  "Branding", "Software Development", "Customer Service", "Operations"
];

const EXPERTISE = ["Practitioner", "Senior Specialist", "Director", "C-Suite Executive", "World-Class Expert"];
const VERSIONS = ["fast", "professional", "enterprise", "master"];

const VERSION_META = {
  fast: { label: "Fast", badge: "⚡", desc: "Rapid deployment. Core instruction set. No friction." },
  professional: { label: "Professional", badge: "◈", desc: "Full context loading. Structured output. Audit-ready." },
  enterprise: { label: "Enterprise", badge: "▣", desc: "Multi-stakeholder. Governance layer. Compliance-grade." },
  master: { label: "Master", badge: "✦", desc: "Self-optimizing. Iterative review loop. Maximum output fidelity." },
};

const COMMANDS = [
  { cmd: "/build", desc: "Create a new production prompt from intake" },
  { cmd: "/improve", desc: "Upgrade an existing prompt you paste in" },
  { cmd: "/audit", desc: "Score and diagnose prompt quality (1–100)" },
  { cmd: "/monetize", desc: "Convert idea into revenue workflow prompt" },
  { cmd: "/agent", desc: "Create a specialized AI agent prompt" },
  { cmd: "/system", desc: "Build a full operating system prompt" },
];

async function callClaude(messages, systemPrompt) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, systemPrompt }),
  });

  if (!res.ok) {
    throw new Error("PromptForge API request failed");
  }

  const data = await res.json();
  return data.output || "";
}

function buildEnginePrompt(intake, version, command = "/build") {
  const versionInstructions = {
    fast: "Generate a FAST version: tight, direct, deployment-ready. 150–250 words. No preamble. No filler.",
    professional: "Generate a PROFESSIONAL version: full role assignment, structured steps, output spec, one self-review loop. 300–450 words.",
    enterprise: "Generate an ENTERPRISE version: multi-stakeholder framing, compliance constraints, audit trail instruction, escalation logic. 450–650 words.",
    master: "Generate a MASTER version: world-class expert identity, layered reasoning chain, iterative self-critique loop, failure-mode handling, output versioning. 600–900 words.",
  };

  const commandContext = {
    "/build": "Build a production-ready prompt from the user's intake data.",
    "/improve": "Upgrade and strengthen the existing prompt provided. Identify weaknesses, then rewrite it to a higher standard.",
    "/audit": "Perform a structured audit of the prompt. Score it 1–100 across six dimensions. Identify weaknesses. Provide specific improvement recommendations.",
    "/monetize": "Frame this as a revenue-generating workflow. Assign expert identity, define the value proposition, and build a prompt that produces a monetizable deliverable.",
    "/agent": "Create a complete AI agent prompt: persistent identity, memory instructions, decision logic, escalation rules, and output protocol.",
    "/system": "Build a full operating system prompt: master identity, domain knowledge loading, workflow sequencing, output standards, and maintenance instructions.",
  };

  return `You are PromptForge Pro™ — an elite prompt engineering engine developed by the Kelly Legacy Institute, Office of the Fiduciary. You operate with institutional rigor, executive precision, and zero tolerance for vague, generic, or low-leverage output.

COMMAND CONTEXT: ${commandContext[command] || commandContext["/build"]}

VERSION INSTRUCTION: ${versionInstructions[version]}

USER INTAKE:
- Objective: ${intake.objective || "Not specified"}
- Audience: ${intake.audience || "Not specified"}
- Industry: ${intake.industry || "Not specified"}
- Expertise Level to Simulate: ${intake.expertise || "Expert"}
- Background Context: ${intake.context || "Not specified"}
- Desired Output Format: ${intake.outputFormat || "Not specified"}
- Mistakes to Avoid: ${intake.mistakes || "Not specified"}
- Category: ${intake.category || "General"}

YOUR TASK: Generate the requested prompt using this exact architecture:

ROLE — Assign the highest-value expert identity for this objective.
MISSION — Define the precise objective with zero ambiguity.
CONTEXT — Load all relevant background knowledge the AI must hold.
PROCESS — Step-by-step reasoning workflow numbered.
CONSTRAINTS — Quality controls, limitations, and guardrails.
OUTPUT — Exact format, structure, and deliverable specification.
OPTIMIZATION — One self-review instruction at the end.

After the prompt, add a PROMPT SCORECARD section.
Score each of these six dimensions 1–10:
Role Clarity, Mission Precision, Context Depth, Process Structure, Constraint Rigor, Output Specificity.

Then provide:
TOTAL SCORE out of 100.
One STRENGTH statement.
One WEAKNESS statement.
One IMPROVEMENT recommendation.

Do not add preamble. Start with the prompt label:
[PROMPTFORGE PRO™ — ${version.toUpperCase()} VERSION]

End with the scorecard. Nothing else.`;
}

function parseScore(text) {
  const match = text.match(/TOTAL SCORE[:\s]+(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

function ScoreRing({ score }) {
  if (!score) return null;
  const color = score >= 85 ? "#4ADE80" : score >= 65 ? "#F5A623" : "#FF6B2B";
  const r = 28;
  const c = 32;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={64} height={64} viewBox="0 0 64 64">
        <circle cx={c} cy={c} r={r} fill="none" stroke="#1E2330" strokeWidth={6} />
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
        />
        <text
          x={c}
          y={c + 5}
          textAnchor="middle"
          fill={color}
          style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}
        >
          {score}
        </text>
      </svg>
      <div>
        <div style={{ color, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
          {score >= 85 ? "ELITE" : score >= 70 ? "STRONG" : score >= 55 ? "MODERATE" : "WEAK"}
        </div>
        <div style={{ color: "#8A8FA0", fontSize: 11 }}>Prompt Score</div>
      </div>
    </div>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={copy}
      style={{
        background: copied ? "#4ADE8022" : "#1E2330",
        border: `1px solid ${copied ? "#4ADE80" : "#3A4055"}`,
        color: copied ? "#4ADE80" : "#8A8FA0",
        borderRadius: 6,
        padding: "5px 14px",
        fontSize: 11,
        cursor: "pointer",
        letterSpacing: 1,
        fontFamily: "monospace",
      }}
    >
      {copied ? "✓ COPIED" : "COPY"}
    </button>
  );
}

function Field({ label, hint, value, onChange, type = "text", options, rows }) {
  const base = {
    background: "#0D0F14",
    border: "1px solid #3A4055",
    borderRadius: 6,
    color: "#F0EDE8",
    padding: "10px 14px",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "system-ui",
    fontSize: 13,
    outline: "none",
    resize: "vertical",
  };

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ color: "#F5A623", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 }}>
        {label}
      </div>

      {hint && <div style={{ color: "#8A8FA0", fontSize: 11, marginBottom: 6 }}>{hint}</div>}

      {options ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...base, cursor: "pointer" }}>
          <option value="">— Select —</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : rows ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} style={base} placeholder={hint} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={base} placeholder={hint} />
      )}
    </div>
  );
}

export default function PromptForgePro() {
  const [phase, setPhase] = useState("home");
  const [activeCmd, setActiveCmd] = useState("/build");
  const [activeVersion, setActiveVersion] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [outputs, setOutputs] = useState({});
  const [visibleVersion, setVisibleVersion] = useState("professional");
  const [pasteInput, setPasteInput] = useState("");
  const [error, setError] = useState("");
  const outputRef = useRef(null);

  const [intake, setIntake] = useState({
    objective: "",
    audience: "",
    industry: "",
    expertise: "World-Class Expert",
    context: "",
    outputFormat: "",
    mistakes: "",
    category: "",
  });

  const setField = (key) => (value) => setIntake((prev) => ({ ...prev, [key]: value }));

  const readyToGenerate =
    intake.objective.trim().length > 10 || (activeCmd !== "/build" && pasteInput.trim().length > 20);

  const generate = async () => {
    setLoading(true);
    setOutputs({});
    setError("");
    setPhase("output");

    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    for (const version of VERSIONS) {
      setActiveVersion(version);

      const systemPrompt = buildEnginePrompt(intake, version, activeCmd);
      const userMsg =
        activeCmd === "/build"
          ? "Generate the prompt now."
          : `Here is the existing prompt or idea to process:\n\n${pasteInput}\n\nProcess it according to the command.`;

      try {
        const result = await callClaude([{ role: "user", content: userMsg }], systemPrompt);
        setOutputs((prev) => ({ ...prev, [version]: result }));
      } catch (err) {
        setOutputs((prev) => ({
          ...prev,
          [version]: "[Error generating this version. Confirm /api/claude is configured, then retry.]",
        }));
        setError("Generation failed for one or more versions. Check your backend Claude proxy.");
      }
    }

    setActiveVersion("professional");
    setVisibleVersion("professional");
    setLoading(false);
  };

  if (phase === "home") {
    return (
      <div style={page}>
        <div style={{ width: "100%", maxWidth: 900, padding: "40px 24px 0", borderBottom: "1px solid #1E2330" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={brand}>PromptForge Pro™</span>
            <span style={versionBadge}>v1.0</span>
          </div>
          <div style={subheader}>KELLY LEGACY INSTITUTE — OFFICE OF THE FIDUCIARY · AI SYSTEMS DIVISION</div>
        </div>

        <div style={{ maxWidth: 900, width: "100%", padding: "56px 24px 40px" }}>
          <div style={hero}>
            Precision-Grade Prompts.
            <br />
            <span style={{ color: "#F5A623" }}>Institutional-Quality Output.</span>
          </div>

          <div style={heroText}>
            PromptForge Pro™ diagnoses your objective, assigns the correct expert identity, extracts missing context,
            and builds production-ready prompts across four deployment tiers.
          </div>

          <div style={{ marginBottom: 32 }}>
            <div style={label}>SELECT COMMAND</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {COMMANDS.map(({ cmd }) => (
                <button key={cmd} onClick={() => setActiveCmd(cmd)} style={cmdButton(activeCmd === cmd)}>
                  {cmd}
                </button>
              ))}
            </div>
            <div style={{ color: "#8A8FA0", fontSize: 12, marginTop: 8, fontStyle: "italic" }}>
              {COMMANDS.find((c) => c.cmd === activeCmd)?.desc}
            </div>
          </div>

          <button onClick={() => setPhase("intake")} style={primaryButton}>
            BEGIN INTAKE →
          </button>
        </div>

        <div style={{ maxWidth: 900, width: "100%", padding: "0 24px 48px" }}>
          <div style={{ color: "#3A4055", fontSize: 11, letterSpacing: 2, marginBottom: 20 }}>
            FOUR DEPLOYMENT TIERS
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
            {VERSIONS.map((v) => (
              <div key={v} style={card}>
                <div style={{ fontSize: 18, marginBottom: 4, color: "#F5A623" }}>{VERSION_META[v].badge}</div>
                <div style={{ color: "#F0EDE8", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  {VERSION_META[v].label}
                </div>
                <div style={{ color: "#8A8FA0", fontSize: 11, lineHeight: 1.5 }}>{VERSION_META[v].desc}</div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (phase === "intake") {
    return (
      <div style={page}>
        <div style={{ width: "100%", maxWidth: 680, padding: "40px 24px" }}>
          <TopNav setPhase={setPhase} activeCmd={activeCmd} intakeOnly />

          <div style={label}>PHASE 1 — INTELLIGENCE INTAKE</div>
          <div style={sectionTitle}>Define Your Objective</div>
          <div style={{ color: "#8A8FA0", fontSize: 13, marginBottom: 32, lineHeight: 1.6 }}>
            Answer precisely. The quality of the generated prompt is a direct function of the quality of this intake.
          </div>

          {activeCmd !== "/build" && (
            <div style={{ ...card, border: "1px solid #F5A62344", marginBottom: 24 }}>
              <div style={label}>PASTE EXISTING PROMPT OR IDEA</div>
              <textarea
                value={pasteInput}
                onChange={(e) => setPasteInput(e.target.value)}
                rows={5}
                style={textarea}
                placeholder={`Paste the content you want to ${activeCmd.replace("/", "")}...`}
              />
            </div>
          )}

          <Field label="OUTCOME OBJECTIVE" hint="What result must this prompt produce? Be specific." value={intake.objective} onChange={setField("objective")} rows={3} />
          <Field label="TARGET AUDIENCE" hint="Who is the end user of the AI output?" value={intake.audience} onChange={setField("audience")} />
          <Field label="INDUSTRY / FIELD" hint="e.g. Real estate law, SaaS marketing, estate planning" value={intake.industry} onChange={setField("industry")} />
          <Field label="PROMPT CATEGORY" options={CATEGORIES} value={intake.category} onChange={setField("category")} />
          <Field label="EXPERTISE LEVEL TO SIMULATE" options={EXPERTISE} value={intake.expertise} onChange={setField("expertise")} />
          <Field label="BACKGROUND CONTEXT" hint="What must the AI know to do this correctly?" value={intake.context} onChange={setField("context")} rows={4} />
          <Field label="OUTPUT FORMAT" hint="e.g. Numbered action plan, executive memo, JSON, script" value={intake.outputFormat} onChange={setField("outputFormat")} />
          <Field label="MISTAKES TO AVOID" hint="What failure modes should the AI explicitly avoid?" value={intake.mistakes} onChange={setField("mistakes")} rows={3} />

          <div style={{ marginBottom: 28 }}>
            <div style={label}>GENERATION MODE</div>
            <div style={card}>
              <div style={{ color: "#F0EDE8", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                All four deployment tiers generate automatically.
              </div>
              <div style={{ color: "#8A8FA0", fontSize: 12, lineHeight: 1.6 }}>
                Fast, Professional, Enterprise, and Master versions will generate in sequence.
              </div>
            </div>
          </div>

          <button onClick={generate} disabled={!readyToGenerate || loading} style={generateButton(readyToGenerate && !loading)}>
            {loading ? "GENERATING..." : "GENERATE PROMPTS →"}
          </button>

          {!readyToGenerate && (
            <div style={{ color: "#3A4055", fontSize: 11, textAlign: "center", marginTop: 8 }}>
              Enter your objective to unlock generation.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={outputRef} style={page}>
      <div style={{ width: "100%", maxWidth: 860, padding: "40px 24px" }}>
        <TopNav setPhase={setPhase} activeCmd={activeCmd} />

        <div style={label}>PHASE 3 — OUTPUT DELIVERY</div>
        <div style={sectionTitle}>Generated Prompts</div>

        {error && <div style={errorBox}>{error}</div>}

        {loading && (
          <div style={{ ...card, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F5A623", animation: "pulse 1s ease-in-out infinite" }} />
            <span style={{ color: "#8A8FA0", fontSize: 13 }}>
              Generating {VERSION_META[activeVersion]?.label} version...
              <span style={{ color: "#F5A623", fontFamily: "monospace" }}> {VERSIONS.filter((v) => outputs[v]).length}/4 complete</span>
            </span>
          </div>
        )}

        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {VERSIONS.map((v) => {
            const done = !!outputs[v];
            const active = visibleVersion === v;

            return (
              <button key={v} onClick={() => done && setVisibleVersion(v)} disabled={!done} style={tabButton(active, done)}>
                {VERSION_META[v].badge} {VERSION_META[v].label.toUpperCase()}
              </button>
            );
          })}
        </div>

        {outputs[visibleVersion] ? (
          <div style={{ ...card, borderRadius: "0 8px 8px 8px", padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <ScoreRing score={parseScore(outputs[visibleVersion])} />
              <CopyBtn text={outputs[visibleVersion]} />
            </div>

            <pre style={outputText}>{outputs[visibleVersion]}</pre>
          </div>
        ) : (
          <div style={{ ...card, borderRadius: "0 8px 8px 8px", padding: "48px 24px", textAlign: "center", color: "#3A4055", fontSize: 13 }}>
            {loading ? "Generating this version..." : "Not yet generated."}
          </div>
        )}

        <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={generate} disabled={loading} style={primaryButton}>
            ↺ REGENERATE
          </button>
          <button onClick={() => setPhase("intake")} style={secondaryButton}>
            EDIT INTAKE
          </button>
        </div>

        <Footer />
      </div>

      <style>{`
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0D0F14; }
        ::-webkit-scrollbar-thumb { background: #3A4055; border-radius: 2px; }
        select option { background: #161A22; color: #F0EDE8; }
      `}</style>
    </div>
  );
}

function TopNav({ setPhase, activeCmd, intakeOnly = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
      <button onClick={() => setPhase("home")} style={navButton}>← HOME</button>
      {!intakeOnly && <button onClick={() => setPhase("intake")} style={navButton}>← INTAKE</button>}
      <div style={{ fontFamily: "'Georgia',serif", color: "#F5A623", fontSize: 16, fontWeight: 700 }}>PromptForge Pro™</div>
      <div style={cmdPill}>{activeCmd}</div>
    </div>
  );
}

function Footer() {
  return (
    <div style={{ marginTop: 48, borderTop: "1px solid #1E2330", paddingTop: 20, color: "#3A4055", fontSize: 10, letterSpacing: 1, textAlign: "center", width: "100%" }}>
      © 2026 KELLY LEGACY ESTATES LLC — PROMPTFORGE PRO™ — NOT LEGAL OR PROFESSIONAL ADVICE
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#0D0F14",
  color: "#F0EDE8",
  fontFamily: "system-ui,-apple-system,sans-serif",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const brand = {
  fontFamily: "'Georgia',serif",
  fontSize: 28,
  fontWeight: 700,
  color: "#F5A623",
};

const versionBadge = {
  background: "#F5A62322",
  border: "1px solid #F5A623",
  color: "#F5A623",
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: 2,
  borderRadius: 4,
  padding: "2px 8px",
};

const subheader = {
  color: "#8A8FA0",
  fontSize: 12,
  letterSpacing: 1,
  marginBottom: 24,
};

const hero = {
  fontFamily: "'Georgia',serif",
  fontSize: 36,
  fontWeight: 700,
  lineHeight: 1.2,
  color: "#F0EDE8",
  marginBottom: 16,
  maxWidth: 620,
};

const heroText = {
  color: "#8A8FA0",
  fontSize: 15,
  lineHeight: 1.7,
  maxWidth: 540,
  marginBottom: 40,
};

const label = {
  color: "#F5A623",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1.5,
  marginBottom: 10,
};

const sectionTitle = {
  fontFamily: "'Georgia',serif",
  fontSize: 22,
  fontWeight: 700,
  marginBottom: 24,
};

const card = {
  background: "#161A22",
  border: "1px solid #1E2330",
  borderRadius: 8,
  padding: "16px 18px",
};

const textarea = {
  background: "#0D0F14",
  border: "1px solid #3A4055",
  borderRadius: 6,
  color: "#F0EDE8",
  padding: "10px 14px",
  width: "100%",
  boxSizing: "border-box",
  fontSize: 13,
  fontFamily: "system-ui",
  resize: "vertical",
  outline: "none",
};

const outputText = {
  color: "#F0EDE8",
  fontSize: 12.5,
  lineHeight: 1.75,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  fontFamily: "'Georgia',Georgia,serif",
  margin: 0,
  borderTop: "1px solid #1E2330",
  paddingTop: 20,
};

const primaryButton = {
  background: "linear-gradient(135deg,#F5A623,#FF6B2B)",
  border: "none",
  borderRadius: 8,
  padding: "12px 28px",
  color: "#0D0F14",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  letterSpacing: 1,
};

const secondaryButton = {
  background: "#161A22",
  border: "1px solid #3A4055",
  borderRadius: 8,
  padding: "12px 28px",
  color: "#8A8FA0",
  fontSize: 13,
  cursor: "pointer",
  letterSpacing: 1,
};

const navButton = {
  background: "none",
  border: "1px solid #3A4055",
  color: "#8A8FA0",
  borderRadius: 6,
  padding: "6px 12px",
  cursor: "pointer",
  fontSize: 11,
  fontFamily: "monospace",
};

const cmdPill = {
  marginLeft: "auto",
  background: "#1E2330",
  border: "1px solid #3A4055",
  color: "#8A8FA0",
  borderRadius: 4,
  padding: "3px 10px",
  fontSize: 10,
  fontFamily: "monospace",
  letterSpacing: 1,
};

const errorBox = {
  background: "#FF6B2B22",
  border: "1px solid #FF6B2B",
  color: "#FFB199",
  borderRadius: 8,
  padding: "12px 16px",
  marginBottom: 20,
  fontSize: 13,
};

function cmdButton(active) {
  return {
    background: active ? "#F5A623" : "#161A22",
    border: `1px solid ${active ? "#F5A623" : "#3A4055"}`,
    color: active ? "#0D0F14" : "#8A8FA0",
    borderRadius: 6,
    padding: "8px 14px",
    fontSize: 12,
    cursor: "pointer",
    fontWeight: active ? 700 : 400,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  };
}

function generateButton(active) {
  return {
    background: active ? "linear-gradient(135deg,#F5A623,#FF6B2B)" : "#1E2330",
    border: "none",
    borderRadius: 8,
    padding: "14px 36px",
    color: active ? "#0D0F14" : "#3A4055",
    fontSize: 14,
    fontWeight: 700,
    cursor: active ? "pointer" : "not-allowed",
    letterSpacing: 1,
    width: "100%",
  };
}

function tabButton(active, done) {
  return {
    background: active ? "#1E2330" : "transparent",
    border: `1px solid ${active ? "#F5A623" : "#3A4055"}`,
    borderBottom: active ? "1px solid #1E2330" : "1px solid #3A4055",
    color: active ? "#F5A623" : done ? "#8A8FA0" : "#3A4055",
    borderRadius: "6px 6px 0 0",
    padding: "8px 18px",
    cursor: done ? "pointer" : "not-allowed",
    fontSize: 11,
    fontWeight: active ? 700 : 400,
    fontFamily: "monospace",
    letterSpacing: 1,
  };
}
