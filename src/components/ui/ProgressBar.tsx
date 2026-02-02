import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'default';
}

export const ProgressBar = ({ progress, showLabel = true, className, size = 'default' }: ProgressBarProps) => {
  const isCompleted = progress === 100;

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-slate-500 font-medium">Tiến độ</span>
          <span className={cn("font-bold", isCompleted ? "text-emerald-600" : "text-indigo-600")}>
            {progress}%
          </span>
        </div>
      )}
      <div className={cn(
        "w-full bg-slate-100 rounded-full overflow-hidden",
        size === 'sm' ? 'h-1' : 'h-1.5'
      )}>
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out", 
            isCompleted ? "bg-emerald-500" : "bg-indigo-500"
          )} 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};