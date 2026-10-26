# Yvonne Córdoba × LumnIA — Vercel edition

This directory is the Vercel-ready copy of the public LumnIA authority site.
The existing ChatGPT Sites deployment remains unchanged.

## Local verification

```bash
npm install
npm run lint
npm run build
npm run dev
```

## Public configuration

- Booking links open Yvonne's Calendly scheduling page.
- `NEXT_PUBLIC_SITE_URL`: canonical production URL. Vercel's production URL is
  used automatically when this variable is not set.

## Vercel deployment

Deploy this directory as a Next.js project. Create a preview first, verify it,
and only then promote or deploy to production.
