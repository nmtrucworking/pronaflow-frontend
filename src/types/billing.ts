export interface PlanFeature {
  id: string;
  text: string;
  included: boolean;
}

export interface PlanEntity {
  plan_id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billing_cycle: 'monthly' | 'yearly';
  features: PlanFeature[];
  isPopular?: boolean;
}

export interface InvoiceEntity {
  invoice_id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  created_at: string; // ISO Date
  pdf_url: string;
}

export interface PaymentMethodEntity {
  id: string;
  type: 'visa' | 'mastercard' | 'paypal';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

// --- MOCK DATA (Dữ liệu giả lập để hiển thị UI) ---

export const MOCK_PLANS: PlanEntity[] = [
  {
    plan_id: 'plan_free',
    name: 'Starter',
    description: 'Dành cho cá nhân và freelancer',
    price: 0,
    currency: 'VND',
    billing_cycle: 'monthly',
    features: [
      { id: '1', text: 'Tối đa 3 dự án', included: true },
      { id: '2', text: '5GB Lưu trữ', included: true },
      { id: '3', text: 'Cộng tác cơ bản', included: true },
      { id: '4', text: 'Báo cáo nâng cao', included: false },
    ]
  },
  {
    plan_id: 'plan_pro',
    name: 'Professional',
    description: 'Tối ưu cho các team nhỏ đang tăng trưởng',
    price: 299000,
    currency: 'VND',
    billing_cycle: 'monthly',
    features: [
      { id: '1', text: 'Không giới hạn dự án', included: true },
      { id: '2', text: '50GB Lưu trữ', included: true },
      { id: '3', text: 'Quyền hạn nâng cao (RBAC)', included: true },
      { id: '4', text: 'Gantt Chart & Analytics', included: true },
    ],
    isPopular: true
  },
  {
    plan_id: 'plan_enterprise',
    name: 'Enterprise',
    description: 'Bảo mật và kiểm soát tối đa',
    price: 999000,
    currency: 'VND',
    billing_cycle: 'monthly',
    features: [
      { id: '1', text: 'Tất cả tính năng Pro', included: true },
      { id: '2', text: 'Không giới hạn lưu trữ', included: true },
      { id: '3', text: 'SSO & Audit Logs', included: true },
      { id: '4', text: 'Hỗ trợ 24/7', included: true },
    ]
  }
];

export const MOCK_INVOICES: InvoiceEntity[] = [
  { invoice_id: 'INV-2023-001', amount: 299000, currency: 'VND', status: 'paid', created_at: '2023-10-01', pdf_url: '#' },
  { invoice_id: 'INV-2023-002', amount: 299000, currency: 'VND', status: 'paid', created_at: '2023-11-01', pdf_url: '#' },
  { invoice_id: 'INV-2023-003', amount: 299000, currency: 'VND', status: 'open', created_at: '2023-12-01', pdf_url: '#' },
];

export const MOCK_PAYMENT_METHODS: PaymentMethodEntity[] = [
  { id: 'pm_1', type: 'visa', last4: '4242', expiry: '12/24', isDefault: true },
  { id: 'pm_2', type: 'mastercard', last4: '8888', expiry: '09/25', isDefault: false },
];