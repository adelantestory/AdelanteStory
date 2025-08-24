import { InvocationContext } from '@azure/functions';
import { DonationRequest } from '../shared/types';
import * as nodemailer from 'nodemailer';

// Email service for sending donation confirmations and receipts
// This can be adapted to use Azure Communication Services, SendGrid, or other email providers

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Initialize email transporter
function createEmailTransporter() {
  // Option 1: Azure Communication Services
  if (process.env.AZURE_COMMUNICATION_CONNECTION_STRING) {
    // Azure Communication Services would be initialized here
    // const { EmailClient } = require("@azure/communication-email");
    // return new EmailClient(process.env.AZURE_COMMUNICATION_CONNECTION_STRING);
  }
  
  // Option 2: SendGrid
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransporter({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  }
  
  // Option 3: SMTP (for development or other email services)
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }
  
  // Fallback: console logging for development
  return null;
}

// Send donation confirmation email
export async function sendDonationConfirmationEmail(
  donationData: DonationRequest,
  donationId: string,
  context: InvocationContext
): Promise<boolean> {
  try {
    context.log(`Sending confirmation email to ${donationData.email}`);
    
    const emailTemplate = generateConfirmationEmailTemplate(donationData, donationId);
    
    return await sendEmail({
      to: donationData.email,
      from: process.env.FROM_EMAIL || 'donations@adelantestory.com',
      fromName: 'Adelante Story Foundation',
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    }, context);
    
  } catch (error) {
    context.log.error('Error sending confirmation email:', error);
    return false;
  }
}

// Send payment failure notification
export async function sendPaymentFailureEmail(
  donationData: DonationRequest,
  errorMessage: string,
  context: InvocationContext
): Promise<boolean> {
  try {
    context.log(`Sending payment failure email to ${donationData.email}`);
    
    const emailTemplate = generatePaymentFailureEmailTemplate(donationData, errorMessage);
    
    return await sendEmail({
      to: donationData.email,
      from: process.env.FROM_EMAIL || 'donations@adelantestory.com',
      fromName: 'Adelante Story Foundation',
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    }, context);
    
  } catch (error) {
    context.log.error('Error sending payment failure email:', error);
    return false;
  }
}

// Send bank transfer instructions email
export async function sendBankTransferInstructionsEmail(
  donationData: DonationRequest,
  transferInstructions: any,
  context: InvocationContext
): Promise<boolean> {
  try {
    context.log(`Sending bank transfer instructions to ${donationData.email}`);
    
    const emailTemplate = generateBankTransferEmailTemplate(donationData, transferInstructions);
    
    return await sendEmail({
      to: donationData.email,
      from: process.env.FROM_EMAIL || 'donations@adelantestory.com',
      fromName: 'Adelante Story Foundation',
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    }, context);
    
  } catch (error) {
    context.log.error('Error sending bank transfer instructions email:', error);
    return false;
  }
}

// Send recurring donation reminder
export async function sendRecurringDonationReminder(
  donorEmail: string,
  donorName: string,
  amount: string,
  frequency: string,
  context: InvocationContext
): Promise<boolean> {
  try {
    context.log(`Sending recurring donation reminder to ${donorEmail}`);
    
    const emailTemplate = generateRecurringReminderEmailTemplate(donorName, amount, frequency);
    
    return await sendEmail({
      to: donorEmail,
      from: process.env.FROM_EMAIL || 'donations@adelantestory.com',
      fromName: 'Adelante Story Foundation',
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    }, context);
    
  } catch (error) {
    context.log.error('Error sending recurring donation reminder:', error);
    return false;
  }
}

// Core email sending function
async function sendEmail(
  emailData: {
    to: string;
    from: string;
    fromName: string;
    subject: string;
    html: string;
    text: string;
  },
  context: InvocationContext
): Promise<boolean> {
  try {
    const transporter = createEmailTransporter();
    
    if (!transporter) {
      // Fallback to console logging for development
      context.log('Email would be sent:', {
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.text.substring(0, 200) + '...'
      });
      return true;
    }
    
    const mailOptions = {
      from: `${emailData.fromName} <${emailData.from}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    };
    
    await transporter.sendMail(mailOptions);
    context.log(`Email sent successfully to ${emailData.to}`);
    return true;
    
  } catch (error) {
    context.log.error('Error sending email:', error);
    return false;
  }
}

// Email template generators

function generateConfirmationEmailTemplate(
  donationData: DonationRequest,
  donationId: string
): EmailTemplate {
  const amount = parseFloat(donationData.amount).toFixed(2);
  const paymentMethod = getPaymentMethodDisplayName(donationData.paymentMethod);
  const recurringText = donationData.isRecurring 
    ? ` This is a ${donationData.frequency} recurring donation.` 
    : '';
  
  const subject = `Thank you for your ${donationData.isRecurring ? 'recurring ' : ''}donation - Adelante Story Foundation`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Thank You!</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your generosity makes a difference</p>
      </div>
      
      <div style="padding: 30px; background: white;">
        <p style="font-size: 16px; color: #333;">Dear ${donationData.firstName} ${donationData.lastName},</p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Thank you so much for your generous donation of <strong>$${amount}</strong> to Adelante Story Foundation.${recurringText}
        </p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #1f2937;">Donation Details</h3>
          <p style="margin: 5px 0; color: #4b5563;"><strong>Amount:</strong> $${amount}</p>
          <p style="margin: 5px 0; color: #4b5563;"><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p style="margin: 5px 0; color: #4b5563;"><strong>Donation ID:</strong> ${donationId}</p>
          <p style="margin: 5px 0; color: #4b5563;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          ${donationData.isRecurring ? `<p style="margin: 5px 0; color: #4b5563;"><strong>Frequency:</strong> ${donationData.frequency}</p>` : ''}
        </div>
        
        ${donationData.message ? `
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e;"><strong>Your Message:</strong></p>
          <p style="margin: 5px 0 0 0; color: #92400e; font-style: italic;">"${donationData.message}"</p>
        </div>
        ` : ''}
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Your donation will help us continue our mission to empower communities through education, 
          connection, and workforce development. Every dollar makes a real difference in the lives 
          of the people we serve.
        </p>
        
        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">What happens next?</h3>
          <ul style="margin: 0; padding-left: 20px; color: #1e3a8a;">
            <li>You'll receive a tax receipt via email within 24-48 hours</li>
            <li>Your donation will be put to work immediately in our programs</li>
            ${donationData.isRecurring ? '<li>You\'ll receive updates about your recurring donations</li>' : ''}
            <li>We'll keep you updated on the impact your donation is making</li>
          </ul>
        </div>
        
        <p style="font-size: 16px; color: #333;">
          If you have any questions about your donation, please don't hesitate to contact us at 
          <a href="mailto:donations@adelantestory.com" style="color: #2563eb;">donations@adelantestory.com</a> 
          or call us at (555) 123-4567.
        </p>
        
        <p style="font-size: 16px; color: #333;">
          With heartfelt gratitude,<br>
          <strong>The Adelante Story Foundation Team</strong>
        </p>
      </div>
      
      <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          Adelante Story Foundation | 123 Community Street, San Antonio, TX 78201<br>
          <a href="mailto:hello@adelantestory.com" style="color: #2563eb;">hello@adelantestory.com</a> | (555) 123-4567
        </p>
        <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 12px;">
          Tax ID: XX-XXXXXXX | This organization is a 501(c)(3) nonprofit
        </p>
      </div>
    </div>
  `;
  
  const text = `
Thank you for your donation to Adelante Story Foundation!

Dear ${donationData.firstName} ${donationData.lastName},

Thank you so much for your generous donation of $${amount} to Adelante Story Foundation.${recurringText}

Donation Details:
- Amount: $${amount}
- Payment Method: ${paymentMethod}
- Donation ID: ${donationId}
- Date: ${new Date().toLocaleDateString()}
${donationData.isRecurring ? `- Frequency: ${donationData.frequency}` : ''}

${donationData.message ? `Your Message: "${donationData.message}"` : ''}

Your donation will help us continue our mission to empower communities through education, connection, and workforce development.

What happens next?
- You'll receive a tax receipt via email within 24-48 hours
- Your donation will be put to work immediately in our programs
${donationData.isRecurring ? '- You\'ll receive updates about your recurring donations' : ''}
- We'll keep you updated on the impact your donation is making

If you have any questions, contact us at donations@adelantestory.com or (555) 123-4567.

With heartfelt gratitude,
The Adelante Story Foundation Team

Adelante Story Foundation
123 Community Street, San Antonio, TX 78201
hello@adelantestory.com | (555) 123-4567
Tax ID: XX-XXXXXXX
  `;
  
  return { subject, html, text };
}

function generatePaymentFailureEmailTemplate(
  donationData: DonationRequest,
  errorMessage: string
): EmailTemplate {
  const amount = parseFloat(donationData.amount).toFixed(2);
  
  const subject = 'Payment Issue - Adelante Story Foundation';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #dc2626; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Payment Issue</h1>
      </div>
      
      <div style="padding: 30px; background: white;">
        <p style="font-size: 16px; color: #333;">Dear ${donationData.firstName} ${donationData.lastName},</p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          We encountered an issue processing your donation of $${amount}. Don't worry - no charges were made to your account.
        </p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
          <p style="margin: 0; color: #dc2626;"><strong>Error Details:</strong></p>
          <p style="margin: 5px 0 0 0; color: #dc2626;">${errorMessage}</p>
        </div>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Please try your donation again, or consider using an alternative payment method. 
          If you continue to experience issues, please contact us at 
          <a href="mailto:donations@adelantestory.com" style="color: #2563eb;">donations@adelantestory.com</a>.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/donate" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Try Again
          </a>
        </div>
      </div>
    </div>
  `;
  
  const text = `
Payment Issue - Adelante Story Foundation

Dear ${donationData.firstName} ${donationData.lastName},

We encountered an issue processing your donation of $${amount}. No charges were made to your account.

Error: ${errorMessage}

Please try your donation again or use an alternative payment method. If you continue to experience issues, contact us at donations@adelantestory.com.

Try again at: ${process.env.FRONTEND_URL}/donate
  `;
  
  return { subject, html, text };
}

function generateBankTransferEmailTemplate(
  donationData: DonationRequest,
  transferInstructions: any
): EmailTemplate {
  const amount = parseFloat(donationData.amount).toFixed(2);
  
  const subject = 'Bank Transfer Instructions - Adelante Story Foundation';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #059669; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Bank Transfer Instructions</h1>
      </div>
      
      <div style="padding: 30px; background: white;">
        <p style="font-size: 16px; color: #333;">Dear ${donationData.firstName} ${donationData.lastName},</p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Thank you for choosing to donate $${amount} to Adelante Story Foundation via bank transfer. 
          Please use the following instructions to complete your donation:
        </p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #059669; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #065f46;">Transfer Instructions</h3>
          <p style="margin: 5px 0; color: #065f46;"><strong>Account Name:</strong> ${transferInstructions.accountName}</p>
          <p style="margin: 5px 0; color: #065f46;"><strong>Account Number:</strong> ${transferInstructions.accountNumber}</p>
          <p style="margin: 5px 0; color: #065f46;"><strong>Routing Number:</strong> ${transferInstructions.routingNumber}</p>
          <p style="margin: 5px 0; color: #065f46;"><strong>Amount:</strong> $${amount}</p>
          <p style="margin: 5px 0; color: #065f46;"><strong>Reference:</strong> ${transferInstructions.reference}</p>
        </div>
        
        <div style="background: #fffbeb; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #92400e;">Important Notes:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #92400e;">
            <li>Include the reference number "${transferInstructions.reference}" in your transfer description</li>
            <li>Transfers typically take 3-5 business days to process</li>
            <li>You'll receive a confirmation email once we receive your transfer</li>
            <li>Keep the reference number for your records</li>
          </ul>
        </div>
        
        <pre style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 8px; color: #374151; font-size: 14px; line-height: 1.4;">
${transferInstructions.instructions}
        </pre>
      </div>
    </div>
  `;
  
  const text = transferInstructions.instructions;
  
  return { subject, html, text };
}

function generateRecurringReminderEmailTemplate(
  donorName: string,
  amount: string,
  frequency: string
): EmailTemplate {
  const subject = `Time for your ${frequency} donation - Adelante Story Foundation`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563eb; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">${frequency} Donation Reminder</h1>
      </div>
      
      <div style="padding: 30px; background: white;">
        <p style="font-size: 16px; color: #333;">Dear ${donorName},</p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          It's time for your ${frequency} donation of $${amount} to Adelante Story Foundation. 
          Thank you for your continued support of our mission!
        </p>
        
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Your ongoing generosity helps us maintain and expand our programs that empower communities 
          through education, connection, and workforce development.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/donate" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Make Your Donation
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; text-align: center;">
          To modify or cancel your recurring donation, please contact us at 
          <a href="mailto:donations@adelantestory.com" style="color: #2563eb;">donations@adelantestory.com</a>
        </p>
      </div>
    </div>
  `;
  
  const text = `
${frequency} Donation Reminder - Adelante Story Foundation

Dear ${donorName},

It's time for your ${frequency} donation of $${amount} to Adelante Story Foundation. Thank you for your continued support!

Your ongoing generosity helps us maintain and expand our programs that empower communities through education, connection, and workforce development.

Make your donation at: ${process.env.FRONTEND_URL}/donate

To modify or cancel your recurring donation, contact us at donations@adelantestory.com
  `;
  
  return { subject, html, text };
}

function getPaymentMethodDisplayName(paymentMethod: string): string {
  switch (paymentMethod) {
    case 'credit-card':
      return 'Credit/Debit Card';
    case 'paypal':
      return 'PayPal';
    case 'bank-transfer':
      return 'Bank Transfer (ACH)';
    default:
      return paymentMethod;
  }
}