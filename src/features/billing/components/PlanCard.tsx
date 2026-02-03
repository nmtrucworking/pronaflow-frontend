import React from 'react';
import { Check, X, ShieldCheck } from 'lucide-react';
import { PlanEntity } from '../types';
import { cn } from '@/lib/utils'; // Giả sử có utility function clsx/tailwind-merge
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'; // Tái sử dụng base card

interface PlanCardProps {
  plan: PlanEntity;
  isCurrent?: boolean;
  onUpgrade?: (planId: string) => void;
  isCompact?: boolean; // Hỗ trợ mật độ thông tin
}

export const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  isCurrent = false, 
  onUpgrade,
  isCompact = false 
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Card 
      className={cn(
        "relative flex flex-col h-full transition-all duration-200 border-2",
        plan.isPopular ? "border-primary shadow-lg scale-[1.02] z-10" : "border-border hover:border-muted-foreground/50",
        isCurrent ? "bg-accent/10 border-accent" : ""
      )}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-sm">
          Phổ biến nhất
        </div>
      )}

      <CardHeader className={cn("text-center", isCompact ? "pb-2 pt-4" : "pb-4")}>
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-2 min-h-[40px]">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="mb-6 text-center">
          <span className="text-3xl font-extrabold text-foreground">
            {plan.price === 0 ? "Miễn phí" : formatPrice(plan.price)}
          </span>
          {plan.price > 0 && <span className="text-muted-foreground">/tháng</span>}
        </div>

        <ul className={cn("space-y-3", isCompact ? "space-y-2" : "")}>
          {plan.features.map((feature: any) => (
            <li key={feature.id} className="flex items-start gap-3">
              {feature.included ? (
                <div className="mt-0.5 p-0.5 bg-green-100 dark:bg-green-900/30 rounded-full shrink-0">
                  <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="mt-0.5 p-0.5 shrink-0">
                   <X className="w-3 h-3 text-muted-foreground/50" />
                </div>
              )}
              <span className={cn(
                "text-sm", 
                feature.included ? "text-foreground" : "text-muted-foreground line-through decoration-muted-foreground/50"
              )}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pt-4">
        <Button 
          className="w-full" 
          variant={isCurrent ? "ghost" : plan.isPopular ? "primary" : "secondary"}
          disabled={isCurrent}
          onClick={() => onUpgrade?.(plan.plan_id)}
        >
          {isCurrent ? (
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Đang sử dụng
            </span>
          ) : (
            "Nâng cấp ngay"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};