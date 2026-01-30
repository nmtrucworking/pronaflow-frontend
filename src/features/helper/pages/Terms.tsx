import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, FileText, Calendar, ShieldCheck, Download, 
  Shield, User, Copyright, Scale, CreditCard, XCircle, 
  Edit, AlertTriangle, Mail 
} from 'lucide-react';

/**
 * TermsPage Component
 * Trình bày các điều khoản và điều kiện sử dụng hệ thống PronaFlow.
 * Triển khai kiến trúc React Functional Component với logic điều hướng động.
 */
const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('user-account');

  // Logic theo dõi vị trí cuộn để cập nhật trạng thái Sidebar
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
    { id: 'user-account', label: '1. Tài khoản người dùng', icon: <User className="w-4 h-4" /> },
    { id: 'ip-rights', label: '2. Quyền sở hữu trí tuệ', icon: <Copyright className="w-4 h-4" /> },
    { id: 'fair-use', label: '3. Quy định sử dụng hợp lý', icon: <Scale className="w-4 h-4" /> },
    { id: 'payment', label: '4. Điều khoản thanh toán', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'termination', label: '5. Chấm dứt dịch vụ', icon: <XCircle className="w-4 h-4" /> },
    { id: 'changes', label: '6. Thay đổi điều khoản', icon: <Edit className="w-4 h-4" /> },
    { id: 'disclaimer', label: '7. Miễn trừ trách nhiệm', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'contact', label: '8. Thông tin liên hệ', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* PHẦN ĐẦU TRANG (HERO SECTION) */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <span className="hover:text-emerald-600 cursor-pointer">Hỗ trợ</span>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-emerald-600 cursor-pointer">Pháp lý</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">Điều khoản dịch vụ</span>
          </nav>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Điều khoản dịch vụ</h1>
          </div>
          
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            Tài liệu này quy định các điều kiện pháp lý ràng buộc giữa người dùng và hệ thống PronaFlow. 
            Việc truy cập và sử dụng dịch vụ đồng nghĩa với việc quý khách xác nhận đã đọc, hiểu và chấp thuận hoàn toàn các nội dung dưới đây.
          </p>
          
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" /> 
              Ngày hiệu lực: 01/01/2025
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 
              Phiên bản: 2.1 (Ổn định)
            </span>
          </div>
        </div>
      </div>

      {/* BỐ CỤC NỘI DUNG CHÍNH */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* THANH ĐIỀU HƯỚNG BÊN TRÁI (STICKY SIDEBAR) */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-12">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Danh mục nội dung</h5>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-all border-l-2 rounded-r-lg flex items-center gap-3 ${
                      activeSection === item.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
                <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                  <Download className="w-4 h-4" />
                  Tải bản PDF lưu trữ
                </button>
                <div className="pt-2">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tài liệu liên quan</h5>
                  <button className="flex items-center gap-2 text-sm text-emerald-600 font-medium hover:underline">
                    <Shield className="w-4 h-4" />
                    Chính sách bảo mật dữ liệu
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* PHẦN NỘI DUNG VĂN BẢN CHI TIẾT */}
          <main className="flex-grow max-w-4xl">
            <div className="space-y-16">

              {/* PHẦN 1: TÀI KHOẢN NGƯỜI DÙNG */}
              <section id="user-account" className="scroll-mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <User className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">1. Tài khoản người dùng</h2>
                </div>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
                  <p>Người dùng có trách nhiệm cung cấp thông tin chính xác, minh bạch trong quá trình đăng ký tài khoản hệ thống.</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Bảo mật thông tin đăng nhập là trách nhiệm duy nhất của chủ tài khoản.</li>
                    <li>Nghiêm cấm hành vi chia sẻ tài khoản cho bên thứ ba mà không có sự đồng ý bằng văn bản của PronaFlow.</li>
                    <li>Mọi hoạt động thực hiện dưới định danh tài khoản cá nhân sẽ được quy kết trách nhiệm cho chủ sở hữu tài khoản đó.</li>
                  </ul>
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* PHẦN 2: QUYỀN SỞ HỮU TRÍ TUỆ */}
              <section id="ip-rights" className="scroll-mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Copyright className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">2. Quyền sở hữu trí tuệ</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-justify">
                  Toàn bộ mã nguồn, giao diện, thuật toán và cơ sở dữ liệu thuộc quyền sở hữu độc quyền của PronaFlow. 
                  Người dùng không được phép sao chép, trích xuất dữ liệu (scraping) hoặc thực hiện các hành vi kỹ thuật đảo ngược (reverse engineering) đối với hệ thống dưới mọi hình thức thương mại hoặc phi thương mại.
                </p>
              </section>

              <hr className="border-slate-100" />

              {/* PHẦN 3: SỬ DỤNG HỢP LÝ */}
              <section id="fair-use" className="scroll-mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Scale className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">3. Quy định sử dụng hợp lý</h2>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Dịch vụ được cung cấp nhằm phục vụ các mục đích nghiệp vụ hợp pháp. Hành vi sử dụng tài nguyên hệ thống quá mức bình thường hoặc tấn công từ chối dịch vụ (DoS) sẽ bị ngăn chặn tự động.
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h4 className="text-amber-800 font-bold text-sm uppercase">Cảnh báo pháp lý</h4>
                  </div>
                  <p className="text-amber-700 text-sm">
                    Vi phạm các điều khoản này có thể dẫn đến việc đình chỉ tài khoản vĩnh viễn và tiến hành các thủ tục pháp lý cần thiết để bảo vệ quyền lợi hợp pháp của nhà cung cấp dịch vụ.
                  </p>
                </div>
              </section>

              <hr className="border-slate-100" />

              {/* PHẦN 4: THANH TOÁN */}
              <section id="payment" className="scroll-mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">4. Điều khoản thanh toán</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Các gói dịch vụ trả phí được thực hiện theo chu kỳ thanh toán đã đăng ký. 
                  Hệ thống không thực hiện hoàn trả chi phí đối với các dịch vụ đã được kích hoạt và sử dụng trong chu kỳ hiện tại. 
                  Thông báo điều chỉnh mức phí sẽ được gửi trước ít nhất 30 ngày qua email chính thức.
                </p>
              </section>

              <hr className="border-slate-100" />

              {/* PHẦN 5: CHẤM DỨT DỊCH VỤ */}
              <section id="termination" className="scroll-mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">5. Chấm dứt dịch vụ</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Người dùng có quyền hủy bỏ sử dụng dịch vụ vào bất kỳ thời điểm nào thông qua bảng điều khiển quản trị. 
                  PronaFlow bảo lưu quyền chấm dứt cung cấp dịch vụ nếu người dùng vi phạm nghiêm trọng các quy định về an ninh mạng hoặc pháp luật hiện hành.
                </p>
              </section>

              <hr className="border-slate-100" />

              {/* PHẦN 6: THAY ĐỔI ĐIỀU KHOẢN */}
              <section id="changes" className="scroll-mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Edit className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">6. Thay đổi điều khoản</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-justify">
                  Hệ thống định kỳ cập nhật các điều khoản để phù hợp với quy định pháp luật và sự thay đổi về mặt kỹ thuật. 
                  Phiên bản mới nhất luôn có hiệu lực kể từ thời điểm công bố trên trang này. Việc tiếp tục sử dụng hệ thống sau thời điểm cập nhật được hiểu là sự chấp thuận đối với phiên bản điều khoản mới nhất.
                </p>
              </section>

              <hr className="border-slate-100" />

              {/* PHẦN 7: MIỄN TRỪ TRÁCH NHIỆM */}
              <section id="disclaimer" className="scroll-mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">7. Miễn trừ trách nhiệm</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Dịch vụ được cung cấp dựa trên thực trạng kỹ thuật hiện có. Chúng tôi cam kết duy trì độ ổn định tối đa 
                  nhưng không chịu trách nhiệm đối với các tổn thất gián tiếp phát sinh từ việc tạm ngưng dịch vụ do sự cố hạ tầng internet quốc tế hoặc các trường hợp bất khả kháng theo quy định của pháp luật.
                </p>
              </section>

              <hr className="border-slate-100" />

              {/* PHẦN 8: THÔNG TIN LIÊN HỆ */}
              <section id="contact" className="scroll-mt-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">8. Thông tin liên hệ</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Mọi phản hồi hoặc yêu cầu làm rõ về các điều khoản dịch vụ, vui lòng liên hệ trực tiếp với bộ phận Pháp chế của chúng tôi để được giải quyết chính thức.
                </p>
              </section>

              {/* CTA LIÊN HỆ CUỐI TRANG */}
              <div className="mt-12 p-8 bg-slate-50 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3">Quý khách vẫn còn vướng mắc kỹ thuật hoặc pháp lý?</h3>
                <p className="text-slate-600 text-sm mb-6 max-w-2xl leading-relaxed">
                  Đội ngũ chuyên viên của chúng tôi luôn sẵn sàng hỗ trợ phân tích các yêu cầu đặc thù để đảm bảo quá trình sử dụng hệ thống diễn ra thuận lợi nhất.
                </p>
                <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/10">
                  <Mail className="w-4 h-4" />
                  Liên hệ bộ phận Hỗ trợ
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* FOOTER ĐƠN GIẢN */}
      <footer className="border-t border-slate-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} PronaFlow. Bảo lưu mọi quyền về sở hữu trí tuệ và nội dung.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;