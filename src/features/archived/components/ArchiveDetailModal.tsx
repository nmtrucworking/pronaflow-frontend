import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Archive, Calendar, HardDrive, RotateCcw, ShieldAlert, ShieldCheck, Trash2, X } from 'lucide-react';
import type { ArchiveItem } from '../types';
import { TYPE_CONFIG } from '../constants';

interface ArchiveDetailModalProps {
  selectedItem: ArchiveItem | null;
  onClose: () => void;
}

const ArchiveDetailModal: React.FC<ArchiveDetailModalProps> = ({ selectedItem, onClose }) => (
  <Dialog.Root open={!!selectedItem} onOpenChange={(open) => !open && onClose()}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
      <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-[101] border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200 outline-none">
        {selectedItem && (
          <div className="flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${TYPE_CONFIG[selectedItem.type].bg} border border-slate-200/60 dark:border-slate-800 shadow-sm`}>
                  {React.createElement(TYPE_CONFIG[selectedItem.type].icon, { size: 22, className: TYPE_CONFIG[selectedItem.type].color })}
                </div>
                <div>
                  <Dialog.Title className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {selectedItem.name}
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-slate-500 dark:text-slate-400">
                    Mã định danh: <span className="font-semibold">{selectedItem.id}</span>
                  </Dialog.Description>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-900/50">
                  <ShieldCheck size={12} /> Dữ liệu đã xác thực
                </div>
                <Dialog.Close className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all">
                  <X size={18} strokeWidth={2.5} aria-hidden="true" />
                  <span className="sr-only">Đóng modal</span>
                </Dialog.Close>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar-y p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <DetailField icon={Archive} label="Loại thực thể" value={selectedItem.type} highlight />
                <DetailField icon={HardDrive} label="Dung lượng" value={selectedItem.size} />
                <DetailField icon={Calendar} label="Thời điểm lưu" value={selectedItem.archived_at} />
                <DetailField icon={ShieldAlert} label="Chính sách hủy" value={selectedItem.expiry_date} />
              </div>

              <section className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mô tả lý do</h4>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800">
                  “{selectedItem.reason}”
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nhật ký tuân thủ</h4>
                <div className="space-y-5 border-l-2 border-slate-100 dark:border-slate-800 ml-1 pl-5">
                  <ActivityItem text="Mã hóa bản sao bằng AES-256 hoàn tất" time="Gần đây" />
                  <ActivityItem text="Gán nhãn bảo mật mức độ doanh nghiệp" time="Lúc khởi tạo" />
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row gap-3">
              <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-[11px] font-black shadow-lg hover:opacity-95 active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                <RotateCcw size={14} strokeWidth={3} /> Khôi phục dữ liệu
              </button>
              <button className="flex-1 py-2.5 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/40 text-red-500 rounded-xl text-[11px] font-black hover:bg-red-50 dark:hover:bg-red-900/20 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                <Trash2 size={14} strokeWidth={3} /> Tiêu hủy vĩnh viễn
              </button>
            </div>
          </div>
        )}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

const DetailField: React.FC<{ icon: any; label: string; value: string; highlight?: boolean }> = ({ icon: Icon, label, value, highlight }) => (
  <div className="flex flex-col gap-1.5 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/20 transition-all">
    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
      <Icon size={10} className="text-blue-500" /> {label}
    </span>
    <span className={`text-[11px] font-black ${highlight ? 'text-blue-600' : 'text-slate-800 dark:text-slate-100'}`}>
      {value}
    </span>
  </div>
);

const ActivityItem: React.FC<{ text: string; time: string }> = ({ text, time }) => (
  <div className="relative group pl-1">
    <div className="absolute -left-[25px] top-1 w-2 h-2 rounded-full bg-blue-600 border border-white dark:border-slate-900 transition-all duration-300 shadow-md shadow-blue-500/20" />
    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors leading-tight">{text}</p>
    <p className="text-[9px] font-medium text-slate-400 italic mt-0.5 uppercase tracking-tighter opacity-70">{time}</p>
  </div>
);

export default ArchiveDetailModal;
