import { Button } from '@/components/ui';
import { PaymentMethod } from '../types';

interface PaymentMethodCardProps {
  method: PaymentMethod;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ method }) => (
  <div className="flex items-center justify-between p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
    <div className="flex items-center gap-4">
      <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
        {method.type}
      </div>
      <div>
        <p className="font-medium text-foreground">•••• •••• •••• {method.last4}</p>
        <p className="text-xs text-muted-foreground">Hết hạn {method.expiry}</p>
      </div>
    </div>
    {method.isDefault ? (
      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Mặc định</span>
    ) : (
      <Button variant="ghost" size="sm" className="text-xs h-7">Đặt làm mặc định</Button>
    )}
  </div>
);
