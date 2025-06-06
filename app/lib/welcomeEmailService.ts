import { supabase } from './clients/supabaseClient'
import { sendEmail, EmailResult } from './clients/emailClient'
import { generateUniqueQuoteForSubscriber } from './quoteGenerationService'
import { render } from '@react-email/render'
import WelcomeEmail from '@/app/components/emails/WelcomeEmail'

export interface WelcomeEmailData {
  subscriberId: string
  subscriberName: string
  email: string
  deliveryTime: string
  deliveryMethod: string[]
  personalGoals: string[]
  tonePreference: string
  persona: string
  categories: string[]
}

/**
 * Send a welcome email to a new subscriber
 */
export async function sendWelcomeEmail(
  welcomeData: WelcomeEmailData
): Promise<EmailResult> {
  try {
    console.log(`Generating welcome email for subscriber: ${welcomeData.subscriberId}`)

    // Generate a personalized welcome quote
    const generatedQuote = await generateUniqueQuoteForSubscriber({
      subscriberId: welcomeData.subscriberId,
      persona: welcomeData.persona,
      categories: welcomeData.categories,
      tone: mapTonePreferenceToGenerationTone(welcomeData.tonePreference),
      storageEnabled: true // Store the welcome quote in history
    })

    // Render the welcome email template
    const emailHtml = await render(WelcomeEmail({
      subscriberName: welcomeData.subscriberName,
      quote: generatedQuote.quote,
      author: generatedQuote.author,
      deliveryTime: formatDeliveryTime(welcomeData.deliveryTime),
      deliveryMethod: welcomeData.deliveryMethod,
      personalGoals: welcomeData.personalGoals,
      tonePreference: welcomeData.tonePreference,
      unsubscribeUrl: '#' // TODO: Implement proper unsubscribe functionality
    }))

    // Send the email
    const result = await sendEmail({
      to: welcomeData.email,
      subject: `🎉 Welcome to Your Daily Dose, ${welcomeData.subscriberName}!`,
      html: emailHtml
    })

    // Log the welcome email delivery
    if (result.success) {
      await logWelcomeEmailDelivery(
        welcomeData.subscriberId,
        result.messageId,
        generatedQuote.quote,
        generatedQuote.author
      )
      console.log(`Welcome email sent successfully to ${welcomeData.email}`)
    } else {
      console.error(`Failed to send welcome email to ${welcomeData.email}:`, result.error)
    }

    return result

  } catch (error) {
    console.error(`Error sending welcome email to ${welcomeData.subscriberId}:`, error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      to: welcomeData.email
    }
  }
}

/**
 * Get subscriber data for welcome email
 */
export async function getSubscriberWelcomeData(subscriberId: string): Promise<WelcomeEmailData | null> {
  try {
    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .select(`
        id,
        first_name,
        last_name,
        email,
        delivery_time,
        delivery_method,
        personal_goals,
        tone_preference,
        persona,
        categories
      `)
      .eq('id', subscriberId)
      .single()

    if (error) {
      console.error('Error fetching subscriber for welcome email:', error)
      return null
    }

    if (!subscriber) {
      console.error('Subscriber not found for welcome email:', subscriberId)
      return null
    }

    return {
      subscriberId: subscriber.id,
      subscriberName: subscriber.first_name,
      email: subscriber.email,
      deliveryTime: subscriber.delivery_time,
      deliveryMethod: subscriber.delivery_method || ['email'],
      personalGoals: subscriber.personal_goals || ['Personal Growth'],
      tonePreference: subscriber.tone_preference || 'inspirational',
      persona: subscriber.persona,
      categories: subscriber.categories
    }

  } catch (error) {
    console.error('Error getting subscriber welcome data:', error)
    return null
  }
}

/**
 * Send welcome email to a subscriber by ID
 */
export async function sendWelcomeEmailToSubscriber(subscriberId: string): Promise<EmailResult> {
  const welcomeData = await getSubscriberWelcomeData(subscriberId)
  
  if (!welcomeData) {
    return {
      success: false,
      error: 'Subscriber not found or missing required data',
      to: 'unknown'
    }
  }

  return sendWelcomeEmail(welcomeData)
}

/**
 * Log welcome email delivery to database
 */
async function logWelcomeEmailDelivery(
  subscriberId: string,
  messageId: string | undefined,
  quote: string,
  author: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('quote_deliveries')
      .insert([{
        subscriber_id: subscriberId,
        quote_text: quote,
        quote_author: author,
        delivery_method: 'email',
        delivery_status: 'sent',
        message_id: messageId,
        sent_at: new Date().toISOString(),
        delivery_type: 'welcome'
      }])

    if (error) {
      console.error('Error logging welcome email delivery:', error)
    }
  } catch (error) {
    console.error('Error logging welcome email delivery:', error)
  }
}

/**
 * Map tone preference to quote generation tone
 */
function mapTonePreferenceToGenerationTone(
  tonePreference: string
): 'inspirational' | 'motivational' | 'reflective' | 'energetic' {
  switch (tonePreference.toLowerCase()) {
    case 'bold':
    case 'energetic':
      return 'energetic'
    case 'motivational':
      return 'motivational'
    case 'gentle':
    case 'wise':
    case 'reflective':
      return 'reflective'
    case 'inspirational':
    case 'playful':
    default:
      return 'inspirational'
  }
}

/**
 * Format delivery time for display
 */
function formatDeliveryTime(deliveryTime: string): string {
  try {
    // If it's already in readable format, return as is
    if (deliveryTime.includes('AM') || deliveryTime.includes('PM')) {
      return deliveryTime
    }

    // If it's in 24-hour format (e.g., "07:00"), convert to 12-hour
    const [hours, minutes] = deliveryTime.split(':').map(Number)
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
  } catch (error) {
    // If parsing fails, return the original value
    return deliveryTime
  }
} 