import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Label from '@radix-ui/react-label';
import * as Checkbox from '@radix-ui/react-checkbox';
import {
  LogIn,
  Loader2,
  Github,
  Mail,
  Eye,
  EyeOff,
  Check,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

/**
 * PronaFlow Login Page Component
 * Framework: React 18+
 * Styling: Tailwind CSS
 * Primitives: Radix UI
 */

const logo = "/branding/logo-dark.svg";

const App = () => {
  // --- State Management ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState('');

  // Giả lập xử lý đăng nhập
  const handleLogin = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');

    // Validation cơ bản
    if (!email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    setIsLoading(true);
    // Giả lập API call
    setTimeout(() => {
      setIsLoading(false);
      // Logic điều hướng sau khi đăng nhập thành công sẽ ở đây
      console.log("Logged in with:", { email, password });
    }, 2000);
  };

  // --- Theme Toggle Logic (Module 9) ---
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} transition-colors duration-300`}>
      <div className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground font-sans selection:bg-primary/30">

        {/* --- PHẦN TRÁI: BRANDING & VISUALS (Chỉ hiện trên Desktop) --- */}
        <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden bg-slate-900">
          {/* Background Wallpaper với hiệu ứng Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80"
              alt="PronaFlow Workspace"
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-slate-900/90" />
          </div>

          {/* Logo Section, which is button access landing page*/}
          <Link
            to="/"
            className='relative z-10 flex items-center gap-3'>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <img
                src={logo}
                alt="PronaFlow Logo"
                className='w-10 h-10' />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">PronaFlow</span>
          </Link>

          {/* Marketing Copy */}
          <div className="relative z-10 space-y-6 max-w-md">
            <h1 className="text-5xl font-extrabold text-white leading-tight">
              Quản trị thông minh.<br />
              <span className="text-primary-foreground/60">Cộng tác không giới hạn.</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Hệ thống điều phối dự án thế hệ mới tích hợp AI giúp đội ngũ của bạn đạt hiệu suất tối ưu 40% ngay từ tháng đầu tiên.
            </p>

            {/* Social Proof Placeholder */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] text-white">
                    U{i}
                  </div>
                ))}
              </div>
              <span className="text-sm text-slate-400 font-medium">+2,500 tổ chức tin dùng</span>
            </div>
          </div>

          {/* Footer Copy */}
          <div className="relative z-10 text-slate-500 text-sm">
            © 2024 PronaFlow Inc. Hệ thống đạt chuẩn ISO/IEC 27001.
          </div>
        </div>

        {/* --- PHẦN PHẢI: AUTHENTICATION FORM --- */}
        <div className="flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 relative bg-white dark:bg-slate-950">

          {/* Theme Toggle Button (Góc trên phải) */}
          <button
            onClick={toggleTheme}
            className="absolute top-8 right-8 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Chuyển chế độ sáng/tối"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header Form */}
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Chào mừng trở lại</h2>
              <p className="text-slate-500 dark:text-slate-400">Đăng nhập để quản lý dự án của bạn ngay hôm nay.</p>
            </div>

            {/* Social Login Buttons (Module 1 - AuthProvider) */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 h-11 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-medium text-sm">
                <Mail className="w-4 h-4 text-red-500" /> Google
              </button>
              <button className="flex items-center justify-center gap-2 h-11 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all font-medium text-sm">
                <Github className="w-4 h-4 dark:text-white" /> GitHub
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t dark:border-slate-800" /></div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white dark:bg-slate-950 px-4 text-slate-400 font-bold tracking-widest">Hoặc email công việc</span>
              </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email Field */}
              <div className="space-y-2">
                <Label.Root
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1"
                  htmlFor="email"
                >
                  Địa chỉ Email
                </Label.Root>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label.Root className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">Mật khẩu</Label.Root>
                  <Link to="/help/contact" className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">Quên mật khẩu?</Link>
                </div>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium animate-shake">
                  {error}
                </div>
              )}

              {/* Remember Me */}
              <div className="flex items-center gap-2 ml-1">
                <Checkbox.Root
                  id="remember"
                  className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700 bg-transparent flex items-center justify-center data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-colors focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <Checkbox.Indicator className="text-white">
                    <Check className="w-3 h-3 stroke-[3px]" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400 select-none cursor-pointer">Ghi nhớ đăng nhập</label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Đang xác thực...
                  </>
                ) : (
                  <>
                    Tiếp tục <ChevronRight className="w-4 h-4" />
                  </>
                )}
                {/* Btn name */}
                <span>Đăng nhập</span>
              </button>
            </form>

            {/* Footer Form */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Chưa có tài khoản?{' '}
              <Link
                to="/register"
                className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
              >
                <span className='text-primary'>Đăng ký ngay</span>
              </Link>
            </p>
          </div>

          {/* Accessibility Info (Small) */}
          <div className="absolute bottom-8 text-[10px] text-slate-400 text-center max-w-[300px]">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <Link to="/help/terms" className="text-slate-500 hover:text-slate-700 underline">Điều khoản dịch vụ</Link>{' '}
            và{' '}
            <Link to="/help/privacy" className="text-slate-500 hover:text-slate-700 underline">Chính sách quyền riêng tư</Link>{' '}
            của chúng tôi.
          </div>
        </div>

      </div>

      {/* Global CSS for Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        
        :root {
          --primary: #3B82F6;
          --background: #FFFFFF;
          --foreground: #0F172A;
        }
        .dark {
          --primary: #60A5FA;
          --background: #020617;
          --foreground: #F8FAFC;
        }
      `}} />
    </div>
  );
};

export default App;