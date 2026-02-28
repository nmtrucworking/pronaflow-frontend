import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/paths';
import { 
  MessageCircle, Building2, Users, MapPin, 
  Phone, Mail, Facebook, Twitter, Linkedin, 
  Youtube, UploadCloud, ArrowRight, Zap, 
  Clock, CheckCircle2 
} from 'lucide-react';

/**
 * ContactPage Component
 * Hệ thống tiếp nhận yêu cầu và điều phối thông tin khách hàng.
 * Triển khai kiến trúc React Functional Component với cơ chế quản lý trạng thái biểu mẫu.
 */
const App: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    requestType: 'Hỗ trợ kỹ thuật',
    subject: '',
    content: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic xử lý gửi dữ liệu về API trung tâm
    console.log('Dữ liệu biểu mẫu đã được ghi nhận:', formData);
  };

  const contactOptions = [
    {
      id: 'tech-support',
      title: 'Hỗ trợ kỹ thuật',
      description: 'Giải quyết các vấn đề vận hành và xung đột hệ thống phát sinh.',
      email: 'support@pronaflow.com',
      icon: <MessageCircle className="w-8 h-8 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      id: 'enterprise-sales',
      title: 'Tư vấn doanh nghiệp',
      description: 'Thiết lập các giải pháp đặc thù và tích hợp hệ thống quy mô lớn.',
      email: 'enterprise@pronaflow.com',
      icon: <Building2 className="w-8 h-8 text-blue-600" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'partnership',
      title: 'Hợp tác chiến lược',
      description: 'Mở rộng hệ sinh thái và thiết lập các mối quan hệ đối tác bền vững.',
      email: 'partners@pronaflow.com',
      icon: <Users className="w-8 h-8 text-purple-600" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* PHẦN TIÊU ĐIỂM (HERO SECTION) */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-16 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3" />
            Cổng tiếp nhận thông tin
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Tối ưu hóa quy trình kết nối và hỗ trợ.
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto text-justify md:text-center">
            Hệ thống PronaFlow thiết lập các kênh tương tác chuyên biệt nhằm đảm bảo mọi yêu cầu về kỹ thuật và nghiệp vụ đều được phân loại và xử lý theo đúng quy trình chuẩn hóa.
          </p>
        </div>
      </div>

      {/* CÁC KÊNH LIÊN HỆ CHUYÊN BIỆT (CONTACT OPTIONS) */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 mb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {contactOptions.map((option) => (
            <div key={option.id} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all group">
              <div className={`w-16 h-16 ${option.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {option.icon}
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl mb-3">{option.title}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed italic">{option.description}</p>
              <a 
                href={`mailto:${option.email}`} 
                className={`inline-flex items-center gap-2 ${option.textColor} font-bold text-sm group-hover:gap-3 transition-all`}
              >
                {option.email}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* KHỐI XỬ LÝ BIỂU MẪU VÀ THÔNG TIN PHÁP NHÂN */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-20">
          
          {/* BIỂU MẪU TIẾP NHẬN YÊU CẦU */}
          <div className="bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-200">
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500" />
              Gửi yêu cầu trực tuyến
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Họ và tên</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white text-sm font-medium" 
                    placeholder="Nhập tên đầy đủ..." 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Địa chỉ Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white text-sm font-medium" 
                    placeholder="email@example.com" 
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Phân loại nghiệp vụ</label>
                <select 
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white text-sm font-bold"
                >
                  <option>Hỗ trợ kỹ thuật vận hành</option>
                  <option>Tư vấn tích hợp giải pháp</option>
                  <option>Báo cáo lỗ hổng (Bug Report)</option>
                  <option>Đề xuất tính năng mới</option>
                  <option>Hợp tác kinh doanh quốc tế</option>
                  <option>Yêu cầu khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tiêu đề yêu cầu</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white text-sm font-medium" 
                  placeholder="Tóm tắt nội dung vấn đề..." 
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nội dung chi tiết</label>
                <textarea 
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={5} 
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white text-sm font-medium resize-none leading-relaxed" 
                  placeholder="Vui lòng cung cấp các thông số và mô tả chi tiết để đội ngũ hỗ trợ có căn cứ xử lý..."
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tệp đính kèm (Log/Screenshot)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer group">
                  <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3 group-hover:text-emerald-500 transition-colors" />
                  <p className="text-sm text-slate-500 font-medium">Tải lên tài liệu minh họa</p>
                  <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-tighter">Định dạng hỗ trợ: PNG, JPG, PDF (Tối đa 10MB)</p>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
              >
                Gửi xác nhận yêu cầu
              </button>
            </form>
          </div>

          {/* THÔNG TIN PHÁP NHÂN VÀ MẠNG XÃ HỘI */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-10">Cơ cấu tổ chức & Liên hệ</h2>
              
              <div className="space-y-10">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-slate-600 shadow-sm">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 uppercase text-xs tracking-widest mb-1">Trụ sở chính</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">Tầng 15, Tòa nhà ABC Tower<br />Quận 1, TP. Hồ Chí Minh, Việt Nam</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-slate-600 shadow-sm">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 uppercase text-xs tracking-widest mb-1">Tổng đài hỗ trợ</h4>
                    <p className="text-slate-600 text-sm font-bold">+84 28 1234 5678</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-black uppercase">
                      <Clock className="w-3 h-3" />
                      Giờ làm việc: 09:00 - 18:00 (Thứ 2 - Thứ 6)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-slate-600 shadow-sm">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 uppercase text-xs tracking-widest mb-1">Kênh thông tin chung</h4>
                    <p className="text-slate-600 text-sm font-medium italic underline">hello@pronaflow.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-16">
                <h3 className="font-extrabold text-slate-900 uppercase text-xs tracking-widest mb-6">Mạng lưới truyền thông</h3>
                <div className="flex gap-4">
                  {[Facebook, Twitter, Linkedin, Youtube].map((Icon, idx) => (
                    <button key={idx} className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* TRUNG TÂM HỖ TRỢ (FAQ CTA) */}
            <div className="mt-16 p-8 bg-emerald-900 text-white rounded-3xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Users className="w-24 h-24" />
              </div>
              <h4 className="font-bold text-lg mb-3">Tra cứu giải pháp tức thời?</h4>
              <p className="text-emerald-100/70 text-sm mb-6 leading-relaxed text-justify">
                Hệ thống Cơ sở kiến thức (Knowledge Base) của chúng tôi chứa hàng nghìn tài liệu kỹ thuật và hướng dẫn vận hành chi tiết giúp quý khách tự xử lý các vấn đề phổ biến.
              </p>
              <Link to={ROUTES.help.root} className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-900/50">
                Truy cập Help Center
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER ĐƠN GIẢN */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} PronaFlow Operational Intelligence. Mọi dữ liệu liên hệ được bảo vệ theo chính sách bảo mật hiện hành.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default App;