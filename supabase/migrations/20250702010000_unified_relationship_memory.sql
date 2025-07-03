-- 1. Extend relationship_interactions for multi-platform aggregation
ALTER TABLE relationship_interactions
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'manual', -- e.g. 'email', 'calendar', 'linkedin', etc.
  ADD COLUMN IF NOT EXISTS external_id text, -- platform-specific unique id
  ADD COLUMN IF NOT EXISTS raw_metadata jsonb DEFAULT '{}';

-- 2. Add relationship_platform_integrations table
CREATE TABLE IF NOT EXISTS relationship_platform_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL, -- e.g. 'gmail', 'outlook', 'google_calendar', 'linkedin', etc.
  access_token text, -- encrypted or stored in secrets manager
  refresh_token text,
  expires_at timestamptz,
  scopes text[],
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS platform_integrations_user_id_idx ON relationship_platform_integrations(user_id);
CREATE INDEX IF NOT EXISTS platform_integrations_platform_idx ON relationship_platform_integrations(platform); 