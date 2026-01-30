import React, { useRef } from 'react';
import { cn } from '../utils';
import { useClickOutside } from '../hooks/useClickOutside';

export const Popover = ({ 
  trigger, 
  content, 
  isOpen, 
  setIsOpen,
  align = 'end'
}: { 
  trigger: React.ReactNode; 
  content: React.ReactNode; 
  isOpen: boolean; 
  setIsOpen: (v: boolean) => void;
  align?: 'start' | 'end';
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className={cn(
          "absolute top-full mt-2 z-50 bg-white rounded-xl border border-slate-200 shadow-xl p-1 animate-in fade-in zoom-in-95 duration-200 min-w-[220px] max-h-[400px] overflow-y-auto custom-scrollbar",
          align === 'end' ? 'right-0' : 'left-0'
        )}>
          {content}
        </div>
      )}
    </div>
  );
};
