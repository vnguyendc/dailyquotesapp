-- Migration 003: Fix sent_quotes RLS policies
-- Allow anon users to insert quotes (for API operations)

-- Drop existing policies
DROP POLICY IF EXISTS "Allow service role full access on sent_quotes" ON sent_quotes;
DROP POLICY IF EXISTS "Allow users to read own quote history" ON sent_quotes;

-- Allow anon and authenticated users to insert quotes (for API operations)
CREATE POLICY "Allow anon insert on sent_quotes" ON sent_quotes
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Allow service role full access (for admin operations)
CREATE POLICY "Allow service role full access on sent_quotes" ON sent_quotes
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon to select quotes for duplicate checking
CREATE POLICY "Allow anon select on sent_quotes" ON sent_quotes
  FOR SELECT 
  TO anon, authenticated
  USING (true); 