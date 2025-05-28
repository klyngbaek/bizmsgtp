# Meta Business Messaging Tech Provider Template

This is a Next.js template for Meta Business Messaging Tech Providers. It provides a foundation for building WhatsApp Business Platform integrations with features like:

- WhatsApp Business Account (WABA) management
- Phone number registration and management
- Message sending and receiving
- Webhook handling
- User authentication via Auth0
- Meta Business Manager integration


[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fklyngbaek%2Fbizmsgtp&env=AUTH0_SECRET,AUTH0_BASE_URL,AUTH0_ISSUER_BASE_URL,AUTH0_CLIENT_ID,AUTH0_CLIENT_SECRET,FB_APP_ID,FB_APP_SECRET,FB_REG_PIN,FB_SUAT,FB_TP_CONFIG_IDS,FB_VERIFY_TOKEN,FB_ADMIN_SUAT,ABLY_KEY&envDescription=Variables%20to%20configure%20the%20app&envLink=https%3A%2F%2Fgithub.com%2Fklyngbaek%2Fbizmsgtp&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22neon%22%2C%22productSlug%22%3A%22neon%22%2C%22protocol%22%3A%22storage%22%2C%22group%22%3A%22postgres%22%7D%5D)


## Quick Start

1. Clone this template:
```bash
npx create-next-app@latest my-meta-app --use-npm --example "https://github.com/yourusername/bizmsgtp"
```

2. Install dependencies:
```bash
cd my-meta-app
npm install
```

3. Configure Database Schema
```
CREATE TABLE ad_accounts (
  key BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  ad_account_id BIGINT,
  user_id VARCHAR,
  app_id BIGINT,
  business_id BIGINT,
  access_token TEXT,
  last_updated TIMESTAMP,
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE businesses (
  key BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  business_id BIGINT,
  user_id VARCHAR,
  app_id BIGINT,
  access_token TEXT,
  last_updated TIMESTAMP,
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE logs (
  key BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id VARCHAR,
  action VARCHAR,
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pages (
  key BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  page_id BIGINT,
  user_id VARCHAR,
  app_id BIGINT,
  business_id BIGINT,
  access_token TEXT,
  last_updated TIMESTAMP,
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE phones (
  key BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  is_ack_bot_enabled TEXT,
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  waba_id BIGINT
);

CREATE TABLE wabas (
  key BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  waba_id BIGINT,
  user_id VARCHAR,
  app_id BIGINT,
  business_id BIGINT,
  access_token TEXT,
  last_updated TIMESTAMP,
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Set up environment variables:
Create a `.env.local` file with the following variables:
```env
# Auth0 Configuration
AUTH0_SECRET='your-auth0-secret'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-tenant.auth0.com'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'

# Meta/WhatsApp Configuration
META_APP_ID='your-meta-app-id'
META_APP_SECRET='your-meta-app-secret'
FB_APP_SECRET='your-facebook-app-secret'
FB_SUAT='your-facebook-system-user-access-token'
FB_REG_PIN='your-registration-pin'
FB_VERIFY_TOKEN='your-webhook-verify-token'
FB_ADMIN_SUAT='your-admin-system-user-access-token'

# Ably Configuration
ABLY_KEY='your-ably-api-key'
```

Note: Never commit the actual `.env.local` file to version control. Keep your secrets secure.

5. Run the development server:
```bash
npm run dev
```

## Features

- **Authentication**: Secure user authentication using Auth0
- **WABA Management**: View and manage WhatsApp Business Accounts
- **Phone Numbers**: Register and manage WhatsApp phone numbers
- **Messaging**: Send and receive WhatsApp messages
- **Webhooks**: Handle incoming webhooks from Meta
- **Business Manager**: Integration with Meta Business Manager

## Configuration

### Auth0 Setup
1. Create an Auth0 account
2. Create a new application
3. Configure callback URLs
4. Add environment variables

### Meta Setup
1. Create a Meta Developer account
2. Create a new app
3. Configure WhatsApp Business Platform
4. Add environment variables

## Deployment

This template is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue in the GitHub repository.