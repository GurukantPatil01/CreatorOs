import { NextResponse } from 'next/server'
import { GenerationService } from '@/services/ai/generation'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { campaignId, transcript, analysis } = body

    const genService = new GenerationService()
    const result = await genService.generateContent(
      campaignId || 'cmp_demo',
      transcript || 'Sample transcript',
      analysis || { summary: 'Sample summary' }
    )

    return NextResponse.json({ success: true, generatedContent: result })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Generation failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
