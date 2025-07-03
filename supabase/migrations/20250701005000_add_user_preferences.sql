-- Add user_preferences table for adaptive interface system
-- This table stores behavioral learning data and UI adaptation preferences

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- Behavioral learning data
  search_preferences jsonb DEFAULT '{}', -- e.g. {"byCompany": 85, "byName": 15}
  feature_usage jsonb DEFAULT '{}', -- e.g. {"notes": 90, "tags": 30, "goals": 45}
  navigation_patterns jsonb DEFAULT '{}', -- e.g. {"dashboard": 40, "contacts": 35, "goals": 25}
  timing_patterns jsonb DEFAULT '[]', -- e.g. ["9:00", "14:00", "17:00"]
  
  -- UI adaptation preferences
  dashboard_layout jsonb DEFAULT '{}', -- e.g. {"widgets": ["recent_activity", "trust_alerts"], "order": [1, 2]}
  contact_view_preferences jsonb DEFAULT '{}', -- e.g. {"defaultView": "grid", "sortBy": "trust_score", "filters": ["hasEmail"]}
  workflow_patterns jsonb DEFAULT '{}', -- e.g. {"contactCreation": ["name", "email", "company"], "goalSetting": ["title", "target_date"]}
  
  -- User behavior profile
  behavior_profile text DEFAULT 'balanced', -- 'relationship-focused', 'goal-focused', 'network-focused', 'balanced'
  sophistication_level text DEFAULT 'intermediate', -- 'beginner', 'intermediate', 'advanced'
  adaptation_level text DEFAULT 'moderate', -- 'minimal', 'moderate', 'aggressive'
  
  -- Contextual preferences
  contextual_suggestions jsonb DEFAULT '{}', -- e.g. {"enabled": true, "frequency": "daily", "types": ["contact_reminders", "goal_alerts"]}
  smart_defaults jsonb DEFAULT '{}', -- e.g. {"contact_tags": ["investor"], "goal_categories": ["fundraising"]}
  
  -- Learning preferences
  learning_enabled boolean DEFAULT true,
  privacy_conscious boolean DEFAULT false,
  data_sharing_level text DEFAULT 'minimal', -- 'minimal', 'standard', 'enhanced'
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user_preferences
CREATE POLICY "Users can read own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON user_preferences
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS user_preferences_behavior_profile_idx ON user_preferences(behavior_profile);
CREATE INDEX IF NOT EXISTS user_preferences_sophistication_level_idx ON user_preferences(sophistication_level);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_user_preferences_updated_at(); 