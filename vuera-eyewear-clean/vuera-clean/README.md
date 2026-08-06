# Vuera — AI-Powered Eyewear

Vite + React + TypeScript storefront with AR/AI try-on, cart, wishlist, auth, checkout, and an admin dashboard, backed by Supabase.

## Getting started

```bash
npm install
npm run dev
```

Your Supabase credentials are already set in `.env` (excluded from git via `.gitignore`).

## Database

Run the migrations in `supabase/migrations/` against your Supabase project, in order:

1. `0001_core_foundation.sql`
2. `0002_seed_catalog.sql`
3. `0003_checkout_and_analytics.sql`

## Project structure

```
src/
  components/   ui primitives, shared sections, layout, admin widgets
  context/      auth, cart, wishlist providers
  pages/        route-level pages (storefront + admin/)
  router/       route definitions
  services/     API/data-access layer
  lib/          supabase client, feature flags, utils
  types/        shared TypeScript types
  data/         static catalog data
```

## What was cleaned up

Your uploaded zip had ~6 layers of nested project folders (each a snapshot Bolt
had wrapped inside the next export), plus a stray `dist/` build folder. This
package is just the final, real project pulled out flat:

- One `src/` — the most complete version (the only one with actual source code).
- Latest `supabase/migrations/` — picked the newest-timestamped set of the three
  duplicated migration sets, and fixed a `.sql.sql` double-extension typo.
- Removed the `dist/` build output (regenerate anytime with `npm run build`).
- Removed all the empty duplicate nested folders.
