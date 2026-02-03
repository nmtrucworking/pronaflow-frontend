import React from 'react';
import { BarChart3, PieChart, LineChart, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ChartPlaceholderProps {
  title: string;
  description?: string;
  type: 'bar' | 'pie' | 'line' | 'area';
  height?: string; // Tailwind h-class
}

export const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ 
  title, 
  description, 
  type,
  height = "h-[300px]" 
}) => {
  const Icon = type === 'pie' ? PieChart : type === 'line' ? LineChart : type === 'area' ? Activity : BarChart3;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <div className={cn(
          "w-full rounded-md border border-dashed bg-muted/30 flex flex-col items-center justify-center text-muted-foreground animate-pulse",
          height
        )}>
          <div className="p-4 bg-background rounded-full mb-3 shadow-sm">
            <Icon className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <span className="text-sm font-medium">Biểu đồ đang được khởi tạo...</span>
          <span className="text-xs opacity-70 mt-1">Recharts Visualization Placeholder</span>
        </div>
      </CardContent>
    </Card>
  );
};