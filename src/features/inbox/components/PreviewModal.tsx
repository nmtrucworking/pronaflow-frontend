import { X, Download, FileText, ImageIcon } from 'lucide-react';
import type { Attachment } from '../types/inbox-types';

interface PreviewModalProps {
  attachment: Attachment | null;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ attachment, onClose }) => {
  if (!attachment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-5xl h-full max-h-[85vh] bg-transparent flex flex-col animate-in zoom-in-95 duration-200 pointer-events-none">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-md rounded-t-xl border border-white/20 pointer-events-auto">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              {attachment.type === 'IMAGE' ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold">{attachment.name}</h3>
              <p className="text-xs text-white/70">{attachment.size} • {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors" 
              title="Tải xuống"
            >
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-white/70 hover:text-white hover:bg-red-500/80 rounded-full transition-colors" 
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-slate-900/50 flex items-center justify-center overflow-hidden rounded-b-xl border-x border-b border-white/20 pointer-events-auto relative">
          {attachment.type === 'IMAGE' ? (
            <img 
              src={attachment.url} 
              alt={attachment.name} 
              className="max-w-full max-h-full object-contain shadow-2xl" 
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-white">
              <FileText className="w-24 h-24 text-slate-400 mb-4" />
              <p className="text-lg font-medium">Không thể xem trước định dạng này</p>
              <button className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                Tải xuống để xem
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
