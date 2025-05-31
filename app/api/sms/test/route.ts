import { NextRequest, NextResponse } from 'next/server'
import { testTwilioConnection } from '@/app/lib/twilioClient'
import { testSMSDelivery } from '@/app/lib/smsQuoteService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subscriberId = searchParams.get('subscriberId')
    const testMessage = searchParams.get('message')

    // Test Twilio connection first
    const connectionTest = await testTwilioConnection()

    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Twilio connection failed',
        details: connectionTest.error
      }, { status: 500 })
    }

    console.log('Twilio connection successful:', connectionTest.accountInfo)

    if (subscriberId) {
      // Test SMS delivery to specific subscriber
      console.log(`Testing SMS delivery to subscriber: ${subscriberId}`)
      
      const deliveryTest = await testSMSDelivery(subscriberId, testMessage || undefined)
      
      return NextResponse.json({
        success: true,
        twilioConnection: connectionTest,
        smsDelivery: deliveryTest,
        message: deliveryTest.success ? 
          'SMS test completed successfully' : 
          'SMS test failed'
      })
    } else {
      // Just test connection
      return NextResponse.json({
        success: true,
        twilioConnection: connectionTest,
        message: 'Twilio connection test successful'
      })
    }

  } catch (error) {
    console.error('Error in SMS test API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { subscriberId, message } = await request.json()

    if (!subscriberId) {
      return NextResponse.json(
        { error: 'subscriberId is required' },
        { status: 400 }
      )
    }

    // Test Twilio connection first
    const connectionTest = await testTwilioConnection()

    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Twilio connection failed',
        details: connectionTest.error
      }, { status: 500 })
    }

    console.log(`Testing SMS delivery to subscriber: ${subscriberId}`)
    
    const deliveryTest = await testSMSDelivery(subscriberId, message)
    
    return NextResponse.json({
      success: true,
      twilioConnection: connectionTest,
      smsDelivery: deliveryTest,
      message: deliveryTest.success ? 
        'SMS test completed successfully' : 
        'SMS test failed'
    })

  } catch (error) {
    console.error('Error in SMS test API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
} 