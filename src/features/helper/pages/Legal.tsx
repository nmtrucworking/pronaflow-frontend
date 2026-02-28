import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/paths';
import { 
  ChevronRight, FileText, Shield, Server, Activity, 
  Cookie, ArrowRight, Download, Calendar, ShieldCheck, 
  Lock, Mail, Info, CheckCircle2 
} from 'lucide-react';

/**
 * LegalPage Component
 * Trình bày tổng thể các văn bản pháp lý và cam kết vận hành của PronaFlow.
 * Triển khai logic điều hướng động và cấu trúc nội dung phân tầng theo tiêu chuẩn học thuật.
 */
const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('terms');

  // Logic Intersection Observer để cập nhật trạng thái Sidebar dựa trên vị trí cuộn
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'terms', label: '1. Quy định sử dụng', icon: <FileText className="w-4 h-4" /> },
    { id: 'privacy', label: '2. Chính sách bảo mật', icon: <Lock className="w-4 h-4" /> },
    { id: 'data-processing', label: '3. Xử lý dữ liệu', icon: <Server className="w-4 h-4" /> },
    { id: 'sla', label: '4. Cam kết dịch vụ (SLA)', icon: <Activity className="w-4 h-4" /> },
    { id: 'cookies', label: '5. Chính sách Cookie', icon: <Cookie className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* PHẦN ĐẦU TRANG (HERO SECTION) */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
            <Link to={ROUTES.help.root} className="hover:text-emerald-600 cursor-pointer transition-colors">Hỗ trợ</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-semibold">Trung tâm Pháp lý</span>
          </nav>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Khung Pháp lý & Quy định Vận hành
          </h1>
          
          <p className="text-lg text-slate-600 max-w-4xl leading-relaxed text-justify">
            Trung tâm Pháp lý cung cấp các văn bản chính thức quy định về quyền hạn, trách nhiệm và các tiêu chuẩn bảo mật dữ liệu. 
            Mọi hoạt động trên hệ thống PronaFlow đều được điều chỉnh bởi các văn bản này nhằm đảm bảo tính minh bạch, an toàn và tuân thủ các quy chuẩn quốc tế.
          </p>
          
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2 font-semibold">
              <Calendar className="w-4 h-4 text-emerald-500" /> 
              Ngày cập nhật: 01/01/2025
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 
              Phiên bản: 2.1
            </span>
          </div>
        </div>
      </div>

      {/* TRUY CẬP NHANH (QUICK LINKS) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Link to={ROUTES.help.terms} className="group text-left bg-white rounded-2xl p-8 border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all block">
            <div className="flex items-start gap-5">
              <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors text-emerald-600">
                <FileText className="w-8 h-8" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Điều khoản Sử dụng</h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">Toàn văn quy định về các điều kiện và thỏa thuận sử dụng dịch vụ PronaFlow.</p>
                <span className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  Chi tiết văn bản <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
          
          <Link to={ROUTES.help.privacy} className="group text-left bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all block">
            <div className="flex items-start gap-5">
              <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors text-blue-600">
                <Shield className="w-8 h-8" />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Chính sách Bảo mật</h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">Quy trình thu thập, xử lý và các biện pháp bảo mật dữ liệu người dùng.</p>
                <span className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm">
                  Chi tiết văn bản <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 pt-8">
          
          {/* SIDEBAR ĐIỀU HƯỚNG */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-12">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Danh mục tổng hợp</h5>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-all border-l-2 rounded-r-lg flex items-center gap-3 ${
                      activeSection === item.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-10 pt-8 border-t border-slate-200">
                <Link to={ROUTES.help.terms} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">
                  <Download className="w-4 h-4" />
                  Mở điều khoản dịch vụ
                </Link>
              </div>
            </div>
          </aside>

          {/* NỘI DUNG TỔNG HỢP (MAIN CONTENT) */}
          <main className="flex-grow max-w-4xl">
            <div className="space-y-20">

              {/* PHẦN 1: ĐIỀU KHOẢN */}
              <section id="terms" className="scroll-mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">1. Quy định sử dụng chung</h2>
                </div>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-justify">
                  <p>Các quy định dưới đây thiết lập khung pháp lý cơ bản cho việc vận hành tài khoản và sử dụng tài nguyên hệ thống.</p>
                  
                  <h3 className="text-slate-900 font-bold mt-6 mb-3">1.1. Quản lý tài khoản và định danh</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Người dùng có nghĩa vụ bảo mật thông tin định danh cá nhân.</li>
                    <li>Nghiêm cấm các hành vi truy cập trái phép hoặc can thiệp vào cấu trúc hệ thống.</li>
                    <li>Tài khoản vi phạm các tiêu chuẩn cộng đồng sẽ bị đình chỉ tạm thời để phục vụ công tác thanh tra.</li>
                  </ul>

                  <h3 className="text-slate-900 font-bold mt-8 mb-3">1.2. Quyền sở hữu trí tuệ</h3>
                  <p>Mọi thuật ngữ, cấu trúc dữ liệu và giao diện người dùng thuộc sở hữu độc quyền của PronaFlow. Việc trích xuất dữ liệu tự động mà không có sự đồng ý bằng văn bản được coi là vi phạm nghiêm trọng bản quyền phần mềm.</p>
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* PHẦN 2: BẢO MẬT */}
              <section id="privacy" className="scroll-mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">2. Chính sách bảo mật dữ liệu</h2>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl mb-8">
                  <h4 className="text-blue-900 font-bold text-xs uppercase tracking-widest mb-2">Nguyên tắc bảo mật</h4>
                  <p className="text-blue-800 text-sm leading-relaxed text-justify font-medium italic">
                    Dữ liệu người dùng là tài sản bảo mật cao nhất. Chúng tôi áp dụng triết lý "Quyền riêng tư mặc định" trong mọi quy trình xử lý dữ liệu.
                  </p>
                </div>
                <div className="overflow-hidden border border-slate-200 rounded-xl mb-8 shadow-sm">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Phân loại dữ liệu</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Mục đích xử lý</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      <tr>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">Dữ liệu định danh</td>
                        <td className="px-6 py-4 text-sm text-slate-600 italic">Duy trì quyền truy cập và xác thực bảo mật.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">Dữ liệu đo lường</td>
                        <td className="px-6 py-4 text-sm text-slate-600 italic">Tối ưu hóa hiệu năng và chẩn đoán lỗi hệ thống.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* PHẦN 3: XỬ LÝ DỮ LIỆU */}
              <section id="data-processing" className="scroll-mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Server className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">3. Quy trình xử lý dữ liệu</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-justify mb-6">
                  Hạ tầng kỹ thuật của PronaFlow được triển khai trên nền tảng điện toán đám mây hiện đại, tuân thủ các tiêu chuẩn quốc tế về an toàn dữ liệu.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-2">Tiêu chuẩn mã hóa</h4>
                    <p className="text-sm text-slate-600 italic">Mã hóa AES-256 cho dữ liệu tĩnh và TLS 1.3 cho dữ liệu trong quá trình truyền tải.</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-2">Sao lưu định kỳ</h4>
                    <p className="text-sm text-slate-600 italic">Cơ chế sao lưu phân tán đảm bảo khả năng phục hồi dữ liệu trong mọi tình huống khẩn cấp.</p>
                  </div>
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* PHẦN 4: SLA */}
              <section id="sla" className="scroll-mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">4. Cam kết mức độ dịch vụ (SLA)</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-justify mb-8">
                  Đối với các tài khoản cấp độ doanh nghiệp (Enterprise), PronaFlow xác lập cam kết về thời gian hoạt động ổn định hàng tháng (Uptime).
                </p>
                <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col">
                      <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-1">Mục tiêu cam kết</span>
                      <span className="text-5xl font-black">99.9%</span>
                    </div>
                    <div className="hidden md:block">
                      <CheckCircle2 className="w-16 h-16 text-emerald-500 opacity-50" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                      <div className="text-xl font-bold text-emerald-400 mb-1">10% Refund</div>
                      <div className="text-xs text-slate-300">Hoàn phí nếu Uptime đạt mức 99.0% - 99.9%</div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                      <div className="text-xl font-bold text-emerald-400 mb-1">25% Refund</div>
                      <div className="text-xs text-slate-300">Hoàn phí nếu Uptime thấp hơn mức 99.0%</div>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* PHẦN 5: COOKIES */}
              <section id="cookies" className="scroll-mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Cookie className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">5. Cơ chế lưu trữ Cookie</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-justify mb-4">
                  Hệ thống sử dụng các tệp tin lưu trữ tạm thời nhằm tối ưu hóa trạng thái đăng nhập và các tùy chỉnh giao diện của người dùng.
                </p>
                <ul className="space-y-4 list-none p-0">
                  <li className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Cookie thiết yếu:</span>
                      <p className="text-sm text-slate-500">Duy trì các tính năng bảo mật lõi và phiên làm việc hiện tại.</p>
                    </div>
                  </li>
                  <li className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Cookie phân tích:</span>
                      <p className="text-sm text-slate-500">Thu thập dữ liệu hiệu suất tải trang nhằm cải thiện hạ tầng kỹ thuật.</p>
                    </div>
                  </li>
                </ul>
              </section>

              {/* LIÊN HỆ PHÁP LÝ */}
              <div className="mt-16 p-8 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Liên hệ bộ phận Pháp chế</h3>
                  <p className="text-slate-600 text-sm max-w-sm">Mọi thắc mắc hoặc yêu cầu làm rõ về các văn bản quy định, vui lòng gửi thông tin chính thức đến đội ngũ hỗ trợ.</p>
                </div>
                <a href="mailto:legal@pronaflow.com" className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                  <Mail className="w-5 h-5" />
                  Gửi yêu cầu
                </a>
              </div>

            </div>
          </main>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} PronaFlow Intelligence Operating. Bảo lưu mọi quyền về nội dung và cấu trúc pháp lý.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;