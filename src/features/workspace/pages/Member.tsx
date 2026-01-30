import React, { useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Popover from '@radix-ui/react-popover';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Shield, 
  Mail, 
  MessageSquare, 
  Trash2, 
  X, 
  Check,
  Circle,
  MapPin,
  Phone,
  Briefcase,
  History,
  ChevronLeft,
  ChevronRight,
  Settings2,
  ArrowUpDown,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
  UserCheck,
  Clock,
  AlertCircle,
  UserMinus,
  ChevronDown,
  Activity,
  CheckCircle2,
  Info
} from 'lucide-react';

/**
 * PRONAFLOW MEMBER HUB v2.4 - REFINED EDITION
 * - Radius Optimization: rounded-xl/lg only.
 * - Toolbar: Combined Search & Filter.
 * - Interaction: Double-click row for Profile.
 * - Features: Advanced Stats Popover & Invite Modal.
 */

interface Member {
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  project_role: 'Owner' | 'Manager' | 'Editor' | 'Viewer';
  workspace_role: 'Admin' | 'Member' | 'Guest';
  status: 'online' | 'away' | 'dnd' | 'offline';
  joined_at: string;
  last_active: string;
  bio?: string;
  phone?: string;
  location?: string;
}

interface PendingRequest {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  requested_at: string;
}

const STATUS_CONFIG = {
  online: { color: 'bg-emerald-500', label: 'Trực tuyến' },
  away: { color: 'bg-amber-500', label: 'Vắng mặt' },
  dnd: { color: 'bg-red-500', label: 'Bận' },
  offline: { color: 'bg-slate-300', label: 'Ngoại tuyến' },
};

const ROLE_THEME = {
  Owner: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30',
  Manager: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30',
  Editor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30',
  Viewer: 'text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700',
};

const MemberHubPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Member; direction: 'asc' | 'desc' }>({
    key: 'full_name',
    direction: 'asc',
  });

  // Mock Data
  const rawMembers: Member[] = useMemo(() => [
    {
      user_id: 'U-001',
      full_name: 'Trần Thế Tường',
      email: 'tuong.tt@pronaflow.com',
      avatar_url: 'https://i.pravatar.cc/150?u=u001',
      project_role: 'Owner',
      workspace_role: 'Admin',
      status: 'online',
      joined_at: '2024-01-15',
      last_active: 'Vừa xong',
      bio: 'Lead Architect & Product Designer. Đam mê xây dựng các hệ thống tối ưu trải nghiệm người dùng.',
      phone: '+84 987 654 321',
      location: 'TP. Hồ Chí Minh, VN'
    },
    {
      user_id: 'U-002',
      full_name: 'Lê Minh Hạnh',
      email: 'hanh.lm@pronaflow.com',
      avatar_url: 'https://i.pravatar.cc/150?u=u002',
      project_role: 'Manager',
      workspace_role: 'Member',
      status: 'away',
      joined_at: '2024-02-10',
      last_active: '15 phút trước',
      bio: 'Project Manager với 5 năm kinh nghiệm quản lý dự án Agile/Scrum.',
      phone: '+84 912 345 678',
      location: 'Hà Nội, VN'
    },
    ...Array.from({ length: 22 }, (_, i) => ({
      user_id: `U-0${i+3}`,
      full_name: `Nhân sự cấp cao ${i+3}`,
      email: `member${i+3}@pronaflow.com`,
      avatar_url: `https://i.pravatar.cc/150?u=u${i+3}`,
      project_role: (i % 4 === 0 ? 'Editor' : 'Viewer') as any,
      workspace_role: 'Member' as any,
      status: (i % 3 === 0 ? 'online' : i % 3 === 1 ? 'offline' : 'away') as any,
      joined_at: '2024-07-01',
      last_active: 'Hôm qua'
    }))
  ], []);

  const pendingRequests: PendingRequest[] = useMemo(() => [
    { id: 'R-01', full_name: 'Phạm Minh Đức', email: 'duc.pm@gmail.com', avatar_url: 'https://i.pravatar.cc/150?u=r01', requested_at: '2 giờ trước' },
    { id: 'R-02', full_name: 'Vũ Thu Trang', email: 'trang.vt@outlook.com', avatar_url: 'https://i.pravatar.cc/150?u=r02', requested_at: 'Hôm qua' },
  ], []);

  // Filtering & Sorting
  const processedMembers = useMemo(() => {
    let result = rawMembers.filter(m => {
      const matchSearch = m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || m.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'all' || m.project_role === roleFilter;
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });

    result.sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [rawMembers, searchQuery, roleFilter, statusFilter, sortConfig]);

  const pagedMembers = processedMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(processedMembers.length / pageSize);

  const handleSort = (key: keyof Member) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans select-none transition-all duration-300">
      
      {/* 1. Global Header & Toolbar */}
      <header className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 z-40 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-700">
          <div className="bg-slate-900 dark:bg-white p-2.5 rounded-xl text-white dark:text-slate-900">
            <Users size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">Thành viên</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">Collaboration Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right duration-700">
          {/* Combined Search & Filter Group */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Tìm nhân sự..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-transparent border-none text-sm font-semibold focus:ring-0 w-56 outline-none transition-all"
              />
            </div>
            
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-600 mx-1" />

            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all relative">
                  <Filter size={14} /> 
                  Lọc
                  {(roleFilter !== 'all' || statusFilter !== 'all') && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content sideOffset={12} align="end" className="w-80 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95 duration-200 outline-none">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Phân loại Vai trò</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['all', 'Owner', 'Manager', 'Editor', 'Viewer'].map(r => (
                          <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase border transition-all ${roleFilter === r ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:bg-slate-100'}`}>
                            {r === 'all' ? 'Mọi vai trò' : r}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Trạng thái kết nối</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['all', 'online', 'offline', 'away'].map(s => (
                          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase border transition-all ${statusFilter === s ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-transparent hover:bg-slate-100'}`}>
                            {s === 'all' ? 'Mọi trạng thái' : s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                      <button onClick={() => {setRoleFilter('all'); setStatusFilter('all');}} className="text-[10px] font-black text-slate-400 uppercase hover:text-blue-600 transition-colors">Đặt lại</button>
                      <Popover.Close className="text-[10px] font-black text-blue-600 uppercase hover:underline underline-offset-4">Áp dụng</Popover.Close>
                    </div>
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>

          <Dialog.Root open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <Dialog.Trigger asChild>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                <UserPlus size={18} strokeWidth={3} /> Mời mới
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 rounded-xl p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] z-[101] border border-white/10 animate-in zoom-in-95 duration-400 outline-none">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">Thêm đồng đội</h2>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed italic">Chia sẻ quyền truy cập dự án qua địa chỉ email công việc.</p>
                  </div>
                  <Dialog.Close className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:rotate-90">
                    <X size={18} />
                  </Dialog.Close>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ Email</label>
                      <input type="email" placeholder="example@pronaflow.com" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl outline-none font-bold text-sm transition-all" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gán vai trò dự án</label>
                      <div className="space-y-2">
                         {['Manager', 'Editor', 'Viewer'].map(role => (
                           <button key={role} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all text-left flex items-center justify-between group">
                              {role}
                              <CheckCircle2 size={14} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                           </button>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="mt-10 flex gap-3">
                   <button className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black shadow-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest">Gửi lời mời ngay</button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>

      {/* 2. Main Content (Scrollable internally) */}
      <main className="flex-1 overflow-hidden flex flex-col p-6 gap-6">
        
        {/* Statistics Tiles with Visual Impact */}
        <div className="grid grid-cols-4 gap-6 shrink-0">
           <StatTile 
            label="Thành viên" 
            value={rawMembers.length} 
            icon={Users} 
            color="blue" 
            details={rawMembers.slice(0, 4)} 
           />
           <StatTile 
            label="Hoạt động" 
            value={rawMembers.filter(m => m.status === 'online').length} 
            icon={Activity} 
            color="emerald" 
            pulse
            details={rawMembers.filter(m => m.status === 'online').slice(0, 4)}
           />
           <StatTile 
            label="Quản trị" 
            value={rawMembers.filter(m => m.project_role === 'Owner' || m.project_role === 'Manager').length} 
            icon={Shield} 
            color="purple" 
            details={rawMembers.filter(m => m.project_role === 'Owner')}
           />
           <StatTile 
            label="Yêu cầu chờ" 
            value={pendingRequests.length.toString().padStart(2, '0')} 
            icon={Clock} 
            color="amber" 
            isPending
            pendingData={pendingRequests}
           />
        </div>

        {/* Data Grid Section */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* Table Header with Sorting */}
          <div className="grid grid-cols-12 px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
             <div className="col-span-5 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('full_name')}>
                Hồ sơ nhân sự <SortIcon active={sortConfig.key === 'full_name'} dir={sortConfig.direction} />
             </div>
             <div className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('project_role')}>
                Vai trò <SortIcon active={sortConfig.key === 'project_role'} dir={sortConfig.direction} />
             </div>
             <div className="col-span-2 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('status')}>
                Trạng thái <SortIcon active={sortConfig.key === 'status'} dir={sortConfig.direction} />
             </div>
             <div className="col-span-2">Tham gia</div>
             <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Table Body - Custom Scrollbar */}
          <div className="flex-1 overflow-y-auto custom-scrollbar-y overflow-x-hidden">
            {pagedMembers.length > 0 ? (
              pagedMembers.map((member, idx) => (
                <div 
                  key={member.user_id} 
                  onDoubleClick={() => setSelectedMember(member)}
                  className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/30 border-b border-slate-50 dark:border-slate-800 last:border-0 group cursor-default transition-all duration-300 animate-in fade-in slide-in-from-left duration-500"
                  style={{ animationDelay: `${idx * 20}ms` }}
                >
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="relative shrink-0 overflow-hidden rounded-lg">
                       <img src={member.avatar_url} className="w-10 h-10 object-cover ring-1 ring-slate-100 dark:ring-slate-800 group-hover:scale-110 transition-transform duration-500" alt="avatar" />
                       <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${STATUS_CONFIG[member.status].color}`} />
                    </div>
                    <div className="flex flex-col overflow-hidden pr-4">
                       <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors truncate">{member.full_name}</span>
                       <span className="text-[11px] font-medium text-slate-400 truncate italic tracking-tight">{member.email}</span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border tracking-tighter ${ROLE_THEME[member.project_role]}`}>
                       {member.project_role}
                    </span>
                  </div>

                  <div className="col-span-2 flex flex-col">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{STATUS_CONFIG[member.status].label}</span>
                    <span className="text-[9px] font-medium text-slate-400 tracking-tighter uppercase">{member.last_active}</span>
                  </div>

                  <div className="col-span-2 text-xs font-bold text-slate-500">
                    {member.joined_at}
                  </div>

                  <div className="col-span-1 text-right">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 group-hover:opacity-100 opacity-0 active:scale-90">
                          <MoreHorizontal size={18} />
                        </button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content className="w-48 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-2xl border border-slate-100 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95 duration-200 outline-none">
                          <DropdownMenuItem icon={UserCheck} label="Xem thông tin" onClick={() => setSelectedMember(member)} />
                          <DropdownMenuItem icon={Mail} label="Gửi email" />
                          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-1" />
                          <DropdownMenuItem icon={UserMinus} label="Loại khỏi dự án" color="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" />
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-32 opacity-30 grayscale">
                 <AlertCircle size={64} strokeWidth={1} className="mb-4" />
                 <p className="text-sm font-black uppercase tracking-[0.2em]">Không tìm thấy kết quả</p>
              </div>
            )}
          </div>

          {/* Table Footer / Pagination */}
          <footer className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 flex items-center justify-between shrink-0">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Trang {currentPage} / {totalPages} (Tổng {processedMembers.length})
             </div>
             <div className="flex items-center gap-1.5">
                <PaginationBtn icon={ChevronLeft} onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} />
                <div className="flex items-center gap-1">
                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${p === currentPage ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg' : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200'}`}>
                        {p}
                      </button>
                   ))}
                </div>
                <PaginationBtn icon={ChevronRight} onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} />
             </div>
          </footer>
        </div>
      </main>

      {/* 3. Member Profile Modal (Settings-like content) */}
      <Dialog.Root open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[100] animate-in fade-in duration-500" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] z-[101] border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300 outline-none">
            {selectedMember && (
              <div className="flex flex-col h-[650px]">
                {/* Decorative Header */}
                <div className="h-28 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-800 dark:to-black relative shrink-0">
                  <Dialog.Close className="absolute right-4 top-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-md">
                    <X size={18} strokeWidth={2.5} />
                  </Dialog.Close>
                </div>
                
                <div className="px-10 -mt-10 flex-1 overflow-y-auto custom-scrollbar-y pb-10">
                  <div className="flex items-end gap-6 mb-10">
                    <div className="relative">
                      <img src={selectedMember.avatar_url} className="w-28 h-28 rounded-xl object-cover border-4 border-white dark:border-slate-900 shadow-2xl transition-transform hover:scale-105 duration-500" alt="avatar" />
                      <div className={`absolute bottom-1 right-1 w-7 h-7 rounded-full border-4 border-white dark:border-slate-900 ${STATUS_CONFIG[selectedMember.status].color}`} />
                    </div>
                    <div className="flex-1 pb-1">
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{selectedMember.full_name}</h2>
                      <p className="text-blue-600 font-bold text-xs mt-2 uppercase tracking-[0.2em] opacity-80">{selectedMember.email}</p>
                    </div>
                  </div>

                  {/* Profile Fields - Settings Style */}
                  <div className="grid grid-cols-2 gap-4 mb-10">
                    <ProfileField icon={Shield} label="Vai trò dự án" value={selectedMember.project_role} highlight />
                    <ProfileField icon={Briefcase} label="Workspace Role" value={selectedMember.workspace_role} />
                    <ProfileField icon={MapPin} label="Địa điểm" value={selectedMember.location || 'Chưa cập nhật'} />
                    <ProfileField icon={History} label="Gia nhập" value={selectedMember.joined_at} />
                  </div>

                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <section>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Info size={12} className="text-blue-500" /> Giới thiệu (Bio)
                      </h4>
                      <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800 italic">
                        "{selectedMember.bio || "Thành viên này rất kín tiếng, họ chưa cập nhật tiểu sử bản thân."}"
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Dòng thời gian hoạt động</h4>
                      <div className="space-y-6 border-l-2 border-slate-100 dark:border-slate-800 ml-2 pl-6">
                         <ActivityItem text="Đã hoàn thành 05 Task trong tuần này" time="Hôm nay" />
                         <ActivityItem text="Đã tham gia nhóm 'PronaFlow UI Design'" time="2 ngày trước" />
                         <ActivityItem text="Chỉnh sửa tài liệu 'Kiến trúc hệ thống'" time="Tuần trước" />
                      </div>
                    </section>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-10 py-6 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-800/30 flex gap-4">
                   <button className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black shadow-2xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest">Gửi lời nhắn</button>
                   <button className="px-5 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all active:scale-90 shadow-sm">
                      <Settings2 size={20} strokeWidth={2.5} />
                   </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Global CSS Overrides */}
      <style>{`
        .custom-scrollbar-y::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-y::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-y::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar-y::-webkit-scrollbar-thumb { background: #334155; }
        .custom-scrollbar-y::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

/** * INTERNAL COMPONENTS */

const StatTile: React.FC<{ label: string, value: any, icon: any, color: string, pulse?: boolean, details?: Member[], isPending?: boolean, pendingData?: PendingRequest[] }> = ({ label, value, icon: Icon, color, pulse, details, isPending, pendingData }) => (
  <Popover.Root>
    <Popover.Trigger asChild>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 group overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 transition-colors" />
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-[0.15em]">{label}</p>
          <div className="flex items-center gap-3">
             <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{value}</p>
             <div className="h-4 w-[2px] bg-slate-100 dark:bg-slate-800" />
             <Activity size={14} className="text-slate-300" />
          </div>
        </div>
        <div className={`p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm ${pulse ? 'animate-pulse' : ''}`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content sideOffset={12} className="w-80 bg-white dark:bg-slate-900 rounded-xl p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95 duration-300 outline-none">
        <div className="flex items-center justify-between mb-4">
           <h5 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{isPending ? 'Phê duyệt gia nhập' : label}</h5>
           <span className="text-[10px] font-bold text-slate-400">Xem tất cả</span>
        </div>
        
        <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar-y pr-2">
           {isPending ? (
             pendingData?.map(req => (
               <div key={req.id} className="flex items-center gap-3 group/item">
                  <img src={req.avatar_url} className="w-9 h-9 rounded-lg object-cover shadow-sm ring-1 ring-slate-100 dark:ring-slate-800" alt="av" />
                  <div className="flex-1 min-w-0">
                     <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate leading-tight">{req.full_name}</p>
                     <p className="text-[10px] font-medium text-slate-400 truncate tracking-tight uppercase italic">{req.requested_at}</p>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover/item:opacity-100 transition-all translate-x-2 group-hover/item:translate-x-0">
                     <button className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Check size={14} /></button>
                     <button className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"><X size={14} /></button>
                  </div>
               </div>
             ))
           ) : (
             details?.map(d => (
               <div key={d.user_id} className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1 rounded-lg transition-colors cursor-pointer">
                  <img src={d.avatar_url} className="w-8 h-8 rounded-lg object-cover" alt="av" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{d.full_name}</p>
                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">{d.project_role}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               </div>
             ))
           )}
        </div>
        <Popover.Arrow className="fill-white dark:fill-slate-900" />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

const SortIcon: React.FC<{ active: boolean, dir: 'asc' | 'desc' }> = ({ active, dir }) => {
  if (!active) return <ArrowUpDown size={12} className="opacity-20" />;
  return dir === 'asc' ? <ArrowUpNarrowWide size={12} className="text-blue-600" /> : <ArrowDownWideNarrow size={12} className="text-blue-600" />;
};

const PaginationBtn: React.FC<{ icon: any, onClick: () => void, disabled: boolean }> = ({ icon: Icon, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-800 disabled:opacity-20 disabled:grayscale transition-all active:scale-90">
    <Icon size={16} strokeWidth={2.5} />
  </button>
);

const DropdownMenuItem: React.FC<{ icon: any, label: string, onClick?: () => void, color?: string }> = ({ icon: Icon, label, onClick, color }) => (
  <DropdownMenu.Item onClick={onClick} className={`flex items-center gap-3 px-3 py-3 text-[11px] font-bold ${color || 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600'} rounded-lg outline-none cursor-pointer transition-all`}>
    <Icon size={16} strokeWidth={2.5} /> {label}
  </DropdownMenu.Item>
);

const ProfileField: React.FC<{ icon: any, label: string, value: string, highlight?: boolean }> = ({ icon: Icon, label, value, highlight }) => (
  <div className="flex flex-col gap-1.5 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/20 transition-colors">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
       <Icon size={11} className="text-blue-500" /> {label}
    </span>
    <span className={`text-xs font-black ${highlight ? 'text-blue-600' : 'text-slate-800 dark:text-slate-100'}`}>
       {value}
    </span>
  </div>
);

const ActivityItem: React.FC<{ text: string, time: string }> = ({ text, time }) => (
  <div className="relative group pl-2">
    <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 group-hover:scale-125 transition-all duration-300 shadow-lg shadow-blue-500/20" />
    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors">{text}</p>
    <p className="text-[10px] font-medium text-slate-400 italic flex items-center gap-1.5 mt-1 uppercase tracking-tight opacity-70 group-hover:opacity-100 transition-all"><Clock size={11} /> {time}</p>
  </div>
);

export default MemberHubPage;