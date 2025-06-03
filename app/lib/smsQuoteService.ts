import { sendSMS, formatQuoteForSMS } from './clients/twilioClient'
import { supabase } from './clients/supabaseClient'

export interface QuoteDelivery {
  id?: string
  subscriber_id: string
  quote_text: string
  author: string
  sent_at: string
  delivery_method: 'sms'
  delivery_status: 'sent' | 'failed' | 'pending'
  sms_id?: string
  error_message?: string
  phone_number: string
}

export interface DeliveryResult {
  success: boolean
  delivery?: QuoteDelivery
  error?: string
  subscriberId: string
}

/**
 * Send a daily quote to a single subscriber via SMS
 */
export async function sendDailyQuoteToSubscriber(subscriberId: string): Promise<DeliveryResult> {
  try {
    // Get subscriber info
    const { data: subscriber, error: subError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('id', subscriberId)
      .single()

    if (subError || !subscriber) {
      return {
        success: false,
        error: `Subscriber not found: ${subError?.message}`,
        subscriberId
      }
    }

    // Validate phone number
    if (!subscriber.phone || subscriber.phone.trim() === '') {
      return {
        success: false,
        error: 'No phone number provided',
        subscriberId
      }
    }

    // Get quote from the quotes API endpoint
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXT_PUBLIC_BASE_URL || 'https://dailyquotesapp.vercel.app'
      : 'http://localhost:3000'
      
    const quoteResponse = await fetch(`${baseUrl}/api/quotes/for-subscriber`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriberId })
    })

    if (!quoteResponse.ok) {
      const errorData = await quoteResponse.json().catch(() => ({}))
      return {
        success: false,
        error: `Failed to generate quote: ${errorData.error || 'Unknown error'}`,
        subscriberId
      }
    }

    const quoteData = await quoteResponse.json()
    
    if (!quoteData.quote) {
      return {
        success: false,
        error: `Quote generation failed: ${quoteData.error || 'No quote returned'}`,
        subscriberId
      }
    }

    const { quote, author } = quoteData.quote

    // Format for SMS
    const subscriberName = `${subscriber.first_name || 'Friend'}`
    const personalization = getPersonalizationForSubscriber(subscriber)
    const smsMessage = formatQuoteForSMS(quote, author, subscriberName, personalization)

    // Send SMS
    const smsResult = await sendSMS({
      to: subscriber.phone,
      message: smsMessage,
      subscriberName
    })

    // Create delivery record
    const delivery: QuoteDelivery = {
      subscriber_id: subscriberId,
      quote_text: quote,
      author: author,
      sent_at: new Date().toISOString(),
      delivery_method: 'sms',
      delivery_status: smsResult.success ? 'sent' : 'failed',
      sms_id: smsResult.messageId,
      error_message: smsResult.error,
      phone_number: subscriber.phone
    }

    // Store delivery record
    const { data: deliveryRecord, error: deliveryError } = await supabase
      .from('quote_deliveries')
      .insert(delivery)
      .select()
      .single()

    if (deliveryError) {
      console.error('Failed to store delivery record:', deliveryError)
      // Continue - SMS was sent successfully even if we can't record it
    }

    return {
      success: smsResult.success,
      delivery: deliveryRecord || delivery,
      error: smsResult.error,
      subscriberId
    }

  } catch (error) {
    console.error(`Failed to send daily quote to ${subscriberId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      subscriberId
    }
  }
}

/**
 * Send daily quotes to multiple subscribers
 */
export async function sendDailyQuotesToSubscribers(subscriberIds: string[]): Promise<DeliveryResult[]> {
  const results: DeliveryResult[] = []

  for (const subscriberId of subscriberIds) {
    try {
      const result = await sendDailyQuoteToSubscriber(subscriberId)
      results.push(result)
      
      // Small delay to avoid overwhelming Twilio
      await new Promise(resolve => setTimeout(resolve, 200))
      
    } catch (error) {
      console.error(`Batch delivery error for ${subscriberId}:`, error)
      results.push({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        subscriberId
      })
    }
  }

  return results
}

/**
 * Send quotes to all active subscribers
 */
export async function sendDailyQuotesToAllSubscribers(): Promise<{
  totalSubscribers: number
  successCount: number
  failureCount: number
  results: DeliveryResult[]
}> {
  try {
    // Get all active subscribers
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('id')
      .eq('is_active', true)
      .not('phone', 'is', null)

    if (error) {
      throw new Error(`Failed to fetch subscribers: ${error.message}`)
    }

    if (!subscribers || subscribers.length === 0) {
      return {
        totalSubscribers: 0,
        successCount: 0,
        failureCount: 0,
        results: []
      }
    }

    const subscriberIds = subscribers.map(sub => sub.id)
    const results = await sendDailyQuotesToSubscribers(subscriberIds)

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    return {
      totalSubscribers: subscribers.length,
      successCount,
      failureCount,
      results
    }

  } catch (error) {
    console.error('Failed to send quotes to all subscribers:', error)
    throw error
  }
}

interface SubscriberData {
  persona?: string
  first_name?: string
  last_name?: string
  phone?: string
  [key: string]: unknown
}

/**
 * Get personalized message based on subscriber's persona
 */
export function getPersonalizationForSubscriber(subscriber: SubscriberData): string {
  const persona = subscriber.persona?.toLowerCase() || 'default'
  
  const personalizations: Record<string, string[]> = {
    athlete: [
      "Train your mind like you train your body! 💪",
      "Champions are made in moments like these! 🏆",
      "Every rep in life counts! 🎯"
    ],
    entrepreneur: [
      "Build something amazing today! 🚀",
      "Your next breakthrough is waiting! 💡",
      "Turn today's challenges into tomorrow's victories! 📈"
    ],
    student: [
      "Knowledge is your superpower! 📚",
      "Every day is a chance to grow! 🌱",
      "You're building your future right now! ✨"
    ],
    professional: [
      "Make today count in your career! 💼",
      "Excellence is a daily habit! ⭐",
      "Lead by example today! 👑"
    ],
    parent: [
      "You're shaping the future! 👨‍👩‍👧‍👦",
      "Your love makes all the difference! ❤️",
      "Being a parent is your greatest adventure! 🌟"
    ],
    creative: [
      "Let your creativity flow today! 🎨",
      "Art is how you change the world! ✨",
      "Your imagination is unlimited! 🌈"
    ],
    leader: [
      "Great leaders inspire daily! 👑",
      "Your vision creates the future! 🔮",
      "Lead with purpose today! 🎯"
    ],
    teacher: [
      "You're planting seeds of wisdom! 🌱",
      "Every student you touch changes the world! 📚",
      "Teaching is the art of possibility! ✨"
    ],
    healthcare: [
      "You're a daily hero! 🏥",
      "Healing hearts and minds! ❤️",
      "Your care makes miracles happen! 🌟"
    ],
    default: [
      "Make today amazing! ✨",
      "You've got this! 💪",
      "Believe in yourself! 🌟"
    ]
  }

  const messages = personalizations[persona] || personalizations.default

  return messages[Math.floor(Math.random() * messages.length)]
}

/**
 * Get delivery statistics for a date range
 */
export async function getDeliveryStats(
  startDate: string,
  endDate: string
): Promise<{
  totalDeliveries: number
  successfulDeliveries: number
  failedDeliveries: number
  successRate: number
}> {
  try {
    const { data: deliveries, error } = await supabase
      .from('quote_deliveries')
      .select('delivery_status')
      .gte('sent_at', startDate)
      .lte('sent_at', endDate)

    if (error) {
      throw new Error(`Failed to fetch delivery stats: ${error.message}`)
    }

    const totalDeliveries = deliveries?.length || 0
    const successfulDeliveries = deliveries?.filter(d => d.delivery_status === 'sent').length || 0
    const failedDeliveries = totalDeliveries - successfulDeliveries
    const successRate = totalDeliveries > 0 ? (successfulDeliveries / totalDeliveries) * 100 : 0

    return {
      totalDeliveries,
      successfulDeliveries,
      failedDeliveries,
      successRate: Math.round(successRate * 100) / 100
    }

  } catch (error) {
    console.error('Failed to get delivery stats:', error)
    throw error
  }
}

/**
 * Test SMS delivery to a specific subscriber
 */
export async function testSMSDelivery(subscriberId: string, customMessage?: string): Promise<DeliveryResult> {
  try {
    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('id', subscriberId)
      .single()

    if (error || !subscriber) {
      return {
        success: false,
        error: `Subscriber not found: ${error?.message}`,
        subscriberId
      }
    }

    const testMessage = customMessage || `Hello ${subscriber.first_name}! This is a test message from Your Daily Dose. Your SMS service is working perfectly! 📱✨`

    const smsResult = await sendSMS({
      to: subscriber.phone,
      message: testMessage,
      subscriberName: subscriber.first_name
    })

    return {
      success: smsResult.success,
      error: smsResult.error,
      subscriberId
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      subscriberId
    }
  }
}
