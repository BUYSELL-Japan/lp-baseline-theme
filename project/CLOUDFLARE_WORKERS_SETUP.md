# CloudFlare Workers Setup Guide

This guide explains how to set up CloudFlare Workers for subdomain routing with static site generation (SSG).

## Overview

The application uses Astro to generate static HTML pages for each store at build time. CloudFlare Workers route subdomain traffic to the corresponding static files.

## Architecture

1. **Build time**: Astro fetches store list from API and generates static pages at `/stores/{subdomain}/`
2. **Runtime**: User visits `okinawa-shoten.yourdomain.com`
3. CloudFlare Worker intercepts the request
4. Worker routes `okinawa-shoten.yourdomain.com/` to `/stores/okinawa-shoten/index.html`
5. Worker routes `*.yourdomain.com/_astro/*` to `/_astro/*` (shared assets)
6. Static HTML with pre-rendered data is served instantly

## CloudFlare Workers Setup

### Step 1: Create a Worker

1. Log in to your CloudFlare dashboard
2. Navigate to Workers & Pages
3. Click "Create application"
4. Select "Create Worker"
5. Name your worker (e.g., `subdomain-router`)

### Step 2: Configure Worker Code

Copy the code from `cloudflare-worker-example.js` and paste it into the Worker editor.

The worker handles two types of requests:
1. **Store pages**: `subdomain.yourdomain.com/` → `/stores/subdomain/index.html`
2. **Static assets**: `subdomain.yourdomain.com/_astro/file.js` → `/_astro/file.js`

This allows all subdomains to share the same `_astro` directory containing JavaScript and CSS files.

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

### Build Time (Astro SSG)

1. **Fetch store list**:
   ```
   GET https://2sznhxhcd8.execute-api.ap-southeast-2.amazonaws.com/dev/lp/stores
   ```
   Returns: `{ count: 2, stores: [{ storeId: "OKI1011", subdomain: "okinawa-shoten" }, ...] }`

2. **Generate pages**: For each store, Astro:
   - Fetches content using `storeId` from `/lp/content/{storeId}`
   - Generates static HTML at `/stores/{subdomain}/index.html`
   - Shares assets in `/_astro/` directory

3. **Output structure**:
   ```
   dist/
   ├── _astro/           # Shared JS/CSS assets
   │   ├── StorePage.js
   │   ├── client.js
   │   └── ...
   └── stores/
       ├── okinawa-shoten/
       │   └── index.html
       └── tokyo-ramen/
           └── index.html
   ```

### Runtime (CloudFlare Workers)

The worker routes requests based on subdomain:
- `okinawa-shoten.yourdomain.com/` → serves `/stores/okinawa-shoten/index.html`
- `okinawa-shoten.yourdomain.com/_astro/StorePage.js` → serves `/_astro/StorePage.js`

### API Endpoints

- **Store list**: `GET /lp/stores` - Returns array of `{ storeId, subdomain }`
- **Store content**: `GET /lp/content/{storeId}` - Returns complete page data for a store

## Building and Deploying

### Build the Site

```bash
npm run build
```

This generates static files in the `dist/` directory.

### Deploy to CloudFlare Pages

1. Connect your repository to CloudFlare Pages
2. Set build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Deploy the site

### Configure the Worker

1. In CloudFlare Pages, go to Settings → Functions
2. Add the Worker code from `cloudflare-worker-example.js`
3. Or create a separate Worker and attach it to your domain

### Testing

1. **Local testing**: Build and preview locally
   ```bash
   npm run build
   npm run preview
   ```
   Access stores directly: `http://localhost:4321/stores/okinawa-shoten/`

2. **Production testing**: Visit your subdomain
   ```
   https://okinawa-shoten.yourdomain.com
   ```

## Data Structure

### Store List Response

```json
{
  "count": 2,
  "stores": [
    { "storeId": "OKI1011", "subdomain": "okinawa-shoten" },
    { "storeId": "TOKYO001", "subdomain": "tokyo-ramen" }
  ]
}
```

### Store Content Response

```json
{
  "storeId": "OKI1011",
  "subdomainName": "okinawa-shoten",
  "ContentData": {
    "header": { ... },
    "hero": { ... },
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
}
```

## Environment Variables

Configure these in `.env` for local development:

```env
# Use fallback local data instead of API
USE_FALLBACK_DATA=true

# Use static store list instead of API
USE_STATIC_STORE_LIST=true
STORE_LIST=OKI1011,TOKYO001
```

For production builds, set `USE_FALLBACK_DATA=false` to fetch from the API.

## Troubleshooting

### Issue: 404 on subdomain
- **Check Worker deployment**: Verify the Worker is active and attached to your domain
- **Check DNS**: Ensure wildcard DNS (`*.yourdomain.com`) is configured
- **Check build output**: Verify `/stores/{subdomain}/` directory exists in `dist/`

### Issue: Assets not loading (blank page)
- **Check `_astro` path**: Verify `/_astro/` files are accessible
- **Check Worker code**: Ensure Worker correctly routes `/_astro/*` requests
- **Check browser console**: Look for 404 errors on JS/CSS files

### Issue: Build fails to fetch store list
- **Check API endpoint**: Verify `/lp/stores` endpoint is accessible
- **Check network**: Ensure build environment can reach API Gateway
- **Use fallback**: Set `USE_STATIC_STORE_LIST=true` and `STORE_LIST=...` in `.env`

### Issue: Content not updated after API changes
- **Rebuild required**: Static site must be rebuilt to fetch latest data
- **Clear cache**: Clear CloudFlare cache after redeployment

## Additional Resources

- [CloudFlare Workers Documentation](https://developers.cloudflare.com/workers/)
- [AWS API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [React Router Documentation](https://reactrouter.com/)
