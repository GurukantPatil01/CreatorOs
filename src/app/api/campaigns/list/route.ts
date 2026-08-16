import { NextResponse } from 'next/server'
import { store } from '@/lib/store'

export async function GET() {
  try {
    const campaigns = await store.getCampaigns()
    return NextResponse.json({ success: true, campaigns })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch campaigns'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
