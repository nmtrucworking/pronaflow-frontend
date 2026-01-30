import { Inbox } from 'lucide-react';

export const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center animate-in fade-in duration-500">
    <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
      <Inbox className="w-16 h-16 text-indigo-200" />
    </div>
    <h3 className="text-lg font-semibold text-slate-700">Tuyệt vời! Inbox Zero</h3>
    <p className="text-sm mt-2 max-w-xs">Bạn đã đọc hết tất cả thông báo. Hãy tận hưởng khoảng thời gian tập trung này.</p>
  </div>
);
