import { NextResponse } from 'next/server'
import { PublishingService } from '@/services/publishing/publishing.service'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      campaignId,
      generatedContentId,
      platform,
      content,
      scheduledAt,
      accountId,
      blueskyHandle,
      blueskyPassword,
      linkedinToken,
      linkedinUrn,
      instagramAccountId,
      instagramToken,
      imageUrl,
    } = body

    if (!campaignId || !platform || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: campaignId, platform, content' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || 'demo_user'

    const service = new PublishingService()
    const result = await service.schedulePost({
      campaignId,
      generatedContentId,
      platform,
      content,
      scheduledAt: scheduledAt || new Date().toISOString(),
      accountId,
      userId,
      blueskyHandle,
      blueskyPassword,
      linkedinToken,
      linkedinUrn,
      instagramAccountId,
      instagramToken,
      imageUrl,
    })

    return NextResponse.json({
      success: true,
      message: 'Post published / scheduled successfully',
      data: result,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Publishing failed. Unable to schedule this post.'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
