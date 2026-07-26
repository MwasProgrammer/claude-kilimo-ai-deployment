-- Demo seed data for hackathon MVP
-- Run with: psql "$DATABASE_URL" -f src/db/seed.sql

INSERT INTO crops (name, name_sw, default_unit, bag_weight_kg) VALUES
  ('Maize', 'Mahindi', 'bag', 90),
  ('Potatoes', 'Viazi', 'bag', 110),
  ('Tomatoes', 'Nyanya', 'crate', 64),
  ('Beans', 'Maharagwe', 'bag', 90)
ON CONFLICT (name) DO NOTHING;

INSERT INTO markets (name, county, latitude, longitude, market_type) VALUES
  ('Wakulima Market',  'Murang''a', -0.7167, 37.1500, 'wholesale'),
  ('Marikiti Market',  'Nairobi',   -1.2833, 36.8267, 'wholesale'),
  ('Nyeri Market',     'Nyeri',     -0.4167, 36.9500, 'wholesale'),
  ('Local Broker',     'Murang''a', -0.7200, 37.1550, 'broker')
ON CONFLICT DO NOTHING;

-- Sample potato prices (KES per bag) matching the product-workflow example
INSERT INTO market_prices (market_id, crop_id, price, unit, trend, recorded_by)
SELECT m.id, c.id, p.price, 'bag', p.trend, 'seed'
FROM (VALUES
  ('Wakulima Market', 'Potatoes', 3600, 'stable'),
  ('Marikiti Market',  'Potatoes', 3850, 'rising'),
  ('Nyeri Market',     'Potatoes', 3500, 'stable'),
  ('Local Broker',     'Potatoes', 2800, 'falling')
) AS p(market_name, crop_name, price, trend)
JOIN markets m ON m.name = p.market_name
JOIN crops   c ON c.name = p.crop_name;

-- Sample maize prices (KES per bag)
INSERT INTO market_prices (market_id, crop_id, price, unit, trend, recorded_by)
SELECT m.id, c.id, p.price, 'bag', p.trend, 'seed'
FROM (VALUES
  ('Wakulima Market', 'Maize', 3200, 'stable'),
  ('Marikiti Market',  'Maize', 3400, 'rising'),
  ('Nyeri Market',     'Maize', 3100, 'stable'),
  ('Local Broker',     'Maize', 2500, 'falling')
) AS p(market_name, crop_name, price, trend)
JOIN markets m ON m.name = p.market_name
JOIN crops   c ON c.name = p.crop_name;
