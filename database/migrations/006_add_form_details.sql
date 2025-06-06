-- Migration 006: Add new form details to subscribers table
-- Run this on both DEV and PROD Supabase instances

-- Add new columns for the restructured form
ALTER TABLE subscribers 
ADD COLUMN IF NOT EXISTS self_description TEXT,
ADD COLUMN IF NOT EXISTS personal_goals TEXT[],
ADD COLUMN IF NOT EXISTS custom_goal TEXT,
ADD COLUMN IF NOT EXISTS tone_preference TEXT,
ADD COLUMN IF NOT EXISTS delivery_method TEXT[];

-- Add constraints for delivery_method (drop first if exists to avoid conflicts)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'check_delivery_method_valid' 
        AND table_name = 'subscribers'
    ) THEN
        ALTER TABLE subscribers 
        ADD CONSTRAINT check_delivery_method_valid 
        CHECK (
            delivery_method IS NULL OR 
            (delivery_method <@ ARRAY['email', 'sms'])
        );
    END IF;
END $$;

-- Add constraint for tone_preference (drop first if exists to avoid conflicts)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'check_tone_preference_valid' 
        AND table_name = 'subscribers'
    ) THEN
        ALTER TABLE subscribers
        ADD CONSTRAINT check_tone_preference_valid
        CHECK (
            tone_preference IS NULL OR 
            tone_preference IN ('inspirational', 'gentle', 'bold', 'wise', 'playful')
        );
    END IF;
END $$;

-- Create indexes for better query performance on the new fields
CREATE INDEX IF NOT EXISTS idx_subscribers_tone_preference ON subscribers(tone_preference);
CREATE INDEX IF NOT EXISTS idx_subscribers_delivery_method ON subscribers USING GIN(delivery_method);
CREATE INDEX IF NOT EXISTS idx_subscribers_personal_goals ON subscribers USING GIN(personal_goals);

-- Add comments for documentation
COMMENT ON COLUMN subscribers.self_description IS 'User-provided description of themselves from step 1';
COMMENT ON COLUMN subscribers.personal_goals IS 'Array of selected personal goals from step 2';
COMMENT ON COLUMN subscribers.custom_goal IS 'Custom goal text if "Other" was selected in step 2';
COMMENT ON COLUMN subscribers.tone_preference IS 'Preferred tone for daily quotes from step 4';
COMMENT ON COLUMN subscribers.delivery_method IS 'Array of preferred delivery methods (email, sms) from step 5'; 