import { NextResponse } from 'next/server'
import { store } from '@/lib/store'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || 'demo_user'

    const campaigns = await store.getCampaigns(userId)
    return NextResponse.json({ success: true, campaigns })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch campaigns'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
