import React, { useState } from 'react';

export const AgentWorkspace: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'agent'; text: string }>>([
    {
      type: 'agent',
      text: 'Legacy Command Agent™ online. Awaiting instructions.',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([
      ...messages,
      { type: 'user', text: input },
      { type: 'agent', text: 'Command received. Processing...' },
    ]);
    setInput('');
  };

  return (
    <div className="h-full flex flex-col bg-obsidian">
      {/* Header */}
      <div className="border-b border-charcoal-700 bg-charcoal-900 px-8 py-4">
        <h1 className="font-mono text-lg font-bold text-platinum">
          Agent Workspace
        </h1>
        <p className="text-xs text-zinc-500 font-mono mt-1">
          Legacy Command Agent™ Interface
        </p>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md px-4 py-3 font-mono text-xs leading-relaxed rounded-none ${
                msg.type === 'user'
                  ? 'bg-gold-600 text-obsidian'
                  : 'bg-charcoal-800 border border-charcoal-700 text-platinum'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-charcoal-700 bg-charcoal-900 p-8">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter command..."
            className="flex-1 bg-charcoal-800 border border-charcoal-700 px-4 py-2 font-mono text-xs text-platinum placeholder-zinc-600 focus:outline-none focus:border-gold-600 transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gold-600 text-obsidian font-mono font-bold text-xs uppercase tracking-wider hover:bg-gold-500 transition-colors rounded-none"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
