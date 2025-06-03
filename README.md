# MuskMustGo Website Redesign

This is the redesigned MuskMustGo website, featuring a modern frontend and dynamic integration with a backend API. The redesign focuses on improved user experience, updated visuals, and seamless product ordering.

## About the Redesign

- **Modern UI/UX:** The site has been rebuilt with a fresh look and responsive design.
- **Dynamic Functionality:** The frontend now communicates with a backend API for user registration, login, product browsing, and order placement.
- **API Integration:** All customer and order data is handled via the backend service, not static files.

## Updated Deployment and Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PM2 installed globally (`npm install -g pm2`)
- Nginx configured as reverse proxy

### Step-by-Step Setup

1. **Pull the latest changes:**
   \`\`\`bash
   cd /var/www/muskmustgo
   git pull origin main
   \`\`\`

2. **Clean install (fixes dependency conflicts):**
   \`\`\`bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install --legacy-peer-deps
   \`\`\`

3. **Set up environment variables** - Create `.env.local` file:
   \`\`\`bash
   API_BASE_URL=http://leafe.com:5000
   NODE_ENV=production
   PORT=3000
   HOSTNAME=0.0.0.0
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_[your_key]
   STRIPE_SECRET_KEY=sk_test_[your_key]
   \`\`\`

4. **Build and deploy:**
   \`\`\`bash
   npm run build
   pm2 start ecosystem.config.js --env production
   \`\`\`

5. **Save PM2 configuration:**
   \`\`\`bash
   pm2 save
   pm2 startup
   \`\`\`

### Environment Variables Required

| Variable | Description | Example |
|----------|-------------|---------|
| `API_BASE_URL` | Your backend API URL | `http://leafe.com:5000` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `HOSTNAME` | Server hostname | `0.0.0.0` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_test_...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |

## API Integration Details

The frontend is configured to work with the backend API at `http://leafe.com:5000` with the following endpoints:

- **POST /orders** - Creates new orders after Stripe payment
- **GET /products** - Retrieves product information
- **POST /customers** - Creates new customer accounts
- **POST /login** - Authenticates users

### Order Data Format

The order data follows the `OrderCreate` schema from your API specification:

\`\`\`json
{
  "customer": {
    "email": "customer@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "addr1": "123 Main St",
    "city": "Anytown",
    "state_prov": "CA",
    "postal_code": "12345",
    "country": "USA"
  },
  "payment_id": "stripe_payment_intent_id",
  "products": [
    {
      "product_id": "product-uuid",
      "quantity": 1,
      "attributes": [
        {
          "name": "emoji",
          "value": "😊"
        }
      ]
    }
  ],
  "shipping": 5.99,
  "tax": 2.50
}
\`\`\`

## Troubleshooting

### Dependency Conflicts Fixed

The previous `date-fns` version conflict has been resolved by downgrading to version 3.6.0 for compatibility with `react-day-picker`.

If you still encounter dependency issues:

\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

### Common Issues

**Application won't start:**
1. Check PM2 logs: `pm2 logs`
2. Verify environment variables are set correctly
3. Ensure the backend API is accessible at the configured URL
4. Check for port conflicts: `lsof -i :3000`

**Build failures:**
1. Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install --legacy-peer-deps`
2. Check Node.js version (requires 18+)

## Monitoring and Maintenance

- **View application status:** `pm2 status`
- **Monitor resources:** `pm2 monit`
- **View logs:** `pm2 logs`
- **Restart application:** `pm2 restart ecosystem.config.js`
- **Update application:**
  \`\`\`bash
  git pull
  npm install --legacy-peer-deps
  npm run build
  pm2 restart ecosystem.config.js
  \`\`\`

## What's Ready

- ✅ Frontend integrates with your API at `http://leafe.com:5000/orders`
- ✅ Order data matches your `OrderCreate` schema exactly
- ✅ Stripe payments work and POST to your backend
- ✅ Complete deployment setup with PM2 + Nginx ready
- ✅ Dependency conflicts resolved

The frontend is production-ready Once deployed, customers can place orders through Stripe, and the order data will automatically save to your backend database.
