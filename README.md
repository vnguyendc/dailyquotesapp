# Daily Quotes App 📱✨

A beautiful, AI-powered subscription service that delivers personalized daily quotes via SMS. Built with Next.js, Supabase, Claude AI, and Twilio.

## 🌟 Features

### ✨ **Beautiful Subscription Experience**
- **Gradient Hero Section**: Stunning sunrise-to-navy gradient design
- **Two-Step Form**: Seamless user onboarding with validation
- **Persona Selection**: 10+ user personas (Athlete, Entrepreneur, Student, etc.)
- **Category Preferences**: Multiple quote categories including Religious & Spiritual
- **Delivery Time Preferences**: Customizable daily delivery scheduling

### 🤖 **AI-Powered Quote Generation**
- **Claude Sonnet 4 Integration**: State-of-the-art AI for quote generation
- **Persona-Aware**: Customized quotes based on user's persona
- **Quote Uniqueness System**: Prevents duplicate and similar quotes
- **Semantic Analysis**: Advanced similarity detection with 30%+ threshold
- **Fallback System**: Guaranteed quote delivery with retry logic

### 📱 **Professional SMS Delivery**
- **Twilio Integration**: Enterprise-grade SMS delivery
- **Personalized Messages**: Custom greetings with subscriber names
- **Persona-Specific Motivations**: Unique encouragement for each user type
- **Delivery Tracking**: Complete success/failure monitoring
- **Rate Limiting**: Built-in protection against API limits

### 📊 **Analytics & Admin Tools**
- **Delivery Statistics**: Success rates, failure analysis, persona breakdown
- **Quote History**: Complete tracking of sent quotes and uniqueness
- **Admin Endpoints**: Secure management with API key authentication
- **Bulk Operations**: Send to multiple subscribers with batch processing

### 🚀 **Production Ready**
- **Automated Scheduling**: Cron job support for daily delivery
- **Database Migrations**: Structured schema with RLS policies  
- **Environment Management**: Separate dev/prod configurations
- **Error Handling**: Comprehensive logging and fallback mechanisms
- **Security**: Row-level security and admin authentication

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase PostgreSQL
- **AI**: Claude Sonnet 4 (Anthropic)
- **SMS**: Twilio
- **Database**: Supabase with Row Level Security
- **Deployment**: Vercel
- **Authentication**: API key-based admin access

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/vnguyendc/dailyquotesapp.git
cd dailyquotesapp
npm install
```

### 2. Environment Setup

Create `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Claude AI Configuration  
ANTHROPIC_API_KEY=your_anthropic_api_key

# Twilio Configuration (for SMS)
TWILIO_SID=AC123...  # Account SID (starts with AC)
TWILIO_AUTH=your_auth_token
TWILIO_PHONE=+15551234567

# Admin & Security
ADMIN_SECRET=your_secure_admin_secret
CRON_SECRET=your_cron_secret  # Optional: for scheduled delivery
```

### 3. Database Setup

Run migrations in your Supabase SQL Editor:

```bash
# Run each migration file in order:
npm run db:migrate:001  # subscribers table
npm run db:migrate:002  # sent_quotes table  
npm run db:migrate:004  # quote_deliveries table
```

Or manually execute files in `database/migrations/`

### 4. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app! 🎉

## 📚 API Reference

### Quote Generation
```bash
# Generate personalized quote
POST /api/quotes/for-subscriber
Body: { "subscriberId": "uuid" }

# Test quote generation
GET /api/quotes/test
```

### SMS Delivery
```bash
# Send quote to single subscriber
POST /api/sms/send-quote  
Body: { "subscriberId": "uuid" }

# Send to all subscribers (admin)
POST /api/sms/send-bulk
Headers: { "x-admin-secret": "your_secret" }

# Test SMS functionality
GET /api/sms/test?subscriberId=uuid
```

### Analytics & Admin
```bash
# Delivery statistics
GET /api/admin/delivery-stats?startDate=2024-01-01&endDate=2024-12-31
Headers: { "x-admin-secret": "your_secret" }

# Quote history analysis
GET /api/admin/quote-history?subscriberId=uuid
Headers: { "x-admin-secret": "your_secret" }

# Subscriber management
GET /api/admin/subscribers
Headers: { "x-admin-secret": "your_secret" }
```

### Automation
```bash
# Daily quotes cron job
GET /api/cron/daily-quotes
Headers: { "authorization": "Bearer your_cron_secret" }
```

## 🎨 Example SMS Message

```
Good morning, John! ☀️

"The only way to do great work is to love what you do."

— Steve Jobs

Build something amazing today! 🚀

Daily Quotes 📖
```

## 🏗️ Architecture

### Database Schema
- **`subscribers`**: User profiles with persona and preferences
- **`sent_quotes`**: Quote history for uniqueness tracking  
- **`quote_deliveries`**: SMS delivery tracking and analytics

### Quote Uniqueness System
1. **History Check**: Retrieves last 30 days of quotes
2. **Duplicate Detection**: Exact text matching
3. **Similarity Analysis**: Semantic comparison with 30%+ threshold
4. **Retry Logic**: Up to 3 attempts with expanding avoid lists
5. **Fallback**: Guaranteed delivery with timestamped quotes

### SMS Delivery Flow
1. **Subscriber Lookup**: Fetch user preferences
2. **Quote Generation**: Call `/api/quotes/for-subscriber`
3. **Message Formatting**: Personalized greeting + quote + motivation
4. **SMS Sending**: Twilio API with error handling
5. **Delivery Tracking**: Database logging with status

## 📱 Scheduling Options

### Vercel Cron Jobs (Recommended)

Create `vercel.json`:
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

### External Schedulers

Use services like Cron-job.org, EasyCron, or GitHub Actions:

```bash
curl -X GET "https://your-app.vercel.app/api/cron/daily-quotes" \
  -H "Authorization: Bearer your_cron_secret"
```

## 💰 Cost Estimation

### Claude AI (Anthropic)
- **Input**: ~$3 per 1M tokens
- **Output**: ~$15 per 1M tokens  
- **Daily cost**: ~$0.01-0.05 per quote

### Twilio SMS
- **Outbound SMS**: ~$0.0075 per message
- **Phone Number**: ~$1.15/month

**Cost Examples:**
- **100 subscribers/day**: $0.75/day → ~$23.65/month
- **1000 subscribers/day**: $7.50/day → ~$226.15/month
- **5000 subscribers/day**: $37.50/day → ~$1,126.15/month

*Calculation: (subscribers × $0.0075 × 30 days) + $1.15 phone rental*

### Supabase
- **Free tier**: Up to 50,000 monthly active users
- **Pro tier**: $25/month for higher limits

## 🔧 Development

### Build and Lint
```bash
npm run build    # Production build
npm run lint     # ESLint check
```

### Testing Endpoints
```bash
# Test quote generation
curl -X POST "http://localhost:3000/api/quotes/test"

# Test SMS (requires verified phone number)  
curl -X POST "http://localhost:3000/api/sms/test" \
  -H "Content-Type: application/json" \
  -d '{"subscriberId": "uuid", "message": "Hello!"}'
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Import from GitHub
2. **Environment Variables**: Add all `.env.local` variables
3. **Deploy**: Automatic deployment on push

### Environment Variables for Production
- All development variables
- Update `TWILIO_SID`, `TWILIO_AUTH`, `TWILIO_PHONE` with production values
- Complete Twilio A2P 10DLC registration for US SMS

## 📋 SMS Setup Requirements

### For Testing (Trial Account)
- ✅ Twilio trial account
- ✅ Verified phone numbers only
- ✅ Limited trial credits

### For Production (US SMS)
- ✅ Paid Twilio account
- ✅ A2P 10DLC registration
- ✅ Brand verification  
- ✅ Campaign approval
- ⏱️ 1-2 weeks approval time

See `SMS_SETUP.md` for detailed SMS configuration.

## 🔒 Security

- **Row Level Security**: Supabase RLS policies
- **API Key Authentication**: Admin endpoints protected
- **Phone Validation**: SMS number format validation
- **Rate Limiting**: Built-in API protection
- **Error Handling**: No sensitive data exposure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- **Anthropic**: Claude AI for intelligent quote generation
- **Twilio**: Reliable SMS delivery infrastructure  
- **Supabase**: Backend-as-a-Service with excellent developer experience
- **Vercel**: Seamless deployment and hosting
- **Next.js**: Full-stack React framework

---

**Built with ❤️ by [Vinh Nguyen](https://github.com/vnguyendc)**

*Transform someone's day, one quote at a time.* ✨
