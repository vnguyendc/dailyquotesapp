import { NextRequest, NextResponse } from 'next/server'
import { testResendConnection } from '@/app/lib/clients/emailClient'
import { testEmailDelivery } from '@/app/lib/emailQuoteService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subscriberId = searchParams.get('subscriberId')
    const testMessage = searchParams.get('message')

    // Test Resend connection first
    const connectionTest = await testResendConnection()

    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Resend connection failed',
        details: connectionTest.error
      }, { status: 500 })
    }

    console.log('Resend connection successful:', connectionTest.apiKeyStatus)

    if (subscriberId) {
      // Test email delivery to specific subscriber
      console.log(`Testing email delivery to subscriber: ${subscriberId}`)
      
      const deliveryTest = await testEmailDelivery(subscriberId, testMessage || undefined)
      
      return NextResponse.json({
        success: true,
        resendConnection: connectionTest,
        emailDelivery: deliveryTest,
        message: deliveryTest.success ? 
          'Email test completed successfully' : 
          'Email test failed'
      })
    } else {
      // Just test connection
      return NextResponse.json({
        success: true,
        resendConnection: connectionTest,
        message: 'Resend connection test successful'
      })
    }

  } catch (error) {
    console.error('Error in email test API:', error)
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

    // Test Resend connection first
    const connectionTest = await testResendConnection()

    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Resend connection failed',
        details: connectionTest.error
      }, { status: 500 })
    }

    console.log(`Testing email delivery to subscriber: ${subscriberId}`)
    
    const deliveryTest = await testEmailDelivery(subscriberId, message)
    
    return NextResponse.json({
      success: true,
      resendConnection: connectionTest,
      emailDelivery: deliveryTest,
      message: deliveryTest.success ? 
        'Email test completed successfully' : 
        'Email test failed'
    })

  } catch (error) {
    console.error('Error in email test API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
} 