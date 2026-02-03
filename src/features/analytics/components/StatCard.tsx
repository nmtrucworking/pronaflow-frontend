import React from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';
import { AnalyticStat } from '../types';

interface StatCardProps {
  stat: AnalyticStat;
  icon: React.ReactNode;
  isCompact?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ stat, icon, isCompact }) => {
  // Determine trend color based on status intention
  const trendColorMap = {
    default: "text-muted-foreground",
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    danger: "text-red-600 dark:text-red-400",
  };

  const TrendIcon = stat.trendDirection === 'up' ? ArrowUpRight : 
                    stat.trendDirection === 'down' ? ArrowDownRight : Minus;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className={cn("flex flex-row items-center justify-between pb-2", isCompact ? "space-y-0 p-3" : "space-y-0")}>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {stat.label}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent className={cn(isCompact ? "p-3 pt-0" : "")}>
        <div className="text-2xl font-bold tracking-tight">
          {stat.value}
          {stat.unit && <span className="text-sm font-normal text-muted-foreground ml-1">{stat.unit}</span>}
        </div>
        <p className={cn("text-xs flex items-center mt-1 font-medium", trendColorMap[stat.status])}>
          <TrendIcon className="h-4 w-4 mr-1" />
          {stat.trend > 0 ? `+${stat.trend}%` : `${stat.trend}%`}
          <span className="text-muted-foreground ml-1 font-normal opacity-80">
            {stat.trendLabel}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};