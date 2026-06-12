import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function runPromptForge() {
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: input }] })
      });

      const data = await res.json();
      setOutput(data.output || data.detail || "No response returned.");
    } catch {
      setOutput("PromptForge connection failed.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#080A0F] text-white px-6 py-8">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm tracking-[0.35em] text-cyan-400 uppercase">Legacy Access™</p>
        <h1 className="mt-4 text-4xl md:text-6xl font-bold">PromptForge Command Interface</h1>
        <p className="mt-4 text-slate-300 max-w-2xl">
          Internal AI drafting and prompt infrastructure for Kelly Legacy Estates.
        </p>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <textarea
            className="w-full min-h-40 rounded-xl bg-black border border-slate-700 p-4 text-white"
            placeholder="Enter your prompt..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={runPromptForge}
            disabled={loading || !input.trim()}
            className="mt-4 rounded-xl bg-cyan-600 px-5 py-3 font-semibold disabled:opacity-50"
          >
            {loading ? "Running..." : "Run PromptForge"}
          </button>

          {output && (
            <div className="mt-6 whitespace-pre-wrap rounded-xl border border-slate-800 bg-black p-4 text-slate-100">
              {output}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
