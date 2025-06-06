import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmailToSubscriber } from '@/app/lib/welcomeEmailService'

export async function POST(req: NextRequest) {
  try {
    const { subscriberId } = await req.json()

    // Validation
    if (!subscriberId) {
      return NextResponse.json(
        { message: 'Subscriber ID is required' },
        { status: 400 }
      )
    }

    console.log(`Processing welcome email request for subscriber: ${subscriberId}`)

    // Send welcome email
    const result = await sendWelcomeEmailToSubscriber(subscriberId)

    if (result.success) {
      return NextResponse.json({
        message: 'Welcome email sent successfully',
        messageId: result.messageId,
        to: result.to
      })
    } else {
      console.error(`Welcome email failed for ${subscriberId}:`, result.error)
      return NextResponse.json(
        { 
          message: 'Failed to send welcome email',
          error: result.error
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Welcome email API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint for testing welcome emails
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const subscriberId = searchParams.get('subscriberId')

    if (!subscriberId) {
      return NextResponse.json(
        { message: 'subscriberId parameter is required' },
        { status: 400 }
      )
    }

    console.log(`Test welcome email request for subscriber: ${subscriberId}`)

    // Send welcome email
    const result = await sendWelcomeEmailToSubscriber(subscriberId)

    if (result.success) {
      return NextResponse.json({
        message: 'Test welcome email sent successfully',
        messageId: result.messageId,
        to: result.to
      })
    } else {
      return NextResponse.json(
        { 
          message: 'Failed to send test welcome email',
          error: result.error
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Test welcome email API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 