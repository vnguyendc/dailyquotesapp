import { NextRequest, NextResponse } from 'next/server'
import { sendDailyQuotesToAllSubscribers, sendDailyQuotesToSubscribers } from '@/app/lib/smsQuoteService'

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const adminSecret = request.headers.get('x-admin-secret')
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { subscriberIds } = body

    console.log('Starting bulk SMS quote delivery...')

    let result
    if (subscriberIds && Array.isArray(subscriberIds)) {
      // Send to specific subscribers
      console.log(`Sending quotes to ${subscriberIds.length} specific subscribers`)
      const results = await sendDailyQuotesToSubscribers(subscriberIds)
      const successCount = results.filter(r => r.success).length
      const failureCount = results.filter(r => !r.success).length
      
      result = {
        totalSubscribers: subscriberIds.length,
        successCount,
        failureCount,
        results
      }
    } else {
      // Send to all active subscribers
      console.log('Sending quotes to all active subscribers')
      result = await sendDailyQuotesToAllSubscribers()
    }

    console.log(`Bulk SMS delivery completed:`, {
      total: result.totalSubscribers,
      success: result.successCount,
      failed: result.failureCount
    })

    return NextResponse.json({
      success: true,
      message: `Successfully sent quotes to ${result.successCount} out of ${result.totalSubscribers} subscribers`,
      stats: {
        totalSubscribers: result.totalSubscribers,
        successCount: result.successCount,
        failureCount: result.failureCount,
        successRate: result.totalSubscribers > 0 ? 
          Math.round((result.successCount / result.totalSubscribers) * 100) : 0
      },
      results: result.results
    })

  } catch (error) {
    console.error('Error in bulk SMS API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const adminSecret = request.headers.get('x-admin-secret')
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    console.log('Starting bulk SMS quote delivery to all subscribers...')

    const result = await sendDailyQuotesToAllSubscribers()

    console.log(`Bulk SMS delivery completed:`, {
      total: result.totalSubscribers,
      success: result.successCount,
      failed: result.failureCount
    })

    return NextResponse.json({
      success: true,
      message: `Successfully sent quotes to ${result.successCount} out of ${result.totalSubscribers} subscribers`,
      stats: {
        totalSubscribers: result.totalSubscribers,
        successCount: result.successCount,
        failureCount: result.failureCount,
        successRate: result.totalSubscribers > 0 ? 
          Math.round((result.successCount / result.totalSubscribers) * 100) : 0
      },
      results: result.results
    })

  } catch (error) {
    console.error('Error in bulk SMS API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
} 