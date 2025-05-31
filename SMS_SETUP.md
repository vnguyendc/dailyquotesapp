# SMS Quote Delivery System 📱

## Overview
The Daily Quotes App now includes a comprehensive SMS delivery system powered by Twilio that sends personalized quotes to subscribers via text messages.

## Features
- **Personalized SMS Messages**: Custom greetings and personalized messages based on subscriber persona
- **Quote Uniqueness**: Integration with the existing quote uniqueness system to prevent duplicate quotes
- **Delivery Tracking**: Complete tracking of SMS delivery success/failure rates
- **Batch Processing**: Send quotes to multiple subscribers with rate limiting
- **Admin Analytics**: Detailed delivery statistics and performance monitoring
- **Cron Job Support**: Automated daily quote delivery via scheduled endpoints

## Setup Instructions

### 1. Database Migration
Run the quote deliveries migration in your Supabase SQL Editor:
```bash
npm run db:migrate:004
```
Or manually execute: `database/migrations/004_create_quote_deliveries.sql`

### 2. Environment Variables
Add these Twilio credentials to your `.env.local` and Vercel environment:

```env
# Twilio Configuration
TWILIO_SID=AC123... # Your Twilio Account SID
TWILIO_AUTH=your_auth_token # Your Twilio Auth Token  
TWILIO_PHONE=+1234567890 # Your Twilio phone number (with +1 country code)

# Optional: Cron job authentication
CRON_SECRET=your_secure_random_string
```

### 3. Get Twilio Credentials
1. Sign up at [Twilio Console](https://console.twilio.com/)
2. Get your Account SID and Auth Token from the dashboard
3. Purchase a phone number for SMS sending
4. Add credentials to your environment variables

## API Endpoints

### SMS Delivery
- **Send Quote to Single Subscriber**
  ```bash
  POST /api/sms/send-quote
  Body: { "subscriberId": "uuid" }
  ```

- **Send Quotes to All Subscribers** (Admin only)
  ```bash
  POST /api/sms/send-bulk
  Headers: { "x-admin-secret": "your_admin_secret" }
  Body: { "subscriberIds": ["uuid1", "uuid2"] } # Optional: specific IDs
  ```

### Testing
- **Test SMS Functionality**
  ```bash
  GET /api/sms/test?subscriberId=uuid&message=Hello%20World
  POST /api/sms/test
  Body: { "subscriberId": "uuid", "message": "Test message" }
  ```

### Analytics
- **Delivery Statistics** (Admin only)
  ```bash
  GET /api/admin/delivery-stats?startDate=2023-01-01&endDate=2023-12-31
  Headers: { "x-admin-secret": "your_admin_secret" }
  ```

### Automated Scheduling
- **Daily Quotes Cron Job**
  ```bash
  GET /api/cron/daily-quotes
  Headers: { "authorization": "Bearer your_cron_secret" } # Optional
  ```

## SMS Message Format

Messages are automatically formatted with:
- Personalized greeting with subscriber's name
- Beautifully formatted quote with author attribution
- Persona-specific motivational message
- App branding footer

Example SMS:
```
Good morning, John! ☀️

"The only way to do great work is to love what you do."

— Steve Jobs

Build something amazing today! 🚀

Daily Quotes 📖
```

## Persona-Specific Messages

The system includes personalized messages for different personas:
- **Athletes**: "Train your mind like you train your body! 💪"
- **Entrepreneurs**: "Build something amazing today! 🚀"  
- **Students**: "Knowledge is your superpower! 📚"
- **Professionals**: "Make today count in your career! 💼"
- **Parents**: "You're shaping the future! 👨‍👩‍👧‍👦"
- **Creatives**: "Let your creativity flow today! 🎨"
- **Leaders**: "Great leaders inspire daily! 👑"
- **Teachers**: "You're planting seeds of wisdom! 🌱"
- **Healthcare Workers**: "You're a daily hero! 🏥"

## Delivery Tracking

Every SMS is tracked in the `quote_deliveries` table with:
- Delivery status (sent/failed/pending)
- Twilio message ID
- Error messages for failed deliveries
- Timestamp information
- Quote content and subscriber details

## Rate Limiting & Best Practices

- **Rate Limiting**: 200ms delay between messages to avoid Twilio rate limits
- **Error Handling**: Comprehensive error tracking and fallback mechanisms
- **Validation**: Phone number format validation before sending
- **Monitoring**: Built-in logging and delivery statistics

## Scheduling Options

### Option 1: Vercel Cron Jobs
Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-quotes",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Option 2: External Cron Services
Use services like:
- **Cron-job.org**: Free scheduled HTTP requests
- **EasyCron**: Advanced scheduling options  
- **GitHub Actions**: Workflow-based scheduling

Example cURL for external schedulers:
```bash
curl -X GET "https://your-app.vercel.app/api/cron/daily-quotes" \
  -H "Authorization: Bearer your_cron_secret"
```

## Cost Estimation

Twilio SMS pricing (US):
- **Outbound SMS**: ~$0.0075 per message
- **Phone Number**: ~$1.15/month

For 1000 daily subscribers:
- Daily cost: ~$7.50
- Monthly cost: ~$225 + $1.15 = ~$226.15

## Monitoring & Analytics

Track delivery performance with:
- Success/failure rates by persona
- Daily delivery statistics  
- Error analysis and troubleshooting
- Subscriber engagement metrics

Access via: `/api/admin/delivery-stats`

## Testing

1. **Test Twilio Connection**:
   ```bash
   curl "http://localhost:3000/api/sms/test"
   ```

2. **Send Test Message**:
   ```bash
   curl -X POST "http://localhost:3000/api/sms/test" \
     -H "Content-Type: application/json" \
     -d '{"subscriberId": "your-test-subscriber-id", "message": "Hello World!"}'
   ```

3. **Test Quote Delivery**:
   ```bash
   curl -X POST "http://localhost:3000/api/sms/send-quote" \
     -H "Content-Type: application/json" \
     -d '{"subscriberId": "your-test-subscriber-id"}'
   ```

## Security Notes

- All admin endpoints require `ADMIN_SECRET` authentication
- Cron endpoints support optional authentication via `CRON_SECRET`
- Phone numbers are validated before SMS sending
- Rate limiting prevents API abuse
- Comprehensive error logging for debugging

## Next Steps

1. Run the database migration
2. Set up Twilio account and get credentials
3. Add environment variables to Vercel
4. Test SMS functionality with a few subscribers
5. Set up automated scheduling
6. Monitor delivery analytics

The SMS system is now ready for production use! 🚀 