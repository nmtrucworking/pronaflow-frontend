import React from 'react';
import { Database, HardDrive, ShieldCheck, Clock } from 'lucide-react';

interface ArchiveStatsProps {
  archiveCount: number;
}

const ArchiveStats: React.FC<ArchiveStatsProps> = ({ archiveCount }) => (
  <div className="grid grid-cols-4 gap-4 shrink-0 animate-in fade-in slide-in-from-top-4 duration-700">
    <ArchiveStatTile label="Tổng lưu trữ" value="1.54 GB" icon={HardDrive} color="blue" trend="+12% tháng" />
    <ArchiveStatTile label="Bảo vệ" value={archiveCount} icon={ShieldCheck} color="emerald" trend="Safe" />
    <ArchiveStatTile label="Sắp tiêu hủy" value="02" icon={Clock} color="red" pulse trend="Cần xử lý" />
    <ArchiveStatTile label="Tự động" value="48" icon={Database} color="purple" trend="Cronjob" />
  </div>
);

const ArchiveStatTile: React.FC<{ label: string; value: any; icon: any; color: string; pulse?: boolean; trend: string }> = ({
  label,
  value,
  icon: Icon,
  color,
  pulse,
  trend,
}) => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-blue-500/20 transition-all duration-300 overflow-hidden relative">
    <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 transition-colors" />
    <div className="flex-1 pl-2">
      <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</p>
        <span className={`text-[8px] font-bold ${color === 'red' ? 'text-red-500 font-black' : 'text-slate-400'} uppercase`}>
          {trend}
        </span>
      </div>
    </div>
    <div className={`p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm ${pulse ? 'animate-pulse' : ''}`}>
      <Icon size={18} strokeWidth={2.5} />
    </div>
  </div>
);

export default ArchiveStats;
