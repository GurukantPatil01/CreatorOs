export class GroqClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || ''
    this.baseUrl = 'https://api.groq.com/openai/v1'
  }

  private isMock(): boolean {
    return (
      !this.apiKey ||
      this.apiKey.includes('placeholder') ||
      this.apiKey.includes('mock') ||
      this.apiKey === 'gsk_your_groq_api_key'
    )
  }

  async chatCompletion(systemPrompt: string, userPrompt: string): Promise<string> {
    if (this.isMock()) {
      return this.getMockCompletion(userPrompt)
    }

    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' },
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Groq API Error ${res.status}: ${errText}`)
      }

      const data = await res.json()
      return data.choices?.[0]?.message?.content || '{}'
    } catch (err) {
      console.warn('[GroqClient] Falling back to mock AI completion:', err)
      return this.getMockCompletion(userPrompt)
    }
  }

  private getMockCompletion(prompt: string): string {
    if (prompt.includes('analyze') || prompt.includes('Extract')) {
      return JSON.stringify({
        summary: 'A high-impact summary covering the 5 biggest mistakes content creators make when building social campaigns in 2026.',
        topics: ['Content Creation', 'Social Strategy', 'Creator Automation', 'Video Production', 'Audience Growth'],
        hooks: [
          '5 critical mistakes 90% of creators make in 2026',
          'Stop doing this if you want your videos to actually convert',
          'The exact workflow top 1% creators use to post 5x faster'
        ],
        tone: 'Informative, Authoritative, Actionable',
        keywords: ['creatoros', 'content strategy', 'video automation', 'postiz', 'growth'],
        targetAudience: 'Digital creators, solopreneurs, and video producers',
        callToAction: 'Save this guide and try CreatorOS for your next upload.'
      })
    }

    return JSON.stringify({
      instagram: {
        hook: '5 mistakes every creator makes in 2026 🚨',
        caption: 'Building a social audience isn\'t about working 80 hours a week—it\'s about having an autonomous workflow.\n\nHere are 5 mistakes holding your channel back:\n1. Creating without repurposing\n2. Manual scheduling burnout\n3. Ignoring hook retention\n4. Inconsistent platform formatting\n5. No automated distribution\n\nWhich of these are you fixing today?',
        hashtags: ['#creatoros', '#contentcreation', '#videomarketing', '#creatoreconomy', '#automation'],
        cta: 'Save this post for your next campaign! 📌'
      },
      linkedin: {
        hook: 'The biggest bottleneck for modern content creators isn\'t ideation—it\'s execution velocity.',
        caption: 'In 2026, top-performing creators aren\'t working longer hours. They are turning single videos into multi-platform campaigns automatically.\n\nHere is the 5-step framework we engineered for CreatorOS:\n\n• Video-to-text transcription via Groq Whisper\n• AI-driven hook and topic extraction\n• Platform-native adaptation for LinkedIn & Bluesky\n• One-click Postiz API scheduling\n\nHow is your team streamlining distribution this quarter?',
        cta: 'Repost if you found this valuable ♻️'
      },
      bluesky: {
        hook: 'Stop manually retyping your video captions for every social platform.',
        caption: 'Turn 1 raw video into platform-ready posts for Bluesky, Instagram & LinkedIn in under 10 seconds. Powered by Groq Whisper & Postiz.',
        cta: 'Try CreatorOS MVP today ⚡️'
      }
    })
  }
}
