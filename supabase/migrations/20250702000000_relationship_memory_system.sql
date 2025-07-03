-- 1. Extend contacts table with rich relationship data
ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS personal_details jsonb DEFAULT '{}', -- family, hobbies, goals, challenges
  ADD COLUMN IF NOT EXISTS shared_interests text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS mutual_connections text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS relationship_importance text DEFAULT 'medium', -- low/medium/high
  ADD COLUMN IF NOT EXISTS relationship_milestones jsonb DEFAULT '{}';

-- 2. Create relationship_interactions table
CREATE TABLE IF NOT EXISTS relationship_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL, -- e.g. 'email', 'call', 'meeting', 'note'
  topic text,
  summary text,
  timestamp timestamptz DEFAULT now(),
  sentiment text, -- e.g. 'positive', 'neutral', 'negative'
  duration integer, -- in minutes
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 3. Create relationship_insights table
CREATE TABLE IF NOT EXISTS relationship_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  health_score integer CHECK (health_score >= 0 AND health_score <= 100),
  decay_risk real CHECK (decay_risk >= 0.0 AND decay_risk <= 1.0),
  optimal_contact_time text, -- e.g. 'Monday 10am'
  suggested_topics text[],
  prep_brief text,
  last_updated timestamptz DEFAULT now()
);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS relationship_interactions_user_id_idx ON relationship_interactions(user_id);
CREATE INDEX IF NOT EXISTS relationship_interactions_contact_id_idx ON relationship_interactions(contact_id);
CREATE INDEX IF NOT EXISTS relationship_insights_user_id_idx ON relationship_insights(user_id);
CREATE INDEX IF NOT EXISTS relationship_insights_contact_id_idx ON relationship_insights(contact_id);

-- 5. Enable RLS and policies (optional, for security)
ALTER TABLE relationship_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own interactions" ON relationship_interactions
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own insights" ON relationship_insights
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id); 