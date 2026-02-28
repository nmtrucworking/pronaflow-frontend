import React, { useState, useMemo } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Switch from '@radix-ui/react-switch';
import * as Label from '@radix-ui/react-label';
import * as Popover from '@radix-ui/react-popover';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Select from '@radix-ui/react-select'; 
import * as Dialog from '@radix-ui/react-dialog'; // Added for Modals
import { 
  Building, 
  Users, 
  CreditCard, 
  HardDrive, 
  Settings, 
  Shield, 
  LogOut, 
  Camera, 
  ChevronDown, 
  AtSign, 
  HelpCircle,
  AlertCircle,
  Check,
  Search,
  MoreHorizontal,
  Mail,
  Plus,
  Download,
  Image as ImageIcon,
  Upload,
  Globe,
  Tag,
  Trash2,
  Edit2,
  Briefcase,
  Layers,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Palette,
  Pipette,
  UserCog,
  Ban,
  Send,
  X,
  Grid,
  Link,
  Copy
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import COLORS from '@/config/colors';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- MOCK DATA ---
const MOCK_WORKSPACES = [
  { id: 'ws1', name: 'PronaFlow HQ', role: 'Owner', avatar: null },
  { id: 'ws2', name: 'Personal Projects', role: 'Admin', avatar: null },
  { id: 'ws3', name: 'Freelance Team', role: 'Member', avatar: null },
];

const MOCK_MEMBERS = [
  { id: 1, name: 'Truc Nguyen', email: 'truc.nguyen@pronaflow.com', role: 'Owner', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', status: 'Active', joined: 'Jan 2023' },
  { id: 2, name: 'Sarah Wilson', email: 'sarah.w@pronaflow.com', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', status: 'Active', joined: 'Feb 2023' },
  { id: 3, name: 'Michael Chen', email: 'm.chen@pronaflow.com', role: 'Member', avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', status: 'Active', joined: 'Mar 2023' },
  { id: 4, name: 'Emily Davis', email: 'emily.d@pronaflow.com', role: 'Guest', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', status: 'Invited', joined: '-' },
];

const MOCK_INVOICES = [
  { id: 'INV-001', date: '01/12/2023', amount: '$29.00', status: 'Paid' },
  { id: 'INV-002', date: '01/11/2023', amount: '$29.00', status: 'Paid' },
  { id: 'INV-003', date: '01/10/2023', amount: '$29.00', status: 'Paid' },
];

const MOCK_TAGS = [
  { id: 1, name: 'Bug', color: COLORS.status.error, usage: 12 },
  { id: 2, name: 'Feature', color: COLORS.semantic.info[500], usage: 8 },
  { id: 3, name: 'Enhancement', color: COLORS.status.success, usage: 5 },
  { id: 4, name: 'Documentation', color: COLORS.status.warning, usage: 3 },
  { id: 5, name: 'Design', color: COLORS.priority.low, usage: 7 },
];

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1614851099511-773084f6911d?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150&h=150&fit=crop',
];

const PRONAFLOW_LOGOS = [
  'PF', 'A', 'B', 'C' 
];

// --- HELPERS ---
const getRoleColorStyles = (role: string) => {
  switch (role.toLowerCase()) {
    case 'owner': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-800';
    case 'admin': return 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-800';
    case 'member': return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    case 'guest': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-800';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

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

const CustomSelect = ({ value, onChange, options, placeholder = "Select...", triggerClassName }: { value: string, onChange: (val: string) => void, options: { value: string, label: string }[], placeholder?: string, triggerClassName?: string }) => (
  <Select.Root value={value} onValueChange={onChange}>
    <Select.Trigger className={cn("w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-700 dark:text-slate-200", triggerClassName)}>
      <Select.Value placeholder={placeholder} />
      <Select.Icon>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="overflow-hidden bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
        <Select.Viewport className="p-1">
          {options.map((opt) => (
            <Select.Item key={opt.value} value={opt.value} className="flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 outline-none cursor-pointer">
              <Select.ItemText>{opt.label}</Select.ItemText>
              <Select.ItemIndicator className="ml-auto">
                <Check className="w-3.5 h-3.5 text-indigo-600" />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

// --- COMPONENT: Advanced Color Picker (Tabs: Preset, Grid, Palette/Hex) ---
const AdvancedColorPicker = ({ color, onChange }: { color: string, onChange: (c: string) => void }) => {
  const [activeTab, setActiveTab] = useState('preset');
  
  // Hexagon-like grid of colors
  const PALETTE_COLORS = [
    COLORS.semantic.error[100], COLORS.semantic.warning[100], COLORS.semantic.warning[500], COLORS.semantic.success[100], COLORS.semantic.success[500], COLORS.semantic.info[100], COLORS.semantic.info[500], COLORS.priority.low, COLORS.semantic.error[500],
    COLORS.semantic.error[500], COLORS.priority.high, COLORS.semantic.warning[500], COLORS.semantic.success[600], COLORS.semantic.success[500], COLORS.semantic.info[500], COLORS.semantic.info[500], COLORS.priority.low, COLORS.semantic.error[600],
    COLORS.semantic.error[700], COLORS.priority.high, COLORS.semantic.warning[700], COLORS.semantic.success[700], COLORS.semantic.success[700], COLORS.semantic.info[700], COLORS.semantic.info[600], COLORS.priority.low, COLORS.semantic.error[700],
  ];

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button 
          className="w-9 h-9 rounded-lg cursor-pointer hover:opacity-90 transition-all ring-2 ring-transparent focus:ring-indigo-500 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center group"
          style={{ backgroundColor: color }}
        >
          <Pipette className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 drop-shadow-md transition-opacity" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="w-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl p-0 z-50 animate-in zoom-in-95 overflow-hidden" sideOffset={8}>
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
             <Tabs.List className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
               <Tabs.Trigger value="preset" className="flex-1 px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wide data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 transition-colors">Preset</Tabs.Trigger>
               <Tabs.Trigger value="grid" className="flex-1 px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wide data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 transition-colors">Grid</Tabs.Trigger>
               <Tabs.Trigger value="custom" className="flex-1 px-3 py-2 text-[10px] font-medium text-slate-500 uppercase tracking-wide data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 transition-colors">Tùy chỉnh</Tabs.Trigger>
             </Tabs.List>
             
             <div className="p-4">
               <Tabs.Content value="preset" className="outline-none">
                 <div className="grid grid-cols-5 gap-2">
                   {[
                    COLORS.status.error,
                    COLORS.priority.high,
                    COLORS.status.warning,
                    COLORS.status.success,
                    COLORS.semantic.info[500],
                    COLORS.semantic.info[600],
                    COLORS.priority.medium,
                    COLORS.priority.low,
                    COLORS.semantic.error[600],
                    COLORS.neutral[500],
                  ].map(c => (
                     <button 
                       key={c}
                       className={cn("w-8 h-8 rounded-full hover:scale-110 transition-transform focus:outline-none ring-offset-1 focus:ring-2", color === c ? "ring-2 ring-indigo-500 dark:ring-indigo-400" : "ring-transparent")}
                       style={{ backgroundColor: c }}
                       onClick={() => onChange(c)}
                     />
                   ))}
                 </div>
               </Tabs.Content>

               <Tabs.Content value="grid" className="outline-none">
                 <div className="grid grid-cols-9 gap-1.5 justify-center">
                   {PALETTE_COLORS.map(c => (
                      <button 
                        key={c}
                        className={cn("w-5 h-5 rounded-sm hover:scale-125 transition-transform z-0 hover:z-10 focus:outline-none clip-hexagon", color === c && "ring-1 ring-white dark:ring-black shadow-md z-10 scale-110")}
                        style={{ backgroundColor: c }}
                        onClick={() => onChange(c)}
                      />
                   ))}
                 </div>
               </Tabs.Content>

               <Tabs.Content value="custom" className="outline-none">
                 <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 shadow-inner">
                        <input 
                          type="color" 
                          value={color}
                          onChange={(e) => onChange(e.target.value)}
                          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0 border-0 opacity-0"
                        />
                         <div className="w-full h-full" style={{ backgroundColor: color }} />
                      </div>
                      <div className="flex-1 relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">#</span>
                        <input 
                          type="text" 
                          value={color.replace('#', '')}
                          onChange={(e) => onChange(`#${e.target.value}`)}
                          className="w-full pl-5 pr-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-700 dark:text-slate-300 font-mono uppercase"
                        />
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500">
                        Nhập mã HEX hoặc click vào ô màu để chọn từ bảng màu hệ thống.
                    </div>
                 </div>
               </Tabs.Content>
             </div>
          </Tabs.Root>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

// --- COMPONENT: Member Actions with Modals ---
const MemberActions = ({ member }: { member: any }) => {
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(member.role);

  return (
    <>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="w-48 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-lg p-1 z-50 animate-in zoom-in-95" sideOffset={5} align="end">
            <div className="flex flex-col gap-0.5">
              <button 
                onClick={() => setEditRoleOpen(true)}
                className="flex items-center w-full px-2 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors text-left"
              >
                <UserCog className="w-3.5 h-3.5 mr-2 text-slate-400" /> Chỉnh sửa vai trò
              </button>
              <button className="flex items-center w-full px-2 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors text-left">
                <Send className="w-3.5 h-3.5 mr-2 text-slate-400" /> Gửi lại lời mời
              </button>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
              <button 
                onClick={() => setRemoveOpen(true)}
                className="flex items-center w-full px-2 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded transition-colors text-left"
              >
                <Ban className="w-3.5 h-3.5 mr-2" /> Xóa khỏi Workspace
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* Edit Role Modal */}
      <Dialog.Root open={editRoleOpen} onOpenChange={setEditRoleOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[400px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white dark:bg-slate-900 p-6 shadow-2xl focus:outline-none z-50 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Chỉnh sửa vai trò
            </Dialog.Title>
            <Dialog.Description className="text-sm text-slate-500 mb-4">
              Thay đổi quyền truy cập của <span className="font-medium text-slate-900 dark:text-white">{member.name}</span> trong Workspace này.
            </Dialog.Description>
            
            <div className="space-y-3 mb-6">
              {['Owner', 'Admin', 'Member', 'Guest'].map(role => (
                <div 
                  key={role}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                    selectedRole === role 
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" 
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  )}
                  onClick={() => setSelectedRole(role)}
                >
                  <div className="flex flex-col">
                    <span className={cn("text-sm font-medium", selectedRole === role ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300")}>
                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider mr-2", getRoleColorStyles(role))}>
                            {role}
                        </span>
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">
                      {role === 'Owner' ? 'Toàn quyền truy cập & thanh toán' : 
                       role === 'Admin' ? 'Quản lý dự án & thành viên' :
                       role === 'Member' ? 'Tạo & chỉnh sửa task' : 'Chỉ xem được nội dung được chia sẻ'}
                    </span>
                  </div>
                  {selectedRole === role && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setEditRoleOpen(false)} className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800">Hủy</button>
              <button onClick={() => setEditRoleOpen(false)} className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Lưu thay đổi</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Remove Member Modal */}
      <Dialog.Root open={removeOpen} onOpenChange={setRemoveOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[400px] translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white dark:bg-slate-900 p-6 shadow-2xl focus:outline-none z-50 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-3 text-red-600 dark:text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-white">
                Xóa thành viên?
              </Dialog.Title>
              <Dialog.Description className="text-sm text-slate-500 mt-1">
                Bạn có chắc chắn muốn xóa <span className="font-medium text-slate-900 dark:text-white">{member.name}</span> khỏi Workspace? Họ sẽ mất quyền truy cập vào tất cả dự án.
              </Dialog.Description>
            </div>
            
            <div className="flex justify-center gap-3">
              <button onClick={() => setRemoveOpen(false)} className="flex-1 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">Hủy bỏ</button>
              <button onClick={() => setRemoveOpen(false)} className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg">Xác nhận xóa</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

// ... (LogoUploader and WorkspaceSwitcher remain the same) ...
const LogoUploader = () => {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <div className="relative group cursor-pointer shrink-0">
          <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-3xl font-bold shadow-md ring-4 ring-white dark:ring-slate-800 transition-transform group-hover:scale-105">
            PF
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[1px]">
            <Camera className="w-6 h-6 text-white mb-1 drop-shadow-md" />
            <span className="text-[10px] font-medium text-white tracking-wide uppercase">Đổi Logo</span>
          </div>
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="w-80 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl z-50 animate-in zoom-in-95 duration-200 overflow-hidden" sideOffset={5} align="start">
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <Tabs.Trigger value="upload" className="flex-1 px-3 py-2.5 text-xs font-medium text-slate-500 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 transition-colors">Upload</Tabs.Trigger>
              <Tabs.Trigger value="unsplash" className="flex-1 px-3 py-2.5 text-xs font-medium text-slate-500 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 transition-colors">Unsplash</Tabs.Trigger>
              <Tabs.Trigger value="library" className="flex-1 px-3 py-2.5 text-xs font-medium text-slate-500 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 transition-colors">Library</Tabs.Trigger>
            </Tabs.List>

            <div className="p-4">
              <Tabs.Content value="upload" className="outline-none">
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center hover:border-indigo-400 hover:bg-indigo-50/10 transition-colors cursor-pointer group">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:text-indigo-500 transition-colors" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Click to upload</p>
                  <p className="text-[10px] text-slate-400 mt-1">SVG, PNG, JPG (Max 2MB)</p>
                </div>
              </Tabs.Content>

              <Tabs.Content value="unsplash" className="outline-none">
                <div className="relative mb-3">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="text" placeholder="Search photos..." className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {UNSPLASH_IMAGES.map((img, i) => (
                    <button key={i} className="aspect-square rounded-md overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all">
                      <img src={img} alt="Unsplash" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </Tabs.Content>

              <Tabs.Content value="library" className="outline-none">
                <div className="grid grid-cols-4 gap-2">
                  {PRONAFLOW_LOGOS.map((logo, i) => (
                    <button key={i} className="aspect-square rounded-md bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold hover:ring-2 hover:ring-indigo-500 transition-all">
                      {logo}
                    </button>
                  ))}
                </div>
              </Tabs.Content>
            </div>
            
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <button className="text-xs text-red-600 hover:underline flex items-center">
                <Trash2 className="w-3 h-3 mr-1" /> Remove
              </button>
              <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 transition-colors">
                Apply
              </button>
            </div>
          </Tabs.Root>
          <Popover.Arrow className="fill-white dark:fill-slate-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
// --- COMPONENT: Workspace Switcher Dropdown ---
const WorkspaceSwitcher = () => {
  const [activeWS, setActiveWS] = useState(MOCK_WORKSPACES[0]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 px-2 py-1 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50">
          <div className="text-left">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center">
              {activeWS.name} <ChevronDown className="w-4 h-4 ml-1.5 text-slate-400 group-hover:text-indigo-500 transition-transform group-data-[state=open]:rotate-180" />
            </h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{activeWS.role}</p>
          </div>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="w-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl p-1 animate-in slide-in-from-top-2 duration-200 z-50" align="start" sideOffset={5}>
          <div className="px-2 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Switch Workspace</div>
          {MOCK_WORKSPACES.map((ws) => (
            <DropdownMenu.Item 
              key={ws.id} 
              onSelect={() => setActiveWS(ws)}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 text-sm rounded-lg cursor-pointer outline-none transition-colors",
                activeWS.id === ws.id ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white",
                  ws.id === 'ws1' ? "bg-indigo-600" : "bg-slate-500"
                )}>
                  {ws.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium leading-none">{ws.name}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{ws.role}</span>
                </div>
              </div>
              {activeWS.id === ws.id && <Check className="w-4 h-4 text-indigo-600" />}
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
          <DropdownMenu.Item className="flex items-center px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer outline-none transition-colors">
            <Plus className="w-4 h-4 mr-3 text-slate-400" />
            Tạo Workspace mới
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
/**
 * Workspace General Settings
 */
const WorkspaceGeneral = () => {
  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
      <SectionHeader title="Thông tin chung" description="Quản lý tên, logo và địa chỉ truy cập của Workspace." />
      
      <div className="space-y-8">
        {/* Identity */}
        <div className="flex flex-col sm:flex-row items-start gap-6 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
          <LogoUploader />
          <div className="flex-1 space-y-4 w-full">
            <InputGroup label="Tên Workspace" id="ws_name">
              <input type="text" defaultValue="PronaFlow HQ" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
            </InputGroup>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <InputGroup label="Ngành nghề" id="ws_industry">
                 <CustomSelect 
                   value="tech" 
                   onChange={() => {}} 
                   options={[
                     { value: 'tech', label: 'Technology & Software' },
                     { value: 'marketing', label: 'Marketing Agency' },
                     { value: 'edu', label: 'Education' },
                     { value: 'finance', label: 'Finance' },
                   ]} 
                 />
               </InputGroup>
               <InputGroup label="Quy mô công ty" id="ws_size">
                 <CustomSelect 
                   value="11-50" 
                   onChange={() => {}} 
                   options={[
                     { value: '1-10', label: '1 - 10 người' },
                     { value: '11-50', label: '11 - 50 người' },
                     { value: '50-plus', label: '50+ người' },
                   ]} 
                 />
               </InputGroup>
            </div>

            <InputGroup label="Mô tả Workspace" id="ws_desc">
              <textarea className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none h-24" placeholder="Mô tả ngắn về không gian làm việc của bạn..." />
            </InputGroup>

            <InputGroup label="Workspace URL" id="ws_url" helpText="Địa chỉ truy cập nhanh cho thành viên tổ chức.">
              <div className="flex group focus-within:ring-2 focus-within:ring-indigo-500/50 rounded-lg transition-all">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm select-none font-mono">
                  pronaflow.com/
                </span>
                <input 
                  type="text" 
                  defaultValue="pronaflow-hq" 
                  className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-r-lg text-sm focus:outline-none font-mono text-slate-700 dark:text-slate-300" 
                />
              </div>
            </InputGroup>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-red-600 mb-3 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" /> Vùng nguy hiểm
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 rounded-lg gap-4 sm:gap-0">
            <div>
              <p className="text-sm font-medium text-red-900 dark:text-red-400">Xóa Workspace</p>
              <p className="text-xs text-red-700 dark:text-red-500 mt-1 max-w-md">Hành động này không thể hoàn tác. Tất cả dữ liệu dự án, task và thành viên sẽ bị xóa vĩnh viễn.</p>
            </div>
            <button className="px-4 py-2 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors active:scale-95 whitespace-nowrap shadow-sm">
              Xóa vĩnh viễn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Workspace Permissions
 */
const WorkspacePermissions = () => {
  const [domains, setDomains] = useState(['pronaflow.com', 'partner.com']);
  const [newDomain, setNewDomain] = useState('');
  const [inviteLinkEnabled, setInviteLinkEnabled] = useState(true);

  const handleAddDomain = () => {
    if (newDomain && !domains.includes(newDomain)) {
      setDomains([...domains, newDomain]);
      setNewDomain('');
    }
  };

  const handleRemoveDomain = (domain: string) => {
    setDomains(domains.filter(d => d !== domain));
  };

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
      <SectionHeader title="Quyền truy cập & Thành viên" description="Kiểm soát ai có thể tham gia và làm gì trong Workspace." />
      
      <div className="space-y-8">
        {/* Invitation Settings */}
        <div className="space-y-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Thiết lập Lời mời
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Ai có thể mời thành viên?" id="invite_perm">
                <CustomSelect 
                value="admin" 
                onChange={() => {}} 
                options={[
                    { value: 'admin', label: 'Chỉ Admin' },
                    { value: 'everyone', label: 'Tất cả thành viên' },
                ]} 
                />
            </InputGroup>

            <InputGroup label="Vai trò mặc định" id="default_role" helpText="Vai trò gán cho thành viên mới khi tham gia.">
                <CustomSelect 
                value="member" 
                onChange={() => {}} 
                options={[
                    { value: 'member', label: 'Member (Thành viên)' },
                    { value: 'viewer', label: 'Viewer (Người xem)' },
                    { value: 'manager', label: 'Manager (Quản lý)' },
                ]} 
                />
            </InputGroup>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center">
                            <Link className="w-4 h-4 mr-2 text-indigo-500" />
                            Liên kết mời tham gia
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">Bất kỳ ai có liên kết này đều có thể tham gia Workspace.</p>
                    </div>
                    <Switch.Root 
                        checked={inviteLinkEnabled} 
                        onCheckedChange={setInviteLinkEnabled}
                        className="w-[36px] h-[20px] bg-slate-300 dark:bg-slate-700 rounded-full relative data-[state=checked]:bg-indigo-600 outline-none cursor-pointer"
                    >
                        <Switch.Thumb className="block w-[16px] h-[16px] bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[18px]" />
                    </Switch.Root>
                </div>
                
                {inviteLinkEnabled && (
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            readOnly 
                            value="https://pronaflow.com/invite/ws/jk23-4h5j-2k34" 
                            className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-500 font-mono focus:outline-none"
                        />
                        <button className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" title="Copy">
                            <Copy className="w-4 h-4" />
                        </button>
                        <button className="px-3 py-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 whitespace-nowrap">
                            Tạo lại link
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Domain Restrictions */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <InputGroup 
            label="Giới hạn tên miền (Domain Restriction)" 
            id="domain" 
            helpText={<span>Chỉ cho phép đăng ký với email thuộc các tên miền này. <a href="#" className="text-indigo-600 hover:underline">Tìm hiểu thêm</a></span>}
          >
            <div className="flex gap-2">
              <div className="relative flex-1">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="vidu: yourcompany.com" 
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" 
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
                />
              </div>
              <button 
                onClick={handleAddDomain}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                  Thêm
              </button>
            </div>
          </InputGroup>
          
          {domains.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                  {domains.map(domain => (
                      <span key={domain} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800">
                          {domain}
                          <button onClick={() => handleRemoveDomain(domain)} className="ml-1.5 hover:text-indigo-900 dark:hover:text-indigo-100 focus:outline-none">
                              <X className="w-3 h-3" />
                          </button>
                      </span>
                  ))}
              </div>
          )}
        </div>

        {/* Feature Permissions */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
             <h3 className="text-sm font-semibold text-slate-900 dark:text-white pb-2">
                Quyền hạn chức năng
            </h3>
            <div className="space-y-3">
                {[
                    { label: 'Tạo dự án mới (Create Projects)', desc: 'Ai có thể tạo dự án trong workspace này?' },
                    { label: 'Xóa dự án (Delete Projects)', desc: 'Ai có thể xóa dự án (bao gồm cả dự án đã lưu trữ)?' },
                    { label: 'Quản lý Tags chung', desc: 'Ai có thể tạo, sửa, xóa Tags của workspace?' }
                ].map((perm, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                        <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{perm.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{perm.desc}</p>
                        </div>
                        <div className="w-40">
                             <CustomSelect 
                                value="admin" 
                                onChange={() => {}} 
                                options={[
                                    { value: 'admin', label: 'Chỉ Admin' },
                                    { value: 'everyone', label: 'Tất cả thành viên' },
                                ]} 
                                triggerClassName="py-1.5 text-xs h-8"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Guest Access */}
        <div className="flex items-center justify-between py-4 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 mt-2">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Cho phép khách (Guest Access)</p>
            <p className="text-xs text-slate-500 mt-0.5">Cho phép mời người dùng ngoài tổ chức vào từng dự án cụ thể.</p>
          </div>
          <Switch.Root className="w-[36px] h-[20px] bg-slate-300 dark:bg-slate-700 rounded-full relative data-[state=checked]:bg-indigo-600 outline-none cursor-pointer" defaultChecked>
            <Switch.Thumb className="block w-[16px] h-[16px] bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[18px]" />
          </Switch.Root>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: Tag Action Popover (New) ---
const TagActionPopover = ({ tag, onEdit, onDelete }: { tag: any, onEdit: () => void, onDelete: () => void }) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="w-32 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-lg p-1 z-50 animate-in zoom-in-95" sideOffset={5} align="end">
          <div className="flex flex-col gap-0.5">
            <button 
              onClick={onEdit}
              className="flex items-center w-full px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors text-left"
            >
              <Edit2 className="w-3 h-3 mr-2 text-slate-400" /> Sửa
            </button>
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-0.5" />
            <button 
              onClick={onDelete}
              className="flex items-center w-full px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded transition-colors text-left"
            >
              <Trash2 className="w-3 h-3 mr-2" /> Xóa
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/**
 * Workspace Tags Management (Enhanced)
 */
const WorkspaceTags = () => {
  const [tags, setTags] = useState(MOCK_TAGS);
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'usage', direction: 'asc' | 'desc' } | null>(null);
  const [newTagColor, setNewTagColor] = useState(COLORS.semantic.info[500]);
  // State for Edit/Delete actions in real app would go here

  // Sorting Logic
  const sortedTags = useMemo(() => {
    if (!sortConfig) return tags;
    return [...tags].sort((a, b) => {
      // @ts-ignore - dynamic sorting
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      // @ts-ignore
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tags, sortConfig]);

  const handleSort = (key: 'name' | 'usage') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
      <SectionHeader title="Quản lý Tags" description="Tạo và quản lý các nhãn (tags) được sử dụng trong toàn bộ Workspace." />
      
      <div className="space-y-6">
        {/* Create Tag */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 items-end">
          <div className="w-full sm:flex-1">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tên Tag</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200" style={{ color: newTagColor }} />
                <input type="text" placeholder="VD: Quan trọng, Gấp..." className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <AdvancedColorPicker color={newTagColor} onChange={setNewTagColor} />
            </div>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors h-[38px] w-full sm:w-auto shadow-sm shadow-indigo-200 dark:shadow-none">
            Tạo mới
          </button>
        </div>

        {/* Tag List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th 
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Tên Tag
                    {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                    {!sortConfig && <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
                  onClick={() => handleSort('usage')}
                >
                  <div className="flex items-center gap-1">
                    Sử dụng
                    {sortConfig?.key === 'usage' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                    {!sortConfig && <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />}
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedTags.map((tag) => (
                <tr key={tag.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <span 
                      className="inline-flex px-2 py-1 rounded-md text-xs font-medium border border-transparent"
                      style={{ 
                        backgroundColor: `${tag.color}15`, // 15% opacity
                        color: tag.color,
                        borderColor: `${tag.color}30` // 30% opacity border
                      }}
                    >
                      {tag.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{tag.usage} tasks</td>
                  <td className="px-4 py-3 text-right">
                    <TagActionPopover 
                      tag={tag} 
                      onEdit={() => console.log('Edit', tag.id)} 
                      onDelete={() => console.log('Delete', tag.id)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * Workspace Members Settings (Enhanced)
 */
const WorkspaceMembers = () => {
  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Thành viên</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quản lý những người có quyền truy cập vào workspace này.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 dark:shadow-none hover:-translate-y-0.5 active:translate-y-0">
          <Plus className="w-4 h-4 mr-2" /> Mời thành viên
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm theo tên hoặc email..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs text-slate-500 font-medium uppercase tracking-wide mr-2 whitespace-nowrap">Lọc theo:</span>
             <CustomSelect 
               value="all" 
               onChange={() => {}} 
               options={[
                 { value: 'all', label: 'Tất cả vai trò' },
                 { value: 'owner', label: 'Owner' },
                 { value: 'admin', label: 'Admin' },
                 { value: 'member', label: 'Member' },
                 { value: 'guest', label: 'Guest' },
               ]} 
             />
          </div>
        </div>

        {/* Member List */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3 w-[40%]">Thành viên</th>
                <th className="px-6 py-3">Vai trò</th>
                <th className="px-6 py-3">Ngày tham gia</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_MEMBERS.map((member) => (
                <tr key={member.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800" />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                          {member.name}
                          {member.role === 'Owner' && <Shield className="w-3 h-3 text-amber-500" fill="currentColor" />}
                        </div>
                        <div className="text-xs text-slate-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border", getRoleColorStyles(member.role))}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{member.joined}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                      member.status === 'Active' 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800" 
                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                    )}>
                      {member.status === 'Active' ? <Check className="w-3 h-3 mr-1" /> : <Mail className="w-3 h-3 mr-1" />}
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <MemberActions member={member} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Mock) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>Hiển thị 1-4 trên tổng số 4 thành viên</span>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md opacity-50 cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Trước</button>
            <button disabled className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md opacity-50 cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ... (Billing and Main Layout Component remain mostly the same, will include for completeness)

/**
 * Workspace Billing
 */
const WorkspaceBilling = () => {
  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
      <SectionHeader title="Gói dịch vụ & Thanh toán" description="Quản lý gói đăng ký và phương thức thanh toán." />
      
      <div className="space-y-8">
        {/* Plan Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-6 text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 border border-white/10 mb-2 backdrop-blur-sm">PRO PLAN</span>
              <h4 className="text-2xl font-bold tracking-tight">PronaFlow Professional</h4>
              <p className="text-sm text-white/80 mt-1 flex items-center">
                <CreditCard className="w-4 h-4 mr-1.5 opacity-70" />
                Visa •••• 4242 (Hết hạn 12/25)
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-3xl font-bold">$29<span className="text-lg text-white/60 font-normal">/tháng</span></p>
              <p className="text-xs text-white/60 mt-1">Kỳ thanh toán tiếp theo: 15/12/2024</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8 relative z-10">
            <div>
              <div className="flex justify-between text-xs font-medium mb-2 opacity-90">
                <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1.5" /> Thành viên</span>
                <span>12 / 50</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: '24%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium mb-2 opacity-90">
                <span className="flex items-center"><HardDrive className="w-3.5 h-3.5 mr-1.5" /> Lưu trữ</span>
                <span>5GB / 100GB</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>

          {/* Decor */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-110 duration-700"></div>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl transition-transform group-hover:scale-110 duration-700"></div>
        </div>
        
        <div className="flex flex-wrap justify-end gap-3">
          <button className="text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
            Quản lý thanh toán
          </button>
          <button className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 dark:shadow-none hover:-translate-y-0.5 active:translate-y-0">
            Nâng cấp gói
          </button>
        </div>

        {/* Invoice History */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Lịch sử thanh toán</h3>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
                <tr>
                  <th className="px-4 py-3">Mã hóa đơn</th>
                  <th className="px-4 py-3">Ngày</th>
                  <th className="px-4 py-3">Số tiền</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Tải về</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {MOCK_INVOICES.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{inv.id}</td>
                    <td className="px-4 py-3 text-slate-500">{inv.date}</td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white">{inv.amount}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN LAYOUT COMPONENT ---

export default function WorkspaceSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const navItems = [
    { id: 'general', label: 'Thông tin chung', icon: Building },
    { id: 'permissions', label: 'Quyền truy cập', icon: Shield },
    { id: 'billing', label: 'Gói dịch vụ & Billing', icon: CreditCard },
    { id: 'members', label: 'Thành viên', icon: Users, badge: MOCK_MEMBERS.length },
    { id: 'tags', label: 'Quản lý Tags', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col h-screen overflow-hidden">
      {/* Custom Scrollbar Styles */}
      <style>
        {`
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: var(--color-neutral-300); border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: var(--color-neutral-400); }
          .dark ::-webkit-scrollbar-thumb { background: var(--color-neutral-700); }
          .dark ::-webkit-scrollbar-thumb:hover { background: var(--color-neutral-600); }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col">
          
          {/* Header */}
          <div className="mb-8 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cài đặt Workspace</span>
              <WorkspaceSwitcher />
            </div>
            <div className="hidden sm:block">
               <button className="flex items-center text-sm font-medium text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10">
                 <LogOut className="w-4 h-4 mr-2" /> Rời Workspace
               </button>
            </div>
          </div>

          <Tabs.Root 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="flex flex-col md:flex-row gap-8 items-start h-full min-h-0" 
            orientation="vertical"
          >
            {/* Sidebar Navigation */}
            <Tabs.List className="w-full md:w-64 flex-shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide md:sticky md:top-0 h-full">
              <div className="flex-1">
                <div className="hidden md:block px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Menu
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Tabs.Trigger 
                      key={item.id}
                      value={item.id}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all w-full text-left whitespace-nowrap md:whitespace-normal shrink-0",
                        activeTab === item.id 
                          ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-800 md:border-l-4 md:border-l-indigo-600 md:rounded-l-none" 
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <div className="flex items-center">
                        <Icon className={cn("w-4 h-4 mr-3", activeTab === item.id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")} />
                        {item.label}
                      </div>
                      {item.badge && (
                        <span className="ml-auto bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs font-medium dark:bg-slate-800 dark:text-slate-400">
                          {item.badge}
                        </span>
                      )}
                    </Tabs.Trigger>
                  )
                })}
              </div>

              {/* Sidebar Footer */}
              <div className="hidden md:block mt-auto pt-6 px-3 border-t border-slate-100 dark:border-slate-800 pb-2">
                <a href="#" className="flex items-center text-xs text-slate-500 hover:text-indigo-600 transition-colors mb-2">
                  <HelpCircle className="w-3.5 h-3.5 mr-2" />
                  Hướng dẫn quản trị
                </a>
              </div>
            </Tabs.List>

            {/* Content Area */}
            <div className="flex-1 w-full bg-white dark:bg-slate-950 md:bg-transparent rounded-2xl md:rounded-none p-6 md:p-0 border md:border-0 border-slate-200 dark:border-slate-800 shadow-sm md:shadow-none h-full overflow-y-auto pr-1">
              <Tabs.Content value="general" className="outline-none">
                <WorkspaceGeneral />
              </Tabs.Content>
              
              <Tabs.Content value="permissions" className="outline-none">
                <WorkspacePermissions />
              </Tabs.Content>

              <Tabs.Content value="billing" className="outline-none">
                <WorkspaceBilling />
              </Tabs.Content>

              <Tabs.Content value="members" className="outline-none">
                <WorkspaceMembers />
              </Tabs.Content>

              <Tabs.Content value="tags" className="outline-none">
                <WorkspaceTags />
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
}