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

### Resend (Email Delivery & Contact Management)
1. Sign up for a [Resend](https://resend.com) account
2. Create an API key in your Resend dashboard
3. Create an audience for your newsletter subscribers
4. Add your API key and audience ID to the environment variables:
   - `RESEND_API_KEY` - Your Resend API key
   - `RESEND_AUDIENCE_ID` - Your audience ID for newsletter subscribers
5. Verify your sending domain in Resend (currently configured for `hello@rogersoptimalhealth.com`)

### Contact Management
Contact information is managed through Resend's audience system. New newsletter subscribers are automatically added to your Resend audience and receive a welcome email.

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
# Email Configuration (using Resend)
RESEND_API_KEY=your_resend_api_key_here

# Resend Audience ID for contact management
RESEND_AUDIENCE_ID=your_audience_id_here

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
- **Contact Management**: Subscribers are automatically added to Resend audience
- **Error Handling**: Graceful fallbacks if services are unavailable
- **Success States**: Visual feedback for successful subscriptions

The newsletter subscription form is located on the homepage and includes:
- Email input with validation
- Loading states during submission
- Success confirmation with visual feedback
- Error handling with user-friendly messages
