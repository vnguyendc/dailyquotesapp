#!/usr/bin/env node

/**
 * Test script for welcome email functionality
 * 
 * Usage:
 * node scripts/test-welcome-email.js [subscriber-id]
 * 
 * If no subscriber ID is provided, it will create a test subscriber
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestSubscriber() {
  console.log('📝 Creating test subscriber...')
  
  const testSubscriber = {
    first_name: 'Test',
    last_name: 'User',
    email: `test-${Date.now()}@example.com`,
    phone: '+1234567890',
    categories: ['Motivation', 'Success'],
    delivery_time: '07:00',
    persona: 'Professional',
    self_description: 'A motivated professional looking to grow',
    personal_goals: ['Career Growth', 'Personal Development'],
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

async function testWelcomeEmail(subscriberId) {
  console.log(`🧪 Testing welcome email for subscriber: ${subscriberId}`)
  
  try {
    const response = await fetch(`http://localhost:3000/api/email/welcome?subscriberId=${subscriberId}`)
    const result = await response.json()

    if (response.ok) {
      console.log('✅ Welcome email test successful!')
      console.log('📧 Email sent to:', result.to)
      console.log('📨 Message ID:', result.messageId)
      console.log('💬 Response:', result.message)
    } else {
      console.error('❌ Welcome email test failed!')
      console.error('Error:', result.message)
      console.error('Details:', result.error)
    }

    return response.ok
  } catch (error) {
    console.error('❌ Network error testing welcome email:', error.message)
    return false
  }
}

async function getSubscriberInfo(subscriberId) {
  const { data, error } = await supabase
    .from('subscribers')
    .select('first_name, last_name, email, delivery_time, personal_goals, tone_preference')
    .eq('id', subscriberId)
    .single()

  if (error) {
    console.error('❌ Failed to get subscriber info:', error)
    return null
  }

  return data
}

async function main() {
  console.log('🚀 Welcome Email Test Script')
  console.log('============================')

  // Check if subscriber ID was provided
  const subscriberId = process.argv[2]
  let testSubscriberId = subscriberId

  if (!testSubscriberId) {
    console.log('No subscriber ID provided, creating test subscriber...')
    testSubscriberId = await createTestSubscriber()
    
    if (!testSubscriberId) {
      console.error('❌ Failed to create test subscriber')
      process.exit(1)
    }
  }

  // Get subscriber info
  const subscriberInfo = await getSubscriberInfo(testSubscriberId)
  if (subscriberInfo) {
    console.log('\n👤 Subscriber Info:')
    console.log(`   Name: ${subscriberInfo.first_name} ${subscriberInfo.last_name}`)
    console.log(`   Email: ${subscriberInfo.email}`)
    console.log(`   Delivery Time: ${subscriberInfo.delivery_time}`)
    console.log(`   Goals: ${subscriberInfo.personal_goals?.join(', ') || 'None'}`)
    console.log(`   Tone: ${subscriberInfo.tone_preference || 'Not set'}`)
  }

  console.log('\n📧 Testing welcome email...')
  
  // Test the welcome email
  const success = await testWelcomeEmail(testSubscriberId)

  if (success) {
    console.log('\n🎉 Welcome email test completed successfully!')
    console.log('Check your email inbox (if using a real email) or Resend dashboard for delivery confirmation.')
  } else {
    console.log('\n💥 Welcome email test failed!')
    console.log('Check the server logs for more details.')
  }

  // Clean up test subscriber if we created one
  if (!subscriberId && testSubscriberId) {
    console.log('\n🧹 Cleaning up test subscriber...')
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', testSubscriberId)

    if (error) {
      console.error('⚠️  Failed to clean up test subscriber:', error)
    } else {
      console.log('✅ Test subscriber cleaned up')
    }
  }

  console.log('\n✨ Test complete!')
}

// Run the test
main().catch(error => {
  console.error('💥 Test script error:', error)
  process.exit(1) 