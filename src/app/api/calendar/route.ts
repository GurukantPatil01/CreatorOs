import { NextResponse } from 'next/server'
import { store } from '@/lib/store'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || 'demo_user'

    const scheduledPosts = store.getScheduledPosts(userId)
    return NextResponse.json({ success: true, scheduledPosts })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch calendar scheduled posts'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
