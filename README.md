# Meta Business Messaging Tech Provider Template

This is a Next.js template for Meta Business Messaging Tech Providers. It provides a foundation for building WhatsApp Business Platform integrations with features like:

- WhatsApp Business Account (WABA) management
- Phone number registration and management
- Message sending and receiving
- Webhook handling
- User authentication via Auth0
- Meta Business Manager integration

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

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```env
AUTH0_SECRET='your-auth0-secret'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-tenant.auth0.com'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'
META_APP_ID='your-meta-app-id'
META_APP_SECRET='your-meta-app-secret'
```

4. Run the development server:
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
