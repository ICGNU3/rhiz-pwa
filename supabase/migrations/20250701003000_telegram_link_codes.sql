-- Table for Telegram onboarding codes
CREATE TABLE IF NOT EXISTS telegram_link_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  telegram_user_id TEXT,
  telegram_username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE telegram_link_codes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own codes" ON telegram_link_codes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own codes" ON telegram_link_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own codes" ON telegram_link_codes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_telegram_link_codes_user_id ON telegram_link_codes(user_id);
CREATE INDEX idx_telegram_link_codes_code ON telegram_link_codes(code); 