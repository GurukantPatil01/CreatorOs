import { NextResponse } from 'next/server'
import { PublishingService } from '@/services/publishing/publishing.service'

export async function GET() {
  try {
    const service = new PublishingService()
    const integrations = await service.getConnectedPlatforms()
    return NextResponse.json({ success: true, integrations })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
