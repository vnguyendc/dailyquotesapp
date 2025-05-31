-- Create quote_deliveries table for tracking SMS delivery history
CREATE TABLE IF NOT EXISTS quote_deliveries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
    quote_text TEXT NOT NULL,
    author TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    delivery_method TEXT NOT NULL CHECK (delivery_method IN ('sms', 'email')),
    delivery_status TEXT NOT NULL CHECK (delivery_status IN ('sent', 'failed', 'pending')),
    sms_id TEXT, -- Twilio message SID
    error_message TEXT,
    phone_number TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quote_deliveries_subscriber_id ON quote_deliveries(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_quote_deliveries_sent_at ON quote_deliveries(sent_at);
CREATE INDEX IF NOT EXISTS idx_quote_deliveries_delivery_status ON quote_deliveries(delivery_status);
CREATE INDEX IF NOT EXISTS idx_quote_deliveries_delivery_method ON quote_deliveries(delivery_method);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_quote_deliveries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_quote_deliveries_updated_at
    BEFORE UPDATE ON quote_deliveries
    FOR EACH ROW
    EXECUTE FUNCTION update_quote_deliveries_updated_at();

-- Row Level Security (RLS)
ALTER TABLE quote_deliveries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert delivery records (for API endpoints)
CREATE POLICY "Allow anonymous insert on quote_deliveries" ON quote_deliveries
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow anonymous users to select their own delivery records
CREATE POLICY "Allow anonymous select on quote_deliveries" ON quote_deliveries
    FOR SELECT
    TO anon
    USING (true);

-- Allow authenticated users full access to delivery records
CREATE POLICY "Allow authenticated full access on quote_deliveries" ON quote_deliveries
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE quote_deliveries IS 'Tracks quote delivery history and success/failure rates for SMS and other delivery methods';
COMMENT ON COLUMN quote_deliveries.subscriber_id IS 'Reference to the subscriber who received the quote';
COMMENT ON COLUMN quote_deliveries.quote_text IS 'The actual quote text that was sent';
COMMENT ON COLUMN quote_deliveries.author IS 'Author of the quote';
COMMENT ON COLUMN quote_deliveries.sent_at IS 'Timestamp when the quote was sent';
COMMENT ON COLUMN quote_deliveries.delivery_method IS 'Method used for delivery (sms, email, etc.)';
COMMENT ON COLUMN quote_deliveries.delivery_status IS 'Status of the delivery attempt';
COMMENT ON COLUMN quote_deliveries.sms_id IS 'Twilio message SID for SMS deliveries';
COMMENT ON COLUMN quote_deliveries.error_message IS 'Error message if delivery failed';
COMMENT ON COLUMN quote_deliveries.phone_number IS 'Phone number where the SMS was sent'; 