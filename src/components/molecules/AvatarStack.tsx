import React from 'react';
import type { UserEntity } from '../../types/project';
import type { Member } from '../../types/member';

interface AvatarStackProps {
  users: (UserEntity | Member)[];
  limit?: number;
}

export const AvatarStack = ({ users, limit = 3 }: AvatarStackProps) => {
  const visible = users.slice(0, limit);
  const remaining = users.length - limit;

  return (
    <div className="flex -space-x-2">
      {visible.map((u, index) => {
        const key = 'id' in u && u.id ? u.id : 'user_id' in u && u.user_id ? u.user_id : `user-${index}`;
        const avatar = 'avatar_url' in u && u.avatar_url ? u.avatar_url : 'avatar' in u && u.avatar ? u.avatar : '';
        const name = 'name' in u && u.name ? u.name : 'username' in u && u.username ? u.username : 'User';
        
        return (
          <img 
            key={key} 
            src={avatar} 
            alt={name} 
            title={name} 
            className="w-6 h-6 rounded-full ring-2 ring-white bg-slate-200 object-cover hover:scale-110 hover:z-10 transition-transform duration-200 cursor-pointer" 
          />
        );
      })}
      {remaining > 0 && (
        <div className="w-6 h-6 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-medium text-slate-600">
          +{remaining}
        </div>
      )}
    </div>
  );
};