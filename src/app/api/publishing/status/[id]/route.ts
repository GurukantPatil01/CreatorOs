import { NextResponse } from 'next/server'
import { PublishingService } from '@/services/publishing/publishing.service'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const service = new PublishingService()
    const status = await service.getPostStatus(id)

    return NextResponse.json({ success: true, status })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
