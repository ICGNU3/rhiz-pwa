-- Table for Telegram message metadata (privacy-first, no content)
CREATE TABLE IF NOT EXISTS telegram_message_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  telegram_user_id TEXT NOT NULL,
  telegram_username TEXT,
  chat_id TEXT NOT NULL,
  chat_title TEXT,
  message_id TEXT,
  timestamp TIMESTAMPTZ NOT NULL,
  is_group BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE telegram_message_metadata ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own Telegram metadata" ON telegram_message_metadata
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Telegram metadata" ON telegram_message_metadata
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_telegram_metadata_user_id ON telegram_message_metadata(user_id);
CREATE INDEX idx_telegram_metadata_telegram_user_id ON telegram_message_metadata(telegram_user_id);
CREATE INDEX idx_telegram_metadata_chat_id ON telegram_message_metadata(chat_id); 