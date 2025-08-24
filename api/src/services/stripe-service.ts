import Stripe from 'stripe';
import { InvocationContext } from '@azure/functions';
import { DonationRequest, PaymentResult } from '../shared/types';

// Initialize Stripe with secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

export async function processStripePayment(
    donationData: DonationRequest,
    context: InvocationContext
): Promise<PaymentResult> {
    try {
        const amount = Math.round(parseFloat(donationData.amount) * 100); // Convert to cents
        
        context.log(`Creating Stripe Payment Intent for $${donationData.amount} (${amount} cents)`);

        // Create customer if this is a recurring donation
        let customerId: string | undefined;
        if (donationData.isRecurring) {
            const customer = await stripe.customers.create({
                email: donationData.email,
                name: `${donationData.firstName} ${donationData.lastName}`,
                phone: donationData.phone,
                address: {
                    line1: donationData.address1!,
                    line2: donationData.address2,
                    city: donationData.city!,
                    state: donationData.state!,
                    postal_code: donationData.zipCode!,
                    country: donationData.country || 'US'
                },
                metadata: {
                    donor_type: 'recurring',
                    frequency: donationData.frequency || 'monthly',
                    anonymous: donationData.isAnonymous.toString()
                }
            });
            customerId = customer.id;
            context.log(`Created Stripe customer: ${customerId}`);
        }

        // Create Payment Intent
        const paymentIntentData: Stripe.PaymentIntentCreateParams = {
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
            description: `Donation to Adelante Story Foundation - ${donationData.firstName} ${donationData.lastName}`,
            receipt_email: donationData.email,
            metadata: {
                donor_first_name: donationData.firstName,
                donor_last_name: donationData.lastName,
                donor_email: donationData.email,
                donor_phone: donationData.phone,
                is_recurring: donationData.isRecurring.toString(),
                frequency: donationData.frequency || '',
                is_anonymous: donationData.isAnonymous.toString(),
                message: donationData.message || ''
            }
        };

        if (customerId) {
            paymentIntentData.customer = customerId;
        }

        const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

        // If this is a recurring donation, set up subscription
        if (donationData.isRecurring && customerId) {
            await setupRecurringDonation(
                customerId,
                amount,
                donationData.frequency || 'monthly',
                context
            );
        }

        context.log(`Created Payment Intent: ${paymentIntent.id}`);

        return {
            success: true,
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret!
        };

    } catch (error) {
        context.log.error('Stripe payment error:', error);
        
        const stripeError = error as Stripe.StripeError;
        return {
            success: false,
            error: stripeError.message || 'Payment processing failed'
        };
    }
}

async function setupRecurringDonation(
    customerId: string,
    amount: number,
    frequency: string,
    context: InvocationContext
): Promise<void> {
    try {
        // Create a price for the recurring donation
        const price = await stripe.prices.create({
            unit_amount: amount,
            currency: 'usd',
            recurring: {
                interval: frequency === 'quarterly' ? 'month' : frequency as any,
                interval_count: frequency === 'quarterly' ? 3 : 1
            },
            product_data: {
                name: 'Adelante Story Foundation Recurring Donation',
                description: `${frequency} recurring donation to Adelante Story Foundation`
            }
        });

        // Create subscription (but don't activate it yet - wait for initial payment confirmation)
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: price.id }],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
            metadata: {
                donation_type: 'recurring',
                frequency: frequency
            }
        });

        context.log(`Created subscription: ${subscription.id}`);
    } catch (error) {
        context.log.error('Subscription setup error:', error);
        // Don't fail the main payment for subscription setup errors
    }
}

// Webhook handler for Stripe events
export async function handleStripeWebhook(
    body: string,
    signature: string,
    context: InvocationContext
): Promise<boolean> {
    try {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
        
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret
        );

        context.log(`Stripe webhook event: ${event.type}`);

        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent, context);
                break;
            case 'payment_intent.payment_failed':
                await handlePaymentFailure(event.data.object as Stripe.PaymentIntent, context);
                break;
            case 'invoice.payment_succeeded':
                await handleRecurringPaymentSuccess(event.data.object as Stripe.Invoice, context);
                break;
            case 'invoice.payment_failed':
                await handleRecurringPaymentFailure(event.data.object as Stripe.Invoice, context);
                break;
        }

        return true;
    } catch (error) {
        context.log.error('Webhook processing error:', error);
        return false;
    }
}

async function handlePaymentSuccess(
    paymentIntent: Stripe.PaymentIntent,
    context: InvocationContext
): Promise<void> {
    context.log(`Payment succeeded: ${paymentIntent.id}`);
    
    // Update donation record in database
    // Send confirmation email
    // This would integrate with your database service
}

async function handlePaymentFailure(
    paymentIntent: Stripe.PaymentIntent,
    context: InvocationContext
): Promise<void> {
    context.log(`Payment failed: ${paymentIntent.id}`);
    
    // Update donation record status
    // Send failure notification email
}

async function handleRecurringPaymentSuccess(
    invoice: Stripe.Invoice,
    context: InvocationContext
): Promise<void> {
    context.log(`Recurring payment succeeded: ${invoice.id}`);
    
    // Create new donation record for recurring payment
    // Send thank you email
}

async function handleRecurringPaymentFailure(
    invoice: Stripe.Invoice,
    context: InvocationContext
): Promise<void> {
    context.log(`Recurring payment failed: ${invoice.id}`);
    
    // Send payment failure notification
    // Potentially pause subscription after multiple failures
}