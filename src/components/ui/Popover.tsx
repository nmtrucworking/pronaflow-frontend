import React, { useRef } from 'react';
import { cn, useClickOutside } from '@/lib/utils';

interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  align?: 'start' | 'end';
  className?: string;
}

/**
 * Popover Component: Hiển thị nội dung nổi phía trên hoặc phía dưới một trigger.
 * Tự động đóng khi nhấn ra bên ngoài vùng nội dung.
 */
export const Popover = ({ 
  trigger, 
  content, 
  isOpen, 
  setIsOpen,
  align = 'end',
  className
}: PopoverProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Xử lý đóng popover khi người dùng click ra ngoài
  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Vùng Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="cursor-pointer select-none"
      >
        {trigger}
      </div>

      {/* Vùng Content (Nội dung nổi) */}
      {isOpen && (
        <div className={cn(
          "absolute top-full mt-2 z-50 bg-white rounded-xl border border-slate-200 shadow-xl p-1",
          "animate-in fade-in zoom-in-95 duration-200",
          "min-w-[240px] max-h-[400px] overflow-y-auto custom-scrollbar",
          align === 'end' ? 'right-0' : 'left-0',
          className
        )}>
          {content}
        </div>
      )}
    </div>
  );
};