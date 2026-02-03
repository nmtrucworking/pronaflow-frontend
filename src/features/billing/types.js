"use strict";
/**
 * Types & Mock Data for Billing Feature
 * Định nghĩa các kiểu dữ liệu và dữ liệu giả cho tính năng thanh toán
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOCK_PAYMENT_METHODS = exports.MOCK_INVOICES = exports.MOCK_PLANS = void 0;
// ============================================================================
// MOCK DATA
// ============================================================================
exports.MOCK_PLANS = [
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
exports.MOCK_INVOICES = [
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
exports.MOCK_PAYMENT_METHODS = [
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
