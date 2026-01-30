import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Shield, Heart, Database, UserCheck, 
  Lock, Users, Cookie, RefreshCw, Mail, 
  Download, FileText, Eye, Trash2, Edit3, ShieldCheck, Calendar
} from 'lucide-react';

/**
 * PrivacyPage Component
 * Trình bày Chính sách bảo mật dữ liệu của hệ thống PronaFlow.
 * Triển khai logic điều hướng động (Active TOC) và cấu trúc nội dung phân tầng.
 */
const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('core-principle');

  // Logic Intersection Observer để xác định phân mục hiện tại khi cuộn trang
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
    { id: 'core-principle', label: '1. Nguyên tắc cốt lõi' },
    { id: 'data-collected', label: '2. Dữ liệu thu thập' },
    { id: 'user-rights', label: '3. Quyền của người dùng' },
    { id: 'data-security', label: '4. An ninh dữ liệu' },
    { id: 'third-party', label: '5. Đơn vị thứ ba' },
    { id: 'cookies', label: '6. Chính sách Cookie' },
    { id: 'updates', label: '7. Cập nhật chính sách' },
    { id: 'contact', label: '8. Thông tin liên hệ' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* PHẦN ĐẦU TRANG (HERO SECTION) */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Hỗ trợ</span>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Pháp lý</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-semibold">Chính sách bảo mật</span>
          </nav>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600 shadow-sm">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Chính sách bảo mật dữ liệu</h1>
          </div>
          
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed text-justify">
            Tài liệu này xác lập các tiêu chuẩn và quy trình vận hành liên quan đến việc thu thập, lưu trữ và xử lý thông tin cá nhân. 
            PronaFlow cam kết tuân thủ nghiêm ngặt các quy định pháp luật hiện hành về an toàn thông tin nhằm bảo vệ tối đa quyền lợi của người dùng.
          </p>
          
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2 font-medium">
              <Calendar className="w-4 h-4 text-blue-500" /> 
              Hiệu lực: 01/01/2025
            </span>
            <span className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-blue-500" /> 
              Phiên bản: 2.1 (Pháp lý chính thức)
            </span>
          </div>
        </div>
      </div>

      {/* BỐ CỤC NỘI DUNG CHI TIẾT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">

            {/* THANH ĐIỀU HƯỚNG CỐ ĐỊNH (SIDEBAR) */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-12">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Danh mục phân tích</h5>
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-all border-l-2 rounded-r-lg ${
                                    activeSection === item.id
                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                        : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
                        <button className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                            <Download className="w-4 h-4" />
                            Xuất tệp PDF lưu trữ
                        </button>
                        <div className="pt-2">
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tài liệu bổ trợ</h5>
                            <button className="flex items-center gap-2 text-sm text-blue-600 font-bold hover:underline">
                                <FileText className="w-4 h-4" />
                                Điều khoản dịch vụ
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* PHẦN NỘI DUNG CHÍNH (MAIN CONTENT) */}
            <main className="flex-grow max-w-4xl">
                <div className="space-y-16">

                    {/* PHẦN 1: NGUYÊN TẮC CỐT LÕI */}
                    <section id="core-principle" className="scroll-mt-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">1. Nguyên tắc cốt lõi</h2>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                            <h4 className="text-blue-900 font-bold text-sm uppercase tracking-wider mb-2">Cam kết bảo mật toàn diện</h4>
                            <p className="text-blue-800 text-sm leading-relaxed text-justify">
                                Chúng tôi vận hành dựa trên nguyên tắc tối thiểu hóa dữ liệu (Data Minimization). Hệ thống chỉ thực hiện thu thập các trường thông tin thực sự cần thiết cho việc duy trì tính năng và tối ưu hóa trải nghiệm người dùng, tuyệt đối không khai thác dữ liệu cho các mục đích ngoài phạm vi thỏa thuận.
                            </p>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* PHẦN 2: DỮ LIỆU THU THẬP */}
                    <section id="data-collected" className="scroll-mt-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <Database className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">2. Phân loại dữ liệu thu thập</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Dữ liệu người dùng được phân tách thành các nhóm cấu trúc nhằm phục vụ các mục đích nghiệp vụ cụ thể:
                        </p>
                        <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Loại dữ liệu</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Mục đích xử lý</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    <tr>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">Định danh cá nhân</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 italic">Xác thực tài khoản và quản lý quyền truy cập.</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">Dữ liệu công việc</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 italic">Duy trì tiến độ dự án và phân bổ tài nguyên hệ thống.</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">Dữ liệu đo lường (Telemetry)</td>
                                        <td className="px-6 py-4 text-sm text-slate-600 italic">Phân tích hiệu năng kỹ thuật và ngăn ngừa sự cố.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* PHẦN 3: QUYỀN CỦA NGƯỜI DÙNG */}
                    <section id="user-rights" className="scroll-mt-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <UserCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">3. Quyền hạn của chủ thể dữ liệu</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                                    <Eye className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Quyền truy cập</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">Yêu cầu trích xuất thông tin cá nhân hiện đang được hệ thống lưu trữ.</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center mb-4">
                                    <Trash2 className="w-5 h-5 text-rose-600" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Quyền xóa bỏ</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">Yêu cầu tiêu hủy dữ liệu cá nhân khi không còn nhu cầu sử dụng dịch vụ.</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                                    <Edit3 className="w-5 h-5 text-blue-600" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">Quyền hiệu chỉnh</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">Cập nhật hoặc đính chính các thông tin sai lệch trên tài khoản cá nhân.</p>
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* PHẦN 4: AN NINH DỮ LIỆU */}
                    <section id="data-security" className="scroll-mt-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">4. Các biện pháp an ninh kỹ thuật</h2>
                        </div>
                        <div className="space-y-6 text-slate-600 leading-relaxed">
                            <div className="flex gap-4 items-start">
                                <div className="w-1 h-16 bg-blue-500 rounded-full flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest mb-1">Mã hóa dữ liệu</h4>
                                    <p className="text-sm">Áp dụng chuẩn mã hóa AES-256 đối với dữ liệu lưu kho (At Rest) và giao thức TLS 1.3 đối với dữ liệu trong quá trình truyền tải (In Transit).</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-1 h-16 bg-blue-500 rounded-full flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest mb-1">Cơ chế sao lưu</h4>
                                    <p className="text-sm">Dữ liệu được sao lưu định kỳ theo mô hình phân tán nhằm đảm bảo khả năng phục hồi sau thảm họa (Disaster Recovery) với thời gian downtime tối thiểu.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-slate-100" />

                    {/* PHẦN 5: ĐƠN VỊ THỨ BA */}
                    <section id="third-party" className="scroll-mt-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">5. Chia sẻ dữ liệu với đơn vị thứ ba</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-justify">
                            PronaFlow tuyệt đối không thực hiện hành vi mua bán dữ liệu cá nhân. Chúng tôi chỉ chia sẻ thông tin cần thiết cho các nhà cung cấp hạ tầng (như Azure, AWS) nhằm duy trì tính khả dụng của dịch vụ. Mọi đối tác đều phải tuân thủ nghiêm ngặt Thỏa thuận xử lý dữ liệu (DPA) đã ký kết.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* PHẦN 6: CHÍNH SÁCH COOKIE */}
                    <section id="cookies" className="scroll-mt-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <Cookie className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">6. Cơ chế sử dụng Cookie</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-6">
                            Hệ thống sử dụng các tệp tin lưu trữ tạm thời (Cookie) để tối ưu hóa phiên làm việc và duy trì trạng thái đăng nhập. 
                        </p>
                        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-xl mb-6">
                            <h4 className="text-emerald-900 font-bold text-xs uppercase tracking-widest mb-2">Quyền riêng tư tuyệt đối</h4>
                            <p className="text-emerald-800 text-sm italic">
                                PronaFlow không sử dụng Tracking Cookies cho mục đích quảng cáo hoặc theo dõi hành vi người dùng ngoài phạm vi hệ thống.
                            </p>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                            <li className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm"><span className="font-bold text-slate-900">Cookie thiết yếu:</span> Duy trì tính năng bảo mật và đăng nhập.</li>
                            <li className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm"><span className="font-bold text-slate-900">Cookie phân tích:</span> Đánh giá hiệu suất tải trang và tương tác UI.</li>
                        </ul>
                    </section>

                    <hr className="border-slate-100" />

                    {/* PHẦN 7: CẬP NHẬT CHÍNH SÁCH */}
                    <section id="updates" className="scroll-mt-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <RefreshCw className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">7. Cập nhật và điều chỉnh</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-justify">
                            Chính sách bảo mật định kỳ được rà soát để phản ánh các thay đổi trong quy trình kỹ thuật hoặc khung pháp lý. Người dùng sẽ nhận được thông báo chính thức qua email đối với các thay đổi có ảnh hưởng trực tiếp đến quyền lợi dữ liệu cá nhân.
                        </p>
                    </section>

                    <hr className="border-slate-100" />

                    {/* PHẦN 8: THÔNG TIN LIÊN HỆ */}
                    <section id="contact" className="scroll-mt-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">8. Thông tin liên hệ chuyên trách</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-8">
                            Mọi yêu cầu liên quan đến quyền truy cập dữ liệu hoặc báo cáo về các lỗ hổng an ninh dữ liệu, vui lòng gửi thông tin chính thức đến bộ phận Pháp chế và An toàn thông tin của chúng tôi.
                        </p>

                        <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <h3 className="text-xl font-bold mb-2">Đội ngũ Hỗ trợ Pháp lý</h3>
                                <p className="text-slate-400 text-sm max-w-sm">Chúng tôi luôn sẵn sàng hỗ trợ quý khách giải quyết các thắc mắc về bảo mật trong vòng 24 giờ làm việc.</p>
                            </div>
                            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                                <Mail className="w-5 h-5" />
                                Liên hệ ngay
                            </button>
                        </div>
                    </section>

                </div>
            </main>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} PronaFlow Operational Integrity. Tất cả các quyền về sở hữu và bảo mật được xác lập.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;