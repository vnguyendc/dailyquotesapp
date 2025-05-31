import { supabase } from '@/lib/supabaseClient'
import { GeneratedQuote } from './claudeClient'

export interface QuoteHistory {
  id: string
  subscriber_id: string
  quote_text: string
  quote_author: string
  quote_category: string
  quote_explanation?: string
  tone: string
  sent_at: string
}

/**
 * Get recent quotes for a subscriber to avoid duplicates
 */
export async function getRecentQuotes(
  subscriberId: string, 
  limitDays: number = 30,
  maxQuotes: number = 50
): Promise<string[]> {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - limitDays)

    const { data, error } = await supabase
      .from('sent_quotes')
      .select('quote_text')
      .eq('subscriber_id', subscriberId)
      .gte('sent_at', cutoffDate.toISOString())
      .order('sent_at', { ascending: false })
      .limit(maxQuotes)

    if (error) {
      console.error('Error fetching recent quotes:', error)
      return []
    }

    return data?.map(row => row.quote_text) || []
  } catch (error) {
    console.error('Error in getRecentQuotes:', error)
    return []
  }
}

/**
 * Check if a specific quote has been sent to a subscriber
 */
export async function hasQuoteBeenSent(
  subscriberId: string, 
  quoteText: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('sent_quotes')
      .select('id')
      .eq('subscriber_id', subscriberId)
      .eq('quote_text', quoteText)
      .maybeSingle()

    if (error) {
      console.error('Error checking quote duplication:', error)
      return false // Assume not sent if we can't check
    }

    return !!data
  } catch (error) {
    console.error('Error in hasQuoteBeenSent:', error)
    return false
  }
}

/**
 * Store a new quote that was sent to a subscriber
 */
export async function storeQuoteHistory(
  subscriberId: string,
  quote: GeneratedQuote,
  tone: string = 'inspirational'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('sent_quotes')
      .insert([{
        subscriber_id: subscriberId,
        quote_text: quote.quote,
        quote_author: quote.author,
        quote_category: quote.category,
        quote_explanation: quote.explanation,
        tone: tone,
        sent_at: new Date().toISOString()
      }])

    if (error) {
      console.error('Error storing quote history:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in storeQuoteHistory:', error)
    return false
  }
}

/**
 * Get quote statistics for a subscriber
 */
export async function getQuoteStats(subscriberId: string) {
  try {
    const { data, error } = await supabase
      .from('sent_quotes')
      .select('quote_category, sent_at')
      .eq('subscriber_id', subscriberId)

    if (error) {
      console.error('Error fetching quote stats:', error)
      return null
    }

    const totalQuotes = data?.length || 0
    const categoryCounts = data?.reduce((acc, quote) => {
      acc[quote.quote_category] = (acc[quote.quote_category] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    const firstQuote = data?.length > 0 ? 
      new Date(Math.min(...data.map(q => new Date(q.sent_at).getTime()))) : null

    return {
      totalQuotes,
      categoryCounts,
      memberSince: firstQuote,
      favoriteCategory: Object.entries(categoryCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || null
    }
  } catch (error) {
    console.error('Error in getQuoteStats:', error)
    return null
  }
}

/**
 * Clean up old quote history (optional - for data management)
 */
export async function cleanupOldQuotes(daysToKeep: number = 365) {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const { error } = await supabase
      .from('sent_quotes')
      .delete()
      .lt('sent_at', cutoffDate.toISOString())

    if (error) {
      console.error('Error cleaning up old quotes:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in cleanupOldQuotes:', error)
    return false
  }
}

/**
 * Check for semantic similarity between quotes (basic keyword/phrase matching)
 */
export function areQuotesSimilar(quote1: string, quote2: string): boolean {
  // Normalize quotes for comparison
  const normalize = (text: string) => text.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(' ')
    .filter(word => word.length > 3) // Keep only words longer than 3 chars

  const words1 = normalize(quote1)
  const words2 = normalize(quote2)

  // Check for common significant words
  const commonWords = words1.filter(word => words2.includes(word))
  const similarityRatio = commonWords.length / Math.max(words1.length, words2.length)

  // Check for common phrases (2+ word sequences)
  const phrases1: string[] = []
  const phrases2: string[] = []
  
  for (let i = 0; i < words1.length - 1; i++) {
    phrases1.push(words1[i] + ' ' + words1[i + 1])
  }
  
  for (let i = 0; i < words2.length - 1; i++) {
    phrases2.push(words2[i] + ' ' + words2[i + 1])
  }

  const commonPhrases = phrases1.filter(phrase => phrases2.includes(phrase))

  // Consider similar if:
  // - More than 30% word overlap OR
  // - Any common phrases (2+ words) exist
  return similarityRatio > 0.3 || commonPhrases.length > 0
}

/**
 * Check if a quote is semantically similar to any recent quotes
 */
export async function isSimilarToRecentQuotes(
  subscriberId: string,
  newQuote: string,
  limitDays: number = 30
): Promise<boolean> {
  try {
    const recentQuotes = await getRecentQuotes(subscriberId, limitDays, 50)
    
    for (const recentQuote of recentQuotes) {
      if (areQuotesSimilar(newQuote, recentQuote)) {
        console.log(`Similar quote detected: "${newQuote}" vs "${recentQuote}"`)
        return true
      }
    }
    
    return false
  } catch (error) {
    console.error('Error checking quote similarity:', error)
    return false // Assume not similar if we can't check
  }
} 