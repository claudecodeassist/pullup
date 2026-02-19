-- PullUp: UF Pickup Sports App — Initial Schema
-- Run this in your Supabase SQL editor or via supabase db push

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE sport_type AS ENUM ('pickleball', 'spikeball');
CREATE TYPE skill_level_type AS ENUM ('beginner', 'intermediate', 'advanced', 'any');
CREATE TYPE game_status_type AS ENUM ('open', 'full', 'cancelled', 'completed');
CREATE TYPE participant_status_type AS ENUM ('joined', 'left');

-- ============================================================
-- LOCATIONS (7 preloaded UF spots)
-- ============================================================

CREATE TABLE locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Locations are viewable by everyone"
  ON locations FOR SELECT USING (true);

-- ============================================================
-- PROFILES (linked to auth.users)
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  preferred_sport sport_type,
  skill_level skill_level_type,
  favorite_location_id TEXT REFERENCES locations(id),
  expo_push_token TEXT,
  onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- UF email guard (server-side check)
CREATE OR REPLACE FUNCTION enforce_ufl_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email NOT LIKE '%@ufl.edu' THEN
    RAISE EXCEPTION 'Only @ufl.edu emails are allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_ufl_email_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION enforce_ufl_email();

-- ============================================================
-- GAMES
-- ============================================================

CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sport sport_type NOT NULL,
  skill_level skill_level_type NOT NULL DEFAULT 'any',
  location_id TEXT NOT NULL REFERENCES locations(id),
  starts_at TIMESTAMPTZ NOT NULL,
  max_players INTEGER NOT NULL CHECK (max_players BETWEEN 2 AND 20),
  current_players INTEGER NOT NULL DEFAULT 0,
  status game_status_type NOT NULL DEFAULT 'open',
  notes TEXT CHECK (char_length(notes) <= 200),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Games are viewable by everyone"
  ON games FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create games"
  ON games FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Host can update own game"
  ON games FOR UPDATE USING (auth.uid() = host_id);

-- ============================================================
-- GAME PARTICIPANTS
-- ============================================================

CREATE TABLE game_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status participant_status_type NOT NULL DEFAULT 'joined',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(game_id, user_id)
);

ALTER TABLE game_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants are viewable by everyone"
  ON game_participants FOR SELECT USING (true);

CREATE POLICY "Users can join games"
  ON game_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participation"
  ON game_participants FOR UPDATE USING (auth.uid() = user_id);

-- Trigger: increment current_players when someone joins
CREATE OR REPLACE FUNCTION update_game_player_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'joined' THEN
    UPDATE games SET current_players = current_players + 1, updated_at = now()
    WHERE id = NEW.game_id;

    -- Auto-set game to full if at capacity
    UPDATE games SET status = 'full'
    WHERE id = NEW.game_id
      AND current_players >= max_players
      AND status = 'open';

  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'joined' AND NEW.status = 'left' THEN
      UPDATE games SET current_players = GREATEST(current_players - 1, 0), updated_at = now()
      WHERE id = NEW.game_id;

      -- Re-open game if was full
      UPDATE games SET status = 'open'
      WHERE id = NEW.game_id
        AND status = 'full'
        AND current_players < max_players;

    ELSIF OLD.status = 'left' AND NEW.status = 'joined' THEN
      UPDATE games SET current_players = current_players + 1, updated_at = now()
      WHERE id = NEW.game_id;

      UPDATE games SET status = 'full'
      WHERE id = NEW.game_id
        AND current_players >= max_players
        AND status = 'open';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_participant_change
  AFTER INSERT OR UPDATE ON game_participants
  FOR EACH ROW EXECUTE FUNCTION update_game_player_count();

-- ============================================================
-- MESSAGES (game chat)
-- ============================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages are viewable by everyone"
  ON messages FOR SELECT USING (true);

CREATE POLICY "Authenticated users can send messages"
  ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- REALTIME PUBLICATION
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE games;
ALTER PUBLICATION supabase_realtime ADD TABLE game_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_games_starts_at ON games (starts_at);
CREATE INDEX idx_games_status ON games (status);
CREATE INDEX idx_games_sport ON games (sport);
CREATE INDEX idx_games_host ON games (host_id);
CREATE INDEX idx_participants_game ON game_participants (game_id);
CREATE INDEX idx_participants_user ON game_participants (user_id);
CREATE INDEX idx_messages_game ON messages (game_id);
