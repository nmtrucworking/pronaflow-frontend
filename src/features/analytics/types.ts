export interface AnalyticStat {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend: number; // Percentage change
  trendDirection: 'up' | 'down' | 'neutral';
  trendLabel: string; // e.g., "vs last month"
  status: 'default' | 'success' | 'warning' | 'danger';
}

export interface ChartConfig {
  id: string;
  title: string;
  description?: string;
  type: 'bar' | 'line' | 'pie' | 'area';
}

// --- MOCK DATA ---

export const MOCK_STATS: AnalyticStat[] = [
  {
    id: 'total-tasks',
    label: 'Tổng số công việc',
    value: 124,
    trend: 12,
    trendDirection: 'up',
    trendLabel: 'so với tháng trước',
    status: 'default'
  },
  {
    id: 'completed',
    label: 'Đã hoàn thành',
    value: 86,
    trend: 8,
    trendDirection: 'up',
    trendLabel: 'năng suất tăng',
    status: 'success'
  },
  {
    id: 'in-progress',
    label: 'Đang thực hiện',
    value: 28,
    trend: 2,
    trendDirection: 'down',
    trendLabel: 'ổn định',
    status: 'warning' // Yellow/Blue depending on theme logic
  },
  {
    id: 'overdue',
    label: 'Quá hạn',
    value: 10,
    trend: 5,
    trendDirection: 'up', // Tăng là xấu
    trendLabel: 'cần chú ý ngay',
    status: 'danger'
  }
];