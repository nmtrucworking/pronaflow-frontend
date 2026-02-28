import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Download, Cpu, HardDrive, ShieldCheck, CheckCircle2, Monitor, Laptop, Code } from 'lucide-react';
import { ROUTES } from '@/routes/paths';

export default function DesktopDownloadPage() {
  const installers = [
    { platform: 'Windows', icon: <Monitor size={18} />, file: '/downloads/installers/PronaFlow-Setup-Windows.exe', note: 'Windows 10/11 (64-bit)' },
    { platform: 'macOS', icon: <Laptop size={18} />, file: '/downloads/installers/PronaFlow-Setup-macOS.dmg', note: 'macOS 11 trở lên' },
    { platform: 'Linux', icon: <Code size={18} />, file: '/downloads/installers/PronaFlow-Setup-Linux.AppImage', note: 'Ubuntu 20.04+ / distro tương thích' },
  ];

  const requirements = [
    { label: 'CPU', value: 'Intel i5 / AMD Ryzen 5 trở lên' },
    { label: 'RAM', value: 'Tối thiểu 8GB (khuyến nghị 16GB)' },
    { label: 'Storage', value: '2GB trống cho app + dữ liệu đồng bộ' },
    { label: 'Network', value: 'Kết nối ổn định để đồng bộ thời gian thực' },
  ];

  const steps = [
    'Tải đúng gói cài đặt theo hệ điều hành.',
    'Mở file installer và cấp quyền nếu hệ điều hành yêu cầu.',
    'Đăng nhập tài khoản PronaFlow để đồng bộ workspace.',
    'Hoàn tất xác thực email và kích hoạt bảo mật 2 lớp (khuyến nghị).',
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link to={ROUTES.root} className="hover:text-indigo-600">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="font-semibold text-slate-900">Hướng dẫn tải & cài đặt Desktop</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">PronaFlow Desktop: Yêu cầu hệ thống và quy trình cài đặt</h1>
          <p className="text-slate-600 mt-3 max-w-3xl">Trang này giúp bạn kiểm tra khả năng tương thích thiết bị, tải đúng bản cài đặt và hoàn tất kích hoạt an toàn.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Download size={18} /> Tải bộ cài</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {installers.map((item) => (
                <a
                  key={item.platform}
                  href={item.file}
                  download
                  className="block rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-sm p-4 transition-all"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">{item.icon} {item.platform}</div>
                  <p className="text-xs text-slate-500">{item.note}</p>
                  <div className="mt-3 text-sm text-indigo-700 font-semibold">Tải ngay</div>
                </a>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Cpu size={18} /> Yêu cầu hiệu năng</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {requirements.map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500 font-bold">{item.label}</div>
                  <div className="text-sm font-semibold text-slate-800 mt-1">{item.value}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ShieldCheck size={18} /> Quy trình cài đặt & kích hoạt</h2>
            <ol className="space-y-3">
              {steps.map((step, index) => (
                <li key={step} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center mt-0.5">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><HardDrive size={16} /> Lưu ý quan trọng</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex gap-2"><CheckCircle2 size={14} className="text-emerald-500 mt-0.5" /> Nên cài trên ổ SSD để tăng tốc độ đồng bộ.</li>
              <li className="flex gap-2"><CheckCircle2 size={14} className="text-emerald-500 mt-0.5" /> Cho phép app qua Firewall để tránh lỗi kết nối.</li>
              <li className="flex gap-2"><CheckCircle2 size={14} className="text-emerald-500 mt-0.5" /> Cập nhật app định kỳ để nhận bản vá bảo mật.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-900 mb-2">Cần hỗ trợ cài đặt?</h3>
            <p className="text-sm text-slate-600 mb-4">Đội ngũ support có thể hỗ trợ từ xa cho doanh nghiệp khi triển khai số lượng lớn thiết bị.</p>
            <Link to={ROUTES.help.contact} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm">
              Liên hệ hỗ trợ
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
