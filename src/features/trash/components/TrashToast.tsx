import React from 'react';
import { RefreshCw, Trash2, X } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface TrashToastProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  desc: string;
  type: 'success' | 'danger';
}

const TrashToast: React.FC<TrashToastProps> = ({ isOpen, onClose, title, desc, type }) => {
  if (!isOpen) return null;
  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-[100] w-80 bg-white border rounded-xl shadow-lg p-4 flex items-start gap-4 animate-in slide-in-from-bottom-10 fade-in duration-300',
        type === 'danger' ? 'border-red-100' : 'border-emerald-100'
      )}
    >
      <div className={cn('p-2 rounded-full flex-shrink-0', type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600')}>
        {type === 'danger' ? <Trash2 className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 mt-1 leading-snug">{desc}</p>
      </div>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TrashToast;
