import { supabase } from '@/app/lib/clients/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Simple authentication check (you might want to improve this)
    const authHeader = req.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching subscribers:', error)
      return NextResponse.json({ message: 'Failed to fetch subscribers' }, { status: 500 })
    }

    return NextResponse.json({ 
      count: subscribers.length,
      subscribers 
    }, { status: 200 })
  } catch (error) {
    console.error('Admin subscribers error:', error)
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 })
  }
} 