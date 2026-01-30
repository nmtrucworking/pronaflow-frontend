import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Check, 
  Shield, 
  Globe,
  ArrowRight, 
  Layout, 
  Calendar, 
  Github, 
  Twitter, 
  Linkedin, 
  ArrowUpRight, 
  Sparkles, 
  Rocket, 
  Monitor, 
  Download, 
  Briefcase, 
  Code,
  Laptop, 
  Book, GraduationCap, 
  RefreshCw, Link as LinkIcon, Smartphone
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Import Modal Components
import ModalLogin from '@/features/auth/pages/Modal_login';
import ModalRegister from '@/features/auth/pages/Modal_register';
import { useNavigate } from 'react-router-dom';

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- COMPONENTS ---

// 1. NAV DROPDOWN ITEM
const NavItem = ({ label, children }: { label: string, children?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div 
      className="relative group py-2"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className={cn(
        "flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors rounded-lg",
        isOpen ? "text-indigo-600 bg-indigo-50/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
      )}>
        {label}
        <ChevronDown size={14} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
      </button>
      
      <div className={cn(
        "absolute top-full left-0 mt-1 w-80 bg-white border border-slate-200 shadow-xl rounded-xl p-4 transition-all duration-200 origin-top-left z-50",
        isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      )}>
        {children}
      </div>
    </div>
  );
};

// 2. NAVBAR
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleRegister = () => {
    setIsRegisterModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    navigate('/dashboard');
  };

  const handleRegisterSuccess = () => {
    setIsRegisterModalOpen(false);
    navigate('/dashboard');
  };

  const switchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <>
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isScrolled 
        ? "bg-white/90 backdrop-blur-md border-b border-slate-200/60 py-2 shadow-sm" 
        : "bg-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* btn return Home-Page (Landing Page) */}
        <div className="flex items-center gap-2 group cursor-pointer shrink-0">
          <button onClick={() => navigate('/') } className="flex items-center gap-2">
            <img
              className="h-8 w-8 transition-transform duration-300 group-hover:rotate-[360deg]" 
              src="/public/branding/logo-dark.svg" 
              alt="PronaFlow" 
            />
            <span className="font-bold text-xl tracking-tight text-slate-900">PronaFlow</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-1">
          <NavItem label="Tính năng">
            <div className="grid grid-cols-1 gap-1">
              <a href="#features" className="flex items-start gap-3 p-3 rounded-lg hover:bg-indigo-50 group transition-colors">
                <Layout size={18} className="text-slate-400 group-hover:text-indigo-600 mt-1" />
                <div>
                  <div className="text-sm font-bold text-slate-800">Quản lý trực quan</div>
                  <div className="text-xs text-slate-500 font-medium">Kanban, Gantt và Timeline view chuyên sâu</div>
                </div>
              </a>
              <a href="#features" className="flex items-start gap-3 p-3 rounded-lg hover:bg-indigo-50 group transition-colors">
                <Sparkles size={18} className="text-slate-400 group-hover:text-indigo-600 mt-1" />
                <div>
                  <div className="text-sm font-bold text-slate-800">AI Intelligence</div>
                  <div className="text-xs text-slate-500 font-medium">Dự báo rủi ro & gán task tự động bằng ML</div>
                </div>
              </a>
              <a href="#" className="flex items-start gap-3 p-3 rounded-lg hover:bg-indigo-50 group transition-colors">
                <RefreshCw size={18} className="text-slate-400 group-hover:text-indigo-600 mt-1" />
                <div>
                  <div className="text-sm font-bold text-slate-800">Automation Workflows</div>
                  <div className="text-xs text-slate-500 font-medium">Tự động hóa quy trình phê duyệt (Module 4)</div>
                </div>
              </a>
            </div>
          </NavItem>

          <NavItem label="Tài liệu">
            <div className="grid grid-cols-1 gap-1">
              <a href="#" className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 group transition-colors">
                <Book size={18} className="text-slate-400 group-hover:text-indigo-600 mt-1" />
                <div>
                  <div className="text-sm font-bold text-slate-800">Hướng dẫn sử dụng</div>
                  <div className="text-xs text-slate-500 font-medium">Cẩm nang chi tiết cho người mới bắt đầu</div>
                </div>
              </a>
              <a href="#" className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 group transition-colors">
                <GraduationCap size={18} className="text-slate-400 group-hover:text-indigo-600 mt-1" />
                <div>
                  <div className="text-sm font-bold text-slate-800">Học viện Prona</div>
                  <div className="text-xs text-slate-500 font-medium">Các khóa học master quy trình Agile</div>
                </div>
              </a>
              <a href="#" className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 group transition-colors">
                <Code size={18} className="text-slate-400 group-hover:text-indigo-600 mt-1" />
                <div>
                  <div className="text-sm font-bold text-slate-800">API Documentation</div>
                  <div className="text-xs text-slate-500 font-medium">Tích hợp PronaFlow vào hệ thống của bạn</div>
                </div>
              </a>
            </div>
          </NavItem>

          <a href="#pricing" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Bảng giá</a>
          <a href="#" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Lộ trình</a>
        </div>

        {/* ctn-btn */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={handleLogin}
            className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
            Đăng nhập
          </button>
          <button
            onClick={handleRegister}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-all shadow-md shadow-indigo-100 hover:-translate-y-0.5">
            Bắt đầu miễn phí
          </button>
        </div>

        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>

    {/* Login Modal */}
      <ModalLogin 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={switchToRegister}
      />

      {/* Register Modal */}
      <ModalRegister 
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={handleRegisterSuccess}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
};

// 3. HERO SECTION
const Hero = () => {
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setShowDownloadModal(true);
  };

  const handleTryWeb = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    navigate('/dashboard');
  };

  const handleRegisterSuccess = () => {
    setIsRegisterModalOpen(false);
    navigate('/dashboard');
  };

  const switchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleDownload = (platform: 'windows' | 'macos' | 'linux') => {
    // TODO: Replace with actual download URLs
    const downloadUrls = {
      windows: '/downloads/PronaFlow-Setup-Windows.exe',
      macos: '/downloads/PronaFlow-Setup-macOS.dmg',
      linux: '/downloads/PronaFlow-Setup-Linux.AppImage'
    };
    
    // Trigger download
    const link = document.createElement('a');
    link.href = downloadUrls[platform];
    link.download = `PronaFlow-${platform}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowDownloadModal(false);
  };

  return (
    <>
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-white">
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-indigo-50/30 to-white -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-indigo-600 text-xs font-extrabold mb-8 shadow-sm">
          <Rocket size={14} /> Hệ thống Hybrid: Desktop & Cloud Sync
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.1]">
          Quản trị dự án đột phá <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500">
            Cho đội nhóm chuyên gia
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Trải nghiệm hiệu năng tối thượng trên Desktop kết hợp linh hoạt trên Web. 
          Giúp đội nhóm của bạn luôn đồng bộ dù đang làm việc offline hay online.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button 
            onClick={handleGetStarted}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 group hover:scale-105 active:scale-95">
            <Download size={20} />
            Tải bản Desktop App
          </button>
          <button 
            onClick={handleTryWeb}
            className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200 font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95">
            <Globe size={20} />
            Truy cập bản Web
          </button>
        </div>

        {/* Dashboard Preview */}
        <div className="relative mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="rounded-xl bg-white p-1 shadow-2xl ring-1 ring-slate-200/60">
            <div className="rounded-lg bg-slate-50 overflow-hidden aspect-[16/9] border border-slate-100 relative group">
               <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />
               <div className="w-full h-full p-8 grid grid-cols-3 gap-6 opacity-80 group-hover:opacity-100 transition-opacity">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="bg-white border border-slate-100 rounded-xl h-full p-5 space-y-4 shadow-sm">
                     <div className="h-1.5 w-12 bg-indigo-100 rounded-full" />
                     <div className="space-y-2">
                        <div className="h-3 w-full bg-slate-100 rounded-full" />
                        <div className="h-3 w-2/3 bg-slate-100 rounded-full" />
                     </div>
                     <div className="mt-auto flex justify-between">
                        <div className="w-7 h-7 rounded-full bg-slate-50" />
                        <div className="h-3 w-16 bg-slate-50 rounded" />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Download Modal */}
    {showDownloadModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 mx-4">
          {/* Close Button */}
          <button
            onClick={() => setShowDownloadModal(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Download size={32} className="text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Tải PronaFlow Desktop</h2>
            <p className="text-slate-500">Chọn hệ điều hành của bạn để tải xuống</p>
          </div>

          {/* Download Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Windows */}
            <button
              onClick={() => handleDownload('windows')}
              className="group p-6 bg-white border-2 border-slate-200 hover:border-indigo-500 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <Monitor size={24} className="text-slate-600 group-hover:text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Windows</h3>
              <p className="text-xs text-slate-500">Windows 10+</p>
              <div className="mt-4 text-xs text-slate-400 font-medium">Version 1.0.0</div>
            </button>

            {/* macOS */}
            <button
              onClick={() => handleDownload('macos')}
              className="group p-6 bg-white border-2 border-slate-200 hover:border-indigo-500 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <Laptop size={24} className="text-slate-600 group-hover:text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">macOS</h3>
              <p className="text-xs text-slate-500">macOS 11+</p>
              <div className="mt-4 text-xs text-slate-400 font-medium">Version 1.0.0</div>
            </button>

            {/* Linux */}
            <button
              onClick={() => handleDownload('linux')}
              className="group p-6 bg-white border-2 border-slate-200 hover:border-indigo-500 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <Code size={24} className="text-slate-600 group-hover:text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Linux</h3>
              <p className="text-xs text-slate-500">Ubuntu 20.04+</p>
              <div className="mt-4 text-xs text-slate-400 font-medium">Version 1.0.0</div>
            </button>
          </div>

          {/* Info */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Shield size={16} className="text-indigo-600" />
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-900 mb-1">Bảo mật & Hiệu năng</p>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Ứng dụng desktop được mã hóa end-to-end và tối ưu để làm việc offline. Dung lượng cài đặt: ~150MB.
                </p>
              </div>
            </div>
          </div>

          {/* Alternative */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 mb-3">
              Hoặc bạn có thể thử ngay bản Web
            </p>
            <button
              onClick={() => {
                setShowDownloadModal(false);
                setIsLoginModalOpen(true);
              }}
              className="text-indigo-600 hover:text-indigo-700 font-bold text-sm underline"
            >
              Truy cập Web App →
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Login Modal */}
    <ModalLogin 
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(false)}
      onSuccess={handleLoginSuccess}
      onSwitchToRegister={switchToRegister}
    />

    {/* Register Modal */}
    <ModalRegister 
      isOpen={isRegisterModalOpen}
      onClose={() => setIsRegisterModalOpen(false)}
      onSuccess={handleRegisterSuccess}
      onSwitchToLogin={switchToLogin}
    />
    </>
  );
};

// 4. FEATURE SECTION
const FeatureSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const feat1Ref = useRef<HTMLDivElement>(null);
  const feat2Ref = useRef<HTMLDivElement>(null);
  const feat3Ref = useRef<HTMLDivElement>(null);
  const featureRefs = [feat1Ref, feat2Ref, feat3Ref];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = featureRefs.findIndex(ref => ref.current === entry.target);
            if (index !== -1) setActiveFeature(index);
          }
        });
      },
      { threshold: 0.8, rootMargin: "-10% 0px -10% 0px" }
    );

    featureRefs.forEach(ref => ref.current && observer.observe(ref.current));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: "Kanban Thông minh 2.0",
      desc: "Tự động hóa luồng trạng thái dựa trên deadline và nhân sự. AI nhận diện các thẻ task quan trọng giúp bạn không bỏ lỡ công việc.",
      icon: <Layout className="text-indigo-600" size={28} />,
      ui: (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 flex flex-col gap-4 w-full h-full animate-in zoom-in-95">
          <div className="flex gap-4">
            <div className="flex-1 h-24 bg-slate-50 rounded-lg border border-dashed border-slate-200" />
            <div className="flex-1 h-24 bg-indigo-50 rounded-lg border border-indigo-100 relative flex items-center justify-center">
               <div className="w-12 h-1.5 bg-indigo-200 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="h-32 bg-slate-50 rounded-lg" />
          <div className="h-24 bg-white border border-slate-100 rounded-lg shadow-sm" />
        </div>
      )
    },
    {
      title: "Gantt Chart Đa chiều",
      desc: "Lập kế hoạch tiến độ tổng thể với khả năng kéo thả thời gian. Quản lý sự phụ thuộc giữa các task cực kỳ linh hoạt.",
      icon: <Calendar className="text-violet-600" size={28} />,
      ui: (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 flex flex-col gap-5 w-full h-full animate-in zoom-in-95">
           <div className="h-6 w-1/3 bg-violet-100 rounded-full" />
           <div className="h-6 w-1/2 bg-indigo-50 rounded-full ml-12" />
           <div className="h-6 w-2/3 bg-pink-50 rounded-full ml-4" />
           <div className="mt-auto h-32 bg-slate-50 rounded-lg flex items-center justify-center p-4">
              <div className="w-full h-px bg-slate-200 relative">
                 <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-4 h-4 bg-indigo-600 rounded-full shadow-lg" />
                 <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-4 h-4 bg-indigo-600 rounded-full shadow-lg" />
              </div>
           </div>
        </div>
      )
    },
    {
      title: "AI Risk Prediction",
      desc: "Dự báo các task có nguy cơ trễ hạn từ sớm. Phân tích hiệu suất team để gợi ý khối lượng công việc phù hợp nhất.",
      icon: <Sparkles className="text-amber-500" size={28} />,
      ui: (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 flex items-center justify-center w-full h-full animate-in zoom-in-95">
           <div className="relative">
              <div className="w-40 h-40 rounded-full border-[12px] border-slate-50 border-t-amber-400 rotate-45" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-4xl font-black text-slate-800 tracking-tighter">82%</span>
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Health Score</span>
              </div>
           </div>
        </div>
      )
    }
  ];

  return (
    <section id="features" className="bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative min-h-screen">
          
          {/* Left: Scroll Content */}
          <div className="space-y-6 py-20 overflow-y-auto lg:overflow-y-visible pr-4">
            {features.map((f, i) => (
              <div key={i} ref={featureRefs[i]} className={cn("transition-all duration-700", activeFeature === i ? "opacity-100 translate-x-3" : "opacity-20")}>
                <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center mb-6 shadow-sm">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4">{f.title}</h3>
                <p className="text-base text-slate-500 leading-relaxed max-w-sm font-medium">{f.desc}</p>
                <button className="mt-6 flex items-center gap-2 text-indigo-600 text-sm font-bold hover:gap-3 transition-all">
                  Chi tiết tính năng <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Right: Sticky Visual */}
          <div className="hidden lg:flex h-screen sticky top-0 items-center justify-center py-20">
            <div className="w-full max-h-[500px] aspect-square bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner flex items-center justify-center p-12">
              <div className="w-full h-full relative">
                {features.map((f, i) => (
                  <div key={i} className={cn(
                    "absolute inset-0 transition-all duration-500 transform flex items-center justify-center",
                    activeFeature === i ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-95 pointer-events-none"
                  )}>
                    {f.ui}
                  </div>
                ))}
              </div>
              <div className={cn(
                "absolute inset-0 -z-10 transition-colors duration-1000 blur-[100px] opacity-20",
                activeFeature === 0 ? "bg-indigo-400" : activeFeature === 1 ? "bg-violet-400" : "bg-amber-400"
              )} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// 5. HYBRID BENEFITS
const HybridSection = () => {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 order-2 md:order-1">
             <div className="relative group">
                <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xl relative z-10 group-hover:-translate-y-2 transition-transform duration-500">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100"><Monitor size={24} /></div>
                      <div>
                        <span className="block font-bold text-slate-900 text-lg leading-tight">Native Desktop App</span>
                        <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Windows / macOS / Linux</span>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Check size={16} className="text-emerald-500" />
                        <span className="text-sm font-semibold text-slate-700">Offline-first: Làm việc không cần Internet</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Check size={16} className="text-emerald-500" />
                        <span className="text-sm font-semibold text-slate-700">Hiệu năng tối ưu cho 10.000+ tasks</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Check size={16} className="text-emerald-500" />
                        <span className="text-sm font-semibold text-slate-700">Thông báo hệ thống tức thì</span>
                      </div>
                   </div>
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-100 rounded-full blur-3xl -z-10 opacity-60" />
             </div>
          </div>
          <div className="flex-1 order-1 md:order-2">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Kỳ quan của sự đồng bộ.</h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 font-medium">
              Bạn không cần phải chọn giữa hiệu năng Desktop và sự tiện dụng của Web. PronaFlow mang đến cả hai với công nghệ đồng bộ thời gian thực mượt mà nhất hiện nay.
            </p>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-white border border-slate-200 rounded-xl text-center">
                  <div className="text-indigo-600 font-bold mb-1 text-2xl">0.1s</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide text-center">Sync Latency</div>
               </div>
               <div className="p-4 bg-white border border-slate-200 rounded-xl text-center">
                  <div className="text-indigo-600 font-bold mb-1 text-2xl">99.9%</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Uptime Promise</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 6. FINAL CTA & INTEGRATIONS
const FinalCTA = () => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setShowDownloadModal(true);
  };

  const handleRegisterSuccess = () => {
    setIsRegisterModalOpen(false);
    navigate('/dashboard');
  };

  const handleDownload = (platform: 'windows' | 'macos' | 'linux') => {
    const downloadUrls = {
      windows: '/downloads/PronaFlow-Setup-Windows.exe',
      macos: '/downloads/PronaFlow-Setup-macOS.dmg',
      linux: '/downloads/PronaFlow-Setup-Linux.AppImage'
    };
    
    const link = document.createElement('a');
    link.href = downloadUrls[platform];
    link.download = `PronaFlow-${platform}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowDownloadModal(false);
  };

  return (
    <>
    <section className="bg-white py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        
        <div className="mb-16">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">Kết nối với mọi công cụ bạn đang dùng</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40">
             <div className="flex items-center gap-2"><Github size={20}/> <span className="font-bold">GitHub</span></div>
             <div className="flex items-center gap-2"><Briefcase size={20}/> <span className="font-bold">Slack</span></div>
             <div className="flex items-center gap-2"><LinkIcon size={20}/> <span className="font-bold">Google Drive</span></div>
             <div className="flex items-center gap-2"><Smartphone size={20}/> <span className="font-bold">Mobile App</span></div>
             <div className="flex items-center gap-2"><Code size={20}/> <span className="font-bold">Jira</span></div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[32px] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-32 -mt-32" />
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px] -ml-32 -mb-32" />

           <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter italic">Nâng tầm quản trị ngay hôm nay.</h2>
              <p className="text-lg md:text-xl text-slate-300 mb-12 font-medium opacity-90">
                Gia nhập hơn 10.000+ đội nhóm đang dẫn đầu thị trường bằng cách làm việc thông minh hơn. Hoàn toàn miễn phí cho các nhóm nhỏ.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-xl transition-all shadow-xl shadow-indigo-900/40 hover:-translate-y-1 active:scale-95">
                  Tải Desktop App
                </button>
                <button 
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl text-xl border border-white/20 transition-all flex items-center justify-center gap-3">
                  Dùng thử Web <ArrowRight size={20} />
                </button>
              </div>

              <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-slate-400 font-semibold opacity-70">
                 <div className="flex items-center gap-2 text-center"><Check size={16} className="text-indigo-400 shrink-0" /> Không cần thẻ tín dụng</div>
                 <div className="flex items-center gap-2 text-center"><Check size={16} className="text-indigo-400 shrink-0" /> Setup trong 2 phút</div>
                 <div className="flex items-center gap-2 text-center"><Check size={16} className="text-indigo-400 shrink-0" /> Support 24/7</div>
              </div>
           </div>
        </div>
      </div>
    </section>

    {/* Download Modal */}
    {showDownloadModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 mx-4">
          <button
            onClick={() => setShowDownloadModal(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Download size={32} className="text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Tải PronaFlow Desktop</h2>
            <p className="text-slate-500">Chọn hệ điều hành của bạn để tải xuống</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => handleDownload('windows')}
              className="group p-6 bg-white border-2 border-slate-200 hover:border-indigo-500 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <Monitor size={24} className="text-slate-600 group-hover:text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Windows</h3>
              <p className="text-xs text-slate-500">Windows 10+</p>
              <div className="mt-4 text-xs text-slate-400 font-medium">Version 1.0.0</div>
            </button>

            <button
              onClick={() => handleDownload('macos')}
              className="group p-6 bg-white border-2 border-slate-200 hover:border-indigo-500 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <Laptop size={24} className="text-slate-600 group-hover:text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">macOS</h3>
              <p className="text-xs text-slate-500">macOS 11+</p>
              <div className="mt-4 text-xs text-slate-400 font-medium">Version 1.0.0</div>
            </button>

            <button
              onClick={() => handleDownload('linux')}
              className="group p-6 bg-white border-2 border-slate-200 hover:border-indigo-500 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <Code size={24} className="text-slate-600 group-hover:text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Linux</h3>
              <p className="text-xs text-slate-500">Ubuntu 20.04+</p>
              <div className="mt-4 text-xs text-slate-400 font-medium">Version 1.0.0</div>
            </button>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Shield size={16} className="text-indigo-600" />
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-900 mb-1">Bảo mật & Hiệu năng</p>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Ứng dụng desktop được mã hóa end-to-end và tối ưu để làm việc offline. Dung lượng cài đặt: ~150MB.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 mb-3">
              Hoặc bạn có thể thử ngay bản Web
            </p>
            <button
              onClick={() => {
                setShowDownloadModal(false);
                setIsRegisterModalOpen(true);
              }}
              className="text-indigo-600 hover:text-indigo-700 font-bold text-sm underline"
            >
              Truy cập Web App →
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Register Modal */}
    <ModalRegister 
      isOpen={isRegisterModalOpen}
      onClose={() => setIsRegisterModalOpen(false)}
      onSuccess={handleRegisterSuccess}
      onSwitchToLogin={() => {}}
    />
    </>
  );
};

// 7. FOOTER
const Footer = () => {
  const footerLinks = [
    { title: 'Sản phẩm', links: ['Tính năng chính', 'Tải bản Desktop', 'Ứng dụng Web', 'Bảng giá Business'] },
    { title: 'Học viện', links: ['Tài liệu người dùng', 'Video hướng dẫn', 'Blog kỹ thuật', 'Roadmap 2024'] },
    { title: 'Công ty', links: ['Về chúng tôi', 'Tuyển dụng', 'Báo chí', 'Liên hệ Support'] },
    { title: 'Pháp lý', links: ['Điều khoản dịch vụ', 'Chính sách bảo mật', 'Cam kết SLA', 'Tiêu chuẩn SOC2'] }
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-6 group cursor-pointer w-fit">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">P</div>
              <span className="font-bold text-2xl text-slate-900 tracking-tight">PronaFlow</span>
            </div>
            <p className="text-slate-500 max-w-sm text-sm leading-relaxed mb-8 font-medium">
              Giải pháp quản trị dự án thông minh đột phá, giúp đội nhóm hiện thực hóa ý tưởng nhanh chóng và chính xác tuyệt đối.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Linkedin].map((Icon, idx) => (
                <button key={idx} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerLinks.map((cat) => (
              <div key={cat.title}>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-[0.2em] mb-8">{cat.title}</h4>
                <ul className="space-y-4">
                  {cat.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1 group font-medium">
                        {link}
                        <ArrowUpRight size={10} className="opacity-0 -translate-y-1 group-hover:opacity-100 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-400 font-bold uppercase tracking-widest">
          <div className="flex items-center gap-6">
            <span>© 2024 PronaFlow Inc.</span>
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </div>
          </div>
          <div className="flex items-center gap-2 hover:text-slate-900 cursor-pointer transition-colors group">
            <Globe size={14} className="group-hover:rotate-12 transition-transform" />
            <span>Tiếng Việt</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- MAIN PAGE ---

export default function LandingPage() {
  return (
    <div className="font-sans text-slate-900 bg-white selection:bg-indigo-100 selection:text-indigo-900 scroll-smooth">
      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }
      `}</style>
      
      <Navbar />
      <Hero />
      
      <section className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center border-y border-slate-50 py-12">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-10 opacity-60">Tech Stacks we use</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-30 grayscale hover:opacity-60 transition-opacity">
             <div className="h-6 w-24 bg-slate-400 rounded-sm" />
             <div className="h-6 w-24 bg-slate-400 rounded-sm" />
             <div className="h-6 w-24 bg-slate-400 rounded-sm" />
             <div className="h-6 w-24 bg-slate-400 rounded-sm" />
             <div className="h-6 w-24 bg-slate-400 rounded-sm" />
          </div>
        </div>
      </section>

      <FeatureSection />
      <HybridSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}