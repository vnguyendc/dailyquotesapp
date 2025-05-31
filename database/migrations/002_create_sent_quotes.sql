-- Migration 002: Create sent_quotes table for tracking quote history
-- Run this on both DEV and PROD Supabase instances

-- Create the sent_quotes table
CREATE TABLE IF NOT EXISTS sent_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  quote_text TEXT NOT NULL,
  quote_author TEXT NOT NULL,
  quote_category TEXT NOT NULL,
  quote_explanation TEXT,
  tone TEXT DEFAULT 'inspirational',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sent_quotes_subscriber_id ON sent_quotes(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_sent_quotes_sent_at ON sent_quotes(sent_at);
CREATE INDEX IF NOT EXISTS idx_sent_quotes_quote_text ON sent_quotes(quote_text);

-- Create a composite index for checking duplicates
CREATE INDEX IF NOT EXISTS idx_sent_quotes_subscriber_quote ON sent_quotes(subscriber_id, quote_text);

-- Enable RLS
ALTER TABLE sent_quotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Allow service role full access on sent_quotes" ON sent_quotes;

-- Allow service role full access (for API operations)
CREATE POLICY "Allow service role full access on sent_quotes" ON sent_quotes
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to read their own quote history (optional for future features)
CREATE POLICY "Allow users to read own quote history" ON sent_quotes
  FOR SELECT 
  TO authenticated
  USING (subscriber_id IN (
    SELECT id FROM subscribers WHERE email = auth.jwt()->>'email'
  )); 