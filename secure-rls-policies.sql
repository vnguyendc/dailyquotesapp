-- Enhanced RLS Policies for Production Security

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public insert on subscribers" ON subscribers;
DROP POLICY IF EXISTS "Allow anonymous insert on subscribers" ON subscribers;
DROP POLICY IF EXISTS "Allow anonymous select on subscribers" ON subscribers;
DROP POLICY IF EXISTS "Allow service role select on subscribers" ON subscribers;
DROP POLICY IF EXISTS "Allow service role update on subscribers" ON subscribers;

-- 1. Allow anonymous users to INSERT only (for public subscription form)
CREATE POLICY "Allow public subscription" ON subscribers
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- 2. Allow service role full access (for admin operations, background jobs)
CREATE POLICY "Allow service role full access" ON subscribers
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 3. Prevent anonymous users from reading data (privacy protection)
-- No SELECT policy for anon = no read access

-- 4. Prevent anonymous users from updating/deleting
-- No UPDATE/DELETE policies for anon = no modify access

-- Optional: Add rate limiting function (advanced)
CREATE OR REPLACE FUNCTION check_subscription_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Simple rate limiting: max 5 submissions per phone number per hour
  IF (
    SELECT COUNT(*) 
    FROM subscribers 
    WHERE phone = NEW.phone 
    AND created_at > NOW() - INTERVAL '1 hour'
  ) >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply rate limiting trigger
CREATE TRIGGER subscription_rate_limit
  BEFORE INSERT ON subscribers
  FOR EACH ROW
  EXECUTE FUNCTION check_subscription_rate_limit(); 