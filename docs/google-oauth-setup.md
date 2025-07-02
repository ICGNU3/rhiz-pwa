# Google OAuth Setup for Rhiz Production

## Overview
This guide will help you set up Google OAuth 2.0 credentials for Rhiz's Google Contacts integration in production.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Rhiz CRM" and click "Create"
4. Select the new project

## Step 2: Enable Required APIs

1. Go to "APIs & Services" → "Library"
2. Search for and enable these APIs:
   - **Google People API** (for contacts)
   - **Gmail API** (for email integration)
   - **Google Calendar API** (for calendar sync)

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Configure the OAuth consent screen:
   - **User Type**: External
   - **App name**: Rhiz CRM
   - **User support email**: your-email@domain.com
   - **Developer contact information**: your-email@domain.com
   - **Scopes**: Add these scopes:
     - `https://www.googleapis.com/auth/userinfo.email`
     - `https://www.googleapis.com/auth/userinfo.profile`
     - `https://www.googleapis.com/auth/contacts.readonly`
     - `https://www.googleapis.com/auth/gmail.readonly`
     - `https://www.googleapis.com/auth/calendar.readonly`

4. Create OAuth 2.0 Client ID:
   - **Application type**: Web application
   - **Name**: Rhiz Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:5175` (development)
     - `https://your-production-domain.com` (production)
   - **Authorized redirect URIs**:
     - `http://localhost:5175/settings` (development)
     - `https://your-production-domain.com/settings` (production)

## Step 4: Get Credentials

After creation, you'll get:
- **Client ID**: `your-client-id.apps.googleusercontent.com`
- **Client Secret**: `your-client-secret`

## Step 5: Environment Variables

Add these to your production environment:

```bash
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://your-production-domain.com/settings

# Supabase (if not already set)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Step 6: Deploy Supabase Edge Functions

Deploy the Google OAuth function to Supabase:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy google-oauth
```

## Step 7: Test the Integration

1. Deploy your app to production
2. Go to Settings → Integrations
3. Click "Connect Google"
4. Complete the OAuth flow
5. Test contact import

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch"**
   - Ensure redirect URI in Google Console matches your app exactly
   - Check for trailing slashes

2. **"invalid_client"**
   - Verify Client ID and Secret are correct
   - Check that credentials are for the right project

3. **"access_denied"**
   - User may have denied permissions
   - Check OAuth consent screen configuration

4. **"scope_not_allowed"**
   - Ensure all required scopes are added to consent screen
   - Verify scopes in the OAuth request

### Security Best Practices:

1. **Never commit secrets** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate secrets** regularly
4. **Monitor OAuth usage** in Google Cloud Console
5. **Set up alerts** for unusual activity

## Production Checklist

- [ ] Google Cloud Project created
- [ ] Required APIs enabled
- [ ] OAuth 2.0 credentials configured
- [ ] Consent screen configured with all scopes
- [ ] Environment variables set in production
- [ ] Supabase Edge Functions deployed
- [ ] OAuth flow tested end-to-end
- [ ] Contact import tested
- [ ] Error handling verified

## Support

If you encounter issues:
1. Check Google Cloud Console logs
2. Verify Supabase function logs
3. Test with a fresh OAuth flow
4. Contact support with specific error messages

---

**Note**: Keep your Client Secret secure and never expose it in client-side code. The secret is only used in the Supabase Edge Function for server-side OAuth token exchange. 