# Rhiz PWA

Rhiz is a progressive web application built with Vite, React and Supabase.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- [Supabase CLI](https://supabase.com/docs/guides/cli) (for running functions locally)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment variables**
   - Copy `.env.example` to `.env` and provide your Supabase credentials:
     ```bash
     cp .env.example .env
     # edit .env
     ```
   - `.env` should contain:
     ```bash
     VITE_SUPABASE_URL=<your-supabase-url>
     VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
     ```
3. **Run Supabase locally** (optional)
   ```bash
   supabase start
   ```

## Development

Start the development server with hot reload:
```bash
npm run dev
```
This will launch the Vite dev server on [localhost:5173](http://localhost:5173).

## Testing

Unit tests are written with [Vitest](https://vitest.dev/):
```bash
npm test
```
The Supabase client uses fallback credentials during tests so no real keys are required.

## Build

Generate a production build:
```bash
npm run build
```
The output is placed in `dist/` and can be deployed to any static host.

To deploy Supabase Edge Functions:
```bash
supabase functions deploy <function-name>
```
See the `supabase/functions` directory for available functions.

