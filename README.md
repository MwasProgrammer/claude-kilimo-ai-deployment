# Kilimo AI — Agriculture Market Advisor (Hackathon MVP)

Helps Kenyan farmers compare real crop prices across nearby markets and get
a plain-language AI recommendation on where to sell and whether to wait.

Built to match the brief exactly:
- **Frontend:** React + Vite, Tailwind CSS
- **Backend:** Node.js / Express
- **Database:** PostgreSQL
- **Auth:** Firebase (used for the Admin price-entry screen only — the
  farmer-facing flow is deliberately login-free, per the MVP scope)
- **Map:** Leaflet + OpenStreetMap (free, no API key needed)
- **AI:** Claude API (Anthropic)
- **Market prices:** manual admin entry (the doc's recommended MVP
  approach — Kenya has no reliable free live price API, so scraping is
  avoided in favor of a fast, trustworthy admin dashboard)

## ✅ Feature checklist
- Crop selection (Maize, Potatoes, Tomatoes, Beans)
- Farmer location (GPS or typed county, geocoded via OpenStreetMap)
- Market price comparison (price, distance, transport estimate, net profit)
- AI recommendation (best market + expected profit, in English or Kiswahili)
- Map showing nearby markets relative to the farmer
- Dashboard with a "profit ladder" ranking markets by what actually lands
  in the farmer's pocket

## Project structure
```
kilimo-ai/
├── backend/     Express API, PostgreSQL schema, Claude integration
└── frontend/    React/Vite app, Tailwind design system, Leaflet map
```

## 1. Database setup (PostgreSQL)

Any Postgres works — a local install, Supabase, Render, or Railway.

```bash
createdb kilimo_ai   # or create it via your host's dashboard
```

> **Using Supabase?** Use the **Connection pooling** string (port 6543,
> host like `aws-0-<region>.pooler.supabase.com`) as `DATABASE_URL`, not
> the direct db host — the direct host frequently fails to resolve from
> serverless/cloud environments.

## 2. Backend setup

```bash
cd backend
cp .env.example .env
npm install
```

Fill in `.env`:
- `DATABASE_URL` — your Postgres connection string
- `ANTHROPIC_API_KEY` — from https://console.anthropic.com
  (leave blank and the AI card still works using a rule-based fallback
  recommendation, so the demo never breaks if the key is missing)
- `FIREBASE_SERVICE_ACCOUNT_PATH` or `FIREBASE_SERVICE_ACCOUNT_JSON` —
  from Firebase Console → Project Settings → Service Accounts →
  Generate new private key (only needed for the Admin price-entry screen)

Load the schema and demo data, then start the server:

```bash
npm run db:setup   # runs schema.sql then seed.sql against DATABASE_URL
npm run dev         # http://localhost:4000
```

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
```

Fill in `.env`:
- `VITE_API_BASE_URL` — defaults to `http://localhost:4000/api`
- `VITE_FIREBASE_*` — from Firebase Console → Project Settings →
  General → Your apps → SDK setup and config (enable **Email/Password**
  sign-in under Authentication, then create one admin user manually in
  the Firebase console for the demo)

```bash
npm run dev   # http://localhost:5173
```

## 4. Try it

1. Open `http://localhost:5173`, click **Check today's price**.
2. Pick a crop (Potatoes has seed data pre-loaded), enter quantity,
   type "Murang'a" as location (or use GPS).
3. See market cards, the profit ladder, the map, and the AI
   recommendation load in.
4. Visit `/admin/login`, sign in with the admin user you created in
   Firebase, and add a new price — it appears on the dashboard instantly.

## Notes on the "other recommendations" in the brief
- **Distance/transport:** estimated with the Haversine formula (padded
  ~25% to approximate real road distance) rather than a paid routing
  API, keeping the MVP free to run. Swap in Google Distance Matrix later
  if you want turn-by-turn accuracy.
- **"KPI analytics / Google Analytics" for market prices:** these are
  product-analytics tools, not market-price data sources — Kenya has no
  robust free live crop-price API, so this MVP uses the admin-entry
  approach the source document itself recommends as fastest and most
  reliable for a demo. `queries` and `ai_recommendations` tables are
  already in the schema if you want to add real usage analytics later.
- **Claude model:** the backend defaults to `claude-sonnet-5` — change
  `CLAUDE_MODEL` in `backend/.env` if you want to point at a different
  model.

## Next steps beyond the hackathon
Buyer marketplace, SMS/USSD access for feature-phone farmers, weather
and crop-disease alerts, and cooperative-level analytics are all natural
extensions — the `queries`/`ai_recommendations` tables already lay the
groundwork for the analytics side.
