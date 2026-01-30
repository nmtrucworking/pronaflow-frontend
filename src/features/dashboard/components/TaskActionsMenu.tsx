import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal, Edit, CalendarDays, Trash2 } from 'lucide-react';

interface TaskActionsMenuProps {
  onEdit?: () => void;
  onReschedule?: () => void;
  onDelete?: () => void;
}

export const TaskActionsMenu: React.FC<TaskActionsMenuProps> = ({
  onEdit,
  onReschedule,
  onDelete,
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-all outline-none focus:opacity-100 focus:ring-2 focus:ring-indigo-500/20 active:scale-95"
          aria-label="Task actions"
        >
          <MoreHorizontal className="w-4 h-4 text-slate-500" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[160px] bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xl p-1 animate-in fade-in zoom-in-95 duration-150 z-50"
          sideOffset={5}
          align="end"
        >
          <DropdownMenu.Item
            className="flex items-center px-2 py-2 text-xs text-slate-700 dark:text-slate-300 outline-none hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer transition-colors"
            onClick={onEdit}
          >
            <Edit className="w-3.5 h-3.5 mr-2 text-slate-400" />
            Chỉnh sửa
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex items-center px-2 py-2 text-xs text-slate-700 dark:text-slate-300 outline-none hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer transition-colors"
            onClick={onReschedule}
          >
            <CalendarDays className="w-3.5 h-3.5 mr-2 text-slate-400" />
            Dời ngày hạn
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
          <DropdownMenu.Item
            className="flex items-center px-2 py-2 text-xs text-red-600 dark:text-red-400 outline-none hover:bg-red-50 dark:hover:bg-red-900/10 rounded cursor-pointer transition-colors"
            onClick={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" />
            Xóa công việc
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
