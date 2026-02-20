-- Migration: Switch from Supabase Auth UUIDs to Clerk text IDs

BEGIN;

-- 1. Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- 2. Clear data
TRUNCATE messages, game_participants, games, profiles CASCADE;

-- 3. Drop ALL RLS policies
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Games are viewable by everyone" ON games;
DROP POLICY IF EXISTS "Authenticated users can create games" ON games;
DROP POLICY IF EXISTS "Host can update own game" ON games;
DROP POLICY IF EXISTS "Participants are viewable by everyone" ON game_participants;
DROP POLICY IF EXISTS "Users can join games" ON game_participants;
DROP POLICY IF EXISTS "Users can update own participation" ON game_participants;
DROP POLICY IF EXISTS "Messages are viewable by everyone" ON messages;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON messages;

-- 4. Drop FK constraints explicitly
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_favorite_location_id_fkey;
ALTER TABLE games DROP CONSTRAINT IF EXISTS games_host_id_fkey;
ALTER TABLE games DROP CONSTRAINT IF EXISTS games_location_id_fkey;
ALTER TABLE game_participants DROP CONSTRAINT IF EXISTS game_participants_user_id_fkey;
ALTER TABLE game_participants DROP CONSTRAINT IF EXISTS game_participants_game_id_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_user_id_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_game_id_fkey;

-- 5. Drop PK on profiles
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_pkey;

-- 6. Convert columns from UUID to TEXT
ALTER TABLE profiles ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE games ALTER COLUMN host_id TYPE TEXT USING host_id::TEXT;
ALTER TABLE game_participants ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
ALTER TABLE messages ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- 7. Re-add PK + FKs
ALTER TABLE profiles ADD PRIMARY KEY (id);
ALTER TABLE profiles ADD CONSTRAINT profiles_favorite_location_id_fkey
  FOREIGN KEY (favorite_location_id) REFERENCES locations(id);
ALTER TABLE games ADD CONSTRAINT games_host_id_fkey
  FOREIGN KEY (host_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE games ADD CONSTRAINT games_location_id_fkey
  FOREIGN KEY (location_id) REFERENCES locations(id);
ALTER TABLE game_participants ADD CONSTRAINT game_participants_game_id_fkey
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE;
ALTER TABLE game_participants ADD CONSTRAINT game_participants_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE messages ADD CONSTRAINT messages_game_id_fkey
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE;
ALTER TABLE messages ADD CONSTRAINT messages_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 8. Make location optional
ALTER TABLE games ALTER COLUMN location_id DROP NOT NULL;

-- 9. Add new columns
ALTER TABLE games ADD COLUMN IF NOT EXISTS has_equipment BOOLEAN DEFAULT false;
ALTER TABLE games ADD COLUMN IF NOT EXISTS extra_equipment BOOLEAN DEFAULT false;
ALTER TABLE games ADD COLUMN IF NOT EXISTS time_flexible BOOLEAN DEFAULT false;

-- 10. Re-create RLS policies (open — Clerk handles auth)
CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update profiles" ON profiles FOR UPDATE USING (true);

CREATE POLICY "Anyone can view games" ON games FOR SELECT USING (true);
CREATE POLICY "Anyone can insert games" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update games" ON games FOR UPDATE USING (true);

CREATE POLICY "Anyone can view participants" ON game_participants FOR SELECT USING (true);
CREATE POLICY "Anyone can insert participants" ON game_participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update participants" ON game_participants FOR UPDATE USING (true);

CREATE POLICY "Anyone can view messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);

COMMIT;
