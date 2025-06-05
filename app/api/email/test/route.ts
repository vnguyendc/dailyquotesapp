import { NextRequest, NextResponse } from 'next/server'
import { sendDailyQuoteEmail } from '@/app/lib/clients/emailClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email query parameter is required' },
        { status: 400 }
      )
    }

    console.log(`Sending test quote email to: ${email}`)

    const result = await sendDailyQuoteEmail({
      to: email,
      subscriberName: 'Test User',
      quote: 'The future belongs to those who believe in the beauty of their dreams.',
      author: 'Eleanor Roosevelt',
      personalization: 'This is a test email to verify your daily quote delivery system! 📧✨'
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error in email test API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, subscriberName, quote, author, personalization } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    console.log(`Sending test quote email to: ${email}`)

    const result = await sendDailyQuoteEmail({
      to: email,
      subscriberName: subscriberName || 'Friend',
      quote: quote || 'The only way to do great work is to love what you do.',
      author: author || 'Steve Jobs',
      personalization: personalization || 'This is a test email to verify your daily quote delivery is working perfectly! 🚀'
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error in email test API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 