import * as paypal from '@paypal/checkout-server-sdk';
import { InvocationContext } from '@azure/functions';
import { DonationRequest, PaymentResult } from '../shared/types';

// PayPal environment setup
function environment() {
    const clientId = process.env.PAYPAL_CLIENT_ID!;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
    
    // Use sandbox for development, live for production
    const isProduction = process.env.NODE_ENV === 'production';
    
    return isProduction
        ? new paypal.core.LiveEnvironment(clientId, clientSecret)
        : new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
    return new paypal.core.PayPalHttpClient(environment());
}

export async function processPayPalPayment(
    donationData: DonationRequest,
    context: InvocationContext
): Promise<PaymentResult> {
    try {
        const amount = parseFloat(donationData.amount).toFixed(2);
        
        context.log(`Creating PayPal order for $${amount}`);

        // Create PayPal order request
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        
        const orderData: any = {
            intent: 'CAPTURE',
            application_context: {
                return_url: `${process.env.FRONTEND_URL}/donation/success`,
                cancel_url: `${process.env.FRONTEND_URL}/donation/cancelled`,
                brand_name: 'Adelante Story Foundation',
                landing_page: 'BILLING',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW'
            },
            purchase_units: [{
                reference_id: `DONATION_${Date.now()}`,
                description: `Donation to Adelante Story Foundation - ${donationData.firstName} ${donationData.lastName}`,
                custom_id: JSON.stringify({
                    donor_email: donationData.email,
                    donor_name: `${donationData.firstName} ${donationData.lastName}`,
                    is_recurring: donationData.isRecurring,
                    frequency: donationData.frequency,
                    is_anonymous: donationData.isAnonymous,
                    message: donationData.message
                }),
                amount: {
                    currency_code: 'USD',
                    value: amount,
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: amount
                        }
                    }
                },
                items: [{
                    name: 'Donation to Adelante Story Foundation',
                    description: donationData.isRecurring 
                        ? `${donationData.frequency} recurring donation` 
                        : 'One-time donation',
                    unit_amount: {
                        currency_code: 'USD',
                        value: amount
                    },
                    quantity: '1',
                    category: 'DONATION'
                }]
            }],
            payer: {
                name: {
                    given_name: donationData.firstName,
                    surname: donationData.lastName
                },
                email_address: donationData.email,
                phone: {
                    phone_number: {
                        national_number: donationData.phone
                    }
                }
            }
        };

        // Handle recurring donations with PayPal subscriptions
        if (donationData.isRecurring) {
            return await createPayPalSubscription(donationData, context);
        }

        request.requestBody(orderData);

        const order = await client().execute(request);
        
        context.log(`PayPal order created: ${order.result.id}`);

        // Find the approval URL
        const approvalUrl = order.result.links?.find(
            (link: any) => link.rel === 'approve'
        )?.href;

        return {
            success: true,
            paypalOrderId: order.result.id,
            // Frontend will redirect to this URL for PayPal approval
            redirectUrl: approvalUrl
        };

    } catch (error) {
        context.log.error('PayPal payment error:', error);
        
        return {
            success: false,
            error: 'PayPal payment processing failed'
        };
    }
}

async function createPayPalSubscription(
    donationData: DonationRequest,
    context: InvocationContext
): Promise<PaymentResult> {
    try {
        // First, create a product
        const productRequest = new paypal.catalog.ProductsCreateRequest();
        productRequest.requestBody({
            name: 'Adelante Story Foundation Recurring Donation',
            description: `${donationData.frequency} recurring donation to Adelante Story Foundation`,
            type: 'SERVICE',
            category: 'NON_PROFIT'
        });

        const product = await client().execute(productRequest);
        context.log(`PayPal product created: ${product.result.id}`);

        // Create billing plan
        const planRequest = new paypal.subscriptions.PlansCreateRequest();
        
        const interval = getPayPalInterval(donationData.frequency || 'monthly');
        const amount = parseFloat(donationData.amount).toFixed(2);

        planRequest.requestBody({
            product_id: product.result.id,
            name: `${donationData.frequency} Donation Plan - $${amount}`,
            description: `${donationData.frequency} recurring donation of $${amount}`,
            billing_cycles: [{
                frequency: {
                    interval_unit: interval.unit,
                    interval_count: interval.count
                },
                tenure_type: 'REGULAR',
                sequence: 1,
                pricing_scheme: {
                    fixed_price: {
                        value: amount,
                        currency_code: 'USD'
                    }
                }
            }],
            payment_preferences: {
                auto_bill_outstanding: true,
                setup_fee: {
                    value: '0',
                    currency_code: 'USD'
                },
                setup_fee_failure_action: 'CONTINUE',
                payment_failure_threshold: 3
            }
        });

        const plan = await client().execute(planRequest);
        context.log(`PayPal plan created: ${plan.result.id}`);

        // Create subscription
        const subscriptionRequest = new paypal.subscriptions.SubscriptionsCreateRequest();
        subscriptionRequest.requestBody({
            plan_id: plan.result.id,
            start_time: new Date(Date.now() + 60000).toISOString(), // Start in 1 minute
            subscriber: {
                name: {
                    given_name: donationData.firstName,
                    surname: donationData.lastName
                },
                email_address: donationData.email
            },
            application_context: {
                brand_name: 'Adelante Story Foundation',
                locale: 'en-US',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'SUBSCRIBE_NOW',
                payment_method: {
                    payer_selected: 'PAYPAL',
                    payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
                },
                return_url: `${process.env.FRONTEND_URL}/donation/success`,
                cancel_url: `${process.env.FRONTEND_URL}/donation/cancelled`
            }
        });

        const subscription = await client().execute(subscriptionRequest);
        context.log(`PayPal subscription created: ${subscription.result.id}`);

        // Find approval URL
        const approvalUrl = subscription.result.links?.find(
            (link: any) => link.rel === 'approve'
        )?.href;

        return {
            success: true,
            paypalOrderId: subscription.result.id,
            redirectUrl: approvalUrl
        };

    } catch (error) {
        context.log.error('PayPal subscription error:', error);
        return {
            success: false,
            error: 'PayPal subscription setup failed'
        };
    }
}

function getPayPalInterval(frequency: string): { unit: string, count: number } {
    switch (frequency) {
        case 'monthly':
            return { unit: 'MONTH', count: 1 };
        case 'quarterly':
            return { unit: 'MONTH', count: 3 };
        case 'annually':
            return { unit: 'YEAR', count: 1 };
        default:
            return { unit: 'MONTH', count: 1 };
    }
}

// Function to capture PayPal payment after approval
export async function capturePayPalPayment(
    orderId: string,
    context: InvocationContext
): Promise<PaymentResult> {
    try {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});

        const capture = await client().execute(request);
        context.log(`PayPal payment captured: ${orderId}`);

        return {
            success: true,
            paypalOrderId: orderId
        };

    } catch (error) {
        context.log.error('PayPal capture error:', error);
        return {
            success: false,
            error: 'Payment capture failed'
        };
    }
}

// Webhook handler for PayPal events
export async function handlePayPalWebhook(
    body: any,
    context: InvocationContext
): Promise<boolean> {
    try {
        const eventType = body.event_type;
        context.log(`PayPal webhook event: ${eventType}`);

        switch (eventType) {
            case 'PAYMENT.CAPTURE.COMPLETED':
                await handlePayPalPaymentSuccess(body.resource, context);
                break;
            case 'PAYMENT.CAPTURE.DENIED':
            case 'PAYMENT.CAPTURE.FAILED':
                await handlePayPalPaymentFailure(body.resource, context);
                break;
            case 'BILLING.SUBSCRIPTION.PAYMENT.COMPLETED':
                await handlePayPalSubscriptionPayment(body.resource, context);
                break;
            case 'BILLING.SUBSCRIPTION.CANCELLED':
            case 'BILLING.SUBSCRIPTION.SUSPENDED':
                await handlePayPalSubscriptionCancellation(body.resource, context);
                break;
        }

        return true;
    } catch (error) {
        context.log.error('PayPal webhook processing error:', error);
        return false;
    }
}

async function handlePayPalPaymentSuccess(resource: any, context: InvocationContext): Promise<void> {
    context.log(`PayPal payment successful: ${resource.id}`);
    // Update donation record, send confirmation email
}

async function handlePayPalPaymentFailure(resource: any, context: InvocationContext): Promise<void> {
    context.log(`PayPal payment failed: ${resource.id}`);
    // Update donation record, send failure notification
}

async function handlePayPalSubscriptionPayment(resource: any, context: InvocationContext): Promise<void> {
    context.log(`PayPal subscription payment: ${resource.id}`);
    // Create new donation record for recurring payment
}

async function handlePayPalSubscriptionCancellation(resource: any, context: InvocationContext): Promise<void> {
    context.log(`PayPal subscription cancelled: ${resource.id}`);
    // Update subscription status, send notification
}