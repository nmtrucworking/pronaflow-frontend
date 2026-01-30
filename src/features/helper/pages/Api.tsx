import React, { useState } from 'react';
import { 
  Code, Terminal, Layers, Folder, CheckSquare, 
  Webhook, Github, Mail, ChevronDown, ChevronRight, 
  Copy, Zap, BookOpen, Cpu
} from 'lucide-react';

/**
 * Interface định nghĩa cấu trúc cho một nhóm API Endpoint
 */
interface EndpointGroup {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  methods: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    description: string;
  }[];
}

const App: React.FC = () => {
  const [openGroups, setOpenGroups] = useState<string[]>(['workspaces']);

  const toggleGroup = (id: string) => {
    setOpenGroups(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const endpointGroups: EndpointGroup[] = [
    {
      id: 'workspaces',
      title: 'Không gian làm việc (Workspaces)',
      description: 'Quản lý cấu trúc tổ chức và các thiết lập không gian làm việc.',
      icon: <Layers className="w-5 h-5" />,
      color: 'text-purple-600',
      methods: [
        { method: 'GET', path: '/v1/workspaces', description: 'Truy xuất danh sách tất cả workspaces.' },
        { method: 'POST', path: '/v1/workspaces', description: 'Khởi tạo không gian làm việc mới.' },
        { method: 'GET', path: '/v1/workspaces/:id', description: 'Lấy thông tin chi tiết của một workspace cụ thể.' }
      ]
    },
    {
      id: 'projects',
      title: 'Dự án (Projects)',
      description: 'Thực hiện các thao tác quản trị vòng đời dự án.',
      icon: <Folder className="w-5 h-5" />,
      color: 'text-blue-600',
      methods: [
        { method: 'GET', path: '/v1/projects', description: 'Liệt kê danh sách dự án thuộc quyền sở hữu.' },
        { method: 'POST', path: '/v1/projects', description: 'Tạo dự án mới trong không gian làm việc.' },
        { method: 'PUT', path: '/v1/projects/:id', description: 'Cập nhật thuộc tính của dự án.' },
        { method: 'DELETE', path: '/v1/projects/:id', description: 'Tiêu hủy dự án khỏi hệ thống.' }
      ]
    },
    {
      id: 'tasks',
      title: 'Tác vụ (Tasks)',
      description: 'Điều phối và quản lý trạng thái các đơn vị công việc.',
      icon: <CheckSquare className="w-5 h-5" />,
      color: 'text-emerald-600',
      methods: [
        { method: 'GET', path: '/v1/tasks', description: 'Truy vấn danh sách tác vụ theo bộ lọc.' },
        { method: 'POST', path: '/v1/tasks', description: 'Khởi tạo tác vụ mới.' },
        { method: 'PATCH', path: '/v1/tasks/:id/status', description: 'Cập nhật trạng thái xử lý của tác vụ.' }
      ]
    },
    {
      id: 'webhooks',
      title: 'Webhooks',
      description: 'Cấu hình thông báo sự kiện theo thời gian thực.',
      icon: <Webhook className="w-5 h-5" />,
      color: 'text-orange-600',
      methods: [
        { method: 'GET', path: '/v1/webhooks', description: 'Danh sách các endpoint nhận tin.' },
        { method: 'POST', path: '/v1/webhooks', description: 'Đăng ký endpoint nhận thông báo sự kiện.' }
      ]
    }
  ];

  const sdks = [
    { name: 'JavaScript/Node.js', cmd: 'npm install pronaflow', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'Python', cmd: 'pip install pronaflow', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'C# / .NET', cmd: 'dotnet add package PronaFlow', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
    { name: 'PHP', cmd: 'composer require pronaflow', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      
      {/* PHẦN ĐẦU TRANG (HERO SECTION) */}
      <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 mb-8 uppercase tracking-widest">
                <Code className="w-3.5 h-3.5" /> 
                Developer API Ecosystem
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">PronaFlow REST API</h1>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed text-justify">
                Tối ưu hóa khả năng mở rộng hệ thống bằng cách tích hợp trực tiếp vào hạ tầng của PronaFlow. Giao thức REST API của chúng tôi cung cấp quyền truy cập toàn diện vào các thực thể dữ liệu và tiến trình nghiệp vụ một cách an toàn và chuẩn xác.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> Bắt đầu tích hợp
                </button>
                <button className="px-8 py-3.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all border border-slate-700 active:scale-95">
                  Tài liệu tham chiếu
                </button>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 font-mono text-sm border border-slate-700 shadow-2xl relative group">
                <div className="absolute top-4 right-4 text-slate-500 hover:text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <Copy className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="ml-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Terminal Output</span>
                </div>
                <pre className="text-slate-300 leading-relaxed overflow-x-auto">
                  <code>
                    <span className="text-blue-400">curl</span> -X GET \<br />
                    &nbsp;&nbsp;<span className="text-emerald-400">"https://api.pronaflow.com/v1/projects"</span> \<br />
                    &nbsp;&nbsp;-H <span className="text-amber-400">"Authorization: Bearer YOUR_API_KEY"</span> \<br />
                    &nbsp;&nbsp;-H <span className="text-amber-400">"Content-Type: application/json"</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
        {/* Đồ họa nền */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/5 to-transparent pointer-events-none"></div>
      </div>

      {/* HƯỚNG DẪN TRIỂN KHAI NHANH (QUICK START) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-12 flex items-center gap-3">
            <Zap className="text-amber-500" /> Quy trình tích hợp cơ bản
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: 1, 
                title: 'Khởi tạo API Key', 
                desc: 'Truy cập bảng điều khiển quản trị viên để khởi tạo mã khóa xác thực bảo mật cho ứng dụng.',
                link: 'Hướng dẫn cấu hình bảo mật'
              },
              { 
                step: 2, 
                title: 'Thực thi yêu cầu đầu tiên', 
                desc: 'Sử dụng mã khóa đã cấp để thực hiện yêu cầu truy vấn danh sách dự án hiện hành.',
                link: 'Xem mã nguồn mẫu'
              },
              { 
                step: 3, 
                title: 'Tối ưu hóa tích hợp', 
                desc: 'Triển khai hệ thống Webhooks để đồng bộ hóa trạng thái dữ liệu theo thời gian thực.',
                link: 'Tài liệu Webhooks'
              }
            ].map((item) => (
              <div key={item.step} className="bg-slate-50 rounded-2xl border border-slate-100 p-8 hover:shadow-xl hover:bg-white transition-all group">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6 font-black text-xl shadow-lg shadow-blue-200">
                  {item.step}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed italic">{item.desc}</p>
                <button className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1 group-hover:gap-2 transition-all">
                  {item.link} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DANH MỤC CÁC ĐIỂM CUỐI (API ENDPOINTS) */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">API Reference</h2>
            <p className="text-slate-500">Mô tả chi tiết các phương thức và tài nguyên hệ thống khả dụng.</p>
          </div>

          <div className="space-y-6">
            {endpointGroups.map((group) => (
              <div key={group.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
                <button 
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                  onClick={() => toggleGroup(group.id)}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center ${group.color}`}>
                      {group.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{group.title}</h3>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{group.description}</p>
                    </div>
                  </div>
                  <div className={`text-slate-400 transition-transform duration-300 ${openGroups.includes(group.id) ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {openGroups.includes(group.id) && (
                  <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-4">
                    {group.methods.map((m, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm font-mono text-sm">
                        <div className="flex items-center gap-3 flex-grow">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            m.method === 'GET' ? 'bg-emerald-100 text-emerald-700' :
                            m.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                            m.method === 'PUT' ? 'bg-amber-100 text-amber-700' :
                            m.method === 'PATCH' ? 'bg-indigo-100 text-indigo-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {m.method}
                          </span>
                          <code className="text-slate-800 font-bold">{m.path}</code>
                        </div>
                        <span className="text-slate-400 text-xs italic sm:text-right">{m.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THƯ VIỆN PHÁT TRIỂN (SDKs) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-12 flex items-center gap-3">
            <Cpu className="text-blue-500" /> Thư viện hỗ trợ lập trình (SDKs)
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sdks.map((sdk) => (
              <div key={sdk.name} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl transition-all group cursor-pointer">
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <img src={sdk.img} className="w-7 h-7" alt={sdk.name} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{sdk.name}</h3>
                <div className="bg-slate-900 p-3 rounded-lg mt-4 group-hover:bg-slate-800 transition-colors">
                  <code className="text-blue-400 text-[10px] font-mono leading-none">{sdk.cmd}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIÊN HỆ HỖ TRỢ KỸ THUẬT (CTA) */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-black text-white mb-6 tracking-tight uppercase">Yêu cầu hỗ trợ kỹ thuật chuyên sâu?</h2>
          <p className="text-slate-400 mb-10 text-lg leading-relaxed">
            Đội ngũ chuyên gia kỹ thuật của PronaFlow luôn sẵn sàng hỗ trợ quý khách trong quá trình triển khai các giải pháp tích hợp phức tạp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" /> Liên hệ Developer Support
            </button>
            <button className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all border border-slate-700 flex items-center justify-center gap-2 active:scale-95">
              <Github className="w-5 h-5" /> Mã nguồn mở (GitHub)
            </button>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} PronaFlow Operational Technology. Tài liệu được bảo mật và cập nhật định kỳ.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default App;