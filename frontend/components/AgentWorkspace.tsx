import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Loader2, AlertCircle, Save, CheckCircle2 } from 'lucide-react';
import { AgentMessage, AgentConfig, Session, RiskLevel } from '../types';
import { sendCommandAgentRequest } from '../services/agentService';
import { reportService } from '../services/reportService';
import { KlatNotice } from './ui/KlatNotice';

// Sub-component for rendering and editing a structured finding
const FindingDraftCard: React.FC<{ sections: Record<string, string> }> = ({ sections }) => {
  const [saved, setSaved] = useState(false);
  
  let initialRisk = RiskLevel.YELLOW;
  const riskText = (sections['RISK ASSESSMENT'] || '').toUpperCase();
  if (riskText.includes('RED')) initialRisk = RiskLevel.RED;
  if (riskText.includes('GREEN')) initialRisk = RiskLevel.GREEN;

  const [classification, setClassification] = useState(sections['CLASSIFICATION'] || 'Unclassified Finding');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(initialRisk);
  const [factsPresented, setFactsPresented] = useState(sections['FACTS PRESENTED'] || '');
  const [operationalIssue, setOperationalIssue] = useState(sections['OPERATIONAL ISSUE'] || '');
  const [recommendedAction, setRecommendedAction] = useState(sections['RECOMMENDED ACTION'] || '');
  const [recordInstruction, setRecordInstruction] = useState(sections['RECORDKEEPING INSTRUCTION'] || '');
  const [implementationStep, setImplementationStep] = useState(sections['IMPLEMENTATION STEP'] || '');

  const handleSave = () => {
    reportService.addEntry({
      domainTitle: 'Command Agent Review',
      classification: classification.trim(),
      riskLevel,
      observation: `Facts: ${factsPresented.trim()}\n\nIssue: ${operationalIssue.trim()}`,
      impact: 'Determined via agent analysis.',
      recommendedControl: recommendedAction.trim(),
      recordInstruction: recordInstruction.trim(),
      implementationStep: implementationStep.trim(),
      status: 'Committed'
    });
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="bg-emerald-950/20 border border-emerald-900/50 p-4 flex items-center gap-3 text-emerald-400 font-mono text-sm">
        <CheckCircle2 size={18} />
        Finding successfully added to report registry.
      </div>
    );
  }

  return (
    <div className="bg-obsidian border border-charcoal-700 p-5 space-y-5 w-full">
      <div className="border-b border-charcoal-800 pb-3 flex justify-between items-center">
        <h3 className="text-xs font-mono text-platinum uppercase tracking-widest flex items-center gap-2">
          <Terminal size={14} className="text-cyan-500" />
          Structured Intelligence Output
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Classification</label>
          <input 
            type="text" 
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
            className="w-full bg-charcoal-900 border border-charcoal-800 text-platinum text-sm p-2 focus:outline-none focus:border-cyan-600 font-mono"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Risk Assessment</label>
          <select 
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
            className="w-full bg-charcoal-900 border border-charcoal-800 text-platinum text-sm p-2 focus:outline-none focus:border-cyan-600 font-mono"
          >
            <option value={RiskLevel.GREEN}>GREEN - Controlled</option>
            <option value={RiskLevel.YELLOW}>YELLOW - Requires Review</option>
            <option value={RiskLevel.RED}>RED - Critical Exposure</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Facts Presented</label>
          <textarea 
            value={factsPresented}
            onChange={(e) => setFactsPresented(e.target.value)}
            className="w-full bg-charcoal-900 border border-charcoal-800 text-platinum text-sm p-2 min-h-[80px] focus:outline-none focus:border-cyan-600 font-mono"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Operational Issue</label>
          <textarea 
            value={operationalIssue}
            onChange={(e) => setOperationalIssue(e.target.value)}
            className="w-full bg-charcoal-900 border border-charcoal-800 text-platinum text-sm p-2 min-h-[80px] focus:outline-none focus:border-cyan-600 font-mono"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Recommended Action</label>
        <textarea 
          value={recommendedAction}
          onChange={(e) => setRecommendedAction(e.target.value)}
          className="w-full bg-charcoal-900 border border-charcoal-800 text-platinum text-sm p-2 min-h-[60px] focus:outline-none focus:border-cyan-600 font-mono"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Recordkeeping Instruction</label>
          <textarea 
            value={recordInstruction}
            onChange={(e) => setRecordInstruction(e.target.value)}
            className="w-full bg-charcoal-900 border border-charcoal-800 text-platinum text-sm p-2 min-h-[60px] focus:outline-none focus:border-cyan-600 font-mono"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Implementation Step</label>
          <textarea 
            value={implementationStep}
            onChange={(e) => setImplementationStep(e.target.value)}
            className="w-full bg-charcoal-900 border border-charcoal-800 text-platinum text-sm p-2 min-h-[60px] focus:outline-none focus:border-cyan-600 font-mono"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-charcoal-800 flex justify-end">
        <button 
          onClick={handleSave}
          className="px-4 py-2 bg-cyan-950/30 border border-cyan-900/50 hover:border-cyan-500 text-cyan-400 text-xs font-mono flex items-center gap-2 transition-colors"
        >
          <Save size={14} /> ADD TO REPORT
        </button>
      </div>
    </div>
  );
};

export const AgentWorkspace: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'sys-1',
      role: 'system',
      content: 'Legacy AI™ Command Agent initialized. Awaiting operational review request.',
      timestamp: Date.now()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [config, setConfig] = useState<AgentConfig>({ projectId: '', location: '', agentId: '' });
  
  useEffect(() => {
    const saved = localStorage.getItem('legacy_ops_agent_config');
    if (saved) setConfig(JSON.parse(saved));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseStructuredResponse = (text: string) => {
    const sections: Record<string, string> = {};
    let currentSection = '';
    
    const lines = text.split('\n');
    for (const line of lines) {
      const match = line.match(/^\*\*(.*?):\*\*(.*)/);
      if (match) {
        currentSection = match[1].trim();
        sections[currentSection] = match[2].trim() + '\n';
      } else if (currentSection) {
        sections[currentSection] += line + '\n';
      }
    }
    return sections;
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMsg: AgentMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);
    setError(null);

    try {
      let fullResponse = '';
      const agentMsgId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, {
        id: agentMsgId,
        role: 'agent',
        content: '',
        timestamp: Date.now()
      }]);

      await sendCommandAgentRequest(
        userMsg.content,
        config,
        session,
        (chunk) => {
          fullResponse += chunk;
          setMessages(prev => prev.map(msg => 
            msg.id === agentMsgId ? { ...msg, content: fullResponse } : msg
          ));
        }
      );
    } catch (err) {
      setError("Error communicating with Agent.");
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        content: 'ERROR: Connection to intelligence core lost.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderMessageContent = (msg: AgentMessage) => {
    if (msg.role === 'system') {
      return <div className="text-zinc-500 italic">{msg.content}</div>;
    }
    if (msg.role === 'user') {
      return <div className="text-platinum">{msg.content}</div>;
    }

    const sections = parseStructuredResponse(msg.content);
    if (Object.keys(sections).length > 2 && !isProcessing) {
      return <FindingDraftCard sections={sections} />;
    }

    return <div className="text-zinc-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">{msg.content}</div>;
  };

  return (
    <div className="flex-grow flex flex-col bg-obsidian h-full relative">
      <div className="p-4 border-b border-charcoal-800 flex justify-between items-center bg-charcoal-900/50">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-cyan-500" />
          <h1 className="text-sm font-mono text-platinum uppercase tracking-widest">Legacy AI™ Command Agent</h1>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-rose-400 text-xs font-mono">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">
              {msg.role === 'user' ? 'Command Input' : msg.role === 'agent' ? 'Operational Intelligence Output' : 'System'}
            </div>
            <div className={`w-full md:max-w-[85%] p-4 ${
              msg.role === 'user' 
                ? 'bg-charcoal-800 border border-charcoal-700 text-platinum ml-auto max-w-[90%]' 
                : msg.role === 'agent'
                  ? 'bg-charcoal-900 border border-charcoal-800'
                  : 'bg-transparent border border-dashed border-charcoal-700'
            }`}>
              {renderMessageContent(msg)}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex flex-col items-start">
            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider mb-1">Processing</div>
            <div className="p-4 bg-obsidian border border-charcoal-800 flex items-center gap-3">
              <Loader2 size={16} className="text-cyan-500 animate-spin" />
              <span className="text-xs font-mono text-zinc-400">Analyzing operational parameters...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-charcoal-800 bg-charcoal-900/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
            {['Review multisig addition', 'Verify credential status', 'Assess governance proposal'].map((prompt, idx) => (
              <button 
                key={idx}
                onClick={() => setInput(prompt)}
                className="whitespace-nowrap text-[10px] font-mono text-zinc-500 hover:text-cyan-400 border border-charcoal-700 hover:border-cyan-900 bg-obsidian px-2 py-1 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="relative flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Enter governance review request or operational query..."
              className="w-full bg-obsidian border border-charcoal-700 text-platinum text-sm p-3 min-h-[80px] max-h-[200px] focus:outline-none focus:border-cyan-600 font-mono resize-y transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="absolute right-2 bottom-2 p-2 bg-cyan-600 text-obsidian hover:bg-cyan-500 disabled:bg-charcoal-700 disabled:text-zinc-500 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="mt-3 text-center">
            <KlatNotice />
          </div>
        </div>
      </div>
    </div>
  );
};
