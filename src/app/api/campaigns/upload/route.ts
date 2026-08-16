import { NextResponse } from 'next/server'
import { UploadService } from '@/services/storage/upload.service'

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || ''
    const uploadService = new UploadService()

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      const topic = formData.get('topic') as string | null

      if (!file && !topic) {
        return NextResponse.json(
          { success: false, error: 'Please provide a video file or a topic' },
          { status: 400 }
        )
      }

      const result = await uploadService.createCampaignFromUpload(
        file,
        file?.name,
        topic || undefined
      )

      return NextResponse.json({ success: true, campaign: result })
    } else {
      const body = await req.json().catch(() => ({}))
      const topic = body.topic as string | undefined

      if (!topic) {
        return NextResponse.json(
          { success: false, error: 'Topic text is required' },
          { status: 400 }
        )
      }

      const result = await uploadService.createCampaignFromUpload(null, undefined, topic)
      return NextResponse.json({ success: true, campaign: result })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
