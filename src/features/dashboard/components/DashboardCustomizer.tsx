import * as Popover from '@radix-ui/react-popover';
import * as Switch from '@radix-ui/react-switch';
import { Settings } from 'lucide-react';
import type { DashboardConfig } from '../types/dashboard-types';

interface DashboardCustomizerProps {
  config: DashboardConfig;
  onToggle: (key: keyof DashboardConfig) => void;
}

const SwitchItem = ({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center justify-between group">
    <label
      className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer group-hover:text-indigo-600 transition-colors"
      htmlFor={id}
    >
      {label}
    </label>
    <Switch.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="w-[30px] h-[18px] bg-slate-200 dark:bg-slate-700 rounded-full relative data-[state=checked]:bg-indigo-600 outline-none cursor-pointer transition-colors"
    >
      <Switch.Thumb className="block w-[14px] h-[14px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[14px] shadow-sm" />
    </Switch.Root>
  </div>
);

export const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({
  config,
  onToggle,
}) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="flex items-center px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-indigo-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-indigo-400 transition-all active:scale-95 shadow-sm">
          <Settings className="w-3.5 h-3.5 mr-2" />
          Tùy biến
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="w-64 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xl p-4 animate-in zoom-in-95 duration-200 z-50"
          sideOffset={5}
          align="end"
        >
          <h4 className="text-sm font-semibold mb-3 text-slate-900 dark:text-white">
            Hiển thị Widget
          </h4>
          <div className="space-y-3">
            <SwitchItem
              id="toggle-stats"
              label="Thẻ thống kê"
              checked={config.showStats}
              onCheckedChange={() => onToggle('showStats')}
            />
            <SwitchItem
              id="toggle-weekly"
              label="Hiệu suất tuần"
              checked={config.showWeeklyProgress}
              onCheckedChange={() => onToggle('showWeeklyProgress')}
            />
            <SwitchItem
              id="toggle-calendar"
              label="Lịch (Sidebar)"
              checked={config.showCalendar}
              onCheckedChange={() => onToggle('showCalendar')}
            />
            <SwitchItem
              id="toggle-activity"
              label="Hoạt động gần đây"
              checked={config.showActivity}
              onCheckedChange={() => onToggle('showActivity')}
            />
          </div>
          <Popover.Arrow className="fill-white dark:fill-slate-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
