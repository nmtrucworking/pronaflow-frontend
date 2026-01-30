import React, { useState, useEffect } from 'react';
import { 
  Globe, Code, Database, HardDrive, Mail, 
  AlertTriangle, XCircle, Info, CheckCircle2, 
  Activity, Clock, ChevronRight 
} from 'lucide-react';

/**
 * Interface định nghĩa cấu trúc dữ liệu cho từng dịch vụ hệ thống
 */
interface SystemService {
  id: string;
  name: string;
  description: string;
  status: 'operational' | 'degraded' | 'outage';
  responseTime?: string;
  icon: React.ReactNode;
}

/**
 * Interface định nghĩa cấu trúc cho lịch sử sự cố
 */
interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'resolved' | 'monitoring' | 'investigating';
  type: 'maintenance' | 'critical' | 'info';
  timestamp: string;
}

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // Thiết lập thời gian cập nhật dữ liệu lần cuối
    const now = new Date();
    const formatted = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + 
                    " " + now.toLocaleDateString('vi-VN');
    setCurrentTime(formatted);
  }, []);

  const services: SystemService[] = [
    { 
      id: 'web', 
      name: 'Web Application', 
      description: 'Vietnam Server Cluster (Ho Chi Minh)', 
      status: 'operational', 
      responseTime: '45ms',
      icon: <Globe className="w-6 h-6" /> 
    },
    { 
      id: 'api', 
      name: 'API Services', 
      description: 'REST & GraphQL Endpoints', 
      status: 'operational', 
      responseTime: '32ms',
      icon: <Code className="w-6 h-6" /> 
    },
    { 
      id: 'db', 
      name: 'Database Cluster', 
      description: 'MS SQL Server (Primary + Replica)', 
      status: 'operational', 
      responseTime: '12ms',
      icon: <Database className="w-6 h-6" /> 
    },
    { 
      id: 'storage', 
      name: 'File Storage', 
      description: 'Azure Blob Storage Infrastructure', 
      status: 'operational', 
      responseTime: '78ms',
      icon: <HardDrive className="w-6 h-6" /> 
    },
    { 
      id: 'email', 
      name: 'Email Service', 
      description: 'SMTP Notifications & Transactional Alerts', 
      status: 'operational', 
      icon: <Mail className="w-6 h-6" /> 
    },
  ];

  const incidents: Incident[] = [
    {
      id: 'inc-1',
      title: 'Bảo trì nâng cấp hạ tầng Database',
      description: 'Thực hiện tối ưu hóa chỉ mục và cập nhật các bản vá bảo mật định kỳ. Quá trình diễn ra ổn định.',
      status: 'resolved',
      type: 'maintenance',
      timestamp: '10/11/2025 • 02:00 - 02:30 (GMT+7)'
    },
    {
      id: 'inc-2',
      title: 'Hiệu suất API bị suy giảm',
      description: 'Ghi nhận tình trạng phản hồi chậm tại một số endpoint do lưu lượng truy cập tăng đột biến. Đã thực hiện mở rộng quy mô máy chủ (Auto-scaling).',
      status: 'resolved',
      type: 'critical',
      timestamp: '25/10/2025 • 14:15 - 14:45 (GMT+7)'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* PHẦN ĐẦU TRANG (HERO SECTION) */}
      <div className="bg-slate-900 text-white py-16 relative overflow-hidden">
        {/* Đồ họa trang trí trừu tượng */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-bold tracking-wide uppercase">Hệ thống vận hành ổn định</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Trạng thái Hệ thống</h1>
          <p className="text-slate-400 text-sm flex items-center justify-center gap-4">
            <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> Cập nhật theo thời gian thực</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Kiểm tra lần cuối: {currentTime}</span>
          </p>
        </div>
      </div>

      {/* DANH SÁCH CÁC DỊCH VỤ (STATUS CARDS) */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {services.map((service) => (
            <div key={service.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-5 mb-4 sm:mb-0">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{service.name}</h3>
                  <p className="text-sm text-slate-500">{service.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6">
                {service.responseTime && (
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Đáp ứng</span>
                    <span className="text-sm font-mono text-slate-600">{service.responseTime}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 uppercase tracking-wide">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Operational
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* THỐNG KÊ TỶ LỆ KHẢ DỤNG (UPTIME STATS) */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Tỷ lệ hoạt động (90 ngày qua)
          </h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trung bình: 99.98%</span>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-end justify-between mb-6">
            <div className="flex flex-col">
              <span className="text-4xl font-black text-emerald-600">99.98%</span>
              <span className="text-xs text-slate-500 font-medium">Uptime định kỳ</span>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                Dữ liệu được tổng hợp từ hệ thống giám sát phân tán tại nhiều khu vực địa lý khác nhau.
              </p>
            </div>
          </div>
          
          <div className="flex gap-1 h-10">
            {Array.from({ length: 90 }).map((_, i) => {
              // Mô phỏng các điểm sự cố nhỏ
              const isDegraded = i === 45 || i === 67;
              return (
                <div 
                  key={i} 
                  className={`flex-1 rounded-full transition-all hover:scale-y-125 cursor-help ${isDegraded ? "bg-amber-400" : "bg-emerald-500"}`}
                  title={`${90 - i} ngày trước: ${isDegraded ? "Sự cố cục bộ" : "Hoạt động 100%"}`}
                ></div>
              );
            })}
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>90 ngày trước</span>
            <span>Hiện tại</span>
          </div>
        </div>
      </div>

      {/* LỊCH SỬ SỰ CỐ KỸ THUẬT (INCIDENT HISTORY) */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-bold text-slate-900 mb-8">Lịch sử sự cố kỹ thuật</h2>
        <div className="space-y-6">
          {incidents.map((incident) => (
            <div key={incident.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  incident.type === 'maintenance' ? 'bg-blue-50 text-blue-600' : 
                  incident.type === 'critical' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'
                }`}>
                  {incident.type === 'maintenance' ? <Info className="w-5 h-5" /> : 
                   incident.type === 'critical' ? <AlertTriangle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{incident.title}</h3>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-md tracking-wider">
                      Đã khắc phục
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {incident.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {incident.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ĐĂNG KÝ THÔNG BÁO (SUBSCRIBE) */}
      <div className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Đăng ký báo cáo sự cố</h3>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Nhận thông báo tự động qua email khi hệ thống ghi nhận các sự cố kỹ thuật hoặc kế hoạch bảo trì hạ tầng định kỳ.
          </p>
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Nhập địa chỉ email doanh nghiệp..." 
              className="flex-grow px-5 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
            />
            <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95 text-sm">
              Đăng ký
            </button>
          </form>
          <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest">
            Chúng tôi cam kết bảo mật thông tin theo chính sách dữ liệu của PronaFlow.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-xs font-medium">
            &copy; {new Date().getFullYear()} PronaFlow Operational Intelligence. Mọi dữ liệu trích xuất từ hệ thống giám sát trung tâm.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default App;