#!/usr/bin/env node

/**
 * Send a test welcome email to a specific email address
 * 
 * Usage:
 * node scripts/send-test-welcome.js your-email@example.com
 */

const { createClient } = require('@supabase/supabase-js')

// Load environment variables from .env.local manually
const fs = require('fs')
const path = require('path')

// Try to load .env.local file
try {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=')
      if (key && value) {
        process.env[key.trim()] = value.trim()
      }
    })
  }
} catch (error) {
  console.log('Note: Could not load .env.local file, using system environment variables')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestSubscriberWithEmail(email, firstName = 'Test') {
  console.log(`📝 Creating test subscriber with email: ${email}`)
  
  const testSubscriber = {
    first_name: firstName,
    last_name: 'User',
    email: email,
    phone: '+1234567890',
    categories: ['Motivation', 'Success', 'Personal Growth'],
    delivery_time: '07:00',
    persona: 'Professional',
    self_description: 'A motivated professional looking to grow and succeed',
    personal_goals: ['Career Growth', 'Personal Development', 'Better Habits'],
    tone_preference: 'inspirational',
    delivery_method: ['email'],
    is_active: true,
    timezone: 'UTC'
  }

  const { data, error } = await supabase
    .from('subscribers')
    .insert([testSubscriber])
    .select()
    .single()

  if (error) {
    console.error('❌ Failed to create test subscriber:', error)
    return null
  }

  console.log('✅ Test subscriber created:', data.id)
  return data.id
}

async function sendTestWelcomeEmail(subscriberId) {
  console.log(`🧪 Sending welcome email for subscriber: ${subscriberId}`)
  
  try {
    const response = await fetch(`http://localhost:3000/api/email/welcome?subscriberId=${subscriberId}`)
    const result = await response.json()

    if (response.ok) {
      console.log('✅ Welcome email sent successfully!')
      console.log('📧 Email sent to:', result.to)
      console.log('📨 Message ID:', result.messageId)
      return true
    } else {
      console.error('❌ Welcome email failed!')
      console.error('Error:', result.message)
      console.error('Details:', result.error)
      return false
    }
  } catch (error) {
    console.error('❌ Network error:', error.message)
    return false
  }
}

async function cleanupTestSubscriber(subscriberId) {
  console.log('🧹 Cleaning up test subscriber...')
  const { error } = await supabase
    .from('subscribers')
    .delete()
    .eq('id', subscriberId)

  if (error) {
    console.error('⚠️  Failed to clean up test subscriber:', error)
  } else {
    console.log('✅ Test subscriber cleaned up')
  }
}

async function main() {
  console.log('🚀 Welcome Email Test - Send to Your Email')
  console.log('=========================================')

  // Get email from command line argument
  const email = process.argv[2]
  
  if (!email) {
    console.error('❌ Please provide your email address')
    console.error('Usage: node scripts/send-test-welcome.js your-email@example.com')
    process.exit(1)
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    console.error('❌ Please provide a valid email address')
    process.exit(1)
  }

  console.log(`📧 Test email will be sent to: ${email}`)
  
  // Extract first name from email (before @)
  const firstName = email.split('@')[0].split('.')[0]
  const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

  // Create test subscriber
  const subscriberId = await createTestSubscriberWithEmail(email, capitalizedName)
  
  if (!subscriberId) {
    console.error('❌ Failed to create test subscriber')
    process.exit(1)
  }

  console.log('\n⏳ Waiting 2 seconds for data to propagate...')
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Send welcome email
  console.log('\n📧 Sending welcome email...')
  const success = await sendTestWelcomeEmail(subscriberId)

  if (success) {
    console.log('\n🎉 Success! Welcome email sent to your inbox!')
    console.log('📬 Check your email (including spam folder) for the welcome message')
    console.log('📊 You can also check delivery status in your Resend dashboard')
  } else {
    console.log('\n💥 Failed to send welcome email')
    console.log('🔍 Check the server logs for more details')
  }

  // Clean up test subscriber
  console.log('\n🧹 Cleaning up...')
  await cleanupTestSubscriber(subscriberId)

  console.log('\n✨ Test complete!')
  
  if (success) {
    console.log('\n📧 What you should see in your email:')
    console.log('   • 🎉 Welcome message with your name')
    console.log('   • ✨ Personalized inspirational quote')
    console.log('   • 📅 Information about daily delivery at 7:00 AM')
    console.log('   • 🎯 References to your goals (Career Growth, Personal Development)')
    console.log('   • 💫 Beautiful green design with professional footer')
  }
}

// Run the test
main().catch(error => {
  console.error('💥 Test script error:', error)
  process.exit(1)
}) 