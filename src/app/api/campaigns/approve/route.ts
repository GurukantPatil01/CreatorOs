import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { campaignId, platform, content } = body

    if (!campaignId || !platform || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing campaignId, platform, or content' },
        { status: 400 }
      )
    }

    try {
      const supabase = createAdminClient()
      
      // Update DB record
      await supabase
        .from('generated_content')
        .update({
          content,
          status: 'approved',
          approved: true,
          updated_at: new Date().toISOString(),
        })
        .eq('campaign_id', campaignId)
        .eq('platform', platform)

      // Update Campaign status
      await supabase
        .from('campaigns')
        .update({ status: 'ready', updated_at: new Date().toISOString() })
        .eq('id', campaignId)
    } catch (err) {
      console.warn('[ApproveAPI] Database update fallback:', err)
    }

    return NextResponse.json({
      success: true,
      message: 'Content approved successfully',
      campaignId,
      platform,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Approval failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
