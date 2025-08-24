export interface DonationRequest {
  amount: string;
  paymentMethod: 'credit-card' | 'paypal' | 'bank-transfer';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Billing address (for credit card only)
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  // Optional fields
  isRecurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'annually';
  message?: string;
  isAnonymous: boolean;
}

export interface DonationRecord {
  id: string;
  donorId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  stripePaymentIntentId?: string;
  paypalOrderId?: string;
  bankTransferReference?: string;
  isRecurring: boolean;
  frequency?: string;
  message?: string;
  isAnonymous: boolean;
  createdAt: Date;
  processedAt?: Date;
}

export interface Donor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdAt: Date;
  lastDonationAt?: Date;
  totalDonated?: number;
}

export interface PaymentResult {
  success: boolean;
  donationId?: string;
  paymentIntentId?: string;
  clientSecret?: string;
  paypalOrderId?: string;
  bankTransferInstructions?: {
    accountNumber: string;
    routingNumber: string;
    accountName: string;
    reference: string;
    instructions: string;
  };
  error?: string;
  requiresAction?: boolean;
}