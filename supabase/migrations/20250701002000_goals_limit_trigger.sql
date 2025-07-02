-- Function to enforce free tier goal limit
CREATE OR REPLACE FUNCTION check_goals_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_type TEXT;
  goals_count INTEGER;
BEGIN
  SELECT userType INTO user_type FROM user_settings WHERE user_id = NEW.user_id;
  SELECT goals_count INTO goals_count FROM user_usage WHERE user_id = NEW.user_id;
  IF (user_type IS NULL OR user_type = 'free') AND goals_count >= 3 THEN
    RAISE EXCEPTION 'Free tier limit reached: upgrade to add more than 3 goals.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for goals insert
DROP TRIGGER IF EXISTS trigger_check_goals_limit ON goals;
CREATE TRIGGER trigger_check_goals_limit
BEFORE INSERT ON goals
FOR EACH ROW EXECUTE FUNCTION check_goals_limit(); 