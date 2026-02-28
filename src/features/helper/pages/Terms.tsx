import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, FileText, Calendar, ShieldCheck, Download, 
  Shield, User, Copyright, Scale, CreditCard, XCircle, 
  Edit, AlertTriangle, Mail 
} from 'lucide-react';
import { ROUTES } from '@/routes/paths';

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

  const termsPdfPath = '/downloads/terms/PronaFlow-Terms-of-Service-v2.2.pdf';

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* PHẦN ĐẦU TRANG (HERO SECTION) */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link to={ROUTES.help.root} className="hover:text-emerald-600 transition-colors">Hỗ trợ</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={ROUTES.help.legal} className="hover:text-emerald-600 transition-colors">Pháp lý</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to={ROUTES.help.terms} aria-current="page" className="text-slate-900 font-medium hover:text-emerald-600 transition-colors">Điều khoản dịch vụ</Link>
          </nav>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Điều khoản dịch vụ</h1>
          </div>
          
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            Điều khoản dịch vụ này điều chỉnh toàn bộ quan hệ giữa người dùng và PronaFlow khi truy cập, đăng ký hoặc sử dụng nền tảng.
            Bằng việc tiếp tục sử dụng dịch vụ, bạn xác nhận đã đọc, hiểu và đồng ý bị ràng buộc bởi các điều khoản dưới đây.
          </p>
          
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" /> 
              Ngày hiệu lực: 01/01/2025
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 
              Phiên bản: 2.2
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
                <a
                  href={termsPdfPath}
                  download
                  className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Tải bản PDF lưu trữ
                </a>
                <a
                  href={termsPdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Xem bản PDF
                </a>
                <div className="pt-2">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tài liệu liên quan</h5>
                  <Link
                    to={ROUTES.help.privacy}
                    className="flex items-center gap-2 text-sm text-emerald-600 font-medium hover:underline"
                  >
                    <Shield className="w-4 h-4" />
                    Chính sách bảo mật dữ liệu
                  </Link>
                  <Link
                    to={ROUTES.help.legal}
                    className="mt-2 flex items-center gap-2 text-sm text-emerald-600 font-medium hover:underline"
                  >
                    <FileText className="w-4 h-4" />
                    Trung tâm pháp lý
                  </Link>
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
                  <p>
                    Bạn phải đủ năng lực pháp lý theo quy định hiện hành để tạo tài khoản và sử dụng dịch vụ. Thông tin đăng ký
                    cần chính xác, cập nhật và thuộc quyền sử dụng hợp pháp của bạn hoặc tổ chức mà bạn đại diện.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hành vi phát sinh từ tài khoản của mình.</li>
                    <li>Không được chia sẻ tài khoản trái phép, mạo danh người khác hoặc tạo nhiều tài khoản nhằm lách giới hạn hệ thống.</li>
                    <li>PronaFlow có thể yêu cầu xác minh danh tính hoặc quyền đại diện tổ chức khi cần thiết để đảm bảo an toàn dịch vụ.</li>
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
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    Toàn bộ mã nguồn, giao diện, nhãn hiệu, logo, tài liệu kỹ thuật và nội dung hiển thị trên hệ thống thuộc quyền sở hữu
                    hoặc quyền khai thác hợp pháp của PronaFlow và các bên cấp phép liên quan.
                  </p>
                  <p>
                    PronaFlow cấp cho bạn quyền sử dụng dịch vụ có giới hạn, không độc quyền, không chuyển nhượng và có thể thu hồi theo
                    đúng phạm vi gói dịch vụ đã đăng ký. Bạn không được sao chép, chỉnh sửa, phân phối lại, bán lại, đảo ngược kỹ thuật
                    hoặc khai thác trái phép bất kỳ thành phần nào của hệ thống.
                  </p>
                </div>
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
                  Bạn cam kết sử dụng dịch vụ cho mục đích hợp pháp, không gây gián đoạn hạ tầng kỹ thuật và không vi phạm quyền, lợi ích
                  hợp pháp của bên thứ ba.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-6">
                  <li>Nghiêm cấm phát tán mã độc, tấn công từ chối dịch vụ, khai thác lỗ hổng hoặc thu thập dữ liệu trái phép.</li>
                  <li>Nghiêm cấm đăng tải nội dung vi phạm pháp luật, xâm phạm quyền sở hữu trí tuệ hoặc thông tin cá nhân của người khác.</li>
                  <li>Không được sử dụng hệ thống để gửi thư rác, lừa đảo hoặc các hoạt động gian lận tài chính, thương mại.</li>
                </ul>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h4 className="text-amber-800 font-bold text-sm uppercase">Cảnh báo pháp lý</h4>
                  </div>
                  <p className="text-amber-700 text-sm">
                    Vi phạm các điều khoản sử dụng có thể dẫn đến hạn chế chức năng, tạm khóa hoặc chấm dứt tài khoản và/hoặc áp dụng biện
                    pháp pháp lý phù hợp theo quy định hiện hành.
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
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    Các gói trả phí được tính theo chu kỳ đã đăng ký (tháng/năm) và tự động gia hạn nếu bạn không hủy trước thời điểm gia
                    hạn theo hướng dẫn tại trang thanh toán.
                  </p>
                  <p>
                    Trừ trường hợp pháp luật bắt buộc khác đi hoặc có cam kết riêng bằng văn bản, phí dịch vụ đã thanh toán không được hoàn
                    lại cho phần thời gian đã kích hoạt. Mức phí, tính năng và hạn mức có thể được điều chỉnh; mọi thay đổi sẽ được thông báo
                    trước trong thời hạn hợp lý.
                  </p>
                </div>
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
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    Bạn có thể chấm dứt sử dụng dịch vụ bất kỳ lúc nào bằng cách hủy gói hoặc yêu cầu đóng tài khoản. Sau khi chấm dứt,
                    quyền truy cập vào một số dữ liệu có thể bị giới hạn theo chính sách lưu trữ và bảo mật hiện hành.
                  </p>
                  <p>
                    PronaFlow có quyền tạm ngưng hoặc chấm dứt cung cấp dịch vụ nếu phát hiện vi phạm nghiêm trọng điều khoản, rủi ro an
                    ninh hoặc yêu cầu từ cơ quan có thẩm quyền. Trong phạm vi khả thi, chúng tôi sẽ thông báo lý do và hướng dẫn xử lý.
                  </p>
                </div>
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
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    Điều khoản có thể được cập nhật để phản ánh thay đổi về sản phẩm, mô hình vận hành hoặc yêu cầu pháp lý. Phiên bản mới
                    sẽ được công bố tại trang này kèm ngày hiệu lực tương ứng.
                  </p>
                  <p>
                    Nếu thay đổi có ảnh hưởng đáng kể đến quyền và nghĩa vụ của người dùng, PronaFlow sẽ nỗ lực thông báo trước qua email
                    hoặc thông báo trong hệ thống. Việc bạn tiếp tục sử dụng dịch vụ sau thời điểm điều khoản có hiệu lực được xem là chấp
                    thuận điều khoản cập nhật.
                  </p>
                </div>
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
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    Dịch vụ được cung cấp trên cơ sở nỗ lực hợp lý để đảm bảo tính sẵn sàng, an toàn và liên tục. Tuy nhiên, không có cam kết
                    tuyệt đối rằng dịch vụ sẽ luôn không gián đoạn hoặc không có lỗi trong mọi thời điểm.
                  </p>
                  <p>
                    Trong phạm vi tối đa pháp luật cho phép, PronaFlow không chịu trách nhiệm đối với thiệt hại gián tiếp, ngẫu nhiên, đặc biệt
                    hoặc hệ quả phát sinh từ việc sử dụng/không thể sử dụng dịch vụ, bao gồm sự cố hạ tầng bên thứ ba, tấn công mạng diện rộng
                    hoặc sự kiện bất khả kháng.
                  </p>
                </div>
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
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    Mọi yêu cầu làm rõ liên quan đến điều khoản dịch vụ, quyền và nghĩa vụ của người dùng vui lòng liên hệ bộ phận pháp chế
                    và hỗ trợ chính thức của PronaFlow.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Email pháp chế: legal@pronaflow.com</li>
                    <li>Email hỗ trợ: support@pronaflow.com</li>
                    <li>Thời gian phản hồi mục tiêu: 01-03 ngày làm việc</li>
                  </ul>
                  <p>
                    Điều khoản này được điều chỉnh và giải thích theo pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được ưu tiên giải quyết
                    thông qua thương lượng thiện chí trước khi đưa ra cơ quan có thẩm quyền.
                  </p>
                </div>
              </section>

              {/* CTA LIÊN HỆ CUỐI TRANG */}
              <div className="mt-12 p-8 bg-slate-50 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3">Quý khách vẫn còn vướng mắc kỹ thuật hoặc pháp lý?</h3>
                <p className="text-slate-600 text-sm mb-6 max-w-2xl leading-relaxed">
                  Đội ngũ chuyên viên của chúng tôi luôn sẵn sàng hỗ trợ phân tích các yêu cầu đặc thù để đảm bảo quá trình sử dụng hệ thống diễn ra thuận lợi nhất.
                </p>
                <a
                  href="mailto:support@pronaflow.com"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-500/10"
                >
                  <Mail className="w-4 h-4" />
                  Liên hệ bộ phận Hỗ trợ
                </a>
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