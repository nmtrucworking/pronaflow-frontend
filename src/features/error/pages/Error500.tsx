import React from 'react';
import { RefreshCw, Home, Server } from 'lucide-react';
import COLORS from '@/config/colors';
import { ROUTES } from '@/routes/paths';

/**
 * ServerErrorPage Component
 * Trình bày thông báo lỗi hệ thống nội bộ (HTTP 500)
 * Sử dụng kiến trúc Functional Component với TypeScript
 */
const App: React.FC = () => {
  const uiColors = {
    gradA: COLORS.semantic.success[50],
    gradB: COLORS.semantic.success[100],
    gradC: COLORS.semantic.success[100],
    gradD: COLORS.semantic.success[50],
  } as const;
  
  // Định nghĩa các hiệu ứng chuyển động thông qua CSS Injection
  const styles = `
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes blob {
      0% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .bg-flow-animation {
      background: linear-gradient(-45deg, var(--pf-error500-grad-a), var(--pf-error500-grad-b), var(--pf-error500-grad-c), var(--pf-error500-grad-d));
      background-size: 400% 400%;
      animation: gradient 15s ease infinite;
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
  `;

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = ROUTES.root;
  };

  return (
    <div
      className="bg-flow-animation min-h-screen w-full flex flex-col justify-center items-center overflow-hidden relative text-slate-800 font-sans"
      style={{
        ['--pf-error500-grad-a' as any]: uiColors.gradA,
        ['--pf-error500-grad-b' as any]: uiColors.gradB,
        ['--pf-error500-grad-c' as any]: uiColors.gradC,
        ['--pf-error500-grad-d' as any]: uiColors.gradD,
      }}
    >
      <style>{styles}</style>

      {/* Cấu trúc đồ họa nền hỗ trợ thị giác */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col-reverse md:flex-row items-center justify-center gap-16">
        
        {/* Khối văn bản và thông tin kỹ thuật */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <div className="mb-6 flex justify-center md:justify-start items-center gap-2">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <Server className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">PronaFlow System</span>
          </div>

          <h1 className="text-7xl font-extrabold text-slate-900 mb-2 tracking-tight">500</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-4">
            Lỗi xử lý phía máy chủ nội bộ.
          </h2>

          <p className="text-base text-slate-600 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed text-justify md:text-left">
            Hệ thống đã ghi nhận một sự cố không mong muốn trong quá trình thực thi yêu cầu. 
            Mọi dữ liệu cá nhân của người dùng vẫn được đảm bảo tính toàn vẹn. 
            Hệ thống giám sát đã tự động gửi báo cáo lỗi đến bộ phận kỹ thuật để tiến hành phân tích và khắc phục.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={handleRefresh}
              className="group px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Thử tải lại trang
            </button>

            <button 
              onClick={handleGoHome}
              className="px-6 py-3 bg-white text-slate-700 border border-slate-200 font-semibold rounded-lg hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Về trang chủ
            </button>
          </div>

          <div className="mt-8 text-sm text-slate-400">
            Mã định danh lỗi: <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">INTERNAL_SERVER_ERROR</span>
            <div className="mt-3">
              <a
                href={`${ROUTES.help.status}#error-codes`}
                className="inline-flex items-center text-emerald-700 hover:text-emerald-800 font-medium underline underline-offset-2"
              >
                Xem danh sách mã lỗi
              </a>
            </div>
          </div>
        </div>

        {/* Khối minh họa kỹ thuật (asset animation) */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md cursor-help">
            <img
              src="/assets/error-500-server-animation.svg"
              alt="Server diagnostics animation"
              className="w-full h-auto drop-shadow-xl"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* Footer bản quyền */}
      <footer className="absolute bottom-4 w-full text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} PronaFlow. Tất cả các quyền được bảo hộ.
      </footer>
    </div>
  );
};

export default App;