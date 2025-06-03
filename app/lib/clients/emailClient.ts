import { Resend } from 'resend'

// Initialize Resend client only when API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export interface EmailMessage {
  to: string
  subject: string
  html: string
  subscriberName?: string
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

    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Your Daily Dose <quotes@dailyquotes.app>',
      to: emailMessage.to,
      subject: emailMessage.subject,
      html: emailMessage.html
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
 * Format a quote for email delivery
 */
export function formatQuoteForEmail(
  quote: string,
  author: string,
  subscriberName: string,
  personalization?: string
): { subject: string; html: string } {
  const subject = `Your Daily Quote, ${subscriberName}! ✨`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Daily Quote</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .greeting {
          font-size: 24px;
          color: #667eea;
          margin-bottom: 10px;
        }
        .quote-container {
          text-align: center;
          margin: 30px 0;
          padding: 25px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 10px;
          border-left: 4px solid #667eea;
        }
        .quote {
          font-size: 20px;
          font-style: italic;
          color: #2c3e50;
          margin-bottom: 15px;
          line-height: 1.5;
        }
        .author {
          font-size: 16px;
          font-weight: 600;
          color: #667eea;
        }
        .personalization {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          text-align: center;
          color: #495057;
          font-size: 16px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
          color: #6c757d;
          font-size: 14px;
        }
        .unsubscribe {
          color: #6c757d;
          text-decoration: none;
          font-size: 12px;
        }
        .emoji {
          font-size: 1.2em;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="greeting">Good morning, ${subscriberName}! <span class="emoji">☀️</span></div>
          <p style="color: #6c757d; margin: 0;">Your daily dose of inspiration</p>
        </div>
        
        <div class="quote-container">
          <div class="quote">"${quote}"</div>
          <div class="author">— ${author}</div>
        </div>
        
        ${personalization ? `
        <div class="personalization">
          ${personalization}
        </div>
        ` : ''}
        
        <div class="footer">
          <p><strong>Your Daily Dose</strong> <span class="emoji">📖</span></p>
          <p>Transforming your day, one quote at a time</p>
          <p>
            <a href="#" class="unsubscribe">Unsubscribe</a> | 
            <a href="#" class="unsubscribe">Update Preferences</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  return { subject, html }
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