import { NextRequest, NextResponse } from 'next/server'
import { generatePersonalizedQuote, generateMultipleQuotes, QuoteRequest } from '../../../lib/clients/claudeClient'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { persona, categories, previousQuotes, tone, count = 1 } = body

    // Validation
    if (!persona || !persona.trim()) {
      return NextResponse.json({ message: 'Persona is required' }, { status: 400 })
    }

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ message: 'At least one category is required' }, { status: 400 })
    }

    // Prepare request
    const quoteRequest: QuoteRequest = {
      persona: persona.trim(),
      categories,
      previousQuotes: previousQuotes || [],
      tone: tone || 'inspirational'
    }

    // Generate quote(s)
    if (count === 1) {
      const quote = await generatePersonalizedQuote(quoteRequest)
      return NextResponse.json({ quote }, { status: 200 })
    } else {
      const quotes = await generateMultipleQuotes(quoteRequest, Math.min(count, 10)) // Max 10 quotes
      return NextResponse.json({ quotes }, { status: 200 })
    }

  } catch (error) {
    console.error('Quote generation error:', error)
    return NextResponse.json({ 
      message: 'Failed to generate quote. Please try again.' 
    }, { status: 500 })
  }
}

// GET endpoint for testing with query parameters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const persona = searchParams.get('persona') || 'Student'
    const categories = searchParams.get('categories')?.split(',') || ['Motivation']
    const tone = (searchParams.get('tone') || 'inspirational') as 'inspirational' | 'motivational' | 'reflective' | 'energetic'

    const quoteRequest: QuoteRequest = {
      persona,
      categories,
      tone
    }

    const quote = await generatePersonalizedQuote(quoteRequest)
    return NextResponse.json({ quote }, { status: 200 })

  } catch (error) {
    console.error('Quote generation error:', error)
    return NextResponse.json({ 
      message: 'Failed to generate quote. Please try again.' 
    }, { status: 500 })
  }
} 