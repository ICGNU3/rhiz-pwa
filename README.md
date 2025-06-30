# Rhiz PWA

Rhiz is a progressive web application built with Vite, React and Supabase.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment variables**
   - Copy `.env.example` to `.env` and update the Supabase credentials:
     ```bash
     cp .env.example .env
     # edit .env
     ```

## Development

Run the development server with hot reload:
```bash
npm run dev
```

## Testing

Unit tests are written with [Vitest](https://vitest.dev/):
```bash
npm test
```

## Build

Generate a production build:
```bash
npm run build
```

The build output is placed in `dist/` and can be served with any static server.

