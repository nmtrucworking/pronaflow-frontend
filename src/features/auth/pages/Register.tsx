import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Label from '@radix-ui/react-label';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { 
  UserPlus, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  CheckCircle2, 
  Briefcase, 
  ShieldCheck, 
  Loader2,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

const App = () => {
  // --- State ---
  const [step, setStep] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    workspaceName: '',
    workspaceSlug: '',
    userRole: 'manager'
  });

  // --- Helpers ---
  const handleNext = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(s => s + 1);
    }, 800);
  };

  const handlePrev = () => setStep(s => s - 1);

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length > 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = calculatePasswordStrength(formData.password);

  return (
    <div className={`${isDarkMode ? 'dark' : ''} transition-colors duration-300`}>
      <div className="token-page-shell min-h-screen grid lg:grid-cols-2 font-sans">
        
        {/* --- TRÁI: MARKETING & STEPS VISUAL --- */}
        <div className="hidden lg:flex relative flex-col justify-between p-12 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80" 
              alt="Register Visual" 
              className="w-full h-full object-cover opacity-30 mix-blend-overlay scale-110 animate-pulse-slow"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
          </div>

          <Link to="/" className="relative z-10 flex items-center gap-3">
             <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">PronaFlow</span>
          </Link>

          <div className="relative z-10 space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white leading-tight">Bắt đầu hành trình tối ưu năng suất của bạn.</h1>
              <p className="text-slate-400 text-lg">Chỉ mất 2 phút để thiết lập không gian làm việc chuyên nghiệp cho đội ngũ.</p>
            </div>

            {/* Step Indicators */}
            <div className="space-y-6">
              {[
                { id: 1, label: 'Thông tin cá nhân', desc: 'Tạo tài khoản bảo mật của bạn' },
                { id: 2, label: 'Thiết lập Workspace', desc: 'Đặt tên cho ngôi nhà chung' },
                { id: 3, label: 'Tùy chỉnh vai trò', desc: 'Tối ưu hóa giao diện cho vị trí của bạn' }
              ].map((s) => (
                <div key={s.id} className={`flex items-start gap-4 transition-all duration-500 ${step >= s.id ? 'opacity-100 translate-x-2' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-xs ${step >= s.id ? 'bg-primary border-primary text-white' : 'border-slate-700 text-slate-500'}`}>
                    {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{s.label}</h4>
                    <p className="text-slate-500 text-xs">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-slate-500 text-sm">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>Tham gia cùng hơn 10,000 chuyên gia tuần này.</span>
          </div>
        </div>

        {/* --- PHẢI: MULTI-STEP FORM --- */}
        <div className="flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 relative bg-white dark:bg-slate-950">
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="absolute top-8 right-8 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          <div className="w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            
            {/* --- STEP 1: ACCOUNT --- */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold dark:text-white">Tạo tài khoản mới</h2>
                  <p className="text-slate-500">Bước đầu tiên để làm việc thông minh hơn.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label.Root className="text-sm font-semibold text-slate-700 dark:text-slate-300">Họ và tên</Label.Root>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="token-input-base w-full h-11 px-4"
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label.Root className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email công việc</Label.Root>
                    <input 
                      type="email" 
                      placeholder="email@company.com"
                      className="token-input-base w-full h-11 px-4"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label.Root className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mật khẩu</Label.Root>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Tối thiểu 8 ký tự"
                        className="token-input-base w-full h-11 px-4"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Password Strength Meter */}
                    <div className="flex gap-1 pt-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${strength >= i*25 ? (strength <= 50 ? 'bg-orange-500' : 'bg-green-500') : 'bg-slate-200 dark:bg-slate-800'}`} />
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleNext}
                  disabled={isLoading || !formData.fullName || !formData.email || strength < 25}
                  className="token-action-primary w-full h-11 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Tiếp tục <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            )}

            {/* --- STEP 2: WORKSPACE (Module 2) --- */}
            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <button onClick={handlePrev} className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary mb-4 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Quay lại
                </button>

                <div className="space-y-2 text-center lg:text-left">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-2 mx-auto lg:mx-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-bold dark:text-white">Tạo Workspace</h2>
                  <p className="text-slate-500">Tổ chức tất cả dự án vào một không gian duy nhất.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label.Root className="text-sm font-semibold">Tên không gian làm việc</Label.Root>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: Prona Team, Marketing Agency..."
                      className="token-input-base w-full h-11 px-4"
                      onChange={(e) => setFormData({...formData, workspaceName: e.target.value, workspaceSlug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label.Root className="text-sm font-semibold">Đường dẫn truy cập (Slug)</Label.Root>
                    <div className="flex items-center gap-1 h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                      <span className="text-slate-400 text-sm">pronaflow.com/</span>
                      <input 
                        type="text" 
                        value={formData.workspaceSlug}
                        className="bg-transparent text-sm font-medium outline-none text-primary"
                        readOnly
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 italic">Dùng để định danh tổ chức của bạn trong hệ thống.</p>
                  </div>
                </div>

                <button 
                  onClick={handleNext}
                  disabled={isLoading || !formData.workspaceName}
                  className="token-action-primary w-full h-11 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Thiết lập ngay <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            )}

            {/* --- STEP 3: ROLE & FINALIZE (Module 9) --- */}
            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-2 text-center lg:text-left">
                  <h2 className="text-3xl font-bold dark:text-white">Bạn là ai?</h2>
                  <p className="text-slate-500">Chúng tôi sẽ cá nhân hóa giao diện dựa trên vai trò của bạn.</p>
                </div>

                <RadioGroup.Root 
                  className="grid grid-cols-1 gap-3" 
                  defaultValue="manager"
                  onValueChange={(val) => setFormData({...formData, userRole: val})}
                >
                  {[
                    { id: 'manager', label: 'Quản lý dự án', desc: 'Lập kế hoạch, theo dõi tiến độ và báo cáo.', icon: Briefcase },
                    { id: 'dev', label: 'Chuyên viên kỹ thuật', desc: 'Xử lý task, cập nhật code và tài liệu.', icon: CheckCircle2 },
                    { id: 'other', label: 'Khác', desc: 'Cộng tác viên hoặc khách hàng xem tiến độ.', icon: UserPlus },
                  ].map((role) => (
                    <RadioGroup.Item 
                      key={role.id} 
                      value={role.id}
                      className="group flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500/5 transition-all outline-none"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 group-data-[state=checked]:bg-emerald-600 group-data-[state=checked]:text-white flex items-center justify-center transition-colors">
                        <role.icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm dark:text-white">{role.label}</p>
                        <p className="text-xs text-slate-500">{role.desc}</p>
                      </div>
                    </RadioGroup.Item>
                  ))}
                </RadioGroup.Root>

                <button 
                  onClick={handleNext}
                  disabled={isLoading}
                  className="token-action-primary w-full h-11 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Hoàn tất thiết lập"}
                </button>
              </div>
            )}

            {/* --- SUCCESS STATE --- */}
            {step === 4 && (
              <div className="text-center space-y-6 py-10 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/10">
                  <Check className="w-10 h-10 stroke-[3px]" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold dark:text-white text-slate-900">Tuyệt vời, {formData.fullName.split(' ').pop()}!</h2>
                  <p className="text-slate-500">Tài khoản của bạn đã sẵn sàng. Hãy khám phá <strong>{formData.workspaceName}</strong> ngay bây giờ.</p>
                </div>
                <button 
                  className="token-action-primary w-full h-11 rounded-lg font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                  onClick={() => navigate('/dashboard')}
                >
                  Truy cập Dashboard
                </button>
              </div>
            )}

            {/* Bottom Link */}
            {step < 4 && (
              <p className="text-center text-sm text-slate-500">
                Đã có tài khoản?{' '}
                <Link to="/login" className="font-bold text-emerald-600 hover:underline">Đăng nhập</Link>
              </p>
            )}
            {step < 4 && (
              <p className="text-center text-[10px] text-slate-400 mt-3">
                Bằng cách đăng ký, bạn đồng ý với{' '}
                <Link to="/help/terms" className="text-slate-500 hover:text-slate-700 underline">Điều khoản dịch vụ</Link>{' '}
                và{' '}
                <Link to="/help/privacy" className="text-slate-500 hover:text-slate-700 underline">Chính sách quyền riêng tư</Link>{' '}
                của chúng tôi.
              </p>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1.1); }
          50% { opacity: 0.4; transform: scale(1.15); }
        }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        
      `}} />
    </div>
  );
};

export default App;