import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { dbService } from '../services/dbService';

export const IntakeForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    organization: '',
    name: '',
    email: '',
    role: '',
    need: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dbService.submitIntake(formData);
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to submit intake", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-charcoal-900 border border-charcoal-800 p-8 text-center space-y-6">
          <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
          <h2 className="text-xl font-mono text-platinum tracking-widest uppercase">Request Received</h2>
          <p className="text-sm text-zinc-400 font-mono leading-relaxed">
            Your operations review request has been logged in the demo registry. An administrator will review the submission.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full px-4 py-3 bg-cyan-600 text-obsidian font-mono text-sm font-bold tracking-wider hover:bg-cyan-500 transition-colors"
          >
            RETURN TO HOME
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian flex flex-col p-6 md:p-12">
      <div className="max-w-2xl w-full mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="text-xs font-mono text-zinc-500 hover:text-cyan-400 flex items-center gap-2 mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> RETURN
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-mono text-platinum tracking-tight mb-2 uppercase">Operations Review Intake</h1>
          <p className="text-sm text-zinc-400 font-mono">Submit a request for institutional governance and operational review.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-charcoal-900 border border-charcoal-800 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Organization</label>
              <input 
                required
                type="text" 
                value={formData.organization}
                onChange={e => setFormData({...formData, organization: e.target.value})}
                className="w-full bg-obsidian border border-charcoal-700 text-platinum text-sm p-3 focus:outline-none focus:border-cyan-600 font-mono transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Your Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-obsidian border border-charcoal-700 text-platinum text-sm p-3 focus:outline-none focus:border-cyan-600 font-mono transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Email Address</label>
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-obsidian border border-charcoal-700 text-platinum text-sm p-3 focus:outline-none focus:border-cyan-600 font-mono transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Operational Role</label>
              <input 
                required
                type="text" 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full bg-obsidian border border-charcoal-700 text-platinum text-sm p-3 focus:outline-none focus:border-cyan-600 font-mono transition-colors"
                placeholder="e.g. Treasury Controller"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Business Need / Review Scope</label>
            <textarea 
              required
              value={formData.need}
              onChange={e => setFormData({...formData, need: e.target.value})}
              className="w-full bg-obsidian border border-charcoal-700 text-platinum text-sm p-3 min-h-[120px] focus:outline-none focus:border-cyan-600 font-mono transition-colors"
              placeholder="Describe the operational workflow, access control, or governance process requiring review..."
            />
          </div>

          <div className="pt-4 border-t border-charcoal-800 flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-cyan-600 text-obsidian font-mono text-sm font-bold tracking-wider hover:bg-cyan-500 disabled:bg-charcoal-700 disabled:text-zinc-500 transition-colors flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              SUBMIT REQUEST
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
