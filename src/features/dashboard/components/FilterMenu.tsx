import * as Popover from '@radix-ui/react-popover';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Filter, ArrowUpDown, Check } from 'lucide-react';

interface FilterMenuProps {
  onSortChange?: (sort: string) => void;
  onFilterChange?: (filters: { myTasks: boolean; hideDone: boolean }) => void;
}

export const FilterMenu: React.FC<FilterMenuProps> = ({
  onSortChange,
  onFilterChange,
}) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow transition-all active:scale-95 outline-none focus:ring-2 focus:ring-indigo-500/20">
          <Filter className="w-4 h-4 mr-2" />
          Bộ lọc
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="w-72 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl p-4 animate-in zoom-in-95 duration-200 z-50"
          sideOffset={8}
          align="end"
        >
          <div className="space-y-5">
            {/* Sort Section */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center">
                <ArrowUpDown className="w-3 h-3 mr-1.5" /> Sắp xếp theo
              </h4>
              <RadioGroup.Root defaultValue="dueDate" onValueChange={onSortChange}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroup.Item
                      value="dueDate"
                      id="sort-due"
                      className="w-4 h-4 rounded-full border border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-indigo-600" />
                    </RadioGroup.Item>
                    <label
                      htmlFor="sort-due"
                      className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      Ngày đến hạn (Gần nhất)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroup.Item
                      value="priority"
                      id="sort-priority"
                      className="w-4 h-4 rounded-full border border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-indigo-600" />
                    </RadioGroup.Item>
                    <label
                      htmlFor="sort-priority"
                      className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      Độ ưu tiên (Cao nhất)
                    </label>
                  </div>
                </div>
              </RadioGroup.Root>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800" />

            {/* Filter Section */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center">
                <Filter className="w-3 h-3 mr-1.5" /> Lọc công việc
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox.Root
                    className="flex h-4 w-4 appearance-none items-center justify-center rounded border border-slate-300 bg-white data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    id="filter-me"
                    onCheckedChange={() =>
                      onFilterChange?.({ myTasks: true, hideDone: false })
                    }
                  >
                    <Checkbox.Indicator>
                      <Check className="h-3 w-3 text-white" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label
                    htmlFor="filter-me"
                    className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Chỉ hiện việc của tôi
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox.Root
                    className="flex h-4 w-4 appearance-none items-center justify-center rounded border border-slate-300 bg-white data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    id="filter-hide-done"
                    onCheckedChange={() =>
                      onFilterChange?.({ myTasks: false, hideDone: true })
                    }
                  >
                    <Checkbox.Indicator>
                      <Check className="h-3 w-3 text-white" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label
                    htmlFor="filter-hide-done"
                    className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Ẩn việc đã hoàn thành
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button className="w-full py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300 text-xs font-semibold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
          <Popover.Arrow className="fill-white dark:fill-slate-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
