import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, CreditCard, Mail, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/routes/paths';

type PlanId = 'starter' | 'pro' | 'enterprise';
type PaymentMethod = 'card' | 'bank';

const plans = [
  {
    id: 'starter' as PlanId,
    name: 'Starter',
    price: 'Miễn phí',
    cycle: 'Dành cho cá nhân hoặc nhóm nhỏ',
    features: ['Tối đa 3 dự án', 'Kanban + Task cơ bản', 'Lưu trữ 1GB'],
  },
  {
    id: 'pro' as PlanId,
    name: 'Pro',
    price: '299.000đ',
    cycle: '/tháng/người dùng',
    features: ['Không giới hạn dự án', 'Timeline + báo cáo nâng cao', 'Lưu trữ 100GB'],
  },
  {
    id: 'enterprise' as PlanId,
    name: 'Enterprise',
    price: 'Liên hệ',
    cycle: 'Giải pháp theo nhu cầu doanh nghiệp',
    features: ['SSO + RBAC nâng cao', 'SLA 99.9%', 'Hỗ trợ ưu tiên 24/7'],
  },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [paymentData, setPaymentData] = useState({
    fullName: '',
    email: '',
    company: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const activePlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlan) ?? plans[1],
    [selectedPlan]
  );

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentData.fullName || !paymentData.email) return;
    if (paymentMethod === 'card' && (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvc)) return;
    setStep(3);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim().length < 6) return;
    setIsVerified(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link to={ROUTES.root} className="hover:text-indigo-600 transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-semibold">Pricing chi tiết</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Pricing chi tiết & Quy trình kích hoạt tài khoản</h1>
          <p className="text-slate-600 mt-3 max-w-3xl">Chọn gói phù hợp, hoàn tất thanh toán an toàn, sau đó xác thực email để kích hoạt workspace ngay lập tức.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => {
                setSelectedPlan(plan.id);
                if (step < 2) setStep(1);
              }}
              className={`w-full text-left rounded-2xl border p-6 transition-all ${selectedPlan === plan.id ? 'border-indigo-500 bg-indigo-50/40 shadow-sm' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{plan.name}</h2>
                  <p className="text-2xl font-extrabold text-indigo-700 mt-1">{plan.price} <span className="text-sm font-semibold text-slate-500">{plan.cycle}</span></p>
                </div>
                {selectedPlan === plan.id && <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-100 text-indigo-700">Đã chọn</span>}
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                    <Check size={14} className="text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          ))}

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold mb-4">Quy trình thanh toán & xác thực</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide mb-5">
              <span className={`px-3 py-1 rounded-full ${step >= 1 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>B1 Chọn gói</span>
              <span className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>B2 Thanh toán</span>
              <span className={`px-3 py-1 rounded-full ${step >= 3 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>B3 Xác thực</span>
            </div>

            {step === 1 && (
              <div>
                <p className="text-sm text-slate-600 mb-4">Bạn đang chọn gói <span className="font-bold text-slate-900">{activePlan.name}</span>. Tiếp tục để nhập thông tin thanh toán.</p>
                <button type="button" onClick={() => setStep(2)} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold">Tiếp tục thanh toán</button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input value={paymentData.fullName} onChange={(e) => setPaymentData((prev) => ({ ...prev, fullName: e.target.value }))} placeholder="Họ và tên" className="px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <input type="email" value={paymentData.email} onChange={(e) => setPaymentData((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email xác thực" className="px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <input value={paymentData.company} onChange={(e) => setPaymentData((prev) => ({ ...prev, company: e.target.value }))} placeholder="Tên công ty (tuỳ chọn)" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />

                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setPaymentMethod('card')} className={`px-3 py-2 rounded-lg border text-sm font-semibold ${paymentMethod === 'card' ? 'border-indigo-500 text-indigo-700 bg-indigo-50' : 'border-slate-300 text-slate-600'}`}>
                    <CreditCard size={14} className="inline mr-1" /> Thẻ quốc tế
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('bank')} className={`px-3 py-2 rounded-lg border text-sm font-semibold ${paymentMethod === 'bank' ? 'border-indigo-500 text-indigo-700 bg-indigo-50' : 'border-slate-300 text-slate-600'}`}>
                    Chuyển khoản
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="grid md:grid-cols-3 gap-4">
                    <input value={paymentData.cardNumber} onChange={(e) => setPaymentData((prev) => ({ ...prev, cardNumber: e.target.value }))} placeholder="Số thẻ" className="md:col-span-2 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input value={paymentData.expiry} onChange={(e) => setPaymentData((prev) => ({ ...prev, expiry: e.target.value }))} placeholder="MM/YY" className="px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input value={paymentData.cvc} onChange={(e) => setPaymentData((prev) => ({ ...prev, cvc: e.target.value }))} placeholder="CVC" className="px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    Chuyển khoản đến tài khoản doanh nghiệp PronaFlow. Sau khi nhận giao dịch, hệ thống sẽ gửi email xác thực kích hoạt.
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setStep(1)} className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold">Quay lại</button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold">Xác nhận thanh toán</button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div>
                {!isVerified ? (
                  <form onSubmit={handleVerify} className="space-y-4">
                    <p className="text-sm text-slate-600">Mã xác thực đã gửi đến <span className="font-bold text-slate-900">{paymentData.email || 'email của bạn'}</span>. Nhập mã để kích hoạt tài khoản.</p>
                    <input value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="Nhập mã xác thực (6 ký tự)" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setStep(2)} className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold">Sửa thanh toán</button>
                      <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold">Xác thực tài khoản</button>
                    </div>
                  </form>
                ) : (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                      <ShieldCheck size={18} /> Kích hoạt thành công
                    </div>
                    <p className="text-sm text-emerald-800 mb-4">Tài khoản đã được xác thực. Bạn có thể bắt đầu tạo workspace và dùng đầy đủ tính năng của gói {activePlan.name}.</p>
                    <button type="button" onClick={() => navigate(ROUTES.auth.register)} className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Đi đến đăng ký</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">Tóm tắt đơn hàng</h3>
            <div className="text-sm text-slate-600 space-y-2">
              <div className="flex justify-between"><span>Gói đã chọn</span><span className="font-semibold text-slate-900">{activePlan.name}</span></div>
              <div className="flex justify-between"><span>Giá</span><span className="font-semibold text-indigo-700">{activePlan.price}</span></div>
              <div className="flex justify-between"><span>Kênh thanh toán</span><span className="font-semibold text-slate-900">{paymentMethod === 'card' ? 'Thẻ quốc tế' : 'Chuyển khoản'}</span></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-2">Xác thực tài khoản</h3>
            <p className="text-sm text-slate-600">Sau thanh toán, hệ thống gửi mã xác thực qua email để kích hoạt và bảo vệ tài khoản khỏi đăng ký giả mạo.</p>
            <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
              <Mail size={12} /> Email verification bắt buộc
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
