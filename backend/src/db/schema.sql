-- Kilimo AI database schema
-- Run with: psql "$DATABASE_URL" -f src/db/schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS farmers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  phone TEXT UNIQUE,
  county TEXT,
  subcounty TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crops (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  name_sw TEXT,
  default_unit TEXT DEFAULT 'bag',
  bag_weight_kg NUMERIC DEFAULT 90
);

CREATE TABLE IF NOT EXISTS markets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  county TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  market_type TEXT DEFAULT 'wholesale' -- wholesale | broker | retail
);

CREATE TABLE IF NOT EXISTS market_prices (
  id SERIAL PRIMARY KEY,
  market_id INTEGER REFERENCES markets(id) ON DELETE CASCADE,
  crop_id INTEGER REFERENCES crops(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'bag',
  trend TEXT DEFAULT 'stable', -- rising | falling | stable
  recorded_at TIMESTAMPTZ DEFAULT now(),
  recorded_by TEXT -- admin uid / name
);

CREATE INDEX IF NOT EXISTS idx_market_prices_crop ON market_prices(crop_id);
CREATE INDEX IF NOT EXISTS idx_market_prices_recorded_at ON market_prices(recorded_at DESC);

CREATE TABLE IF NOT EXISTS queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES farmers(id),
  crop_id INTEGER REFERENCES crops(id),
  quantity NUMERIC,
  county TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES queries(id) ON DELETE CASCADE,
  best_market_id INTEGER REFERENCES markets(id),
  expected_profit NUMERIC,
  recommendation_text TEXT,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now()
);
