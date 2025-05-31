-- Create the subscribers table
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT NOT NULL UNIQUE,
  categories TEXT[] NOT NULL,
  delivery_time TEXT NOT NULL,
  persona TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups (since email can be null, use partial index)
CREATE INDEX idx_subscribers_email ON subscribers(email) WHERE email IS NOT NULL;

-- Create an index on phone for faster lookups
CREATE INDEX idx_subscribers_phone ON subscribers(phone);

-- Create an index on is_active for filtering active subscribers
CREATE INDEX idx_subscribers_active ON subscribers(is_active);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at when a row is modified
CREATE TRIGGER update_subscribers_updated_at 
  BEFORE UPDATE ON subscribers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows INSERT for everyone (for new subscriptions)
CREATE POLICY "Allow public insert on subscribers" ON subscribers
  FOR INSERT WITH CHECK (true);

-- Create a policy that allows SELECT for service role (for admin queries)
CREATE POLICY "Allow service role select on subscribers" ON subscribers
  FOR SELECT USING (auth.role() = 'service_role');

-- Create a policy that allows UPDATE for service role (for admin updates)
CREATE POLICY "Allow service role update on subscribers" ON subscribers
  FOR UPDATE USING (auth.role() = 'service_role'); 