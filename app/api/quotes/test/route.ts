import { NextResponse } from 'next/server'
import { generatePersonalizedQuote } from '../../../lib/clients/claudeClient'

export async function GET() {
  try {
    console.log('Testing Claude API integration...')
    
    // Test with sample data
    const testQuote = await generatePersonalizedQuote({
      persona: 'Entrepreneur',
      categories: ['Motivation', 'Success'],
      tone: 'inspirational'
    })

    return NextResponse.json({ 
      status: 'success',
      message: 'Claude API integration is working!',
      testQuote 
    }, { status: 200 })

  } catch (error) {
    console.error('Claude API test failed:', error)
    
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json({ 
      status: 'error',
      message: 'Claude API integration failed',
      error: errorMessage
    }, { status: 500 })
  }
} 