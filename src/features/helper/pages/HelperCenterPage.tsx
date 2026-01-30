import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, GitBranch, Activity, Code, MessageCircle, 
  Rocket, Trello, UserCog, Plug, Shield, Smartphone,
  FileText, ArrowRight, ChevronDown, Headphones, Zap,
  SearchCheck
} from 'lucide-react';

/**
 * Interface định nghĩa cấu trúc dữ liệu cho danh mục hướng dẫn
 */
interface Article {
  id: number;
  title: string;
  slug: string;
}

interface Category {
  id: string;
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
  articles: Article[];
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Dữ liệu danh mục hướng dẫn chuẩn hóa
  const categories: Category[] = [
    {
      id: 'getting-started',
      icon: <Rocket className="w-6 h-6" />,
      color: 'blue',
      title: 'Khởi tạo & Nhập môn',
      desc: 'Hướng dẫn thiết lập không gian làm việc (Workspace) và làm quen với giao diện nghiệp vụ.',
      articles: [
        { id: 1, title: 'Tổng quan hệ sinh thái PronaFlow', slug: 'overview' },
        { id: 2, title: 'Cấu hình Workspace cho doanh nghiệp', slug: 'create-workspace' },
        { id: 3, title: 'Quản trị nhân sự và phân quyền dự án', slug: 'invite-members' }
      ]
    },
    {
      id: 'project-management',
      icon: <Trello className="w-6 h-6" />,
      color: 'purple',
      title: 'Quản trị Dự án & Kanban',
      desc: 'Quy trình khởi tạo Task, điều phối luồng công việc và tối ưu hóa bảng Kanban.',
      articles: [
        { id: 4, title: 'Khai thác tối đa Kanban Board', slug: 'kanban-guide' },
        { id: 5, title: 'Phân loại mức độ ưu tiên hệ thống', slug: 'priority-guide' },
        { id: 6, title: 'Cấu trúc hóa danh sách tác vụ', slug: 'task-lists' }
      ]
    },
    {
      id: 'account',
      icon: <UserCog className="w-6 h-6" />,
      color: 'orange',
      title: 'Tài khoản & Phí dịch vụ',
      desc: 'Quản lý thông tin định danh, bảo mật tài khoản và các gói tài nguyên.',
      articles: [
        { id: 7, title: 'Quy trình khôi phục định danh', slug: 'forgot-password' },
        { id: 8, title: 'Thiết lập bảo mật hai lớp (2FA)', slug: '2fa-setup' },
        { id: 9, title: 'Nâng cấp hạn mức tài nguyên', slug: 'upgrade-plan' }
      ]
    },
    {
      id: 'integrations',
      icon: <Plug className="w-6 h-6" />,
      color: 'emerald',
      title: 'Tích hợp & Kết nối',
      desc: 'Liên kết PronaFlow với các hạ tầng kỹ thuật và ứng dụng bên thứ ba.',
      articles: [
        { id: 10, title: 'Đồng bộ hóa dữ liệu Slack', slug: 'slack-integration' },
        { id: 11, title: 'Tự động hóa qua Webhook', slug: 'webhooks' },
        { id: 12, title: 'Tài liệu kỹ thuật REST API', slug: 'api-docs' }
      ]
    },
    {
      id: 'security',
      icon: <Shield className="w-6 h-6" />,
      color: 'rose',
      title: 'An ninh & Bảo mật Dữ liệu',
      desc: 'Các tiêu chuẩn bảo vệ thông tin và cơ chế kiểm soát truy cập.',
      articles: [
        { id: 13, title: 'Tiêu chuẩn an toàn dữ liệu Cloud', slug: 'data-security' },
        { id: 14, title: 'Cơ chế phân quyền vai trò (RBAC)', slug: 'roles-permissions' }
      ]
    },
    {
      id: 'mobile',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'indigo',
      title: 'Ứng dụng Di động',
      desc: 'Sử dụng các tính năng nghiệp vụ trên thiết bị di động iOS/Android.',
      articles: [
        { id: 15, title: 'Cài đặt và cấu hình ứng dụng', slug: 'mobile-install' },
        { id: 16, title: 'Đồng bộ hóa ngoại tuyến (Offline)', slug: 'offline-sync' }
      ]
    }
  ];

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "Làm thế nào để khởi tạo một Workspace mới?",
      answer: "Truy cập bảng điều khiển chính, chọn biểu tượng '+' tại thanh điều hướng bên trái. Hệ thống sẽ yêu cầu xác định tên và mục tiêu của Workspace để tối ưu hóa hạ tầng lưu trữ."
    },
    {
      id: 2,
      question: "Hệ thống có hỗ trợ tích hợp API từ bên thứ ba không?",
      answer: "Có, PronaFlow cung cấp hệ thống REST API và Webhook chuẩn hóa cho phép tích hợp với Slack, GitHub, Jira và các hạ tầng doanh nghiệp khác."
    },
    {
      id: 3,
      question: "Làm thế nào để mời thành viên vào dự án hiện hành?",
      answer: "Vào mục Cài đặt Dự án (Project Settings), chọn phân mục 'Nhân sự', nhập địa chỉ email và xác định vai trò (Admin/Member/Viewer) cho thành viên đó."
    },
    {
      id: 4,
      question: "Dữ liệu nghiệp vụ được bảo mật như thế nào?",
      answer: "Chúng tôi áp dụng chuẩn mã hóa AES-256 cho dữ liệu tĩnh và TLS 1.3 cho quá trình truyền tải thông tin, đảm bảo tính toàn vẹn và bảo mật tuyệt đối."
    }
  ];

  // Logic tìm kiếm thời gian thực
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return categories.flatMap(cat => 
      cat.articles
        .filter(art => art.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(art => ({ ...art, category: cat.title }))
    );
  }, [searchQuery]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100">
      
      {/* PHẦN ĐẦU TRANG & TÌM KIẾM (HERO SECTION) */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 py-16 md:py-24 relative overflow-hidden">
        {/* Đồ họa trang trí nền */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-200 blur-3xl"></div>
          <div className="absolute top-32 -left-24 w-72 h-72 rounded-full bg-blue-200 blur-3xl"></div>
        </div>

        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white shadow-sm mb-6 text-xs font-bold text-slate-600 uppercase tracking-widest">
            <Zap className="w-3 h-3 text-emerald-500" />
            Cập nhật phiên bản v2.4 hiện hành
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">
            Trung tâm Hỗ trợ Kỹ thuật & Nghiệp vụ
          </h1>

          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                if (value) {
                  setSearchParams({ q: value });
                } else {
                  setSearchParams({});
                }
              }}
              className="block w-full pl-12 pr-4 py-4.5 border-2 border-slate-200 rounded-2xl bg-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm sm:text-base font-medium"
              placeholder="Tìm kiếm tài liệu, giải pháp hoặc báo cáo sự cố..."
            />

            {/* Dropdown kết quả tìm kiếm */}
            {searchQuery && (
              <div className="absolute w-full mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 text-left max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                {searchResults.length > 0 ? (
                  searchResults.map(result => (
                    <Link
                      key={result.id}
                      to={`/help?q=${encodeURIComponent(result.title)}`}
                      className="block px-5 py-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{result.title}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Phân mục: {result.category}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-5 py-8 text-center">
                    <SearchCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 italic">Không tìm thấy tài liệu phù hợp với từ khóa "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="mt-5 text-slate-400 text-xs font-bold uppercase tracking-widest">
            Gợi ý tra cứu: 
            <button onClick={() => setSearchQuery('Kanban')} className="ml-2 text-emerald-600 hover:underline">Kanban</button>, 
            <button onClick={() => setSearchQuery('API')} className="ml-2 text-emerald-600 hover:underline">API Docs</button>, 
            <button onClick={() => setSearchQuery('Bảo mật')} className="ml-2 text-emerald-600 hover:underline">Bảo mật</button>
          </p>
        </div>
      </div>

      {/* LIÊN KẾT NHANH (QUICK LINKS) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Changelog', desc: 'Nhật ký cập nhật', icon: <GitBranch className="text-purple-600" />, bg: 'bg-purple-50', to: '/help/changelog' },
            { label: 'Hệ thống', desc: 'Trạng thái vận hành', icon: <Activity className="text-emerald-600" />, bg: 'bg-emerald-50', to: '/help/status' },
            { label: 'Tài liệu API', desc: 'Cổng lập trình viên', icon: <Code className="text-blue-600" />, bg: 'bg-blue-50', to: '/help/api' },
            { label: 'Liên hệ', desc: 'Yêu cầu hỗ trợ', icon: <MessageCircle className="text-orange-600" />, bg: 'bg-orange-50', to: '/help/contact' }
          ].map((link, idx) => (
            <Link key={idx} to={link.to} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all group text-left">
              <div className={`w-12 h-12 ${link.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {link.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">{link.label}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* DANH MỤC HƯỚNG DẪN (KNOWLEDGE BASE) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-black text-slate-900 mb-12 tracking-tight uppercase">Cơ sở Kiến thức & Hướng dẫn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-emerald-500 hover:shadow-2xl transition-all duration-300 group">
              <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors`}>
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{cat.title}</h3>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed italic">{cat.desc}</p>
              <ul className="space-y-4">
                {cat.articles.map((art) => (
                  <li key={art.id}>
                    <Link
                      to={`/help?q=${encodeURIComponent(art.title)}`}
                      className="text-sm text-slate-600 hover:text-emerald-600 flex items-start gap-2 group/link text-left"
                    >
                      <FileText className="w-4 h-4 mt-0.5 text-slate-300 group-hover/link:text-emerald-500 transition-colors" />
                      <span className="group-hover/link:underline font-medium">{art.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-100">
                <Link to="/help/terms" className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                  Toàn bộ tài liệu <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CÂU HỎI THƯỜNG GẶP (FAQ SECTION) */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Câu hỏi thường gặp</h2>
            <p className="text-slate-500 font-medium">Phân tích và giải đáp các thắc mắc nghiệp vụ phổ biến.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-emerald-200 transition-colors">
                <button 
                  className="w-full flex items-center justify-between p-6 text-left" 
                  onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                >
                  <span className="font-bold text-slate-900 leading-tight">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaqId === faq.id ? 'rotate-180' : ''}`} />
                </button>
                {openFaqId === faq.id && (
                  <div className="px-6 pb-6 animate-in slide-in-from-top-2">
                    <p className="text-slate-600 text-sm leading-relaxed text-justify italic">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HỖ TRỢ TRỰC TIẾP (CONTACT CTA) */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-slate-900 rounded-[2.5rem] p-12 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-blue-600/10"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-900/40">
                <Headphones className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4 tracking-tight uppercase">Yêu cầu hỗ trợ chuyên sâu?</h2>
              <p className="text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">Đội ngũ kỹ thuật viên của chúng tôi luôn sẵn sàng tiếp nhận và giải quyết các yêu cầu đặc thù của quý khách.</p>
              <Link to="/help/contact" className="inline-flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                Gửi yêu cầu hỗ trợ
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default App;