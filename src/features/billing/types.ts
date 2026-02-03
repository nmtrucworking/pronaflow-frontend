/**
 * Types & Mock Data for Billing Feature
 * Định nghĩa các kiểu dữ liệu và dữ liệu giả cho tính năng thanh toán
 */

// ============================================================================
// PLAN TYPES
// ============================================================================

export interface PlanFeature {
  id: string;
  text: string;
  included: boolean;
}

export interface PlanEntity {
  plan_id: string;
  name: string;
  description: string;
  price: number; // VND
  isPopular?: boolean;
  features: PlanFeature[];
}

// ============================================================================
// INVOICE TYPES
// ============================================================================

export type InvoiceStatus = 'paid' | 'open' | 'void' | 'uncollectible';

export interface InvoiceEntity {
  invoice_id: string;
  amount: number;
  currency: string; // e.g., 'VND', 'USD'
  status: InvoiceStatus;
  created_at: string; // ISO 8601 date string
}

// ============================================================================
// PAYMENT METHOD TYPES
// ============================================================================

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

// ============================================================================
// MOCK DATA
// ============================================================================

export const MOCK_PLANS: PlanEntity[] = [
  {
    plan_id: 'plan_free',
    name: 'Miễn phí',
    description: 'Phù hợp để bắt đầu',
    price: 0,
    features: [
      { id: 'f1', text: 'Tối đa 3 dự án', included: true },
      { id: 'f2', text: 'Tối đa 5 thành viên', included: true },
      { id: 'f3', text: '1GB lưu trữ', included: true },
      { id: 'f4', text: 'Lịch sử không giới hạn', included: false },
      { id: 'f5', text: 'Báo cáo nâng cao', included: false },
      { id: 'f6', text: 'Hỗ trợ ưu tiên', included: false },
    ],
  },
  {
    plan_id: 'plan_pro',
    name: 'Pro',
    description: 'Cho các doanh nghiệp nhỏ',
    price: 299000,
    isPopular: true,
    features: [
      { id: 'f1', text: 'Dự án không giới hạn', included: true },
      { id: 'f2', text: 'Tối đa 100 thành viên', included: true },
      { id: 'f3', text: '50GB lưu trữ', included: true },
      { id: 'f4', text: 'Lịch sử không giới hạn', included: true },
      { id: 'f5', text: 'Báo cáo nâng cao', included: true },
      { id: 'f6', text: 'Hỗ trợ ưu tiên', included: false },
    ],
  },
  {
    plan_id: 'plan_enterprise',
    name: 'Enterprise',
    description: 'Giải pháp tùy chỉnh',
    price: 999000,
    features: [
      { id: 'f1', text: 'Dự án không giới hạn', included: true },
      { id: 'f2', text: 'Thành viên không giới hạn', included: true },
      { id: 'f3', text: '1TB lưu trữ', included: true },
      { id: 'f4', text: 'Lịch sử không giới hạn', included: true },
      { id: 'f5', text: 'Báo cáo nâng cao', included: true },
      { id: 'f6', text: 'Hỗ trợ ưu tiên 24/7', included: true },
    ],
  },
];

export const MOCK_INVOICES: InvoiceEntity[] = [
  {
    invoice_id: 'INV-2023-001',
    amount: 299000,
    currency: 'VND',
    status: 'paid',
    created_at: '2023-10-01T10:00:00Z',
  },
  {
    invoice_id: 'INV-2023-002',
    amount: 299000,
    currency: 'VND',
    status: 'paid',
    created_at: '2023-09-01T10:00:00Z',
  },
  {
    invoice_id: 'INV-2023-003',
    amount: 299000,
    currency: 'VND',
    status: 'open',
    created_at: '2023-08-01T10:00:00Z',
  },
];

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'card',
    last4: '4242',
    expiry: '12/25',
    isDefault: true,
  },
  {
    id: 'pm_2',
    type: 'card',
    last4: '5555',
    expiry: '06/26',
    isDefault: false,
  },
];
