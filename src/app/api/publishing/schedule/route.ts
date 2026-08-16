import { NextResponse } from 'next/server'
import { PublishingService } from '@/services/publishing/publishing.service'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { campaignId, generatedContentId, platform, content, scheduledAt, accountId } = body

    if (!campaignId || !platform || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: campaignId, platform, content' },
        { status: 400 }
      )
    }

    const service = new PublishingService()
    const result = await service.schedulePost({
      campaignId,
      generatedContentId,
      platform,
      content,
      scheduledAt: scheduledAt || new Date().toISOString(),
      accountId,
    })

    return NextResponse.json({
      success: true,
      message: 'Post scheduled successfully through Postiz',
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
