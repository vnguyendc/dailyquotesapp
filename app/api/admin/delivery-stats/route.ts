import { NextRequest, NextResponse } from 'next/server'
import { getDeliveryStats } from '@/app/lib/smsQuoteService'
import { supabase } from '../../../../lib/supabaseClient'

interface DeliveryWithSubscriber {
  delivery_status: string
  subscribers: {
    persona: string
  }[] | null
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

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || 
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // Default: 30 days ago
    const endDate = searchParams.get('endDate') || new Date().toISOString() // Default: now

    console.log(`Getting delivery stats from ${startDate} to ${endDate}`)

    // Get overall delivery statistics
    const stats = await getDeliveryStats(startDate, endDate)

    // Get recent deliveries with details
    const { data: recentDeliveries, error: deliveriesError } = await supabase
      .from('quote_deliveries')
      .select(`
        id,
        quote_text,
        author,
        sent_at,
        delivery_status,
        error_message,
        phone_number,
        subscriber_id,
        subscribers (
          first_name,
          last_name,
          persona
        )
      `)
      .gte('sent_at', startDate)
      .lte('sent_at', endDate)
      .order('sent_at', { ascending: false })
      .limit(50)

    if (deliveriesError) {
      console.error('Error fetching recent deliveries:', deliveriesError)
    }

    // Get delivery stats by day
    const { data: dailyStats } = await supabase
      .rpc('get_daily_delivery_stats', {
        start_date: startDate,
        end_date: endDate
      })

    // Get delivery stats by persona
    const { data: personaStats } = await supabase
      .from('quote_deliveries')
      .select(`
        delivery_status,
        subscribers (
          persona
        )
      `)
      .gte('sent_at', startDate)
      .lte('sent_at', endDate)

    // Process persona statistics
    const personaStatsProcessed: Record<string, { total: number; successful: number; failed: number }> = {}
    
    if (personaStats) {
      personaStats.forEach((delivery: DeliveryWithSubscriber) => {
        const persona = delivery.subscribers?.[0]?.persona || 'Unknown'
        if (!personaStatsProcessed[persona]) {
          personaStatsProcessed[persona] = { total: 0, successful: 0, failed: 0 }
        }
        
        personaStatsProcessed[persona].total++
        if (delivery.delivery_status === 'sent') {
          personaStatsProcessed[persona].successful++
        } else if (delivery.delivery_status === 'failed') {
          personaStatsProcessed[persona].failed++
        }
      })
    }

    // Get error analysis
    const { data: errorAnalysis } = await supabase
      .from('quote_deliveries')
      .select('error_message, delivery_status')
      .eq('delivery_status', 'failed')
      .gte('sent_at', startDate)
      .lte('sent_at', endDate)

    const errorCounts: Record<string, number> = {}
    if (errorAnalysis) {
      errorAnalysis.forEach(delivery => {
        const error = delivery.error_message || 'Unknown error'
        errorCounts[error] = (errorCounts[error] || 0) + 1
      })
    }

    return NextResponse.json({
      success: true,
      dateRange: {
        startDate,
        endDate
      },
      overallStats: stats,
      recentDeliveries: recentDeliveries || [],
      personaStats: personaStatsProcessed,
      errorAnalysis: errorCounts,
      dailyStats: dailyStats || null,
      metadata: {
        queriedAt: new Date().toISOString(),
        totalRecentDeliveries: recentDeliveries?.length || 0
      }
    })

  } catch (error) {
    console.error('Error in delivery stats API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
} 