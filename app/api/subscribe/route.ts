import { supabase } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone, categories, deliveryTime } = await req.json()

    // Validation
    if (!firstName?.trim()) {
      return NextResponse.json({ message: 'First name is required' }, { status: 400 })
    }

    if (!lastName?.trim()) {
      return NextResponse.json({ message: 'Last name is required' }, { status: 400 })
    }

    // Email is optional, but if provided, validate format
    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 })
    }

    if (!phone?.match(/^\+?[1-9]\d{1,14}$/)) {
      return NextResponse.json({ message: 'Invalid phone number' }, { status: 400 })
    }

    // Validate personalization fields
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ message: 'Please select at least one quote category' }, { status: 400 })
    }

    if (!deliveryTime) {
      return NextResponse.json({ message: 'Please select a delivery time' }, { status: 400 })
    }

    // Check if email already exists (only if email is provided)
    if (email) {
      const { data: existingEmailSubscriber, error: emailSelectError } = await supabase
        .from('subscribers')
        .select('email')
        .eq('email', email)
        .maybeSingle()

      if (emailSelectError && emailSelectError.code !== 'PGRST116') {
        console.error('Error checking existing email subscriber:', emailSelectError)
        return NextResponse.json({ message: 'Error checking subscription status' }, { status: 500 })
      }

      if (existingEmailSubscriber) {
        return NextResponse.json({ message: 'This email address is already subscribed.' }, { status: 409 })
      }
    }

    // Check if phone number already exists
    const { data: existingPhoneSubscriber, error: phoneSelectError } = await supabase
      .from('subscribers')
      .select('phone')
      .eq('phone', phone)
      .maybeSingle()

    if (phoneSelectError && phoneSelectError.code !== 'PGRST116') {
      console.error('Error checking existing phone subscriber:', phoneSelectError)
      return NextResponse.json({ message: 'Error checking subscription status' }, { status: 500 })
    }

    if (existingPhoneSubscriber) {
      return NextResponse.json({ message: 'This phone number is already subscribed.' }, { status: 409 })
    }

    // Insert new subscriber
    const { error } = await supabase
      .from('subscribers')
      .insert([{ 
        first_name: firstName, 
        last_name: lastName, 
        email: email || null, 
        phone, 
        categories: categories,
        delivery_time: deliveryTime,
        is_active: true, 
        timezone: 'UTC' 
      }])

    if (error) {
      console.error('Error inserting subscriber:', error)
      return NextResponse.json({ message: 'Failed to subscribe. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: `Welcome aboard, ${firstName}! Your personalized daily quotes will arrive at ${deliveryTime}.` 
    }, { status: 201 })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 })
  }
} 