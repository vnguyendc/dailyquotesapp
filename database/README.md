# Database Migrations

This directory contains SQL migration files for the Daily Quotes App database schema.

## Migration Order

Run these migrations in order in your Supabase SQL Editor:

1. **001_create_subscribers.sql** - Creates the base subscribers table
2. **002_create_sent_quotes.sql** - Creates quote history tracking
3. **004_create_quote_deliveries.sql** - Creates delivery tracking for SMS/email
4. **005_add_auth_integration.sql** - Adds Supabase auth integration
5. **006_add_form_details.sql** - Adds new form fields for restructured onboarding

## Migration 006: New Form Fields

The latest migration adds support for the new 5-step onboarding form:

### New Columns Added:
- `self_description` (TEXT) - User's self-description from Step 1
- `personal_goals` (TEXT[]) - Array of selected goals from Step 2
- `custom_goal` (TEXT) - Custom goal if "Other" was selected in Step 2
- `tone_preference` (TEXT) - Preferred tone from Step 4 (inspirational, gentle, bold, wise, playful)
- `delivery_method` (TEXT[]) - Array of delivery methods from Step 5 (email, sms)

### Constraints Added:
- `check_delivery_method_valid` - Ensures only 'email' and 'sms' are allowed
- `check_tone_preference_valid` - Ensures only valid tone values are stored

### Indexes Added:
- `idx_subscribers_tone_preference` - For filtering by tone preference
- `idx_subscribers_delivery_method` - GIN index for array queries on delivery methods
- `idx_subscribers_personal_goals` - GIN index for array queries on personal goals

## Running Migrations

### Option 1: Using npm scripts
```bash
npm run db:migrate:006  # Shows instruction for latest migration
npm run db:migrate      # Shows instruction for all migrations
```

### Option 2: Direct SQL execution
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the migration file contents
4. Execute the SQL

## Form Data Mapping

The new form structure maps to database fields as follows:

| Form Step | Form Field | Database Column | Type |
|-----------|------------|-----------------|------|
| Step 1 | Self Description | `self_description` | TEXT |
| Step 2 | Personal Goals | `personal_goals` | TEXT[] |
| Step 2 | Custom Goal | `custom_goal` | TEXT |
| Step 3 | Emotional Themes | `categories` | TEXT[] |
| Step 4 | Tone Preference | `tone_preference` | TEXT |
| Step 5 | First Name | `first_name` | TEXT |
| Step 5 | Last Name | `last_name` | TEXT |
| Step 5 | Email | `email` | TEXT |
| Step 5 | Phone | `phone` | TEXT |
| Step 5 | Delivery Method | `delivery_method` | TEXT[] |
| Step 5 | Delivery Time | `delivery_time` | TEXT |
| Step 5 | Password | (auth table) | - |

## API Changes

The `/api/subscribe` endpoint now:
- Requires both email and phone number
- Accepts all new form fields
- Validates tone preference and delivery method values
- Stores complete user profile in single request

## Backward Compatibility

The migration is designed to be backward compatible:
- All new columns are nullable
- Existing data remains intact
- Old API calls will still work (new fields will be null) 