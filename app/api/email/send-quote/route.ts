import { NextRequest, NextResponse } from 'next/server'
import { sendDailyQuoteToSubscriberViaEmail } from '@/app/lib/emailQuoteService'

export async function POST(request: NextRequest) {
  try {
    const { subscriberId } = await request.json()

    if (!subscriberId) {
      return NextResponse.json(
        { error: 'subscriberId is required' },
        { status: 400 }
      )
    }

    console.log(`Sending quote via email to subscriber: ${subscriberId}`)

    const result = await sendDailyQuoteToSubscriberViaEmail(subscriberId)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Quote sent via email successfully',
        delivery: result.delivery
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          subscriberId: result.subscriberId
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error in email send-quote API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subscriberId = searchParams.get('subscriberId')

    if (!subscriberId) {
      return NextResponse.json(
        { error: 'subscriberId query parameter is required' },
        { status: 400 }
      )
    }

    console.log(`Sending quote via email to subscriber: ${subscriberId}`)

    const result = await sendDailyQuoteToSubscriberViaEmail(subscriberId)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Quote sent via email successfully',
        delivery: result.delivery
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          subscriberId: result.subscriberId
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error in email send-quote API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 