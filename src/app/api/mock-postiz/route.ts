import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'online',
    message: 'CreatorOS Postiz API Engine',
    integrations: [
      {
        id: 'int_bluesky_01',
        name: 'Bluesky Account (@creator.bsky.social)',
        identifier: 'creator.bsky.social',
        disabled: false,
        provider: 'bluesky',
      },
      {
        id: 'int_mastodon_01',
        name: 'Mastodon Account (@creator@mastodon.social)',
        identifier: 'creator@mastodon.social',
        disabled: false,
        provider: 'mastodon',
      },
      {
        id: 'int_linkedin_01',
        name: 'LinkedIn Profile (CreatorOS Demo)',
        identifier: 'creator-linkedin',
        disabled: false,
        provider: 'linkedin',
      },
    ],
  })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const mockPostId = `postiz_mock_${Date.now()}`

  return NextResponse.json({
    id: mockPostId,
    status: 'SCHEDULED',
    scheduledAt: body.scheduledAt || new Date().toISOString(),
    publishedUrl: `https://bsky.app/profile/creator.bsky.social/post/${mockPostId}`,
    message: 'Post successfully scheduled via Postiz API engine',
  })
}
