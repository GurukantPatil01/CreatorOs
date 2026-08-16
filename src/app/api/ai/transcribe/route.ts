import { NextResponse } from 'next/server'
import { TranscriptionService } from '@/services/ai/transcription'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { videoUrl } = body

    const transcriptionService = new TranscriptionService()
    const result = await transcriptionService.transcribeVideo(videoUrl)

    return NextResponse.json({ success: true, transcription: result })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Transcription error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
