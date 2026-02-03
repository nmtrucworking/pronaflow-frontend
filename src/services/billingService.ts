/**
 * Billing & Subscription Service
 * Module 13: Subscription & Billing Management
 * 
 * Handles subscriptions, plans, billing, and invoices
 */

import axiosClient from '@/lib/axiosClient';
import type { AxiosResponse } from 'axios';

// ============================================================================
// TYPES
// ============================================================================

export interface SubscriptionPlan {
  plan_id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billing_period: 'monthly' | 'yearly';
  features: string[];
  limits: {
    max_projects?: number;
    max_members?: number;
    max_storage_gb?: number;
    max_integrations?: number;
  };
  is_active: boolean;
  created_at: string;
}

export interface WorkspaceSubscription {
  subscription_id: string;
  workspace_id: string;
  plan_id: string;
  plan_name: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  trial_end?: string;
  created_at: string;
}

export interface UsageMetrics {
  workspace_id: string;
  period_start: string;
  period_end: string;
  usage: {
    projects_count: number;
    projects_limit: number;
    members_count: number;
    members_limit: number;
    storage_used_gb: number;
    storage_limit_gb: number;
    api_calls: number;
    api_calls_limit: number;
  };
  overages: Record<string, number>;
}

export interface Client {
  client_id: string;
  workspace_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  tax_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  invoice_id: string;
  workspace_id: string;
  client_id?: string;
  invoice_number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  items: InvoiceItem[];
  notes?: string;
  payment_method?: string;
  paid_at?: string;
  created_at: string;
}

export interface InvoiceItem {
  item_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface PaymentMethod {
  payment_method_id: string;
  type: 'card' | 'bank_account' | 'paypal';
  last4?: string;
  brand?: string;
  is_default: boolean;
  created_at: string;
}

// ============================================================================
// SUBSCRIPTION PLANS
// ============================================================================

/**
 * Get all subscription plans
 */
export const getPlans = async (): Promise<AxiosResponse<{ plans: SubscriptionPlan[] }>> => {
  return axiosClient.get('/subscription/plans');
};

/**
 * Get plan details
 */
export const getPlanById = async (
  planId: string
): Promise<AxiosResponse<SubscriptionPlan>> => {
  return axiosClient.get(`/subscription/plans/${planId}`);
};

/**
 * Create subscription plan (admin only)
 */
export const createPlan = async (
  data: Partial<SubscriptionPlan>
): Promise<AxiosResponse<SubscriptionPlan>> => {
  return axiosClient.post('/subscription/plans', data);
};

/**
 * Update subscription plan (admin only)
 */
export const updatePlan = async (
  planId: string,
  data: Partial<SubscriptionPlan>
): Promise<AxiosResponse<SubscriptionPlan>> => {
  return axiosClient.patch(`/subscription/plans/${planId}`, data);
};

// ============================================================================
// WORKSPACE SUBSCRIPTIONS
// ============================================================================

/**
 * Get workspace subscription
 */
export const getWorkspaceSubscription = async (
  workspaceId: string
): Promise<AxiosResponse<WorkspaceSubscription>> => {
  return axiosClient.get(`/subscription/workspaces/${workspaceId}/subscription`);
};

/**
 * Create workspace subscription
 */
export const createSubscription = async (
  workspaceId: string,
  data: {
    plan_id: string;
    payment_method_id?: string;
  }
): Promise<AxiosResponse<WorkspaceSubscription>> => {
  return axiosClient.post(`/subscription/workspaces/${workspaceId}/subscription`, data);
};

/**
 * Upgrade/downgrade subscription
 */
export const upgradeSubscription = async (
  workspaceId: string,
  data: {
    new_plan_id: string;
  }
): Promise<AxiosResponse<WorkspaceSubscription>> => {
  return axiosClient.post(`/subscription/workspaces/${workspaceId}/subscription/upgrade`, data);
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (
  workspaceId: string,
  data?: {
    cancel_at_period_end: boolean;
    reason?: string;
  }
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post(`/subscription/workspaces/${workspaceId}/subscription/cancel`, data);
};

/**
 * Reactivate cancelled subscription
 */
export const reactivateSubscription = async (
  workspaceId: string
): Promise<AxiosResponse<WorkspaceSubscription>> => {
  return axiosClient.post(`/subscription/workspaces/${workspaceId}/subscription/reactivate`);
};

// ============================================================================
// USAGE & BILLING
// ============================================================================

/**
 * Get workspace usage metrics
 */
export const getUsageMetrics = async (
  workspaceId: string,
  params?: {
    period_start?: string;
    period_end?: string;
  }
): Promise<AxiosResponse<UsageMetrics>> => {
  return axiosClient.get(`/subscription/workspaces/${workspaceId}/usage`, { params });
};

/**
 * Get usage summary
 */
export const getUsageSummary = async (
  workspaceId: string
): Promise<AxiosResponse<any>> => {
  return axiosClient.get(`/subscription/workspaces/${workspaceId}/usage/summary`);
};

// ============================================================================
// CLIENTS (for Freelancers)
// ============================================================================

/**
 * Get all clients
 */
export const getClients = async (
  workspaceId: string,
  params?: {
    page?: number;
    page_size?: number;
    search?: string;
  }
): Promise<AxiosResponse<{ clients: Client[]; pagination: any }>> => {
  return axiosClient.get(`/subscription/workspaces/${workspaceId}/clients`, { params });
};

/**
 * Get client by ID
 */
export const getClientById = async (
  clientId: string
): Promise<AxiosResponse<Client>> => {
  return axiosClient.get(`/subscription/clients/${clientId}`);
};

/**
 * Create client
 */
export const createClient = async (
  workspaceId: string,
  data: Partial<Client>
): Promise<AxiosResponse<Client>> => {
  return axiosClient.post(`/subscription/workspaces/${workspaceId}/clients`, data);
};

/**
 * Update client
 */
export const updateClient = async (
  clientId: string,
  data: Partial<Client>
): Promise<AxiosResponse<Client>> => {
  return axiosClient.patch(`/subscription/clients/${clientId}`, data);
};

/**
 * Delete client
 */
export const deleteClient = async (
  clientId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.delete(`/subscription/clients/${clientId}`);
};

// ============================================================================
// INVOICES
// ============================================================================

/**
 * Get all invoices
 */
export const getInvoices = async (
  workspaceId: string,
  params?: {
    status?: string;
    client_id?: string;
    page?: number;
    page_size?: number;
  }
): Promise<AxiosResponse<{ invoices: Invoice[]; pagination: any }>> => {
  return axiosClient.get(`/subscription/workspaces/${workspaceId}/invoices`, { params });
};

/**
 * Get invoice by ID
 */
export const getInvoiceById = async (
  invoiceId: string
): Promise<AxiosResponse<Invoice>> => {
  return axiosClient.get(`/subscription/invoices/${invoiceId}`);
};

/**
 * Create invoice
 */
export const createInvoice = async (
  workspaceId: string,
  data: Partial<Invoice>
): Promise<AxiosResponse<Invoice>> => {
  return axiosClient.post(`/subscription/workspaces/${workspaceId}/invoices`, data);
};

/**
 * Update invoice status
 */
export const updateInvoiceStatus = async (
  invoiceId: string,
  data: {
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    payment_method?: string;
  }
): Promise<AxiosResponse<Invoice>> => {
  return axiosClient.patch(`/subscription/invoices/${invoiceId}/status`, data);
};

/**
 * Generate invoice PDF
 */
export const generateInvoicePDF = async (
  invoiceId: string
): Promise<AxiosResponse<Blob>> => {
  return axiosClient.post(
    `/subscription/invoices/${invoiceId}/generate-pdf`,
    {},
    { responseType: 'blob' }
  );
};

/**
 * Send invoice to client
 */
export const sendInvoice = async (
  invoiceId: string,
  data?: {
    email?: string;
    message?: string;
  }
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post(`/subscription/invoices/${invoiceId}/send`, data);
};

// ============================================================================
// PAYMENT METHODS
// ============================================================================

/**
 * Get payment methods
 */
export const getPaymentMethods = async (
  workspaceId: string
): Promise<AxiosResponse<{ payment_methods: PaymentMethod[] }>> => {
  return axiosClient.get(`/subscription/workspaces/${workspaceId}/payment-methods`);
};

/**
 * Add payment method
 */
export const addPaymentMethod = async (
  workspaceId: string,
  data: {
    type: 'card' | 'bank_account' | 'paypal';
    token: string;
    set_as_default?: boolean;
  }
): Promise<AxiosResponse<PaymentMethod>> => {
  return axiosClient.post(`/subscription/workspaces/${workspaceId}/payment-methods`, data);
};

/**
 * Delete payment method
 */
export const deletePaymentMethod = async (
  paymentMethodId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.delete(`/subscription/payment-methods/${paymentMethodId}`);
};

/**
 * Set default payment method
 */
export const setDefaultPaymentMethod = async (
  paymentMethodId: string
): Promise<AxiosResponse<{ message: string }>> => {
  return axiosClient.post(`/subscription/payment-methods/${paymentMethodId}/set-default`);
};

export default {
  // Plans
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  
  // Subscriptions
  getWorkspaceSubscription,
  createSubscription,
  upgradeSubscription,
  cancelSubscription,
  reactivateSubscription,
  
  // Usage
  getUsageMetrics,
  getUsageSummary,
  
  // Clients
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  
  // Invoices
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoiceStatus,
  generateInvoicePDF,
  sendInvoice,
  
  // Payment Methods
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
};
