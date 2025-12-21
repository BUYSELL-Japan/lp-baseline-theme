# CloudFlare Workers Setup Guide

This guide explains how to set up CloudFlare Workers for subdomain routing to display DynamoDB data.

## Overview

The application fetches landing page data from DynamoDB via API Gateway based on the subdomain. CloudFlare Workers route subdomain traffic to your application.

## Architecture

1. User visits `teststore.yourdomain.com`
2. CloudFlare Worker intercepts the request
3. Worker proxies the request to your main application
4. React app detects subdomain and fetches corresponding data from API Gateway
5. Data is displayed dynamically

## CloudFlare Workers Setup

### Step 1: Create a Worker

1. Log in to your CloudFlare dashboard
2. Navigate to Workers & Pages
3. Click "Create application"
4. Select "Create Worker"
5. Name your worker (e.g., `subdomain-router`)

### Step 2: Configure Worker Code

Copy the code from `cloudflare-worker-example.js` and paste it into the Worker editor.

Replace `https://yourdomain.com/index.html` with your actual domain where the React app is hosted.

### Step 3: Configure Routes

1. Go to your website in CloudFlare dashboard
2. Navigate to Workers Routes
3. Add a route: `*.yourdomain.com/*`
4. Select your worker from the dropdown

### Step 4: DNS Configuration

Ensure your DNS is configured correctly:

1. Add an A or CNAME record for `*` (wildcard) pointing to your server
2. Enable CloudFlare proxy (orange cloud)

## How It Works

### Frontend (React App)

The React app includes logic to:

1. **Detect subdomain**: Extract the subdomain from `window.location.hostname`
2. **Fetch data**: Call API Gateway with the subdomain as `storeId`
   ```
   https://2sznhxhcd8.execute-api.ap-southeast-2.amazonaws.com/dev/lp/content/{storeId}
   ```
3. **Display data**: Render components with fetched data using React Context

### API Gateway & DynamoDB

- Each store has a unique `storeId` in DynamoDB
- The JSON data includes a `SubdomainName` field
- API Gateway endpoint returns the complete landing page data for a given `storeId`

## Testing

### Local Testing

1. Edit your `/etc/hosts` file (or `C:\Windows\System32\drivers\etc\hosts` on Windows):
   ```
   127.0.0.1 teststore.localhost
   127.0.0.1 anotherstore.localhost
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Visit `http://teststore.localhost:5173` in your browser

### Production Testing

1. Deploy your React app to your hosting service
2. Configure CloudFlare Workers as described above
3. Visit `https://teststore.yourdomain.com`

## Data Structure

### Expected DynamoDB/API Response Format

```json
{
  "storeId": "teststore",
  "subdomainName": "teststore",
  "header": {
    "logo": { "text": "Store Name" },
    "navigation": [...]
  },
  "hero": {
    "title": "Welcome",
    "subtitle": "...",
    "backgroundImage": "..."
  },
  "about": { ... },
  "menu": { ... },
  "pricing": { ... },
  "gallery": { ... },
  "staff": { ... },
  "reviews": { ... },
  "news": { ... },
  "storeInfo": { ... },
  "company": { ... },
  "access": { ... },
  "faq": { ... },
  "cta": { ... },
  "contact": { ... },
  "footer": { ... }
}
```

## Fallback Behavior

If no subdomain is detected or data fetch fails, the app displays default content from `src/data/content.ts`.

## Troubleshooting

### Issue: Subdomain not detected
- Check DNS configuration
- Verify CloudFlare Worker is active
- Inspect browser console for errors

### Issue: Data not loading
- Verify API Gateway endpoint is accessible
- Check CORS settings on API Gateway
- Inspect Network tab in browser DevTools

### Issue: 404 errors
- Ensure your hosting service supports SPA routing
- Check CloudFlare Worker route configuration

## Additional Resources

- [CloudFlare Workers Documentation](https://developers.cloudflare.com/workers/)
- [AWS API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [React Router Documentation](https://reactrouter.com/)
