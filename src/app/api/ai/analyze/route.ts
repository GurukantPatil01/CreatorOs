import { NextResponse } from 'next/server'
import { GenerationService } from '@/services/ai/generation'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { campaignId, transcript } = body

    if (!transcript) {
      return NextResponse.json({ success: false, error: 'Transcript text is required' }, { status: 400 })
    }

    const genService = new GenerationService()
    const analysis = await genService.analyzeTranscript(campaignId || 'cmp_demo', transcript)

    return NextResponse.json({ success: true, analysis })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Analysis failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
