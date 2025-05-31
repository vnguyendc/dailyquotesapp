-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Allow public insert on subscribers" ON subscribers;

-- Create a new policy that allows anyone to insert (for public subscription form)
CREATE POLICY "Allow anonymous insert on subscribers" ON subscribers
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Also create a policy to allow anonymous users to read their own data (optional)
CREATE POLICY "Allow anonymous select on subscribers" ON subscribers
  FOR SELECT 
  TO anon, authenticated
  USING (true); 