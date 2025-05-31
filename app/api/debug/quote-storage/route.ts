import { NextRequest, NextResponse } from 'next/server'
import { storeQuoteHistory } from '../../../lib/quoteHistoryService'

export async function POST(req: NextRequest) {
  try {
    const { subscriberId } = await req.json()

    if (!subscriberId) {
      return NextResponse.json({ message: 'Subscriber ID required' }, { status: 400 })
    }

    // Test storing a simple quote
    const testQuote = {
      quote: "Test quote for debugging storage",
      author: "Debug System",
      category: "Motivation",
      explanation: "Testing quote storage functionality"
    }

    console.log('Attempting to store test quote...')
    const stored = await storeQuoteHistory(subscriberId, testQuote, 'inspirational')
    
    console.log('Storage result:', stored)

    return NextResponse.json({
      success: stored,
      message: stored ? 'Quote stored successfully' : 'Failed to store quote',
      testQuote
    }, { status: stored ? 200 : 500 })

  } catch (error) {
    console.error('Debug storage error:', error)
    return NextResponse.json({
      success: false,
      message: 'Error during storage test',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 