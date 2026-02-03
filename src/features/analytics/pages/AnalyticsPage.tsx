import { 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  AlertTriangle, 
  Download, 
  Calendar as CalendarIcon,
  Filter
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui';
import { StatCard } from '../components/StatCard';
import { ChartPlaceholder } from '../components/ChartPlaceholder';
import { MOCK_STATS } from '../types';

const AnalyticsPage = () => {
  // Giả lập state compact từ user settings
  const isCompact = false;

  const getIconForStat = (id: string) => {
    switch (id) {
      case 'total-tasks': return <ListTodo className="w-4 h-4" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      default: return <ListTodo className="w-4 h-4" />;
    }
  };

  return (
    <MainLayout title="Báo cáo & Phân tích">
      <div className="container mx-auto p-6 space-y-8 max-w-[1600px]">
        
        {/* Header Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Tổng quan hiệu suất</h1>
            <p className="text-muted-foreground">Dữ liệu thời gian thực về tiến độ dự án và năng suất đội ngũ.</p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="secondary" size="sm" className="flex-1 sm:flex-none">
              <CalendarIcon className="w-4 h-4 mr-2" /> 30 ngày qua
            </Button>
            <Button variant="secondary" size="sm" className="flex-1 sm:flex-none">
              <Filter className="w-4 h-4 mr-2" /> Bộ lọc
            </Button>
            <Button variant="primary" size="sm" className="flex-1 sm:flex-none">
              <Download className="w-4 h-4 mr-2" /> Xuất PDF
            </Button>
          </div>
        </div>

        {/* 1. Vital Signs Row (Grid 4 cột) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_STATS.map((stat) => (
            <StatCard 
              key={stat.id} 
              stat={stat} 
              icon={getIconForStat(stat.id)}
              isCompact={isCompact}
            />
          ))}
        </section>

        {/* 2. Main Analytics Grid (2x2 Layout) */}
        {/* Rationale: Grid 2x2 trên màn hình lớn giúp so sánh dữ liệu song song.
           Trên mobile sẽ tự động stack thành 1 cột.
        */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Left: Trend over time */}
          <div className="lg:col-span-1">
            <ChartPlaceholder 
              title="Tiến độ công việc (Burn-down)"
              description="So sánh kế hoạch vs thực tế theo tuần"
              type="area"
              height="h-[350px]"
            />
          </div>

          {/* Top Right: Status Distribution */}
          <div className="lg:col-span-1">
            <ChartPlaceholder 
              title="Phân bổ trạng thái"
              description="Tỷ lệ công việc theo trạng thái hiện tại"
              type="pie"
              height="h-[350px]"
            />
          </div>

          {/* Bottom Left: Resource Utilization */}
          <div className="lg:col-span-1">
            <ChartPlaceholder 
              title="Hiệu suất thành viên"
              description="Số lượng task hoàn thành theo nhân sự"
              type="bar"
              height="h-[350px]"
            />
          </div>

          {/* Bottom Right: Priority Analysis */}
          <div className="lg:col-span-1">
            <ChartPlaceholder 
              title="Mức độ ưu tiên & Rủi ro"
              description="Phân tích task theo độ ưu tiên (High/Urgent)"
              type="bar"
              height="h-[350px]"
            />
          </div>

        </section>
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage;