import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface TrashDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  isDanger?: boolean;
  children: React.ReactNode;
}

const TrashDialog: React.FC<TrashDialogProps> = ({ isOpen, onClose, title, description, children, isDanger }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 border border-slate-100">
        <div className="flex items-start gap-4">
          <div className={cn('p-3 rounded-full flex-shrink-0', isDanger ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600')}>
            {isDanger ? <AlertTriangle className="w-6 h-6" /> : <RefreshCw className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">{children}</div>
      </div>
    </div>
  );
};

export default TrashDialog;
