import { CreditCard, Check, ArrowRight } from 'lucide-react';
import { PlanCard } from '../components/PlanCard';
import { MOCK_PLANS } from '../types';
import { Button } from '@/components/ui';

export default function PublicBillingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto max-w-6xl py-12 md:py-20 px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold mb-4">
            <CreditCard className="w-4 h-4" />
            Gói cước linh hoạt
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Chọn gói phù hợp cho bạn
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Từ startup nhỏ đến doanh nghiệp lớn, PronaFlow có giải pháp quản lý dự án hoàn hảo cho mọi quy mô tổ chức.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className="text-sm font-medium text-muted-foreground">Thanh toán hàng tháng</span>
          <button className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-300 dark:bg-slate-600 transition-colors hover:bg-slate-400 dark:hover:bg-slate-500">
            <span className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform" />
          </button>
          <span className="text-sm font-medium text-muted-foreground">
            Thanh toán hàng năm
            <span className="ml-2 inline-block px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
              Tiết kiệm 20%
            </span>
          </span>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {MOCK_PLANS.map((plan) => (
            <PlanCard
              key={plan.plan_id}
              plan={plan}
              isCurrent={false}
              onUpgrade={(id) => console.log('Upgrade to:', id)}
            />
          ))}
        </div>

        {/* Enterprise Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Gói Enterprise</h3>
              <p className="text-muted-foreground">Giải pháp tùy chỉnh hoàn toàn cho tổ chức lớn với yêu cầu đặc biệt.</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-medium">Private Cloud Deployment</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-medium">SLA và Hỗ trợ 24/7 riêng</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-medium">Custom Integrations</span>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <Button className="gap-2">
                Liên hệ Sales <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Các câu hỏi thường gặp</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: 'Tôi có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào?',
                a: 'Có, bạn có thể thay đổi gói vào bất cứ lúc nào. Chúng tôi sẽ tính toán lại giá theo từng ngày.'
              },
              {
                q: 'Có thời gian dùng thử miễn phí?',
                a: 'Có, bạn có 14 ngày dùng thử miễn phí với đầy đủ tính năng của gói Pro.'
              },
              {
                q: 'Những gì xảy ra nếu tôi hủy gói?',
                a: 'Bạn vẫn có thể truy cập dữ liệu trong 30 ngày. Sau đó, dữ liệu sẽ bị xóa vĩnh viễn.'
              },
              {
                q: 'Bạn chấp nhận những phương thức thanh toán nào?',
                a: 'Chúng tôi chấp nhận thẻ tín dụng, chuyển khoản ngân hàng và ví điện tử phổ biến.'
              }
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
