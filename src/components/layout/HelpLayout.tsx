import { Outlet, Link } from 'react-router-dom';
import { ROUTES } from '@/routes/paths';

export const HelpLayout = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to={ROUTES.root} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center shadow-sm">
              P
            </div>
            <div className="leading-tight">
              <div className="text-sm font-black tracking-tight">PronaFlow Help</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Support Center</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link to={ROUTES.help.root} className="hover:text-emerald-600 transition-colors">Tổng quan</Link>
            <Link to={ROUTES.help.status} className="hover:text-emerald-600 transition-colors">Trạng thái</Link>
            <Link to={ROUTES.help.api} className="hover:text-emerald-600 transition-colors">API</Link>
            <Link to={ROUTES.help.changelog} className="hover:text-emerald-600 transition-colors">Changelog</Link>
            <Link to={ROUTES.help.contact} className="hover:text-emerald-600 transition-colors">Liên hệ</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to={ROUTES.auth.login} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Đăng nhập</Link>
            <Link to={ROUTES.auth.register} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-500 transition-colors">
              Dùng thử miễn phí
            </Link>
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center">
                P
              </div>
              <div>
                <div className="font-black">PronaFlow</div>
                <div className="text-xs text-slate-400 uppercase tracking-[0.2em] font-bold">Help Center</div>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Trung tâm hỗ trợ dành cho đội ngũ vận hành, kỹ thuật và quản trị dự án.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Tài liệu</div>
            <ul className="space-y-2 text-slate-600">
              <li><Link to={ROUTES.help.root} className="hover:text-emerald-600">Tổng quan</Link></li>
              <li><Link to={ROUTES.help.api} className="hover:text-emerald-600">API Docs</Link></li>
              <li><Link to={ROUTES.help.changelog} className="hover:text-emerald-600">Changelog</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Hỗ trợ</div>
            <ul className="space-y-2 text-slate-600">
              <li><Link to={ROUTES.help.status} className="hover:text-emerald-600">Trạng thái hệ thống</Link></li>
              <li><Link to={ROUTES.help.contact} className="hover:text-emerald-600">Liên hệ</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Pháp lý</div>
            <ul className="space-y-2 text-slate-600">
              <li><Link to={ROUTES.help.terms} className="hover:text-emerald-600">Điều khoản</Link></li>
              <li><Link to={ROUTES.help.privacy} className="hover:text-emerald-600">Chính sách riêng tư</Link></li>
              <li><Link to={ROUTES.help.legal} className="hover:text-emerald-600">Pháp lý</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            &copy; {new Date().getFullYear()} PronaFlow Operational Intelligence. Toàn bộ nội dung được bảo hộ theo chính sách dữ liệu.
          </div>
        </div>
      </footer>
    </div>
  );
};
