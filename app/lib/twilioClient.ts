import twilio from 'twilio'

const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_AUTH
const fromPhone = process.env.TWILIO_PHONE

if (!accountSid || !authToken || !fromPhone) {
  console.warn('Twilio credentials not fully configured. SMS functionality will be disabled.')
}

// Only initialize client if we have valid credentials
const client = (accountSid && authToken && accountSid.startsWith('AC')) 
  ? twilio(accountSid, authToken) 
  : null

export interface SMSMessage {
  to: string
  message: string
  subscriberName?: string
}

export interface SMSResult {
  success: boolean
  messageId?: string
  error?: string
  to: string
}

/**
 * Send a single SMS message
 */
export async function sendSMS(smsMessage: SMSMessage): Promise<SMSResult> {
  try {
    if (!client || !accountSid || !authToken || !fromPhone) {
      return {
        success: false,
        error: 'Twilio not configured',
        to: smsMessage.to
      }
    }

    const message = await client.messages.create({
      body: smsMessage.message,
      from: fromPhone,
      to: smsMessage.to
    })

    console.log(`SMS sent successfully to ${smsMessage.to}: ${message.sid}`)

    return {
      success: true,
      messageId: message.sid,
      to: smsMessage.to
    }

  } catch (error) {
    console.error(`Failed to send SMS to ${smsMessage.to}:`, error)
    
    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
      to: smsMessage.to
    }
  }
}

/**
 * Send SMS to multiple recipients
 */
export async function sendBulkSMS(messages: SMSMessage[]): Promise<SMSResult[]> {
  const results: SMSResult[] = []

  for (const message of messages) {
    try {
      const result = await sendSMS(message)
      results.push(result)
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`Bulk SMS error for ${message.to}:`, error)
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
 * Format a quote for SMS delivery
 */
export function formatQuoteForSMS(
  quote: string,
  author: string,
  subscriberName: string,
  personalization?: string
): string {
  const greeting = `Good morning, ${subscriberName}! ☀️`
  
  const formattedQuote = `"${quote}"\n\n— ${author}`
  
  const footer = personalization 
    ? `\n\n${personalization}\n\nDaily Quotes 📖` 
    : '\n\nDaily Quotes 📖'

  return `${greeting}\n\n${formattedQuote}${footer}`
}

/**
 * Validate phone number format for SMS
 */
export function isValidSMSNumber(phone: string): boolean {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '')
  
  // Must start with + and have 10-15 digits total
  const phoneRegex = /^\+[1-9]\d{9,14}$/
  
  return phoneRegex.test(cleaned)
}

interface TwilioAccountInfo {
  sid: string
  friendlyName: string
  status: string
}

/**
 * Test Twilio connection
 */
export async function testTwilioConnection(): Promise<{
  success: boolean
  error?: string
  accountInfo?: TwilioAccountInfo
}> {
  try {
    if (!client || !accountSid || !authToken) {
      return {
        success: false,
        error: 'Twilio credentials not configured'
      }
    }

    const account = await client.api.accounts(accountSid).fetch()
    
    return {
      success: true,
      accountInfo: {
        sid: account.sid,
        friendlyName: account.friendlyName,
        status: account.status
      }
    }

  } catch (error) {
    console.error('Twilio connection test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
} 