import { sendEmail, formatQuoteForEmail } from './clients/emailClient'
import { supabase } from './clients/supabaseClient'
import { getPersonalizationForSubscriber } from './smsQuoteService'

export interface EmailDelivery {
  id?: string
  subscriber_id: string
  quote_text: string
  author: string
  sent_at: string
  delivery_method: 'email'
  delivery_status: 'sent' | 'failed' | 'pending'
  email_id?: string
  error_message?: string
  email_address: string
}

export interface EmailDeliveryResult {
  success: boolean
  delivery?: EmailDelivery
  error?: string
  subscriberId: string
}

/**
 * Send a daily quote to a single subscriber via email
 */
export async function sendDailyQuoteToSubscriberViaEmail(subscriberId: string): Promise<EmailDeliveryResult> {
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

    // Validate email address
    if (!subscriber.email || subscriber.email.trim() === '') {
      return {
        success: false,
        error: 'No email address provided',
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

    // Format for email
    const subscriberName = `${subscriber.first_name || 'Friend'}`
    const personalization = getPersonalizationForSubscriber(subscriber)
    const { subject, html } = await formatQuoteForEmail(quote, author, subscriberName, personalization)

    // Send email
    const emailResult = await sendEmail({
      to: subscriber.email,
      subject,
      html,
      subscriberName
    })

    // Create delivery record (reuse quote_deliveries table)
    const delivery: EmailDelivery = {
      subscriber_id: subscriberId,
      quote_text: quote,
      author: author,
      sent_at: new Date().toISOString(),
      delivery_method: 'email',
      delivery_status: emailResult.success ? 'sent' : 'failed',
      email_id: emailResult.messageId,
      error_message: emailResult.error,
      email_address: subscriber.email
    }

    // Store delivery record (we can reuse the quote_deliveries table)
    const { data: deliveryRecord, error: deliveryError } = await supabase
      .from('quote_deliveries')
      .insert({
        ...delivery,
        phone_number: subscriber.email // Reuse phone_number field for email
      })
      .select()
      .single()

    if (deliveryError) {
      console.error('Failed to store email delivery record:', deliveryError)
      // Continue - email was sent successfully even if we can't record it
    }

    return {
      success: emailResult.success,
      delivery: deliveryRecord || delivery,
      error: emailResult.error,
      subscriberId
    }

  } catch (error) {
    console.error(`Failed to send daily quote via email to ${subscriberId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      subscriberId
    }
  }
}

/**
 * Send daily quotes to multiple subscribers via email
 */
export async function sendDailyQuotesToSubscribersViaEmail(subscriberIds: string[]): Promise<EmailDeliveryResult[]> {
  const results: EmailDeliveryResult[] = []

  for (const subscriberId of subscriberIds) {
    try {
      const result = await sendDailyQuoteToSubscriberViaEmail(subscriberId)
      results.push(result)
      
      // Small delay to avoid overwhelming email service
      await new Promise(resolve => setTimeout(resolve, 150))
      
    } catch (error) {
      console.error(`Batch email delivery error for ${subscriberId}:`, error)
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
 * Send quotes to all active subscribers via email
 */
export async function sendDailyQuotesToAllSubscribersViaEmail(): Promise<{
  totalSubscribers: number
  successCount: number
  failureCount: number
  results: EmailDeliveryResult[]
}> {
  try {
    // Get all active subscribers with email addresses
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('id')
      .eq('is_active', true)
      .not('email', 'is', null)
      .neq('email', '')

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
    const results = await sendDailyQuotesToSubscribersViaEmail(subscriberIds)

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    return {
      totalSubscribers: subscribers.length,
      successCount,
      failureCount,
      results
    }

  } catch (error) {
    console.error('Failed to send quotes via email to all subscribers:', error)
    throw error
  }
}

/**
 * Test email delivery to a specific subscriber
 */
export async function testEmailDelivery(subscriberId: string, customMessage?: string): Promise<EmailDeliveryResult> {
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

    const testMessage = customMessage || `Hello ${subscriber.first_name}! This is a test email from Your Daily Dose. Your email delivery is working perfectly! 📧✨`
    
    const { subject, html } = await formatQuoteForEmail(
      testMessage,
      'Your Daily Dose Team',
      subscriber.first_name || 'Friend',
      'Welcome to email delivery! 🎉'
    )

    const emailResult = await sendEmail({
      to: subscriber.email,
      subject,
      html,
      subscriberName: subscriber.first_name
    })

    return {
      success: emailResult.success,
      error: emailResult.error,
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