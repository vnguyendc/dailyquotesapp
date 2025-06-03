import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/app/lib/clients/supabaseClient'
import { generateUniqueQuoteForSubscriber } from '../../../lib/quoteGenerationService'

export async function POST(req: NextRequest) {
  try {
    const { subscriberId, tone = 'inspirational' } = await req.json()

    if (!subscriberId) {
      return NextResponse.json({ message: 'Subscriber ID is required' }, { status: 400 })
    }

    // Get subscriber data from Supabase
    const { data: subscriber, error: fetchError } = await supabase
      .from('subscribers')
      .select('persona, categories, first_name')
      .eq('id', subscriberId)
      .eq('is_active', true)
      .single()

    if (fetchError || !subscriber) {
      return NextResponse.json({ message: 'Subscriber not found or inactive' }, { status: 404 })
    }

    // Generate unique personalized quote with history checking
    const quote = await generateUniqueQuoteForSubscriber({
      subscriberId,
      persona: subscriber.persona,
      categories: subscriber.categories,
      tone
    })

    // Add personalized greeting
    const response = {
      quote,
      greeting: `Good morning, ${subscriber.first_name}!`,
      personalization: `As a ${subscriber.persona.toLowerCase()}, this ${quote.category.toLowerCase()} quote is specially curated for you.`,
      isUnique: true // Always true now with our deduplication system
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error) {
    console.error('Subscriber quote generation error:', error)
    return NextResponse.json({ 
      message: 'Failed to generate personalized quote.' 
    }, { status: 500 })
  }
}

// GET endpoint for testing with subscriber ID as query param
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const subscriberId = searchParams.get('id')
    const tone = searchParams.get('tone') || 'inspirational'

    if (!subscriberId) {
      return NextResponse.json({ message: 'Subscriber ID is required' }, { status: 400 })
    }

    // Call the POST method with the same logic
    return POST(new NextRequest(req.url, {
      method: 'POST',
      body: JSON.stringify({ subscriberId, tone })
    }))

  } catch (error) {
    console.error('Subscriber quote GET error:', error)
    return NextResponse.json({ 
      message: 'Failed to generate personalized quote.' 
    }, { status: 500 })
  }
} 