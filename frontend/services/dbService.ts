import { DemoRequest } from '../types';

// Mock Firestore implementation using localStorage
const STORAGE_KEY = 'legacy_ops_demo_requests';

export const dbService = {
  async submitIntake(data: Partial<DemoRequest>): Promise<DemoRequest> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newRequest: DemoRequest = {
      id: `REQ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      organization: data.organization || '',
      name: data.name || '',
      email: data.email || '',
      role: data.role || '',
      need: data.need || '',
      status: 'new',
      priority: 'normal',
      source: 'LegacyOps Command Intake',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const existing = this.getRequestsSync();
    existing.push(newRequest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    
    return newRequest;
  },

  async getRequests(): Promise<DemoRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.getRequestsSync().sort((a, b) => b.createdAt - a.createdAt);
  },

  async updateRequest(id: string, updates: Partial<DemoRequest>): Promise<DemoRequest> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const existing = this.getRequestsSync();
    const index = existing.findIndex(r => r.id === id);
    
    if (index === -1) throw new Error('Request not found');

    const updatedRequest = {
      ...existing[index],
      ...updates,
      updatedAt: Date.now()
    };

    // Handle close logic
    if (updates.reviewOutcome === 'closed' && existing[index].status !== 'closed') {
      updatedRequest.status = 'closed';
      updatedRequest.followUpStatus = 'completed';
      updatedRequest.closedAt = Date.now();
    }

    existing[index] = updatedRequest;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    
    return updatedRequest;
  },

  getRequestsSync(): DemoRequest[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Seed with some mock data if empty
      const seed: DemoRequest[] = [
        {
          id: 'REQ-ALPHA-01',
          organization: 'Decentralized Entity Alpha',
          name: 'Sarah Connor',
          email: 'sarah@decentralized.alpha',
          role: 'Treasury Controller',
          need: 'Need to review multisig threshold policies and credential issuance for new signers.',
          status: 'new',
          priority: 'high',
          source: 'LegacyOps Command Intake',
          createdAt: Date.now() - 86400000,
          updatedAt: Date.now() - 86400000,
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(data);
  }
};
