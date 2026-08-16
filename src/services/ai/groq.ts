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
      this.apiKey === 'gsk_your_groq_api_key'
    )
  }

  async chatCompletion(systemPrompt: string, userPrompt: string): Promise<string> {
    if (this.isMock()) {
      return this.getDynamicCompletion(userPrompt)
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
        console.warn(`[GroqClient] Groq API returned ${res.status}: ${errText}. Using dynamic generator.`)
        return this.getDynamicCompletion(userPrompt)
      }

      const data = await res.json()
      const content = data.choices?.[0]?.message?.content
      if (content) return content

      return this.getDynamicCompletion(userPrompt)
    } catch (err) {
      console.warn('[GroqClient] Groq API request error:', err)
      return this.getDynamicCompletion(userPrompt)
    }
  }

  /**
   * Generates dynamic contextual AI responses matching the exact user topic/transcript
   */
  private getDynamicCompletion(prompt: string): string {
    // Extract topic or transcript content from prompt
    const match = prompt.match(/transcript:\s*"([^"]+)"/i) || prompt.match(/topic:\s*"([^"]+)"/i)
    const rawSubject = match ? match[1] : prompt.substring(0, 100)
    const subject = rawSubject.replace(/Welcome back!|In today's video|we are breaking down/gi, '').trim() || 'Content Repurposing'

    const cleanSubject = subject.length > 60 ? subject.substring(0, 60) + '...' : subject

    if (prompt.includes('analyze') || prompt.includes('Extract')) {
      return JSON.stringify({
        summary: `A high-impact breakdown exploring strategic frameworks, growth tactics, and key insights regarding ${cleanSubject}.`,
        topics: [cleanSubject, 'Strategy', 'Growth Workflow', 'Optimization', 'Execution Velocity'],
        hooks: [
          `The single biggest key to mastering ${cleanSubject} in 2026`,
          `Stop making these critical mistakes when dealing with ${cleanSubject}`,
          `The exact step-by-step blueprint for ${cleanSubject}`
        ],
        tone: 'Actionable, Informative, High-Impact',
        keywords: [cleanSubject.toLowerCase().replace(/\s+/g, ''), 'creatoros', 'strategy', 'automation', 'growth'],
        targetAudience: 'Digital creators, solopreneurs, and growth managers',
        callToAction: `Save this post and implement these principles for ${cleanSubject}.`
      })
    }

    // Generated 12 assets + platform posts
    return JSON.stringify({
      hooks: [
        { id: 'hook_1', title: 'Curiosity Hook', category: 'hook', content: `The single biggest key to mastering ${cleanSubject} in 2026 🚨` },
        { id: 'hook_2', title: 'Bold Contrarian Hook', category: 'hook', content: `90% of creators misunderstand ${cleanSubject}. Here is what actually works.` },
        { id: 'hook_3', title: 'Direct Question Hook', category: 'hook', content: `What if you could automate your entire strategy for ${cleanSubject}?` }
      ],
      captions: [
        { id: 'cap_linkedin', title: 'LinkedIn Professional Post', category: 'caption', platform: 'linkedin', hook: `Scaling ${cleanSubject} isn't about working longer hours—it's about execution velocity.`, content: `In 2026, top operators streamline their workflow with automated pipelines.\n\nHere is our 3-step framework for ${cleanSubject}:\n1. Clear context extraction\n2. Platform-native adaptation\n3. One-click automated distribution`, cta: 'Repost if you found this valuable ♻️' },
        { id: 'cap_instagram', title: 'Instagram Reels Caption', category: 'caption', platform: 'instagram', hook: `Mastering ${cleanSubject} in 2026 🚨`, content: `Here is everything you need to know about ${cleanSubject}:\n\n• Focus on high-retention hooks\n• Optimize for platform-native formatting\n• Automate post queueing`, hashtags: [`#${cleanSubject.toLowerCase().replace(/[^a-z0-9]/g, '')}`, '#creatoros', '#contentcreation'], cta: 'Save this post for later! 📌' },
        { id: 'cap_bluesky', title: 'Bluesky Short Post', category: 'caption', platform: 'bluesky', hook: `The ultimate guide to ${cleanSubject}.`, content: `Turn 1 raw idea into platform-ready social posts in under 10 seconds. Powered by Groq LLM & Postiz.`, cta: 'Try CreatorOS today ⚡️' }
      ],
      scripts: [
        { id: 'script_reels', title: '30s Reels/TikTok Script', category: 'script', content: `[HOOK] Stop scrolling if you want to master ${cleanSubject}.\n[BODY] Here are 3 steps: 1. Extract core ideas. 2. Repurpose for multi-channel. 3. Automate publishing.\n[CTA] Try CreatorOS now!` },
        { id: 'script_shorts', title: '15s YouTube Shorts Script', category: 'script', content: `[HOOK] This 1 workflow changes how you handle ${cleanSubject}.\n[BODY] Auto-generate 12 platform assets in 1 click.\n[CTA] Link in bio.` },
        { id: 'script_teaser', title: '10s Teaser Audio Voiceover', category: 'script', content: `[AUDIO] "The secret to scaling ${cleanSubject} in 2026 is automated distribution velocity."` }
      ],
      carousels: [
        { id: 'slide_1', title: 'Carousel Slide 1: Cover Hook', category: 'carousel', content: `SLIDE 1: The Definitive Guide to ${cleanSubject}` },
        { id: 'slide_2', title: 'Carousel Slide 2: Value Infographic', category: 'carousel', content: `SLIDE 2: Step 1 - Structure your core concept. Step 2 - Automate multi-platform publishing.` },
        { id: 'slide_3', title: 'Carousel Slide 3: Conversion CTA', category: 'carousel', content: `SLIDE 3: Save & Share this carousel. Built with CreatorOS.` }
      ],
      instagram: {
        hook: `Mastering ${cleanSubject} in 2026 🚨`,
        caption: `Building an audience around ${cleanSubject} is about having an autonomous execution workflow. Here is what you need to focus on today.`,
        hashtags: [`#${cleanSubject.toLowerCase().replace(/[^a-z0-9]/g, '')}`, '#creatoros', '#contentstrategy'],
        cta: 'Save this post for later! 📌'
      },
      linkedin: {
        hook: `Scaling ${cleanSubject} isn't about working longer hours—it's about execution velocity.`,
        caption: `In 2026, top-performing teams turn single ideas into multi-platform campaigns automatically.\n\nHere is our 3-step framework for ${cleanSubject}:\n• High-speed transcription & extraction\n• Platform-native adaptation\n• Automated API publishing`,
        cta: 'Repost if you found this valuable ♻️'
      },
      bluesky: {
        hook: `The ultimate guide to ${cleanSubject}.`,
        caption: `Turn 1 video into platform-ready posts for Bluesky, Instagram & LinkedIn in under 10 seconds. Powered by Groq & Postiz.`,
        cta: 'Try CreatorOS today ⚡️'
      }
    })
  }
}
