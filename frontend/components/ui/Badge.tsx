import React from 'react';
import { RiskLevel } from '../../types';

interface BadgeProps {
  level: RiskLevel;
  className?: string;
}

export const RiskBadge: React.FC<BadgeProps> = ({ level, className = '' }) => {
  const styles = {
    [RiskLevel.GREEN]: 'bg-emerald-950 text-emerald-400 border-emerald-900',
    [RiskLevel.YELLOW]: 'bg-amber-950 text-amber-400 border-amber-900',
    [RiskLevel.RED]: 'bg-rose-950 text-rose-400 border-rose-900',
  };

  const labels = {
    [RiskLevel.GREEN]: 'CONTROLLED',
    [RiskLevel.YELLOW]: 'REVIEW REQ',
    [RiskLevel.RED]: 'CRITICAL',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider border rounded-sm ${styles[level]} ${className}`}>
      {labels[level]}
    </span>
  );
};
