import { Resend } from 'resend'
import { render } from '@react-email/render'
import DailyQuoteEmail from '@/app/components/emails/DailyQuoteEmail'

// Initialize Resend client only when API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export interface EmailMessage {
  to: string
  subject: string
  html?: string
  subscriberName?: string
  quote?: string
  author?: string
  personalization?: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
  to: string
}

/**
 * Send a single email
 */
export async function sendEmail(emailMessage: EmailMessage): Promise<EmailResult> {
  try {
    if (!process.env.RESEND_API_KEY || !resend) {
      return {
        success: false,
        error: 'Resend API key not configured',
        to: emailMessage.to
      }
    }

    // Use React Email template if quote data is provided, otherwise use custom HTML
    let emailHtml = emailMessage.html
    
    if (emailMessage.quote && emailMessage.author) {
      emailHtml = await render(DailyQuoteEmail({
        subscriberName: emailMessage.subscriberName || 'Friend',
        quote: emailMessage.quote,
        author: emailMessage.author,
        personalization: emailMessage.personalization,
        unsubscribeUrl: '#' // TODO: Implement proper unsubscribe functionality
      }))
    }

    const result = await resend.emails.send({
      from: 'Your Daily Dose <quotes@yourdailydose.ai>',
      to: emailMessage.to,
      subject: emailMessage.subject,
      html: emailHtml || ''
    })

    console.log(`Email sent successfully to ${emailMessage.to}: ${result.data?.id}`)

    return {
      success: true,
      messageId: result.data?.id,
      to: emailMessage.to
    }

  } catch (error) {
    console.error(`Failed to send email to ${emailMessage.to}:`, error)
    
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
      to: emailMessage.to
    }
  }
}

/**
 * Format a quote for email delivery using React Email template
 */
export async function formatQuoteForEmail(
  quote: string,
  author: string,
  subscriberName: string,
  personalization?: string
): Promise<{ subject: string; html: string }> {
  const subject = `Your Daily Quote, ${subscriberName}! ✨`
  
  // Generate HTML using React Email template
  const html = await render(DailyQuoteEmail({
    subscriberName,
    quote,
    author,
    personalization,
    unsubscribeUrl: '#' // TODO: Implement proper unsubscribe functionality
  }))

  return { subject, html }
}

/**
 * Send a daily quote email with React Email template
 */
export async function sendDailyQuoteEmail({
  to,
  subscriberName,
  quote,
  author,
  personalization
}: {
  to: string
  subscriberName: string
  quote: string
  author: string
  personalization?: string
}): Promise<EmailResult> {
  const subject = `Your Daily Quote, ${subscriberName}! ✨`
  
  return sendEmail({
    to,
    subject,
    subscriberName,
    quote,
    author,
    personalization
  })
}

/**
 * Send bulk emails with rate limiting
 */
export async function sendBulkEmails(messages: EmailMessage[]): Promise<EmailResult[]> {
  const results: EmailResult[] = []

  for (const message of messages) {
    try {
      const result = await sendEmail(message)
      results.push(result)
      
      // Small delay to avoid rate limiting (Resend allows 10 req/sec)
      await new Promise(resolve => setTimeout(resolve, 150))
      
    } catch (error) {
      console.error(`Bulk email error for ${message.to}:`, error)
      results.push({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        to: message.to
      })
    }
  }

  return results
}

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Test Resend connection
 */
export async function testResendConnection(): Promise<{
  success: boolean
  error?: string
  apiKeyStatus?: string
}> {
  try {
    if (!process.env.RESEND_API_KEY) {
      return {
        success: false,
        error: 'Resend API key not configured'
      }
    }

    // Test by attempting to get account info (if endpoint exists)
    // For now, we'll just validate the API key format
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey.startsWith('re_')) {
      return {
        success: false,
        error: 'Invalid Resend API key format (should start with re_)'
      }
    }

    return {
      success: true,
      apiKeyStatus: 'Valid format'
    }

  } catch (error) {
    console.error('Resend connection test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
} 