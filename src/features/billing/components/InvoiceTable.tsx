import React from 'react';
import { Download, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { InvoiceEntity } from '../types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

interface InvoiceTableProps {
  invoices: InvoiceEntity[];
  isCompact?: boolean;
}

const StatusBadge = ({ status }: { status: InvoiceEntity['status'] }) => {
  const styles: Record<InvoiceEntity['status'], string> = {
    paid: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    open: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    void: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    uncollectible: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  };

  const icons: Record<InvoiceEntity['status'], React.ReactNode> = {
    paid: <CheckCircle2 className="w-3 h-3 mr-1" />,
    open: <AlertCircle className="w-3 h-3 mr-1" />,
    void: null,
    uncollectible: <AlertCircle className="w-3 h-3 mr-1" />,
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      styles[status]
    )}>
      {icons[status]}
      <span className="capitalize">{status === 'paid' ? 'Đã thanh toán' : status === 'open' ? 'Chờ thanh toán' : status}</span>
    </span>
  );
};

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, isCompact }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(amount);
  };

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-card">
        <div className="bg-muted p-4 rounded-full mb-3">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Chưa có hóa đơn nào</h3>
        <p className="text-muted-foreground max-w-sm mt-1">
          Lịch sử thanh toán của bạn sẽ xuất hiện ở đây sau khi bạn đăng ký gói trả phí.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto rounded-md border bg-card">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted/50 text-muted-foreground font-medium">
          <tr>
            <th className={cn("px-4 py-3", isCompact ? "py-2" : "")}>Mã hóa đơn</th>
            <th className={cn("px-4 py-3", isCompact ? "py-2" : "")}>Ngày tạo</th>
            <th className={cn("px-4 py-3", isCompact ? "py-2" : "")}>Số tiền</th>
            <th className={cn("px-4 py-3 text-center", isCompact ? "py-2" : "")}>Trạng thái</th>
            <th className={cn("px-4 py-3 text-right", isCompact ? "py-2" : "")}>Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {invoices.map((invoice) => (
            <tr key={invoice.invoice_id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">
                {invoice.invoice_id}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(invoice.created_at)}
              </td>
              <td className="px-4 py-3 font-medium">
                {formatCurrency(invoice.amount, invoice.currency)}
              </td>
              <td className="px-4 py-3 text-center">
                <StatusBadge status={invoice.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="w-4 h-4 text-muted-foreground" />
                  <span className="sr-only">Tải về</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};