-- Initial schema for XinYiJian (Supabase)
-- Apply with: supabase db push / SQL editor. Never store API keys in migrations.

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  avatar_emoji VARCHAR(10) DEFAULT '👤',
  email VARCHAR(255),
  preferences JSONB DEFAULT '{}',
  body_data JSONB DEFAULT '{}',
  stats JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clothing items table
CREATE TABLE IF NOT EXISTS clothing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  sub_category VARCHAR(50),
  brand VARCHAR(100),
  color VARCHAR(50) NOT NULL,
  colors JSONB DEFAULT '[]',
  pattern VARCHAR(50),
  material VARCHAR(100),
  season JSONB DEFAULT '[]',
  style JSONB DEFAULT '[]',
  occasion JSONB DEFAULT '[]',
  size VARCHAR(20),
  fit VARCHAR(50),
  price DECIMAL(10, 2),
  purchase_date DATE,
  purchase_channel VARCHAR(100),
  images JSONB DEFAULT '[]',
  thumbnail VARCHAR(50),
  wear_count INTEGER DEFAULT 0,
  last_worn DATE,
  is_favorite BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  tags JSONB DEFAULT '[]',
  notes TEXT,
  care_instructions TEXT,
  sustainability JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create outfits table
CREATE TABLE IF NOT EXISTS outfits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  items JSONB DEFAULT '[]',
  occasion VARCHAR(50) NOT NULL,
  weather JSONB,
  temperature INTEGER,
  style VARCHAR(50) NOT NULL,
  season VARCHAR(50),
  is_ai_generated BOOLEAN DEFAULT FALSE,
  ai_confidence DECIMAL(3, 2),
  image VARCHAR(255),
  thumbnail VARCHAR(255),
  wear_count INTEGER DEFAULT 0,
  last_worn DATE,
  is_favorite BOOLEAN DEFAULT FALSE,
  tags JSONB DEFAULT '[]',
  notes TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  fit_score INTEGER,
  color_score INTEGER,
  style_score INTEGER,
  occasion_score INTEGER,
  total_score INTEGER,
  style_tags JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  images JSONB DEFAULT '[]',
  outfit_id UUID REFERENCES outfits(id) ON DELETE SET NULL,
  tags JSONB DEFAULT '[]',
  likes INTEGER DEFAULT 0,
  comments JSONB DEFAULT '[]',
  shares INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bottles table (for clothing exchange)
CREATE TABLE IF NOT EXISTS bottles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES clothing_items(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'floating',
  eco_impact JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  matched_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create calendar entries table
CREATE TABLE IF NOT EXISTS calendar_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  outfit_id UUID REFERENCES outfits(id) ON DELETE SET NULL,
  weather JSONB,
  occasion VARCHAR(50),
  mood VARCHAR(50),
  rating INTEGER,
  photos JSONB DEFAULT '[]',
  notes TEXT,
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  replies JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clothing_items_updated_at
BEFORE UPDATE ON clothing_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outfits_updated_at
BEFORE UPDATE ON outfits
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
BEFORE UPDATE ON community_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_entries_updated_at
BEFORE UPDATE ON calendar_entries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clothing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bottles ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own clothing items" ON clothing_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clothing items" ON clothing_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clothing items" ON clothing_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clothing items" ON clothing_items
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own outfits" ON outfits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own outfits" ON outfits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outfits" ON outfits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outfits" ON outfits
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view public outfits" ON outfits
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own calendar entries" ON calendar_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendar entries" ON calendar_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar entries" ON calendar_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar entries" ON calendar_entries
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view all community posts" ON community_posts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own community posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own community posts" ON community_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own community posts" ON community_posts
  FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Users can view their own bottles" ON bottles
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert their own bottles" ON bottles
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own bottles" ON bottles
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can view all comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = author_id);
