-- PullUp Seed Data: 7 UF Locations + Demo Games
-- Run after initial schema migration

-- ============================================================
-- LOCATIONS
-- ============================================================

INSERT INTO locations (id, name, latitude, longitude) VALUES
  ('flavet',          'Flavet Field',       29.6499, -82.3486),
  ('sw-rec-indoor',   'SW Rec (Indoor)',    29.6397, -82.3534),
  ('sw-rec-outdoor',  'SW Rec (Outdoor)',   29.6393, -82.3539),
  ('lake-alice',      'Lake Alice Fields',  29.6428, -82.3614),
  ('reitz-lawn',      'Reitz Lawn',         29.6462, -82.3478),
  ('hume',            'Hume Field',         29.6449, -82.3404),
  ('ring-road',       'Ring Road Fields',   29.6501, -82.3408)
ON CONFLICT (id) DO NOTHING;
