import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, X, Save } from 'lucide-react';
import { DemoRequest } from '../types';
import { dbService } from '../services/dbService';

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<DemoRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadRequests = async () => {
    setIsLoading(true);
    const data = await dbService.getRequests();
    setRequests(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdate = async (id: string, updates: Partial<DemoRequest>) => {
    await dbService.updateRequest(id, updates);
    await loadRequests();
    if (selectedRequest && selectedRequest.id === id) {
      const updated = await dbService.getRequests();
      setSelectedRequest(updated.find(r => r.id === id) || null);
    }
  };

  const stats = {
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    highPriority: requests.filter(r => r.priority === 'high').length,
    closed: requests.filter(r => r.status === 'closed').length,
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col p-6">
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <button 
              onClick={() => navigate('/')}
              className="text-xs font-mono text-zinc-500 hover:text-cyan-400 flex items-center gap-2 mb-4 transition-colors"
            >
              <ArrowLeft size={14} /> RETURN TO HOME
            </button>
            <h1 className="text-2xl font-mono text-platinum tracking-tight uppercase">Admin Review Console</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Requests', value: stats.total },
            { label: 'New Pending', value: stats.new, color: 'text-cyan-400' },
            { label: 'High Priority', value: stats.highPriority, color: 'text-rose-400' },
            { label: 'Closed', value: stats.closed, color: 'text-zinc-500' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-charcoal-900 border border-charcoal-800 p-4">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">{stat.label}</div>
              <div className={`text-2xl font-mono ${stat.color || 'text-platinum'}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-6 h-[600px]">
          {/* List */}
          <div className="w-full md:w-1/2 lg:w-2/3 bg-charcoal-900 border border-charcoal-800 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-charcoal-800/50 sticky top-0">
                <tr>
                  <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-wider border-b border-charcoal-800">ID / Org</th>
                  <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-wider border-b border-charcoal-800">Status</th>
                  <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-wider border-b border-charcoal-800">Priority</th>
                  <th className="p-4 text-[10px] font-mono text-zinc-500 uppercase tracking-wider border-b border-charcoal-800">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="p-4 text-center text-zinc-500 font-mono text-sm">Loading...</td></tr>
                ) : requests.map(req => (
                  <tr key={req.id} className="border-b border-charcoal-800/50 hover:bg-charcoal-800 transition-colors">
                    <td className="p-4">
                      <div className="text-xs font-mono text-platinum">{req.id}</div>
                      <div className="text-[10px] font-mono text-zinc-500">{req.organization}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider border ${
                        req.status === 'new' ? 'border-cyan-900 text-cyan-400 bg-cyan-950/30' :
                        req.status === 'closed' ? 'border-zinc-800 text-zinc-500 bg-zinc-900/30' :
                        'border-amber-900 text-amber-400 bg-amber-950/30'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-mono uppercase tracking-wider ${
                        req.priority === 'high' ? 'text-rose-400' : 'text-zinc-400'
                      }`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => setSelectedRequest(req)}
                        className="text-[10px] font-mono text-cyan-500 hover:text-cyan-400 flex items-center gap-1 uppercase tracking-wider"
                      >
                        <FileText size={12} /> Open File
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail Panel */}
          {selectedRequest && (
            <div className="hidden md:flex w-1/2 lg:w-1/3 bg-charcoal-900 border border-charcoal-800 flex-col">
              <div className="p-4 border-b border-charcoal-800 flex justify-between items-center bg-charcoal-800/30">
                <h2 className="text-sm font-mono text-platinum uppercase tracking-widest">Review File: {selectedRequest.id}</h2>
                <button onClick={() => setSelectedRequest(null)} className="text-zinc-500 hover:text-platinum">
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-grow space-y-6">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Submitter</div>
                  <div className="text-sm font-mono text-platinum">{selectedRequest.name} ({selectedRequest.role})</div>
                  <div className="text-xs font-mono text-zinc-400">{selectedRequest.email}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Business Need</div>
                  <div className="text-sm font-mono text-zinc-300 bg-obsidian p-3 border border-charcoal-800 leading-relaxed">
                    {selectedRequest.need}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-charcoal-800">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Priority</label>
                    <select 
                      value={selectedRequest.priority}
                      onChange={(e) => handleUpdate(selectedRequest.id, { priority: e.target.value as any })}
                      className="w-full bg-obsidian border border-charcoal-700 text-platinum text-sm p-2 focus:outline-none focus:border-cyan-600 font-mono"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Review Outcome</label>
                    <select 
                      value={selectedRequest.reviewOutcome || ''}
                      onChange={(e) => handleUpdate(selectedRequest.id, { reviewOutcome: e.target.value })}
                      className="w-full bg-obsidian border border-charcoal-700 text-platinum text-sm p-2 focus:outline-none focus:border-cyan-600 font-mono"
                    >
                      <option value="">Pending</option>
                      <option value="needs_info">Needs More Information</option>
                      <option value="approved">Approved for Operations</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Admin Notes</label>
                    <textarea 
                      value={selectedRequest.adminNotes || ''}
                      onChange={(e) => handleUpdate(selectedRequest.id, { adminNotes: e.target.value })}
                      className="w-full bg-obsidian border border-charcoal-700 text-platinum text-sm p-2 min-h-[100px] focus:outline-none focus:border-cyan-600 font-mono"
                      placeholder="Internal notes..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
