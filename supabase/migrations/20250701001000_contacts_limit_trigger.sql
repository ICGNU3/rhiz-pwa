-- Function to enforce free tier contact limit
CREATE OR REPLACE FUNCTION check_contacts_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_type TEXT;
  contacts_count INTEGER;
BEGIN
  SELECT userType INTO user_type FROM user_settings WHERE user_id = NEW.user_id;
  SELECT contacts_count INTO contacts_count FROM user_usage WHERE user_id = NEW.user_id;
  IF (user_type IS NULL OR user_type = 'free') AND contacts_count >= 25 THEN
    RAISE EXCEPTION 'Free tier limit reached: upgrade to add more than 25 contacts.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for contacts insert
DROP TRIGGER IF EXISTS trigger_check_contacts_limit ON contacts;
CREATE TRIGGER trigger_check_contacts_limit
BEFORE INSERT ON contacts
FOR EACH ROW EXECUTE FUNCTION check_contacts_limit(); 