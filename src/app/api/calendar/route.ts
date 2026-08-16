import { NextResponse } from 'next/server'
import { store } from '@/lib/store'

export async function GET() {
  try {
    const scheduledPosts = store.getScheduledPosts()
    return NextResponse.json({ success: true, scheduledPosts })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch calendar scheduled posts'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
