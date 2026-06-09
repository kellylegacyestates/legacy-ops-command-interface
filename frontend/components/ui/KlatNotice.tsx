import React from 'react';
import { KLAT_NOTICE } from '../../constants';

interface KlatNoticeProps {
  className?: string;
}

export const KlatNotice: React.FC<KlatNoticeProps> = ({ className = '' }) => {
  return (
    <div className={`text-[10px] text-zinc-600 font-mono leading-relaxed ${className}`}>
      {KLAT_NOTICE}
    </div>
  );
};
