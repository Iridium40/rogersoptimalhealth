# Rogers Optimal Health Website

A health coaching website for Lenee Rogers, Independent OPTAVIA Certified Health Coach.

## Features

- Health coaching services showcase
- Lean & Green recipes
- Newsletter subscription with welcome emails
- Health assessment forms
- Blog content
- Contact and booking integration

## Newsletter Setup

The website includes a newsletter subscription feature that integrates with:

### Resend (Email Delivery)
1. Sign up for a [Resend](https://resend.com) account
2. Create an API key in your Resend dashboard
3. Add your API key to the environment variables as `RESEND_API_KEY`
4. Verify your sending domain in Resend (currently configured for `hello@rogersoptimalhealth.com`)

### HubSpot (Contact Management)
1. Create a [HubSpot](https://hubspot.com) account
2. Generate a private app access token with the following scopes:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
3. Add your access token to the environment variables as `HUBSPOT_PRIVATE_APP_TOKEN`

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
# HubSpot Configuration
HUBSPOT_PRIVATE_APP_TOKEN=your_hubspot_private_app_token_here
HUBSPOT_PRIVATE_CLIENT_SECRET=your_hubspot_client_secret_here

# Email Configuration (using Resend)
RESEND_API_KEY=your_resend_api_key_here

# Email addresses
ADMIN_EMAIL=admin@rogersoptimalhealth.com
FROM_EMAIL=hello@rogersoptimalhealth.com

# Other Environment Variables
PING_MESSAGE=ping
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Newsletter Features

- **Email Validation**: Client and server-side validation
- **Welcome Email**: Automatically sent via Resend with branded template
- **HubSpot Integration**: Contacts are created/updated with newsletter subscription status
- **Error Handling**: Graceful fallbacks if services are unavailable
- **Success States**: Visual feedback for successful subscriptions

The newsletter subscription form is located on the homepage and includes:
- Email input with validation
- Loading states during submission
- Success confirmation with visual feedback
- Error handling with user-friendly messages
