import React from 'react';
import { Home, ArrowLeft, Zap } from 'lucide-react';

/**
 * Interface định nghĩa các thuộc tính cho trang lỗi (nếu cần mở rộng)
 */
interface ErrorPageProps {
  errorCode?: string;
  title?: string;
  message?: string;
}

const App: React.FC<ErrorPageProps> = ({
  errorCode = "404",
  title = "Tài nguyên không tồn tại",
  message = "Hệ thống không thể xác định được yêu cầu tại địa chỉ này. Vui lòng kiểm tra lại đường dẫn hoặc quay trở lại giao diện chính của hệ thống."
}) => {
  
  // Inline styles cho các hiệu ứng chuyển động gradient và blob
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
      background: linear-gradient(-45deg, #f3f4f6, #e5e7eb, #d1fae5, #ecfdf5);
      background-size: 400% 400%;
      animation: gradient 15s ease infinite;
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }
  `;

  return (
    <div className="bg-flow-animation min-h-screen w-full flex flex-col justify-center items-center overflow-hidden relative text-slate-800 font-sans">
      <style>{styles}</style>

      {/* Các thành phần đồ họa nền (Background Elements) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-center justify-center gap-12">
        
        {/* Khối nội dung thông tin */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <div className="mb-8 flex justify-center md:justify-start items-center gap-2">
            <Zap className="w-8 h-8 text-emerald-600" />
            <span className="text-2xl font-bold tracking-tight text-slate-900">PronaFlow</span>
          </div>

          <h1 className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-4">
            {errorCode}
          </h1>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 uppercase tracking-tight">
            {title}
          </h2>

          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={() => window.location.href = '/'}
              className="group px-8 py-3.5 bg-emerald-600 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Quay lại Trang chủ
            </button>

            <button 
              onClick={() => window.history.back()}
              className="px-8 py-3.5 bg-white text-slate-700 border border-slate-200 font-semibold rounded-lg hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại trang trước
            </button>
          </div>
        </div>

        {/* Khối minh họa trực quan (SVG Illustration) */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          <div className="relative w-full max-w-lg">
            <svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#0d9488', stopOpacity: 1 }} />
                </linearGradient>
              </defs>

              {/* Mô phỏng giao diện hệ thống */}
              <rect x="50" y="50" width="400" height="250" rx="20" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
              <rect x="50" y="50" width="400" height="30" rx="20" fill="#f1f5f9" />
              <circle cx="75" cy="65" r="5" fill="#ef4444" />
              <circle cx="95" cy="65" r="5" fill="#eab308" />
              <circle cx="115" cy="65" r="5" fill="#22c55e" />

              {/* Ký hiệu ngắt kết nối dữ liệu */}
              <path d="M180 150 L320 250" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="10,10" />
              <path d="M320 150 L180 250" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="10,10" />

              {/* Biểu tượng cảnh báo trung tâm */}
              <circle cx="250" cy="200" r="50" fill="url(#grad1)" className="animate-pulse" />
              <text x="250" y="220" fontFamily="sans-serif" fontSize="var(--font-size-6xl)" textAnchor="middle" fill="white" fontWeight="bold">!</text>

              {/* Các khối trang trí hỗ trợ */}
              <rect x="380" y="240" width="80" height="80" rx="10" fill="#a7f3d0" opacity="0.5" className="animate-bounce" style={{ animationDuration: '3s' }} />
              <rect x="40" y="260" width="60" height="60" rx="30" fill="#99f6e4" opacity="0.5" className="animate-bounce" style={{ animationDuration: '4s' }} />
            </svg>
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