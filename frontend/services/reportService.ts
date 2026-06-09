import { ReportEntry } from '../types';

const STORAGE_KEY = 'legacy_ops_report_entries';

export const reportService = {
  getEntries(): ReportEntry[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  },

  addEntry(entry: Omit<ReportEntry, 'id' | 'timestamp'>): ReportEntry {
    const newEntry: ReportEntry = {
      ...entry,
      id: `FND-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: Date.now(),
    };
    
    const existing = this.getEntries();
    existing.push(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    
    return newEntry;
  },

  clearEntries(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};
