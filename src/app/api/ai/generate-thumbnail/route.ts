import { NextResponse } from 'next/server'
import { GroqClient } from '@/services/ai/groq'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { campaignName, transcript } = body

    const topicOrTitle = campaignName || 'Viral Content Masterclass 2026'
    const contextText = transcript || topicOrTitle

    // 1. Use Groq AI / LLM to analyze content and craft viral thumbnail copy & image prompt
    const groq = new GroqClient()
    const systemPrompt = 'You are a master YouTube & social media visual thumbnail designer. Return valid JSON only.'
    const userPrompt = `Analyze this video transcript/topic and craft the ultimate viral YouTube/Reels thumbnail concept.
Topic/Transcript: "${contextText}"

Return JSON matching this exact structure:
{
  "title": "Short punchy uppercase headline max 6 words",
  "subtitle": "Engaging sub-headline max 8 words",
  "badgeText": "Short viral badge with 1 emoji e.g. MUST WATCH 🚨",
  "imagePrompt": "Cinematic visual image prompt describing the subject background scene",
  "themeColor": "#FFDE59 or #00E5FF or #A3E635 or #FF90E8"
}`

    let aiConcept = {
      title: topicOrTitle.toUpperCase().substring(0, 35),
      subtitle: 'REPURPOSE 1 VIDEO INTO 12 MULTI-CHANNEL POSTS',
      badgeText: 'VIRAL BREAKTHROUGH 🚨',
      imagePrompt: `cinematic photography of ${topicOrTitle}, vibrant lighting, 8k resolution, viral YouTube thumbnail style`,
      themeColor: '#FFDE59',
    }

    try {
      const groqRawStr = await groq.chatCompletion(systemPrompt, userPrompt)
      const parsed = JSON.parse(groqRawStr)
      if (parsed && parsed.title) {
        aiConcept = {
          title: parsed.title || aiConcept.title,
          subtitle: parsed.subtitle || aiConcept.subtitle,
          badgeText: parsed.badgeText || aiConcept.badgeText,
          imagePrompt: parsed.imagePrompt || aiConcept.imagePrompt,
          themeColor: parsed.themeColor || aiConcept.themeColor,
        }
      }
    } catch (llmErr) {
      console.warn('[AI Thumbnail] LLM parse fallback active:', llmErr)
    }

    // 2. Generate AI Image Background using AI Image Engine
    const seed = Date.now()
    const encodedPrompt = encodeURIComponent(aiConcept.imagePrompt)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${seed}`

    return NextResponse.json({
      success: true,
      thumbnail: {
        id: `thumb_ai_${Date.now()}`,
        title: aiConcept.title,
        subtitle: aiConcept.subtitle,
        badgeText: aiConcept.badgeText,
        themeColor: aiConcept.themeColor,
        textColor: '#000000',
        aspectRatio: '16:9',
        layout: 'bold-header',
        imageUrl: imageUrl,
        imagePrompt: aiConcept.imagePrompt,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate AI thumbnail'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
