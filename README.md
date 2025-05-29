# Meta Business Messaging Tech Provider Template

This is a Next.js template for Meta Business Messaging Tech Providers. It provides a foundation for building WhatsApp Business Platform integrations with features like:

- WhatsApp Business Account (WABA) management
- Phone number registration and management
- Message sending and receiving
- Webhook handling
- User authentication via Auth0
- Meta Business Manager integration

## Quick Start

1. Deploy
Deploy this template to a new Vercel project by clicking the button below
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fklyngbaek%2Fbizmsgtp&env=ABLY_KEY,AUTH0_SECRET,AUTH0_BASE_URL,AUTH0_ISSUER_BASE_URL,AUTH0_CLIENT_ID,AUTH0_CLIENT_SECRET,FB_APP_ID,FB_APP_SECRET,FB_BUSINESS_ID,FB_GRAPH_API_VERSION,FB_REG_PIN,FB_TP_CONFIG_IDS,FB_VERIFY_TOKEN,TP_CONTACT_EMAIL&envDescription=Variables%20to%20configure%20the%20app&envLink=https%3A%2F%2Fgithub.com%2Fklyngbaek%2Fbizmsgtp&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22neon%22%2C%22productSlug%22%3A%22neon%22%2C%22protocol%22%3A%22storage%22%2C%22group%22%3A%22postgres%22%7D%5D)

2. Create a fork
Within the flow started above, pick a fork name for the code base

3. Connect database
Within the flow above, connect the Neon DB

4. Enter the environment variables
Within the flow above enter all the environment variables

```env
# Ably Configuration
ABLY_KEY='your-ably-api-key'

# Auth0 Configuration
AUTH0_SECRET='your-auth0-secret'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-tenant.auth0.com'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'

# Facebook Configuration
FB_APP_ID='your-facebook-app-id'
FB_APP_SECRET='your-facebook-app-secret'
FB_BUSINESS_ID='your-facebook-business-id'
FB_GRAPH_API_VERSION='fb-graph-api-version'
FB_REG_PIN='your-registration-pin'
FB_TP_CONFIG_IDS='tp-config-ids-comma-separated'
FB_VERIFY_TOKEN='your-webhook-verify-token'

# Tech Provider Configuration
TP_CONTACT_EMAIL='email-address'
```

5. Configure database schema
Once the project is finished deploying, go to the neon dashboard associated with the newly deployed Vercel project. Go into the SQL editor and paste the following commands to setup the right table schema.

```sql
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
CREATE UNIQUE INDEX user_app_ad_account_key on ad_accounts (user_id, app_id, ad_account_id);

CREATE TABLE businesses (
  key BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  business_id BIGINT,
  user_id VARCHAR,
  app_id BIGINT,
  access_token TEXT,
  last_updated TIMESTAMP,
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX user_app_business_key on businesses (user_id, app_id, business_id);

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
CREATE UNIQUE INDEX user_app_page_key on pages (user_id, app_id, page_id);

CREATE TABLE phones (
  key BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  phone_id BIGINT,
  is_ack_bot_enabled TEXT,
  last_updated TIMESTAMP,
  ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX phone_key on phones (phone_id);

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
CREATE UNIQUE INDEX user_app_waba_key on wabas (user_id, app_id, waba_id);
```

## Features
- **Authentication**: Secure user authentication using Auth0
- **WABA Management**: View and manage WhatsApp Business Accounts
- **Phone Numbers**: Register and manage WhatsApp phone numbers
- **Messaging**: Send and receive WhatsApp messages
- **Webhooks**: Handle incoming webhooks from Meta
- **Business Manager**: Integration with Meta Business Manager

## Configuration

### Ably Setup

Ably is used to handle sockets to live stream conversations and webhook data to the browser.

1. Create an Ably account

### Auth0 Setup

Auth0 is used as the login library.

1. Create an Auth0 account
2. Create a new application
3. Configure callback URLs
4. Add environment variables

### Meta Setup

You need a configured Meta app and business 

1. Create a Meta Developer account
2. Create a new app
3. Create a new Business Portfolio and connect it to the app
4. Add the Vercel deployment domain to the app's valid callback urls

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue in the GitHub repository.