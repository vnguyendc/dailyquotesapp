import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/lib/clients/supabaseClient'
import { getQuoteStats } from '../../../lib/quoteHistoryService'

export async function GET(req: NextRequest) {
  try {
    // Simple authentication check
    const authHeader = req.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const subscriberId = searchParams.get('subscriber_id')
    const limit = parseInt(searchParams.get('limit') || '100')

    if (subscriberId) {
      // Get history for specific subscriber
      const { data: history, error: historyError } = await supabase
        .from('sent_quotes')
        .select('*')
        .eq('subscriber_id', subscriberId)
        .order('sent_at', { ascending: false })
        .limit(limit)

      if (historyError) {
        return NextResponse.json({ message: 'Failed to fetch quote history' }, { status: 500 })
      }

      // Get stats for this subscriber
      const stats = await getQuoteStats(subscriberId)

      return NextResponse.json({
        subscriber_id: subscriberId,
        history,
        stats,
        count: history.length
      }, { status: 200 })

    } else {
      // Get overall statistics
      const { data: overallStats, error: statsError } = await supabase
        .from('sent_quotes')
        .select('subscriber_id, quote_category, sent_at')
        .order('sent_at', { ascending: false })
        .limit(1000)

      if (statsError) {
        return NextResponse.json({ message: 'Failed to fetch statistics' }, { status: 500 })
      }

      // Calculate aggregate stats
      const totalQuotes = overallStats.length
      const uniqueSubscribers = new Set(overallStats.map(q => q.subscriber_id)).size
      const categoryCounts = overallStats.reduce((acc, quote) => {
        acc[quote.quote_category] = (acc[quote.quote_category] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const recentQuotes = overallStats.slice(0, limit)

      return NextResponse.json({
        overview: {
          totalQuotes,
          uniqueSubscribers,
          categoryCounts,
          averageQuotesPerSubscriber: uniqueSubscribers > 0 ? (totalQuotes / uniqueSubscribers).toFixed(2) : 0
        },
        recentQuotes,
        count: recentQuotes.length
      }, { status: 200 })
    }

  } catch (error) {
    console.error('Quote history admin error:', error)
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 })
  }
} 