import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { validateDonationRequest } from '../shared/validation';
import { DonationRequest, PaymentResult } from '../shared/types';
import { processStripePayment } from '../services/stripe-service';
import { processPayPalPayment } from '../services/paypal-service';
import { processBankTransfer } from '../services/bank-transfer-service';
import { saveDonationRecord, saveDonorInfo } from '../services/database-service';
import { sendDonationConfirmationEmail } from '../services/email-service';

export async function processdonation(
    request: HttpRequest, 
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log('Processing donation request');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        };
    }

    if (request.method !== 'POST') {
        return {
            status: 405,
            headers: { 'Access-Control-Allow-Origin': '*' },
            jsonBody: { error: 'Method not allowed' }
        };
    }

    try {
        // Parse and validate request body
        const rawBody = await request.text();
        const requestData = JSON.parse(rawBody);
        
        const donationData: DonationRequest = validateDonationRequest(requestData);
        
        context.log(`Processing ${donationData.paymentMethod} donation for $${donationData.amount}`);

        let paymentResult: PaymentResult;

        // Process payment based on method
        switch (donationData.paymentMethod) {
            case 'credit-card':
                paymentResult = await processStripePayment(donationData, context);
                break;
            case 'paypal':
                paymentResult = await processPayPalPayment(donationData, context);
                break;
            case 'bank-transfer':
                paymentResult = await processBankTransfer(donationData, context);
                break;
            default:
                throw new Error('Invalid payment method');
        }

        if (paymentResult.success) {
            // Save donor information
            const donorId = await saveDonorInfo(donationData, context);
            
            // Save donation record
            const donationId = await saveDonationRecord({
                ...donationData,
                donorId,
                paymentResult
            }, context);

            // Send confirmation email (async, don't wait)
            sendDonationConfirmationEmail(donationData, donationId, context)
                .catch(err => context.log.error('Email sending failed:', err));

            // Update payment result with donation ID
            paymentResult.donationId = donationId;
        }

        return {
            status: paymentResult.success ? 200 : 400,
            headers: { 'Access-Control-Allow-Origin': '*' },
            jsonBody: paymentResult
        };

    } catch (error) {
        context.log.error('Donation processing error:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        
        return {
            status: 400,
            headers: { 'Access-Control-Allow-Origin': '*' },
            jsonBody: {
                success: false,
                error: errorMessage
            }
        };
    }
}

app.http('processdonation', {
    methods: ['GET', 'POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: processdonation
});