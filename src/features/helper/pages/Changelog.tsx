import React, { useState } from 'react';
import { 
  GitBranch, Sparkles, Zap, Bug, CheckCircle2, 
  ArrowUpRight, ChevronDown, Filter, Calendar,
  Clock, Award
} from 'lucide-react';

/**
 * Interface định nghĩa cấu trúc dữ liệu cho một bản ghi cập nhật
 */
interface ChangelogEntry {
  version: string;
  type: 'Major' | 'Minor' | 'Patch';
  date: string;
  features?: string[];
  improvements?: string[];
  fixes?: string[];
}

const App: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Features' | 'Improvements' | 'Bug Fixes'>('All');

  const changelogData: ChangelogEntry[] = [
    {
      version: 'v2.4.0',
      type: 'Major',
      date: '10/11/2025',
      features: [
        'Dark Mode: Tích hợp chế độ giao diện tối toàn hệ thống, tự động điều chỉnh theo cấu hình hệ điều hành.',
        'Google Calendar Sync: Đồng bộ hóa dữ liệu hai chiều với nền tảng Google Calendar.',
        'Custom Fields: Cho phép mở rộng các trường dữ liệu tùy chỉnh cho đối tượng tác vụ (Tasks).'
      ],
      improvements: [
        'Tối ưu hóa thuật toán tải Kanban Board, cải thiện tốc độ phản hồi lên 30%.',
        'Cập nhật giao diện bảng điều khiển (Dashboard) với hệ thống biểu đồ tương tác mới.'
      ]
    },
    {
      version: 'v2.3.5',
      type: 'Patch',
      date: '25/10/2025',
      fixes: [
        'Khắc phục lỗi hiển thị Avatar trên trình duyệt di động (Safari).',
        'Vá lỗ hổng bảo mật liên quan đến cơ chế duy trì phiên đăng nhập (CVE-2025-XXXX).',
        'Xử lý xung đột tính năng kéo thả (Drag & Drop) trên trình duyệt Firefox.'
      ]
    },
    {
      version: 'v2.3.0',
      type: 'Minor',
      date: '10/10/2025',
      features: [
        'Recurring Tasks: Thiết lập các tác vụ lặp lại định kỳ theo cấu hình linh hoạt.',
        'Task Dependencies: Xây dựng mối liên kết và phụ thuộc giữa các tác vụ trong dự án.'
      ],
      improvements: [
        'Nâng cấp trình soạn thảo hỗ trợ định dạng Markdown toàn phần.',
        'Tối ưu hóa hiệu năng xử lý cho không gian làm việc (Workspace) quy mô lớn.'
      ]
    },
    {
      version: 'v2.2.0',
      type: 'Minor',
      date: '15/09/2025',
      features: [
        'Timeline View: Cung cấp giao diện Gantt chart phục vụ quản trị tiến độ dự án.',
        'Slack Integration: Tích hợp hệ thống thông báo trực tiếp qua nền tảng Slack.'
      ]
    }
  ];

  const filteredData = changelogData.filter(entry => {
    if (filter === 'All') return true;
    if (filter === 'Features') return entry.features && entry.features.length > 0;
    if (filter === 'Improvements') return entry.improvements && entry.improvements.length > 0;
    if (filter === 'Bug Fixes') return entry.fixes && entry.fixes.length > 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      
      {/* PHẦN TIÊU ĐIỂM (HERO SECTION) */}
      <div className="bg-gradient-to-b from-purple-50 to-white border-b border-slate-200 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 border border-purple-200 text-xs font-bold text-purple-700 rounded-full mb-6 uppercase tracking-widest">
            <GitBranch className="w-3 h-3" />
            Thông cáo phát hành
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Lịch sử cập nhật phiên bản</h1>
          <p className="text-lg text-slate-500 leading-relaxed text-justify md:text-center">
            Theo dõi chi tiết quá trình tối ưu hóa, các tính năng mới được triển khai và các bản vá kỹ thuật nhằm duy trì sự ổn định của hệ thống PronaFlow.
          </p>
        </div>
      </div>

      {/* HỆ THỐNG PHÂN LOẠI (FILTER) */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 py-6">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-2 text-slate-400">
              <Filter className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Lọc:</span>
            </div>
            {(['All', 'Features', 'Improvements', 'Bug Fixes'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all border ${
                  filter === type 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {type === 'All' ? 'Tất cả' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LỘ TRÌNH PHÁT TRIỂN (CHANGELOG TIMELINE) */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="relative border-l-2 border-slate-100 space-y-16 ml-4">
          
          {filteredData.map((entry, index) => (
            <div key={entry.version} className="relative pl-10 group">
              {/* Điểm nút trên Timeline */}
              <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-125 ${
                entry.type === 'Major' ? 'bg-purple-600' : entry.type === 'Minor' ? 'bg-blue-600' : 'bg-slate-400'
              }`}></div>
              
              {/* Thông tin đầu mục phiên bản */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{entry.version}</h2>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase rounded-md tracking-wider ${
                    entry.type === 'Major' ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-200' : 
                    entry.type === 'Minor' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : 
                    'bg-slate-50 text-slate-600 ring-1 ring-slate-200'
                  }`}>
                    {entry.type === 'Major' ? 'Bản cập nhật lớn' : entry.type === 'Minor' ? 'Cập nhật định kỳ' : 'Bản vá kỹ thuật'}
                  </span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {entry.date}
                  </span>
                </div>
              </div>

              {/* Chi tiết nội dung cập nhật */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:border-slate-300 transition-all space-y-8">
                
                {entry.features && entry.features.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Tính năng mới
                    </h4>
                    <ul className="space-y-3">
                      {entry.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span dangerouslySetInnerHTML={{ __html: feature }}></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {entry.improvements && entry.improvements.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> Cải tiến hiệu quả
                    </h4>
                    <ul className="space-y-3">
                      {entry.improvements.map((improvement, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                          <ArrowUpRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {entry.fixes && entry.fixes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Bug className="w-4 h-4" /> Khắc phục lỗi
                    </h4>
                    <ul className="space-y-3">
                      {entry.fixes.map((fix, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                          <div className="w-5 h-5 bg-rose-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                          </div>
                          <span>{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* TẢI THÊM (LOAD MORE) */}
        <div className="text-center mt-20">
          <button className="inline-flex items-center gap-2 px-8 py-3 bg-white text-slate-900 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95">
            <Clock className="w-4 h-4" />
            Truy xuất phiên bản cũ hơn
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-16 border-t border-slate-100 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 text-slate-400 mb-4">
            <Award className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">PronaFlow Release Intelligence</span>
          </div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
            &copy; {new Date().getFullYear()} PronaFlow Operational Technology. Mọi thay đổi đều được ghi nhận qua hệ thống kiểm soát phiên bản.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default App;