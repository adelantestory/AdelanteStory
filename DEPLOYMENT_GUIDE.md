# AdelanteStory Donation System - Deployment Guide

This guide covers deploying the complete donation system to Azure Static Web Apps with Azure Functions backend.

## Overview

The donation system consists of:
- **Frontend**: React application with donation form
- **Backend**: Azure Functions for payment processing
- **Payment Providers**: Stripe, PayPal, Bank Transfer support
- **Email Service**: Azure Communication Services or SendGrid
- **Database**: Azure Cosmos DB or SQL Database

## Prerequisites

- Azure account with active subscription
- Node.js 18+ installed locally
- Azure CLI installed
- Git repository for your code

## Step 1: Azure Resource Setup

### 1.1 Create Azure Static Web App

```bash
# Login to Azure
az login

# Create resource group
az group create --name adelante-story-rg --location "East US"

# Create Static Web App
az staticwebapp create \
  --name adelante-story-app \
  --resource-group adelante-story-rg \
  --source https://github.com/your-username/AdelanteStory \
  --location "East US2" \
  --branch main \
  --app-location "/client" \
  --api-location "/api" \
  --output-location "dist"
```

### 1.2 Set up Payment Providers

#### Stripe Setup
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Set up webhooks pointing to: `https://your-app.azurestaticapps.net/api/stripe-webhook`
4. Configure webhook events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

#### PayPal Setup
1. Create developer account at [developer.paypal.com](https://developer.paypal.com)
2. Create application to get Client ID and Secret
3. Set up webhooks pointing to: `https://your-app.azurestaticapps.net/api/paypal-webhook`
4. Configure webhook events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `BILLING.SUBSCRIPTION.PAYMENT.COMPLETED`

### 1.3 Set up Database

#### Option A: Azure Cosmos DB
```bash
# Create Cosmos DB account
az cosmosdb create \
  --resource-group adelante-story-rg \
  --name adelante-cosmosdb \
  --kind GlobalDocumentDB \
  --locations regionName="East US" failoverPriority=0 isZoneRedundant=False

# Create database
az cosmosdb sql database create \
  --account-name adelante-cosmosdb \
  --resource-group adelante-story-rg \
  --name AdelanteDonations

# Create containers
az cosmosdb sql container create \
  --account-name adelante-cosmosdb \
  --resource-group adelante-story-rg \
  --database-name AdelanteDonations \
  --name donors \
  --partition-key-path "/id"

az cosmosdb sql container create \
  --account-name adelante-cosmosdb \
  --resource-group adelante-story-rg \
  --database-name AdelanteDonations \
  --name donations \
  --partition-key-path "/donorId"
```

#### Option B: Azure SQL Database
```bash
# Create SQL Server
az sql server create \
  --name adelante-sql-server \
  --resource-group adelante-story-rg \
  --location "East US" \
  --admin-user adminuser \
  --admin-password "YourStrongPassword123!"

# Create SQL Database
az sql db create \
  --resource-group adelante-story-rg \
  --server adelante-sql-server \
  --name AdelanteDonations \
  --service-objective Basic
```

### 1.4 Set up Email Service

#### Option A: Azure Communication Services
```bash
# Create Communication Services resource
az communication create \
  --name adelante-communication \
  --resource-group adelante-story-rg \
  --location "Global" \
  --data-location "United States"
```

#### Option B: SendGrid
1. Create SendGrid account
2. Get API key from Settings → API Keys
3. Verify sender identity (your domain/email)

## Step 2: Environment Configuration

### 2.1 Configure Azure Static Web App Settings

```bash
# Set application settings
az staticwebapp appsettings set \
  --name adelante-story-app \
  --setting-names \
    STRIPE_SECRET_KEY="sk_live_your_stripe_secret_key" \
    STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret" \
    PAYPAL_CLIENT_ID="your_paypal_client_id" \
    PAYPAL_CLIENT_SECRET="your_paypal_client_secret" \
    SENDGRID_API_KEY="SG.your_sendgrid_api_key" \
    FROM_EMAIL="donations@adelantestory.com" \
    COSMOS_DB_ENDPOINT="https://adelante-cosmosdb.documents.azure.com:443/" \
    COSMOS_DB_KEY="your_cosmos_db_primary_key" \
    COSMOS_DB_DATABASE_ID="AdelanteDonations" \
    FRONTEND_URL="https://your-app.azurestaticapps.net" \
    NODE_ENV="production" \
    BANK_ACCOUNT_NUMBER="your_account_number" \
    BANK_ROUTING_NUMBER="your_routing_number"
```

### 2.2 Update Frontend API Base URL

Update your donation form to call the Azure Functions API:

```typescript
// In client/src/pages/donate.tsx, update the API call:
const response = await fetch('/api/processdonation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(donationData),
});
```

## Step 3: Deploy the Application

### 3.1 Update Repository Structure

Ensure your repository matches this structure:
```
/
├── client/                 # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── api/                   # Azure Functions
│   ├── src/
│   ├── package.json
│   ├── host.json
│   └── tsconfig.json
├── staticwebapp.config.json
└── README.md
```

### 3.2 Create Static Web App Configuration

Create `staticwebapp.config.json` in the root:

```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "responseOverrides": {
    "400": {
      "rewrite": "/custom-400.html"
    },
    "401": {
      "rewrite": "/login.html"
    },
    "403": {
      "rewrite": "/custom-403.html"
    },
    "404": {
      "rewrite": "/custom-404.html"
    }
  }
}
```

### 3.3 Deploy via GitHub Actions

Azure Static Web Apps automatically sets up GitHub Actions. The workflow file will be created in `.github/workflows/`.

To manually trigger deployment:

```bash
# Commit and push your changes
git add .
git commit -m "Add donation system with Azure Functions backend"
git push origin main
```

## Step 4: Database Schema Setup

### 4.1 For Azure Cosmos DB

The containers will be created automatically by the application. No additional schema setup required.

### 4.2 For Azure SQL Database

Run these SQL scripts to create the tables:

```sql
-- Create Donors table
CREATE TABLE Donors (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    firstName NVARCHAR(100) NOT NULL,
    lastName NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    phone NVARCHAR(20),
    address1 NVARCHAR(255),
    address2 NVARCHAR(255),
    city NVARCHAR(100),
    state NVARCHAR(50),
    zipCode NVARCHAR(20),
    country NVARCHAR(50),
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    lastDonationAt DATETIME2,
    totalDonated DECIMAL(10,2) DEFAULT 0
);

-- Create Donations table
CREATE TABLE Donations (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    donorId UNIQUEIDENTIFIER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency NVARCHAR(3) DEFAULT 'USD',
    paymentMethod NVARCHAR(20) NOT NULL,
    status NVARCHAR(20) NOT NULL,
    stripePaymentIntentId NVARCHAR(255),
    paypalOrderId NVARCHAR(255),
    bankTransferReference NVARCHAR(100),
    isRecurring BIT DEFAULT 0,
    frequency NVARCHAR(20),
    message NTEXT,
    isAnonymous BIT DEFAULT 0,
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    processedAt DATETIME2,
    FOREIGN KEY (donorId) REFERENCES Donors(id)
);

-- Create indexes
CREATE INDEX IX_Donors_Email ON Donors(email);
CREATE INDEX IX_Donations_DonorId ON Donations(donorId);
CREATE INDEX IX_Donations_Status ON Donations(status);
CREATE INDEX IX_Donations_PaymentMethod ON Donations(paymentMethod);
```

## Step 5: Testing

### 5.1 Test Payment Integration

1. **Credit Card (Stripe)**:
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC

2. **PayPal**:
   - Use PayPal sandbox accounts
   - Test both one-time and recurring payments

3. **Bank Transfer**:
   - Verify instruction emails are sent
   - Test manual confirmation process

### 5.2 Test Email Delivery

- Verify confirmation emails are sent
- Test failure notification emails
- Check recurring donation reminders

## Step 6: Production Checklist

### 6.1 Security
- [ ] Switch to live API keys for Stripe/PayPal
- [ ] Configure proper CORS settings
- [ ] Enable HTTPS only
- [ ] Set up proper authentication for admin endpoints

### 6.2 Monitoring
- [ ] Set up Application Insights for logging
- [ ] Configure alerts for failed payments
- [ ] Monitor webhook delivery success

### 6.3 Compliance
- [ ] Configure tax receipt generation
- [ ] Set up data retention policies
- [ ] Implement PCI compliance measures
- [ ] Add privacy policy and terms

## Step 7: Maintenance

### 7.1 Regular Tasks
- Monitor payment failure rates
- Review donation analytics
- Update email templates seasonally
- Test payment integrations monthly

### 7.2 Backup Strategy
- Set up automated database backups
- Export donor data regularly
- Test restore procedures

## Support

For deployment issues:
- Check Azure Portal logs in Static Web Apps → Functions
- Review Application Insights telemetry
- Test API endpoints directly

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | Yes | Stripe secret API key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook endpoint secret |
| `PAYPAL_CLIENT_ID` | Yes | PayPal application client ID |
| `PAYPAL_CLIENT_SECRET` | Yes | PayPal application secret |
| `FROM_EMAIL` | Yes | Sender email address |
| `SENDGRID_API_KEY` | If using SendGrid | SendGrid API key |
| `AZURE_COMMUNICATION_CONNECTION_STRING` | If using Azure Comm Services | Connection string |
| `COSMOS_DB_ENDPOINT` | If using Cosmos DB | Cosmos DB endpoint URL |
| `COSMOS_DB_KEY` | If using Cosmos DB | Cosmos DB access key |
| `SQL_CONNECTION_STRING` | If using SQL Database | SQL connection string |
| `FRONTEND_URL` | Yes | Your static web app URL |
| `BANK_ACCOUNT_NUMBER` | If supporting bank transfers | Your bank account number |
| `BANK_ROUTING_NUMBER` | If supporting bank transfers | Your bank routing number |

This completes the deployment setup for your donation system!