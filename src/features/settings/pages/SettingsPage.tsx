import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/routes/paths';
import * as Tabs from '@radix-ui/react-tabs';
import * as Avatar from '@radix-ui/react-avatar';
import * as Switch from '@radix-ui/react-switch';
import * as Label from '@radix-ui/react-label';
import { 
  User, 
  Lock, 
  Palette, 
  Bell, 
  Camera, 
  Loader2, 
  Check, 
  ShieldAlert,
  ChevronDown,
  Globe,
  Monitor,
  Moon,
  Sun,
  Mail,
  Smartphone,
  Briefcase,
  MapPin,
  Link as LinkIcon,
  Github,
  Linkedin,
  Upload,
  HelpCircle,
  ExternalLink,
  Twitter,
  Dribbble,
  Plus,
  Trash2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  SmartphoneNfc,
  Type,
  Layout,
  Calendar,
  Eye,
  Slack,
  Building, // Added missing import
  LayoutGrid,
  Keyboard
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Import Module 9 Components
import AccessibilityPanel from '@/features/personalization/components/AccessibilityPanel';
import DashboardCustomizer from '@/features/personalization/components/DashboardCustomizer';

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- TYPES & MOCK DATA ---
interface CustomLink {
  id: string;
  label: string;
  url: string;
}

interface UserProfile {
  username: string;
  fullname: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  city: string;
  country: string;
  timezone: string;
  bio: string;
  avatarUrl: string;
  website: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    dribbble: string;
  };
  customLinks: CustomLink[];
}

const MOCK_USER: UserProfile = {
  username: 'trucnguyen',
  fullname: 'Truc Nguyen',
  email: 'truc.nguyen@pronaflow.com',
  phone: '+84 909 123 456',
  jobTitle: 'Lead Product Designer',
  department: 'Product', 
  city: 'Ho Chi Minh City',
  country: 'VN',
  timezone: 'Asia/Ho_Chi_Minh',
  bio: 'Passionate about building great user experiences and scalable design systems.',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  website: 'https://pronaflow.com',
  socials: {
    github: 'trucnguyen-dev',
    linkedin: 'trucnguyen-design',
    twitter: 'truc_ux',
    dribbble: 'trucnguyen'
  },
  customLinks: [
    { id: '1', label: 'Behance Portfolio', url: 'https://behance.net/trucnguyen' },
    { id: '2', label: 'Medium Blog', url: 'https://medium.com/@trucnguyen' }
  ]
};

const COUNTRIES = [
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
];

const DEPARTMENTS = [
  { id: 'Product', name: 'Product Design & Management' },
  { id: 'Engineering', name: 'Engineering & DevOps' },
  { id: 'Marketing', name: 'Marketing & Growth' },
  { id: 'Sales', name: 'Sales & Customer Success' },
  { id: 'HR', name: 'Human Resources' },
];

// --- COMPONENTS ---

const InputGroup = ({ label, id, children, helpText, error }: { label: string, id: string, children: React.ReactNode, helpText?: React.ReactNode, error?: string }) => (
  <div className="space-y-1.5 w-full">
    <div className="flex justify-between items-baseline">
      <Label.Root className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor={id}>
        {label}
      </Label.Root>
      {error && <span className="text-xs text-red-500 font-medium flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{error}</span>}
    </div>
    {children}
    {helpText && !error && <div className="text-[11px] text-slate-500 leading-tight">{helpText}</div>}
  </div>
);

const SectionHeader = ({ title, description }: { title: string, description: string }) => (
  <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
  </div>
);

// --- TAB CONTENT COMPONENTS ---

/**
 * 1. Profile Settings Tab
 */
const ProfileSettings = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(MOCK_USER);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // -- Handlers --
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform: keyof UserProfile['socials'], value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      socials: { ...prev.socials, [platform]: value } 
    }));
  };

  // Custom Links Logic
  const handleAddLink = () => {
    const newLink: CustomLink = { id: Date.now().toString(), label: '', url: '' };
    setFormData(prev => ({ ...prev, customLinks: [...prev.customLinks, newLink] }));
  };

  const handleRemoveLink = (id: string) => {
    setFormData(prev => ({ ...prev, customLinks: prev.customLinks.filter(l => l.id !== id) }));
  };

  const handleLinkChange = (id: string, field: keyof CustomLink, value: string) => {
    setFormData(prev => ({
      ...prev,
      customLinks: prev.customLinks.map(link => link.id === id ? { ...link, [field]: value } : link)
    }));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Saved data:', formData);
    }, 1500);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to construct social URLs
  const getSocialUrl = (platform: keyof UserProfile['socials']) => {
    const username = formData.socials[platform];
    if (!username) return '#';
    const bases = {
      github: 'https://github.com/',
      linkedin: 'https://linkedin.com/in/',
      twitter: 'https://x.com/',
      dribbble: 'https://dribbble.com/'
    };
    return `${bases[platform]}${username}`;
  };

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
      <SectionHeader title="Hồ sơ cá nhân" description="Quản lý thông tin hiển thị của bạn trên PronaFlow." />
      
      <div className="space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 ring-4 ring-white dark:ring-slate-800 rounded-full shadow-lg"> 
                <Avatar.Root className="w-full h-full rounded-full overflow-hidden transition-transform group-hover:scale-105 block bg-slate-200">
                  <Avatar.Image src={formData.avatarUrl} className="w-full h-full object-cover" />
                  <Avatar.Fallback className="w-full h-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold">
                      {formData.fullname.charAt(0)}
                  </Avatar.Fallback>
                </Avatar.Root>
                
                <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[1px]">
                    <Camera className="w-6 h-6 text-white mb-1 drop-shadow-md" />
                    <span className="text-[10px] font-medium text-white tracking-wide uppercase">Đổi ảnh</span>
                </div>

                <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full z-10" title="Trực tuyến"></div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
          
          <div className="text-center sm:text-left flex-1 space-y-3 min-w-0 w-full">
            <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Ảnh đại diện</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto sm:mx-0 leading-relaxed">
                Nên sử dụng ảnh vuông, kích thước tối thiểu 400x400px.<br className="hidden sm:block"/> Hỗ trợ định dạng JPG, PNG hoặc GIF.
                </p>
            </div>
            <div className="flex gap-2 justify-center sm:justify-start pt-1">
              <button onClick={handleAvatarClick} className="text-xs font-medium px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-all shadow-sm flex items-center group/btn active:scale-95">
                <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-500 group-hover/btn:text-indigo-500 transition-colors" /> Tải ảnh mới
              </button>
              <button className="text-xs font-medium px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 dark:text-red-400 rounded-lg transition-colors border border-transparent active:scale-95">
                Xóa ảnh
              </button>
            </div>
          </div>
        </div>

        {/* Basic Info Form */}
        <div className="space-y-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Thông tin cơ bản</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup label="Họ và tên" id="fullname">
              <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
            </InputGroup>
            <InputGroup label="Tên người dùng" id="username">
              <div className="relative group">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-indigo-500 transition-colors">@</span>
                <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
              </div>
            </InputGroup>
          </div>
          <InputGroup label="Email" id="email" helpText={<span className="flex items-center gap-1">Email này dùng để đăng nhập. Cần thay đổi? <a href="#" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium hover:underline inline-flex items-center">Liên hệ Admin <ExternalLink className="w-2.5 h-2.5 ml-0.5" /></a></span>}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="email" value={formData.email} disabled className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 cursor-not-allowed font-medium" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2"><span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50"><Check className="w-3 h-3 mr-1" /> Đã xác thực</span></div>
            </div>
          </InputGroup>
          <InputGroup label="Giới thiệu bản thân (Bio)" id="bio">
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="Chia sẻ đôi chút về vai trò và sở thích của bạn..." className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none" />
            <div className="text-right text-[10px] text-slate-400 mt-1">{formData.bio.length}/500</div>
          </InputGroup>
        </div>

        {/* Professional Info */}
        <div className="space-y-5 pt-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Thông tin công việc</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup label="Chức danh" id="jobTitle">
              <div className="relative group">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
              </div>
            </InputGroup>
            <InputGroup label="Phòng ban" id="department">
              <div className="relative group">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10" />
                <select name="department" value={formData.department} onChange={handleChange} className="w-full pl-9 pr-8 py-2.5 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all appearance-none cursor-pointer shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600">
                  <option value="" disabled>Chọn phòng ban</option>
                  {DEPARTMENTS.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 pointer-events-none transition-colors" />
              </div>
            </InputGroup>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup label="Số điện thoại" id="phone">
              <div className="relative group">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+84..." className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
              </div>
            </InputGroup>
            <InputGroup label="Khu vực & Quốc gia" id="location">
              <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Thành phố" className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
                </div>
                <div className="relative w-1/3 min-w-[120px]">
                  <select name="country" value={formData.country} onChange={handleChange} className="w-full pl-3 pr-8 py-2.5 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all appearance-none cursor-pointer shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600">
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </InputGroup>
          </div>
        </div>

        {/* Social Links - Enhanced with Hyperlinks */}
        <div className="space-y-5 pt-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Mạng xã hội & Liên kết</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <InputGroup label="Website cá nhân" id="website">
              <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://yourportfolio.com" className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
                </div>
                {formData.website && (
                  <a href={formData.website} target="_blank" rel="noreferrer" className="flex items-center justify-center w-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-200 dark:hover:text-indigo-400 dark:hover:border-indigo-800 transition-colors" title="Mở liên kết">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </InputGroup>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { id: 'github', label: 'GitHub', icon: Github, prefix: 'github.com/' },
                { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, prefix: 'linkedin.com/in/' },
                { id: 'twitter', label: 'Twitter / X', icon: Twitter, prefix: 'x.com/' },
                { id: 'dribbble', label: 'Dribbble', icon: Dribbble, prefix: 'dribbble.com/' },
              ].map((social) => (
                <InputGroup 
                  key={social.id} 
                  label={social.label} 
                  id={social.id} 
                  helpText={!formData.socials[social.id as keyof typeof formData.socials] ? "Nhập username để liên kết hồ sơ." : undefined}
                >
                  <div className="flex gap-2">
                    <div className="relative flex-1 flex group rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all">
                      <div className="flex items-center pl-3 pr-2 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 text-slate-500 text-xs select-none">
                        <social.icon className="w-3.5 h-3.5 mr-2" />
                        {social.prefix}
                      </div>
                      <input 
                        type="text" 
                        value={formData.socials[social.id as keyof typeof formData.socials]}
                        onChange={(e) => handleSocialChange(social.id as any, e.target.value)}
                        placeholder="username"
                        className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none"
                      />
                    </div>
                    {formData.socials[social.id as keyof typeof formData.socials] && (
                      <a 
                        href={getSocialUrl(social.id as any)} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center justify-center w-10 shrink-0 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-200 dark:hover:text-indigo-400 dark:hover:border-indigo-800 transition-colors"
                        title={`Mở ${social.label}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </InputGroup>
              ))}
            </div>
          </div>

          {/* Custom Links Section */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">Liên kết mở rộng</label>
            <div className="space-y-3">
              {formData.customLinks.map((link) => (
                <div key={link.id} className="flex gap-2 items-start animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <input 
                        type="text" 
                        value={link.label}
                        onChange={(e) => handleLinkChange(link.id, 'label', e.target.value)}
                        placeholder="Tiêu đề (VD: Portfolio)" 
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                    <div className="col-span-2">
                      <input 
                        type="url" 
                        value={link.url}
                        onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                        placeholder="https://..." 
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveLink(link.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                    title="Xóa liên kết"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button 
                onClick={handleAddLink}
                className="flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-2 rounded-lg transition-colors border border-dashed border-indigo-200 dark:border-indigo-800 w-full justify-center sm:w-auto"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Thêm liên kết khác
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Thêm các liên kết đến blog, portfolio hoặc các dự án cá nhân để làm nổi bật hồ sơ của bạn.</p>
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="sticky bottom-0 -mx-6 -mb-10 px-6 py-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-between z-20 mt-8 shadow-sm">
          <p className="text-xs text-slate-500 italic hidden sm:block">Lần cập nhật cuối: 2 giờ trước</p>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors bg-transparent border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg active:scale-95">
              Hủy bỏ
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...</> : <><Check className="w-4 h-4 mr-2" /> Lưu thay đổi</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Preferences Tab (Theme & Language)
 */
const PreferenceSettings = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [colorMode, setColorMode] = useState('default');
  const [fontScale, setFontScale] = useState(100);

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
      <SectionHeader title="Giao diện & Ứng dụng" description="Tùy chỉnh trải nghiệm nhìn và cảm nhận của bạn." />

      <div className="space-y-8">
        {/* Theme Selector */}
        <div>
          <Label.Root className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">Chế độ giao diện</Label.Root>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'light', label: 'Sáng', icon: Sun },
              { id: 'dark', label: 'Tối', icon: Moon },
              { id: 'system', label: 'Hệ thống', icon: Monitor },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTheme(item.id as any)}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-xl border-2 transition-all active:scale-95 relative group",
                    isActive 
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-md shadow-indigo-500/20" 
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-sm"
                  )}
                >
                  <div className={cn(
                    "w-full h-20 rounded-lg mb-3 flex items-center justify-center",
                    item.id === 'light' ? "bg-slate-100 border border-slate-200" :
                    item.id === 'dark' ? "bg-slate-800 border border-slate-700" :
                    "bg-gradient-to-br from-slate-100 to-slate-800 border border-slate-200"
                  )}>
                    <Icon className={cn("w-6 h-6", item.id === 'light' ? "text-slate-500" : item.id === 'dark' ? "text-slate-400" : "text-slate-600")} />
                  </div>
                  <span className={cn("text-xs font-medium", isActive ? "text-indigo-700 dark:text-indigo-300" : "text-slate-600 dark:text-slate-400")}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 bg-indigo-600 rounded-full text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Accessibility & Typography */}
        <div className="space-y-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white pb-2 flex items-center">
            <Eye className="w-4 h-4 mr-2" /> Khả năng tiếp cận (Accessibility)
          </h3>
          
          <InputGroup 
            label="Chế độ hiển thị màu" 
            id="color_mode" 
            helpText={
              <span>
                Điều chỉnh màu sắc cho người dùng gặp khó khăn về thị giác. <a href="#" className="text-indigo-600 hover:underline inline-flex items-center">Tìm hiểu thêm <ExternalLink className="w-2.5 h-2.5 ml-0.5" /></a>
              </span>
            }
          >
            <div className="space-y-2">
              <div className="relative">
                <select 
                  value={colorMode}
                  onChange={(e) => setColorMode(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:border-indigo-500 cursor-pointer shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                >
                  <option value="default">Mặc định</option>
                  <option value="protanopia">Mù màu đỏ (Protanopia)</option>
                  <option value="deuteranopia">Mù màu lục (Deuteranopia)</option>
                  <option value="tritanopia">Mù màu lam (Tritanopia)</option>
                  <option value="high_contrast">Độ tương phản cao</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              {colorMode !== 'default' && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-md text-[11px] font-medium text-indigo-700 dark:text-indigo-400">
                  <Check className="w-3 h-3" />
                  Đã bật: {
                    colorMode === 'protanopia' ? 'Mù màu đỏ (Protanopia)' :
                    colorMode === 'deuteranopia' ? 'Mù màu lục (Deuteranopia)' :
                    colorMode === 'tritanopia' ? 'Mù màu lam (Tritanopia)' :
                    'Độ tương phản cao'
                  }
                </div>
              )}
            </div>
          </InputGroup>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label.Root className="text-sm font-medium text-slate-700 dark:text-slate-300">Cỡ chữ hiển thị ({fontScale}%)</Label.Root>
              <Type className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-medium">A</span>
              <input 
                type="range" 
                min="85" 
                max="125" 
                step="5"
                value={fontScale}
                onChange={(e) => setFontScale(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-lg text-slate-900 dark:text-white font-bold">A</span>
            </div>
            <p className="text-[11px] text-slate-500">Điều chỉnh kích thước văn bản để dễ đọc hơn trên các thiết bị màn hình nhỏ.</p>
          </div>
        </div>

        {/* Language & Localization */}
        <div className="space-y-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white pb-2 flex items-center">
            <Globe className="w-4 h-4 mr-2" /> Ngôn ngữ & Định dạng
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup 
              label="Ngôn ngữ hiển thị" 
              id="language"
              helpText="Chọn ngôn ngữ giao diện ứng dụng"
            >
              <div className="relative">
                <select 
                  className="w-full pl-3 pr-8 py-2.5 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:border-indigo-500 cursor-pointer shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                >
                  <option value="vi-VN">🇻🇳 Tiếng Việt</option>
                  <option value="en-US">🇺🇸 English (US)</option>
                  <option value="ja-JP">🇯🇵 日本語</option>
                  <option value="ko-KR">🇰🇷 한국어</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </InputGroup>

            <InputGroup 
              label="Múi giờ" 
              id="timezone"
              helpText="Thời gian hiển thị theo múi giờ của bạn"
            >
              <div className="relative">
                <select 
                  className="w-full pl-3 pr-8 py-2.5 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:border-indigo-500 cursor-pointer shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                >
                  <option value="Asia/Ho_Chi_Minh">(GMT+7) Ho Chi Minh</option>
                  <option value="Asia/Bangkok">(GMT+7) Bangkok</option>
                  <option value="Asia/Tokyo">(GMT+9) Tokyo</option>
                  <option value="Asia/Seoul">(GMT+9) Seoul</option>
                  <option value="America/New_York">(GMT-5) New York</option>
                  <option value="Europe/London">(GMT+0) London</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </InputGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup 
              label="Định dạng ngày" 
              id="date_format"
            >
              <div className="relative">
                <select 
                  className="w-full pl-3 pr-8 py-2.5 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:border-indigo-500 cursor-pointer shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (03/02/2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (02/03/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (2026-02-03)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </InputGroup>

            <InputGroup 
              label="Định dạng thời gian" 
              id="time_format"
            >
              <div className="relative">
                <select 
                  className="w-full pl-3 pr-8 py-2.5 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:focus:border-indigo-500 cursor-pointer shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                >
                  <option value="24h">24 giờ (14:30)</option>
                  <option value="12h">12 giờ (2:30 PM)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </InputGroup>
          </div>
        </div>

        {/* Layout & Navigation */}
        <div className="space-y-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white pb-2 flex items-center">
            <Layout className="w-4 h-4 mr-2" /> Bố cục & Điều hướng
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup 
              label="Mật độ hiển thị" 
              id="density"
              helpText="Chọn 'Thu gọn' để xem nhiều nội dung hơn trên một màn hình."
            >
              <div className="relative">
                <div className="flex items-center space-x-4 h-[38px]">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="radio" name="density" className="accent-indigo-600 w-4 h-4" defaultChecked />
                    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">Thoải mái</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="radio" name="density" className="accent-indigo-600 w-4 h-4" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">Thu gọn</span>
                  </label>
                </div>
              </div>
            </InputGroup>

            <InputGroup 
              label="Thanh bên (Sidebar)" 
              id="sidebar_pref"
              helpText="Tự động ẩn thanh bên khi không sử dụng để mở rộng không gian làm việc."
            >
              <div className="flex items-center justify-between h-[38px]">
                <span className="text-sm text-slate-500">Tự động thu gọn</span>
                <Switch.Root className="w-[36px] h-[20px] bg-slate-300 dark:bg-slate-700 rounded-full relative data-[state=checked]:bg-indigo-600 outline-none cursor-pointer" defaultChecked={false}>
                  <Switch.Thumb className="block w-[16px] h-[16px] bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[18px]" />
                </Switch.Root>
              </div>
            </InputGroup>
          </div>
        </div>

        {/* Region & Formatting */}
        <div className="space-y-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white pb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2" /> Vùng & Định dạng
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputGroup 
              label="Ngôn ngữ" 
              id="language"
              helpText={<span>Ngôn ngữ hiển thị chính. <a href="#" className="text-indigo-600 hover:underline">Đóng góp bản dịch</a></span>}
            >
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer">
                  <option>Tiếng Việt (Vietnam)</option>
                  <option>English (US)</option>
                  <option>日本語 (Japan)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </InputGroup>

            <InputGroup label="Định dạng ngày" id="date_format">
              <div className="relative">
                <select className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer">
                  <option value="dd/mm/yyyy">DD/MM/YYYY (31/01/2024)</option>
                  <option value="mm/dd/yyyy">MM/DD/YYYY (01/31/2024)</option>
                  <option value="yyyy-mm-dd">YYYY-MM-DD (2024-01-31)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </InputGroup>

            <InputGroup label="Ngày bắt đầu tuần" id="start_week">
              <div className="relative">
                <select className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer">
                  <option value="monday">Thứ Hai</option>
                  <option value="sunday">Chủ Nhật</option>
                  <option value="saturday">Thứ Bảy</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </InputGroup>

            <InputGroup label="Định dạng giờ" id="time_format">
              <div className="relative">
                <div className="flex items-center space-x-4 h-[38px]">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="radio" name="time_fmt" className="accent-indigo-600 w-4 h-4" defaultChecked />
                    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">24 giờ</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="radio" name="time_fmt" className="accent-indigo-600 w-4 h-4" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">12 giờ (AM/PM)</span>
                  </label>
                </div>
              </div>
            </InputGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 3. Security Tab (Password & MFA)
 */
const SecuritySettings = () => {
  const [password, setPassword] = useState('');
  
  // Logic hiển thị độ mạnh mật khẩu
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 7) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const strengthColors = [
    'bg-slate-200 dark:bg-slate-700',
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-emerald-500'
  ];

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
      <SectionHeader title="Bảo mật tài khoản" description="Bảo vệ tài khoản của bạn với mật khẩu mạnh và xác thực 2 bước." />

      <div className="space-y-8">
        
        {/* Password Section */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center">
                <Lock className="w-4 h-4 mr-2 text-indigo-500" />
                Đổi mật khẩu
              </h3>
              <p className="text-xs text-slate-500 mt-1">Sử dụng mật khẩu mạnh để bảo vệ tài khoản.</p>
            </div>
            <button className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors">
              Quên mật khẩu?
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InputGroup label="Mật khẩu hiện tại" id="current_pass">
                <input type="password" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/50 focus:outline-none" placeholder="••••••••" />
              </InputGroup>
              <InputGroup label="Mật khẩu mới" id="new_pass">
                <input 
                  type="password" 
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/50 focus:outline-none" 
                  placeholder="Ít nhất 8 ký tự" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
              
              {/* UI Hiển thị độ mạnh mật khẩu */}
              {password && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                  <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    <span>Độ mạnh</span>
                    <span className={cn(
                      strength === 1 ? 'text-red-500' : 
                      strength === 2 ? 'text-orange-500' : 
                      strength === 3 ? 'text-yellow-500' : 'text-emerald-500'
                    )}>{strengthLabels[strength]}</span>
                  </div>
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex-1 rounded-full transition-all duration-300",
                          i <= strength ? strengthColors[strength] : 'bg-slate-200 dark:bg-slate-700'
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}

              <InputGroup label="Nhập lại mật khẩu" id="confirm_pass">
                <input type="password" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/50 focus:outline-none" placeholder="••••••••" />
              </InputGroup>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-xs space-y-3 h-fit border border-slate-100 dark:border-slate-700">
              <p className="font-medium text-slate-700 dark:text-slate-300">Yêu cầu mật khẩu:</p>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400">
                <li className={cn("flex items-center transition-colors", password.length > 7 ? "text-emerald-600 dark:text-emerald-400" : "")}>
                  <div className={cn("w-1.5 h-1.5 rounded-full mr-2", password.length > 7 ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600")}></div>
                  Ít nhất 8 ký tự
                </li>
                <li className={cn("flex items-center transition-colors", /[A-Z]/.test(password) ? "text-emerald-600 dark:text-emerald-400" : "")}>
                  <div className={cn("w-1.5 h-1.5 rounded-full mr-2", /[A-Z]/.test(password) ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600")}></div>
                  Bao gồm chữ hoa & thường
                </li>
                <li className={cn("flex items-center transition-colors", /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password) ? "text-emerald-600 dark:text-emerald-400" : "")}>
                  <div className={cn("w-1.5 h-1.5 rounded-full mr-2", /[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password) ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600")}></div>
                  Ít nhất 1 số hoặc ký tự đặc biệt
                </li>
              </ul>
              <button 
                disabled={strength < 3}
                className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cập nhật mật khẩu
              </button>
            </div>
          </div>
        </div>

        {/* 2FA Section - Enhanced with Helpers */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Xác thực 2 yếu tố (2FA)
          </h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-5 rounded-xl border border-emerald-100 bg-emerald-50/30 dark:border-emerald-900/30 dark:bg-emerald-900/10">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    Xác thực qua ứng dụng
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 font-bold">KHUYÊN DÙNG</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                    Sử dụng Google Authenticator hoặc Authy để tạo mã xác thực một lần. <a href="#" className="text-indigo-600 hover:underline">Hướng dẫn cài đặt</a>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Đã bật</span>
                <button className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border px-3 py-1.5 rounded-md bg-white dark:bg-slate-800">Cấu hình</button>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <SmartphoneNfc className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Tin nhắn văn bản (SMS)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                    Nhận mã xác thực qua số điện thoại +84 909 *** 456.
                  </p>
                </div>
              </div>
              <Switch.Root className="w-[42px] h-[25px] bg-slate-300 dark:bg-slate-700 rounded-full relative shadow-inner data-[state=checked]:bg-indigo-600 outline-none cursor-pointer">
                <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA7 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
              </Switch.Root>
            </div>

            <div className="flex items-center justify-between p-5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Mã dự phòng (Recovery Codes)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                    Sử dụng khi bạn mất điện thoại hoặc không thể truy cập ứng dụng xác thực.
                  </p>
                </div>
              </div>
              <button className="text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border px-3 py-1.5 rounded-md">Xem mã</button>
            </div>
          </div>
        </div>

        {/* Login Sessions - Enhanced */}
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Phiên đăng nhập</h3>
              <p className="text-xs text-slate-500 mt-1">Quản lý các thiết bị đang truy cập vào tài khoản của bạn.</p>
            </div>
            <button className="text-xs text-red-600 hover:text-red-700 font-medium">Đăng xuất tất cả thiết bị khác</button>
          </div>
          
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-100 dark:divide-slate-100/10">
            {/* Current Session */}
            <div className="flex items-center justify-between p-4 bg-indigo-50/30 dark:bg-indigo-900/10">
              <div className="flex items-center gap-4">
                <Monitor className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Chrome trên Windows</p>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded border border-emerald-200">HIỆN TẠI</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Ho Chi Minh City, VN • 113.161.72.12</p>
                </div>
              </div>
              <div className="text-xs text-slate-400">Đang hoạt động</div>
            </div>

            {/* Other Session 1 */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <Smartphone className="w-6 h-6 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Safari trên iPhone 14 Pro</p>
                  <p className="text-xs text-slate-500 mt-0.5">Hanoi, VN • 14.162.xx.xx • 2 giờ trước</p>
                </div>
              </div>
              <button className="text-xs font-medium text-red-600 hover:text-red-700 border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded transition-colors">
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 4. Notification Settings Tab (NEW)
 */
const NotificationSettings = () => {
  // Mock state for global toggles
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [dndEnabled, setDndEnabled] = useState(false);

  const notifCategories = [
    {
      id: 'tasks',
      title: 'Công việc & Dự án',
      items: [
        { id: 'assigned', label: 'Khi tôi được giao việc mới', email: true, push: true },
        { id: 'due_soon', label: 'Nhắc nhở sắp đến hạn (trước 24h)', email: true, push: true },
        { id: 'status_change', label: 'Trạng thái công việc thay đổi', email: false, push: true },
        { id: 'comment', label: 'Bình luận mới trong công việc của tôi', email: true, push: true },
      ]
    },
    {
      id: 'mentions',
      title: 'Đề cập & Thảo luận',
      items: [
        { id: 'mention_me', label: 'Khi ai đó nhắc đến tôi (@mention)', email: true, push: true },
        { id: 'reply', label: 'Phản hồi bình luận của tôi', email: true, push: true },
      ]
    },
    {
      id: 'system',
      title: 'Hệ thống',
      items: [
        { id: 'access', label: 'Yêu cầu quyền truy cập', email: true, push: false },
        { id: 'security', label: 'Cảnh báo bảo mật & Đăng nhập', email: true, push: true, required: true }, // Cannot disable
      ]
    }
  ];

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
      <SectionHeader title="Thông báo" description="Kiểm soát cách bạn nhận thông tin từ hệ thống." />
      
      <div className="space-y-8">
        {/* Global Controls */}
        <div className="space-y-4">
           <h3 className="text-sm font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">Kênh thông báo chính</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={cn("p-4 rounded-xl border transition-all", emailEnabled ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" : "bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-75")}>
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Mail className="w-5 h-5" />
                </div>
                <Switch.Root checked={emailEnabled} onCheckedChange={setEmailEnabled} className="w-[36px] h-[20px] bg-slate-300 dark:bg-slate-700 rounded-full relative data-[state=checked]:bg-indigo-600 outline-none cursor-pointer">
                  <Switch.Thumb className="block w-[16px] h-[16px] bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[18px]" />
                </Switch.Root>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Email</h4>
              <p className="text-xs text-slate-500 mt-1">Gửi về truc.nguyen@pronaflow.com</p>
            </div>

            <div className={cn("p-4 rounded-xl border transition-all", pushEnabled ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" : "bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-75")}>
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                  <Bell className="w-5 h-5" />
                </div>
                <Switch.Root checked={pushEnabled} onCheckedChange={setPushEnabled} className="w-[36px] h-[20px] bg-slate-300 dark:bg-slate-700 rounded-full relative data-[state=checked]:bg-indigo-600 outline-none cursor-pointer">
                  <Switch.Thumb className="block w-[16px] h-[16px] bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[18px]" />
                </Switch.Root>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Push & In-App</h4>
              <p className="text-xs text-slate-500 mt-1">Thông báo trên trình duyệt & App</p>
            </div>
          </div>
        </div>

        {/* Do Not Disturb */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
           <div className="flex items-center justify-between mb-4">
             <div>
               <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center">
                 <Moon className="w-4 h-4 mr-2 text-slate-500" /> Không làm phiền (Do Not Disturb)
               </h3>
               <p className="text-xs text-slate-500 mt-1">Tắt tất cả thông báo trong khung giờ đã chọn.</p>
             </div>
             <Switch.Root checked={dndEnabled} onCheckedChange={setDndEnabled} className="w-[36px] h-[20px] bg-slate-300 dark:bg-slate-700 rounded-full relative data-[state=checked]:bg-indigo-600 outline-none cursor-pointer">
                <Switch.Thumb className="block w-[16px] h-[16px] bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[18px]" />
             </Switch.Root>
           </div>
           
           {dndEnabled && (
             <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2 fade-in">
                <InputGroup label="Bắt đầu" id="dnd_start">
                  <input type="time" defaultValue="22:00" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                </InputGroup>
                <InputGroup label="Kết thúc" id="dnd_end">
                  <input type="time" defaultValue="08:00" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                </InputGroup>
             </div>
           )}
        </div>

        {/* Detailed Preferences */}
        {notifCategories.map((category) => (
          <div key={category.id} className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {category.title}
            </h3>
            <div className="space-y-1">
              {/* Header Row */}
              <div className="flex justify-end gap-8 px-2 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                <span className="w-8 text-center">Email</span>
                <span className="w-8 text-center">Push</span>
              </div>
              
              {category.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <span className="text-sm text-slate-700 dark:text-slate-300 pr-4">{item.label}</span>
                  <div className="flex items-center gap-8">
                    <div className="w-8 flex justify-center">
                      <input 
                        type="checkbox" 
                        defaultChecked={item.email} 
                        disabled={!emailEnabled || (item as any).required}
                        className="accent-indigo-600 w-4 h-4 rounded disabled:opacity-50 cursor-pointer" 
                      />
                    </div>
                    <div className="w-8 flex justify-center">
                      <input 
                        type="checkbox" 
                        defaultChecked={item.push} 
                        disabled={!pushEnabled || (item as any).required}
                        className="accent-indigo-600 w-4 h-4 rounded disabled:opacity-50 cursor-pointer" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Integrations */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-violet-900 flex items-center justify-center shrink-0 text-white">
                <Slack className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Slack</h4>
                <p className="text-xs text-slate-500 mt-0.5">Nhận thông báo quan trọng qua kênh Slack của bạn.</p>
              </div>
            </div>
            <button className="text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-md transition-colors">
              Kết nối
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN LAYOUT COMPONENT ---

export default function GeneralSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [searchParams, setSearchParams] = useSearchParams();

  // Navigation Items
  const navItems = [
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: User, category: 'Tài khoản' },
    { id: 'security', label: 'Bảo mật & Đăng nhập', icon: Lock, category: 'Tài khoản' },
    { id: 'preferences', label: 'Giao diện & Ứng dụng', icon: Palette, category: 'Tài khoản' },
    { id: 'notifications', label: 'Thông báo', icon: Bell, category: 'Tài khoản' },
    { id: 'accessibility', label: 'Khả năng tiếp cận', icon: Eye, category: 'Cá nhân hóa' },
    { id: 'dashboard', label: 'Tùy chỉnh Dashboard', icon: LayoutGrid, category: 'Cá nhân hóa' },
    { id: 'shortcuts', label: 'Phím tắt', icon: Keyboard, category: 'Cá nhân hóa' },
  ];

  useEffect(() => {
    const tabFromQuery = searchParams.get('tab');
    if (!tabFromQuery) return;

    const isValidTab = navItems.some((item) => item.id === tabFromQuery);
    if (isValidTab && tabFromQuery !== activeTab) {
      setActiveTab(tabFromQuery);
    }
  }, [searchParams, navItems, activeTab]);

  useEffect(() => {
    const current = searchParams.get('tab');
    if (current === activeTab) return;

    const next = new URLSearchParams(searchParams);
    next.set('tab', activeTab);
    setSearchParams(next, { replace: true });
  }, [activeTab, searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col h-screen overflow-hidden">
      {/* --- CUSTOM SCROLLBAR STYLES --- */}
      <style>
        {`
          /* Webkit browsers (Chrome, Safari, Edge) */
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: var(--color-neutral-300);
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: var(--color-neutral-400);
          }
          
          /* Dark mode specific */
          .dark ::-webkit-scrollbar-thumb {
            background: var(--color-neutral-700);
          }
          .dark ::-webkit-scrollbar-thumb:hover {
            background: var(--color-neutral-600);
          }

          /* Hide scrollbar for tab navigation on mobile but keep functionality */
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;  /* IE and Edge */
              scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col">
          
          {/* Header */}
          <div className="mb-8 shrink-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Cài đặt cá nhân</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý cài đặt tài khoản và tùy chọn ứng dụng.</p>
          </div>

          <Tabs.Root 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="flex flex-col md:flex-row gap-8 items-start h-full min-h-0" 
            orientation="vertical"
          >
            {/* Sticky Sidebar Navigation */}
            <Tabs.List className="w-full md:w-64 flex-shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide md:sticky md:top-0 h-full">
              <div className="flex-1">
                {/* Group: Tài khoản */}
                <div className="hidden md:block px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Tài khoản
                </div>
                {navItems.filter(i => i.category === 'Tài khoản').map((item) => {
                  const Icon = item.icon;
                  return (
                    <Tabs.Trigger 
                      key={item.id}
                      value={item.id}
                      className={cn(
                        "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all w-full text-left whitespace-nowrap md:whitespace-normal shrink-0",
                        activeTab === item.id 
                          ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-800 md:border-l-4 md:border-l-indigo-600 md:rounded-l-none" 
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 mr-3", activeTab === item.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")} />
                      {item.label}
                    </Tabs.Trigger>
                  )
                })}

                {/* Group: Cá nhân hóa */}
                <div className="hidden md:block px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mt-4">
                  Cá nhân hóa
                </div>
                {navItems.filter(i => i.category === 'Cá nhân hóa').map((item) => {
                  const Icon = item.icon;
                  return (
                    <Tabs.Trigger 
                      key={item.id}
                      value={item.id}
                      className={cn(
                        "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all w-full text-left whitespace-nowrap md:whitespace-normal shrink-0",
                        activeTab === item.id 
                          ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-800 md:border-l-4 md:border-l-indigo-600 md:rounded-l-none" 
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 mr-3", activeTab === item.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")} />
                      {item.label}
                    </Tabs.Trigger>
                  )
                })}
              </div>

              {/* Sidebar Footer Links */}
              <div className="hidden md:block mt-auto pt-6 px-3 border-t border-slate-100 dark:border-slate-800 pb-2 space-y-2">
                <a href={ROUTES.help.root} className="flex items-center text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium group">
                  <HelpCircle className="w-3.5 h-3.5 mr-2 group-hover:scale-110 transition-transform" />
                  Trung tâm trợ giúp
                  <ExternalLink className="w-2.5 h-2.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <div className="flex gap-2 text-[10px] text-slate-400 pt-1">
                  <a href={ROUTES.help.privacy} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors font-medium">Bảo mật</a>
                  <span>•</span>
                  <a href={ROUTES.help.terms} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors font-medium">Điều khoản</a>
                  <span>•</span>
                  <span className="text-slate-500 font-medium">v1.2.0</span>
                </div>
              </div>
            </Tabs.List>

            {/* Content Area - Scrollable */}
            <div className="flex-1 w-full bg-white dark:bg-slate-950 md:bg-transparent rounded-2xl md:rounded-none p-6 md:p-0 border md:border-0 border-slate-200 dark:border-slate-800 shadow-sm md:shadow-none h-full overflow-y-auto pr-1">
              <Tabs.Content value="profile" className="outline-none">
                <ProfileSettings />
              </Tabs.Content>
              
              <Tabs.Content value="security" className="outline-none">
                <SecuritySettings />
              </Tabs.Content>

              <Tabs.Content value="preferences" className="outline-none">
                <PreferenceSettings />
              </Tabs.Content>

              <Tabs.Content value="notifications" className="outline-none">
                <NotificationSettings />
              </Tabs.Content>

              <Tabs.Content value="accessibility" className="outline-none">
                <AccessibilityPanel userId="current-user" />
              </Tabs.Content>

              <Tabs.Content value="dashboard" className="outline-none">
                <DashboardCustomizer userId="current-user" />
              </Tabs.Content>

              <Tabs.Content value="shortcuts" className="outline-none">
                <div className="space-y-6">
                  <SectionHeader 
                    title="Phím tắt"
                    description="Xem và tùy chỉnh các phím tắt bàn phím"
                  />
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
                    <Keyboard className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                      Nhấn <kbd className="px-3 py-1 bg-white dark:bg-slate-800 rounded border border-blue-300 dark:border-blue-600 font-mono">?</kbd> để xem tất cả phím tắt
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Hoặc nhấn <kbd className="px-2 py-1 bg-white dark:bg-slate-800 rounded border border-blue-300 dark:border-blue-600 font-mono text-xs">Cmd/Ctrl + K</kbd> để mở bảng lệnh
                    </p>
                  </div>
                </div>
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
}