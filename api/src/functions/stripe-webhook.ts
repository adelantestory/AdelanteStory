import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { handleStripeWebhook } from '../services/stripe-service';

export async function stripeWebhook(
    request: HttpRequest, 
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log('Stripe webhook received');

    if (request.method !== 'POST') {
        return {
            status: 405,
            jsonBody: { error: 'Method not allowed' }
        };
    }

    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            context.log.error('Missing Stripe signature');
            return {
                status: 400,
                jsonBody: { error: 'Missing signature' }
            };
        }

        const success = await handleStripeWebhook(body, signature, context);

        if (success) {
            return {
                status: 200,
                jsonBody: { received: true }
            };
        } else {
            return {
                status: 400,
                jsonBody: { error: 'Webhook processing failed' }
            };
        }

    } catch (error) {
        context.log.error('Stripe webhook error:', error);
        return {
            status: 500,
            jsonBody: { error: 'Internal server error' }
        };
    }
}

app.http('stripe-webhook', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: stripeWebhook
});