import { supabase } from '@/app/lib/clients/supabaseClient'
import { normalizePhoneNumber, isValidPhoneNumber } from '../../lib/phoneUtils'
import { sendWelcomeEmailToSubscriber } from '@/app/lib/welcomeEmailService'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      categories, 
      deliveryTime, 
      persona, 
      password,
      // New fields from restructured form
      selfDescription,
      personalGoals,
      customGoal,
      tonePreference,
      deliveryMethod
    } = await req.json()

    // Validation
    if (!firstName?.trim()) {
      return NextResponse.json({ message: 'First name is required' }, { status: 400 })
    }

    if (!lastName?.trim()) {
      return NextResponse.json({ message: 'Last name is required' }, { status: 400 })
    }

    // Email is now required
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({ message: 'Valid email address is required' }, { status: 400 })
    }

    // Phone is now required
    if (!phone || !isValidPhoneNumber(phone)) {
      return NextResponse.json({ message: 'Valid phone number is required' }, { status: 400 })
    }

    // Validate new form fields
    if (!selfDescription?.trim()) {
      return NextResponse.json({ message: 'Self description is required' }, { status: 400 })
    }

    if (!personalGoals || !Array.isArray(personalGoals) || personalGoals.length === 0) {
      return NextResponse.json({ message: 'Please select at least one personal goal' }, { status: 400 })
    }

    // If "Other" is selected in personal goals, custom goal is required
    if (personalGoals.includes('Other') && !customGoal?.trim()) {
      return NextResponse.json({ message: 'Please describe your other goal' }, { status: 400 })
    }

    if (!tonePreference?.trim()) {
      return NextResponse.json({ message: 'Tone preference is required' }, { status: 400 })
    }

    if (!deliveryMethod || !Array.isArray(deliveryMethod) || deliveryMethod.length === 0) {
      return NextResponse.json({ message: 'Please select at least one delivery method' }, { status: 400 })
    }

    // Validate personalization fields
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ message: 'Please select at least one quote category' }, { status: 400 })
    }

    if (!deliveryTime) {
      return NextResponse.json({ message: 'Please select a delivery time' }, { status: 400 })
    }

    if (!persona?.trim()) {
      return NextResponse.json({ message: 'Please select your persona type' }, { status: 400 })
    }

    // Validate password if provided
    if (password && password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters long' }, { status: 400 })
    }

    // Normalize phone number for consistency
    const normalizedPhone = normalizePhoneNumber(phone)

    let authUserId = null

    // Create Supabase auth user if password and email are provided
    if (password && email) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email.toLowerCase().trim(),
          password: password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
            }
          }
        })

        if (authError) {
          console.error('Supabase auth error:', authError)
          if (authError.message.includes('already registered')) {
            return NextResponse.json({ message: 'This email address is already registered.' }, { status: 409 })
          }
          return NextResponse.json({ message: 'Failed to create account. Please try again.' }, { status: 500 })
        }

        authUserId = authData.user?.id
        console.log('Created auth user:', authUserId)
      } catch (error) {
        console.error('Auth creation error:', error)
        return NextResponse.json({ message: 'Failed to create account. Please try again.' }, { status: 500 })
      }
    }

    // Check if email already exists
    const { data: existingEmailSubscriber, error: emailSelectError } = await supabase
      .from('subscribers')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (emailSelectError && emailSelectError.code !== 'PGRST116') {
      console.error('Error checking existing email subscriber:', emailSelectError)
      return NextResponse.json({ message: 'Error checking subscription status' }, { status: 500 })
    }

    if (existingEmailSubscriber) {
      return NextResponse.json({ message: 'This email address is already subscribed.' }, { status: 409 })
    }

    // Check if phone number already exists
    const { data: existingPhoneSubscriber, error: phoneSelectError } = await supabase
      .from('subscribers')
      .select('phone')
      .eq('phone', normalizedPhone)
      .maybeSingle()

    if (phoneSelectError && phoneSelectError.code !== 'PGRST116') {
      console.error('Error checking existing phone subscriber:', phoneSelectError)
      return NextResponse.json({ message: 'Error checking subscription status' }, { status: 500 })
    }

    if (existingPhoneSubscriber) {
      return NextResponse.json({ message: 'This phone number is already subscribed.' }, { status: 409 })
    }

    // Insert new subscriber
    const subscriberData = { 
      first_name: firstName.trim(), 
      last_name: lastName.trim(), 
      email: email.toLowerCase().trim(), 
      phone: normalizedPhone, 
      categories: categories,
      delivery_time: deliveryTime,
      persona: persona.trim(),
      // New fields from restructured form
      self_description: selfDescription.trim(),
      personal_goals: personalGoals,
      custom_goal: personalGoals.includes('Other') ? customGoal?.trim() : null,
      tone_preference: tonePreference,
      delivery_method: deliveryMethod,
      is_active: true, 
      timezone: 'UTC',
      ...(authUserId && { auth_user_id: authUserId })
    }

    const { data, error } = await supabase
      .from('subscribers')
      .insert([subscriberData])
      .select()

    if (error) {
      console.error('Error inserting subscriber:', error)
      
      // Handle specific database errors
      if (error.code === '23505') { // Unique constraint violation
        if (error.message.includes('email')) {
          return NextResponse.json({ message: 'This email address is already subscribed.' }, { status: 409 })
        }
        if (error.message.includes('phone')) {
          return NextResponse.json({ message: 'This phone number is already subscribed.' }, { status: 409 })
        }
      }
      
      return NextResponse.json({ message: 'Failed to subscribe. Please try again.' }, { status: 500 })
    }

    const newSubscriberId = data?.[0]?.id
    console.log('New subscriber created:', newSubscriberId)

    // Send welcome email if email delivery is enabled
    if (deliveryMethod.includes('email') && newSubscriberId) {
      try {
        console.log(`Triggering welcome email for subscriber: ${newSubscriberId}`)
        
        // Send welcome email asynchronously (don't wait for it to complete)
        sendWelcomeEmailToSubscriber(newSubscriberId)
          .then(result => {
            if (result.success) {
              console.log(`Welcome email sent successfully to ${firstName} (${result.to})`)
            } else {
              console.error(`Welcome email failed for ${firstName}:`, result.error)
            }
          })
          .catch(error => {
            console.error(`Welcome email error for ${firstName}:`, error)
          })
          
      } catch (error) {
        // Don't fail the subscription if welcome email fails
        console.error('Error triggering welcome email:', error)
      }
    }

    return NextResponse.json({ 
      message: `Welcome aboard, ${firstName}! Your personalized daily dose will arrive at ${deliveryTime}.`,
      subscriberId: newSubscriberId
    }, { status: 201 })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 })
  }
} 