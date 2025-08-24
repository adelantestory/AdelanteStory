import { z } from 'zod';

export const donationRequestSchema = z.object({
  amount: z.string().refine(val => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Amount must be a positive number"),
  
  paymentMethod: z.enum(['credit-card', 'paypal', 'bank-transfer']),
  
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  
  // Conditional billing address fields
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  
  isRecurring: z.boolean().default(false),
  frequency: z.enum(['monthly', 'quarterly', 'annually']).optional(),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false)
}).refine(data => {
  // If credit card payment, billing address is required
  if (data.paymentMethod === 'credit-card') {
    return data.address1 && data.city && data.state && data.zipCode;
  }
  return true;
}, {
  message: "Billing address is required for credit card payments",
  path: ['address1']
});

export const validateDonationRequest = (data: any) => {
  return donationRequestSchema.parse(data);
};