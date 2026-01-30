
import { User as UserIcon } from 'lucide-react';
import type { UserEntity } from '../types';

export const AssigneeAvatarGroup = ({ users, limit = 3 }: { users: UserEntity[], limit?: number }) => {
  if (!users || users.length === 0) {
    return (
      <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-slate-50 flex-shrink-0">
        <UserIcon className="w-3 h-3" />
      </div>
    );
  }
  const visibleUsers = users.slice(0, limit);
  const remaining = users.length - limit;
  return (
    <div className="flex -space-x-2 overflow-hidden items-center flex-shrink-0">
      {visibleUsers.map((user) => (
        <img key={user.id} className="inline-block h-6 w-6 rounded-full ring-2 ring-white hover:scale-110 hover:z-10 transition-transform duration-200 cursor-pointer object-cover bg-slate-200" src={user.avatar} alt={user.name} title={user.name} />
      ))}
      {remaining > 0 && (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white text-[10px] font-medium text-slate-600">+{remaining}</span>
      )}
    </div>
  );
};
