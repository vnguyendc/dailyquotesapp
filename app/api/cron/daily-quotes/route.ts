import { NextRequest, NextResponse } from 'next/server'
import { sendDailyQuotesToAllSubscribers } from '@/app/lib/smsQuoteService'

export async function GET(request: NextRequest) {
  try {
    // Optional: Add authentication for production
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting scheduled daily quotes delivery...')

    const result = await sendDailyQuotesToAllSubscribers()

    console.log('Scheduled daily quotes delivery completed:', {
      total: result.totalSubscribers,
      success: result.successCount,
      failed: result.failureCount,
      successRate: result.totalSubscribers > 0 ? 
        Math.round((result.successCount / result.totalSubscribers) * 100) : 0
    })

    return NextResponse.json({
      success: true,
      message: 'Daily quotes sent successfully',
      stats: {
        totalSubscribers: result.totalSubscribers,
        successCount: result.successCount,
        failureCount: result.failureCount,
        successRate: result.totalSubscribers > 0 ? 
          Math.round((result.successCount / result.totalSubscribers) * 100) : 0
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Cron job failed:', error)
    return NextResponse.json(
      { 
        error: 'Cron job failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Same logic as GET for flexibility
  return GET(request)
} 