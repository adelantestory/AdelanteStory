import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { handlePayPalWebhook } from '../services/paypal-service';

export async function paypalWebhook(
    request: HttpRequest, 
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log('PayPal webhook received');

    if (request.method !== 'POST') {
        return {
            status: 405,
            jsonBody: { error: 'Method not allowed' }
        };
    }

    try {
        const body = await request.json();
        
        // In production, you should verify the webhook signature
        // const signature = request.headers.get('paypal-transmission-sig');
        // const certId = request.headers.get('paypal-cert-id');
        // const authAlgo = request.headers.get('paypal-auth-algo');
        // const transmissionId = request.headers.get('paypal-transmission-id');
        // const transmissionTime = request.headers.get('paypal-transmission-time');
        
        // Verify webhook authenticity here
        
        const success = await handlePayPalWebhook(body, context);

        if (success) {
            return {
                status: 200,
                jsonBody: { status: 'SUCCESS' }
            };
        } else {
            return {
                status: 400,
                jsonBody: { error: 'Webhook processing failed' }
            };
        }

    } catch (error) {
        context.log.error('PayPal webhook error:', error);
        return {
            status: 500,
            jsonBody: { error: 'Internal server error' }
        };
    }
}

app.http('paypal-webhook', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: paypalWebhook
});