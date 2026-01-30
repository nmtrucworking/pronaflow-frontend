import React from 'react';
import { cn } from '../utils';

export const Modal = ({ isOpen, onClose, children, className }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; className?: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={cn("relative bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 w-full max-h-[90vh] flex flex-col", className)}>
        {children}
      </div>
    </div>
  );
};
