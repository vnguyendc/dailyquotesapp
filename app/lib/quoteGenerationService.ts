import { generatePersonalizedQuote, QuoteRequest, GeneratedQuote } from './clients/claudeClient'
import { getRecentQuotes, storeQuoteHistory, hasQuoteBeenSent, isSimilarToRecentQuotes } from './quoteHistoryService'

export interface QuoteGenerationOptions {
  subscriberId: string
  persona: string
  categories: string[]
  tone?: 'inspirational' | 'motivational' | 'reflective' | 'energetic'
  maxRetries?: number
  storageEnabled?: boolean
}

/**
 * Generate a unique quote for a subscriber with history checking
 */
export async function generateUniqueQuoteForSubscriber(
  options: QuoteGenerationOptions
): Promise<GeneratedQuote> {
  const { 
    subscriberId, 
    persona, 
    categories, 
    tone = 'inspirational',
    maxRetries = 3,
    storageEnabled = true
  } = options

  // Get recent quotes for this subscriber
  const recentQuotes = await getRecentQuotes(subscriberId, 30, 50)
  
  let attempts = 0
  let generatedQuote: GeneratedQuote

  // Try to generate a unique quote
  while (attempts < maxRetries) {
    attempts++
    
    try {
      // Generate quote with history context
      const quoteRequest: QuoteRequest = {
        persona,
        categories,
        previousQuotes: recentQuotes,
        tone
      }
      
      generatedQuote = await generatePersonalizedQuote(quoteRequest)
      
      // Check if this exact quote was already sent
      const alreadySent = await hasQuoteBeenSent(subscriberId, generatedQuote.quote)
      
      // Check if this quote is semantically similar to recent quotes
      const isSimilar = await isSimilarToRecentQuotes(subscriberId, generatedQuote.quote)
      
      if (!alreadySent && !isSimilar) {
        // Quote is unique! Store it if enabled
        if (storageEnabled) {
          const stored = await storeQuoteHistory(subscriberId, generatedQuote, tone)
          if (!stored) {
            console.warn(`Failed to store quote history for subscriber ${subscriberId}`)
          }
        }
        
        return generatedQuote
      }
      
      // Quote is duplicate or similar, add to avoid list and try again
      recentQuotes.push(generatedQuote.quote)
      console.log(`Attempt ${attempts}: Generated ${alreadySent ? 'duplicate' : 'similar'} quote, retrying...`)
      
    } catch (error) {
      console.error(`Quote generation attempt ${attempts} failed:`, error)
      
      if (attempts === maxRetries) {
        // Use fallback quote but make it unique by adding timestamp
        const timestamp = new Date().toISOString().slice(0, 10)
        generatedQuote = {
          quote: `"Success is not final, failure is not fatal: it is the courage to continue that counts." - ${timestamp}`,
          author: "Winston Churchill",
          category: categories[0] || "Motivation",
          explanation: "A timeless reminder about perseverance and resilience."
        }
        
        // Store fallback quote
        if (storageEnabled) {
          await storeQuoteHistory(subscriberId, generatedQuote, tone)
        }
        
        return generatedQuote
      }
    }
  }

  // This should never be reached, but TypeScript requires it
  throw new Error('Failed to generate unique quote after all attempts')
}

/**
 * Generate quotes for multiple subscribers (batch processing)
 */
export async function generateQuotesForSubscribers(
  subscribers: Array<{
    id: string
    persona: string
    categories: string[]
    first_name: string
  }>,
  tone: 'inspirational' | 'motivational' | 'reflective' | 'energetic' = 'inspirational'
): Promise<Array<{
  subscriberId: string
  quote: GeneratedQuote
  error?: string
}>> {
  const results: Array<{
    subscriberId: string
    quote: GeneratedQuote
    error?: string
  }> = []

  for (const subscriber of subscribers) {
    try {
      const quote = await generateUniqueQuoteForSubscriber({
        subscriberId: subscriber.id,
        persona: subscriber.persona,
        categories: subscriber.categories,
        tone
      })
      
      results.push({
        subscriberId: subscriber.id,
        quote
      })
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (error) {
      console.error(`Failed to generate quote for subscriber ${subscriber.id}:`, error)
      results.push({
        subscriberId: subscriber.id,
        quote: {
          quote: "The journey of a thousand miles begins with one step.",
          author: "Lao Tzu",
          category: subscriber.categories[0] || "Inspiration",
          explanation: "A gentle reminder to start where you are."
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  return results
} 