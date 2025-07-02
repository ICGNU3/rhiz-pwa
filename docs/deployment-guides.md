# Deployment Guides

## Overview
This guide covers deploying Rhiz to different platforms for staging and production environments.

## Prerequisites
1. Complete the [Google OAuth Setup](./google-oauth-setup.md)
2. Set up your production Supabase project
3. Configure environment variables

## Platform-Specific Guides

### Vercel Deployment

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Configure Project
Create `vercel.json` in your project root:
```json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/manifest.webmanifest",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache"
        }
      ]
    }
  ]
}
```

#### 3. Deploy
```bash
# Staging
vercel --env VITE_SUPABASE_URL=your_staging_url --env VITE_SUPABASE_ANON_KEY=your_staging_key

# Production
vercel --prod --env VITE_SUPABASE_URL=your_production_url --env VITE_SUPABASE_ANON_KEY=your_production_key
```

### Netlify Deployment

#### 1. Create `netlify.toml`
```toml
[build]
  command = "npm run build:prod"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache"
```

#### 2. Deploy via Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### GitHub Pages Deployment

#### 1. Create GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build:prod
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Firebase Hosting

#### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### 2. Initialize Firebase
```bash
firebase init hosting
```

#### 3. Configure `firebase.json`
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/manifest.webmanifest",
        "headers": [
          {
            "key": "Content-Type",
            "value": "application/manifest+json"
          }
        ]
      },
      {
        "source": "/sw.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  }
}
```

#### 4. Deploy
```bash
npm run build:prod
firebase deploy
```

## Environment Variables Setup

### 1. Create Environment Files
```bash
# Copy the example file
cp env.production.example .env.production.local

# Edit with your actual values
nano .env.production.local
```

### 2. Required Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `VITE_GOOGLE_CLIENT_SECRET`: Google OAuth client secret

### 3. Platform-Specific Setup

#### Vercel
Add environment variables in Vercel dashboard or via CLI:
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

#### Netlify
Add in Netlify dashboard under Site settings > Environment variables

#### GitHub Pages
Add as repository secrets in GitHub settings

## Post-Deployment Checklist

### 1. Verify Deployment
- [ ] App loads without errors
- [ ] PWA installation works
- [ ] Service worker registers
- [ ] Offline functionality works

### 2. Test Core Features
- [ ] User registration/login
- [ ] Contact management
- [ ] Google OAuth integration
- [ ] iOS Shortcuts import
- [ ] Search and filtering

### 3. Performance Check
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s

### 4. Security Verification
- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] Environment variables not exposed

## Troubleshooting

### Common Issues

#### 1. Routing Issues
If you get 404 errors on direct navigation:
- Ensure SPA fallback is configured
- Check that all routes redirect to index.html

#### 2. PWA Not Installing
- Verify manifest.webmanifest is accessible
- Check that icons are properly configured
- Ensure HTTPS is enabled

#### 3. Service Worker Issues
- Clear browser cache
- Check that sw.js is not cached
- Verify workbox configuration

#### 4. Environment Variables Not Loading
- Ensure variables are prefixed with `VITE_`
- Check platform-specific configuration
- Verify build process includes variables

## Monitoring and Analytics

### 1. Error Tracking
Consider adding error tracking:
- Sentry
- LogRocket
- Bugsnag

### 2. Performance Monitoring
- Vercel Analytics
- Google Analytics
- Web Vitals monitoring

### 3. Uptime Monitoring
- UptimeRobot
- Pingdom
- StatusCake 