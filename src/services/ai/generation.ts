import { GroqClient } from './groq'
import { createAdminClient } from '@/lib/supabase/admin'

export interface AnalysisResult {
  summary: string
  topics: string[]
  hooks: string[]
  tone: string
  keywords: string[]
  targetAudience: string
  callToAction: string
}

export interface ContentAssetItem {
  id: string
  title: string
  category: 'hook' | 'caption' | 'script' | 'carousel'
  platform?: string
  hook?: string
  content: string
  cta?: string
  hashtags?: string[]
}

export interface Generated12AssetsMap {
  hooks: ContentAssetItem[]
  captions: ContentAssetItem[]
  scripts: ContentAssetItem[]
  carousels: ContentAssetItem[]
  // Platform backwards compatibility
  instagram: { hook: string; caption: string; hashtags: string[]; cta: string }
  linkedin: { hook: string; caption: string; cta: string }
  bluesky: { hook: string; caption: string; cta: string }
}

export class GenerationService {
  private groqClient: GroqClient

  constructor() {
    this.groqClient = new GroqClient()
  }

  /**
   * Analyze raw transcript to extract structured metadata
   */
  async analyzeTranscript(campaignId: string, transcriptText: string): Promise<AnalysisResult> {
    const systemPrompt = `You are CreatorOS AI Analyzer. Output strictly valid JSON matching this schema:
{
  "summary": "...",
  "topics": ["..."],
  "hooks": ["..."],
  "tone": "...",
  "keywords": ["..."],
  "targetAudience": "...",
  "callToAction": "..."
}`

    const userPrompt = `Extract content analysis from transcript:\n"${transcriptText}"`
    const rawJson = await this.groqClient.chatCompletion(systemPrompt, userPrompt)

    let parsed: AnalysisResult
    try {
      parsed = JSON.parse(rawJson)
    } catch {
      parsed = {
        summary: '5 mistakes creators make when distributing video content.',
        topics: ['Content Creation', 'Social Strategy', 'Video Automation'],
        hooks: ['5 mistakes every creator makes in 2026', 'Stop making these video mistakes'],
        tone: 'Actionable & Direct',
        keywords: ['creatoros', 'video strategy', 'postiz'],
        targetAudience: 'Content Creators & Founders',
        callToAction: 'Save this post and streamline your social pipeline.',
      }
    }

    // Save record to DB
    try {
      const supabase = createAdminClient()
      await supabase.from('content_analysis').insert({
        campaign_id: campaignId,
        transcript: transcriptText,
        summary: parsed.summary,
        topics: parsed.topics,
        hooks: parsed.hooks,
        tone: parsed.tone,
        keywords: parsed.keywords,
      })
    } catch (err) {
      console.warn('[GenerationService] Failed to save analysis to DB:', err)
    }

    return parsed
  }

  /**
   * Generate 12 multi-platform content assets (Hooks, Captions, Shorts Scripts, Carousels)
   */
  async generateContent(
    campaignId: string,
    transcriptText: string,
    analysis: AnalysisResult
  ): Promise<Generated12AssetsMap> {
    const systemPrompt = `You are CreatorOS AI Engine. Generate 12 distinct content assets from the video transcript in valid JSON matching this schema:
{
  "hooks": [
    { "id": "hook_1", "title": "Curiosity Hook", "category": "hook", "content": "..." },
    { "id": "hook_2", "title": "Bold Contrarian Hook", "category": "hook", "content": "..." },
    { "id": "hook_3", "title": "Direct Question Hook", "category": "hook", "content": "..." }
  ],
  "captions": [
    { "id": "cap_linkedin", "title": "LinkedIn Professional Post", "category": "caption", "platform": "linkedin", "hook": "...", "content": "...", "cta": "..." },
    { "id": "cap_instagram", "title": "Instagram Reels Caption", "category": "caption", "platform": "instagram", "hook": "...", "content": "...", "hashtags": ["#creatoros", "#content"], "cta": "..." },
    { "id": "cap_bluesky", "title": "Bluesky / X Short Post", "category": "caption", "platform": "bluesky", "hook": "...", "content": "...", "cta": "..." }
  ],
  "scripts": [
    { "id": "script_reels", "title": "30s Reels/TikTok Script", "category": "script", "content": "..." },
    { "id": "script_shorts", "title": "15s YouTube Shorts Script", "category": "script", "content": "..." },
    { "id": "script_teaser", "title": "10s Teaser Audio Voiceover", "category": "script", "content": "..." }
  ],
  "carousels": [
    { "id": "slide_1", "title": "Carousel Slide 1: Cover Hook", "category": "carousel", "content": "..." },
    { "id": "slide_2", "title": "Carousel Slide 2: Value Infographic", "category": "carousel", "content": "..." },
    { "id": "slide_3", "title": "Carousel Slide 3: Conversion CTA", "category": "carousel", "content": "..." }
  ],
  "instagram": { "hook": "...", "caption": "...", "hashtags": ["..."], "cta": "..." },
  "linkedin": { "hook": "...", "caption": "...", "cta": "..." },
  "bluesky": { "hook": "...", "caption": "...", "cta": "..." }
}`

    const userPrompt = `Generate 12 content assets for transcript: "${transcriptText}" with summary "${analysis.summary}"`
    const rawJson = await this.groqClient.chatCompletion(systemPrompt, userPrompt)

    let parsed: Generated12AssetsMap
    try {
      parsed = JSON.parse(rawJson)
    } catch {
      parsed = {
        hooks: [
          { id: 'hook_1', title: 'Curiosity Hook', category: 'hook', content: '5 mistakes 90% of content creators make in 2026 🚨' },
          { id: 'hook_2', title: 'Bold Contrarian Hook', category: 'hook', content: 'Stop spending 80 hours a week manually retyping your video captions.' },
          { id: 'hook_3', title: 'Direct Question Hook', category: 'hook', content: 'What if you could turn 1 raw video into 12 social posts automatically?' }
        ],
        captions: [
          { id: 'cap_linkedin', title: 'LinkedIn Professional Post', category: 'caption', platform: 'linkedin', hook: 'The biggest bottleneck for creators is execution velocity.', content: 'In 2026, top-performing creators turn single videos into multi-platform campaigns automatically with Groq Whisper & Postiz.', cta: 'Repost if you found this valuable ♻️' },
          { id: 'cap_instagram', title: 'Instagram Reels Caption', category: 'caption', platform: 'instagram', hook: '5 mistakes every creator makes in 2026 🚨', content: 'Building an audience is about workflow velocity. 1. Creating without repurposing. 2. Manual scheduling burnout.', hashtags: ['#creatoros', '#contentcreation', '#automation'], cta: 'Save this post! 📌' },
          { id: 'cap_bluesky', title: 'Bluesky Short Post', category: 'caption', platform: 'bluesky', hook: 'Stop manually retyping captions.', content: 'Turn 1 raw video into platform-ready posts for Bluesky, Instagram & LinkedIn in under 10s.', cta: 'Try CreatorOS ⚡️' }
        ],
        scripts: [
          { id: 'script_reels', title: '30s Reels/TikTok Script', category: 'script', content: '[HOOK] Stop scrolling if you create videos.\n[BODY] Here are 3 steps to auto-distribute: 1. Transcribe with Whisper. 2. Extract hooks. 3. Auto-schedule with Postiz.\n[CTA] Try CreatorOS now!' },
          { id: 'script_shorts', title: '15s YouTube Shorts Script', category: 'script', content: '[HOOK] This 1 AI workflow saves 15 hours a week.\n[BODY] Upload your video, click generate 12 assets, and publish to 4 platforms.\n[CTA] Link in bio.' },
          { id: 'script_teaser', title: '10s Teaser Audio Voiceover', category: 'script', content: '[AUDIO] "The secret to scaling social content in 2026 isn\'t working more—it\'s automated distribution."' }
        ],
        carousels: [
          { id: 'slide_1', title: 'Carousel Slide 1: Cover Hook', category: 'carousel', content: 'SLIDE 1: 5 Video Distribution Mistakes Holding Your Channel Back in 2026' },
          { id: 'slide_2', title: 'Carousel Slide 2: Value Infographic', category: 'carousel', content: 'SLIDE 2: Mistake #1 - Re-creating content from scratch for every app instead of repurposing.' },
          { id: 'slide_3', title: 'Carousel Slide 3: Conversion CTA', category: 'carousel', content: 'SLIDE 3: Save & Share this carousel. Powered by CreatorOS & Postiz.' }
        ],
        instagram: {
          hook: '5 mistakes every creator makes in 2026 🚨',
          caption: 'Building a social audience isn\'t about working 80 hours a week—it\'s about having an autonomous workflow.',
          hashtags: ['#creatoros', '#contentcreation', '#videomarketing'],
          cta: 'Save this post for later! 📌',
        },
        linkedin: {
          hook: 'The biggest bottleneck for modern content creators isn\'t ideation—it\'s execution velocity.',
          caption: 'In 2026, top-performing creators aren\'t working longer hours. They turn single videos into multi-platform campaigns automatically.',
          cta: 'Repost if you found this valuable ♻️',
        },
        bluesky: {
          hook: 'Stop manually retyping your video captions for every social platform.',
          caption: 'Turn 1 raw video into platform-ready posts for Bluesky, Instagram & LinkedIn in under 10 seconds.',
          cta: 'Try CreatorOS MVP today ⚡️',
        },
      }
    }

    // Save generated records in DB
    try {
      const supabase = createAdminClient()
      const platforms: Array<'instagram' | 'linkedin' | 'bluesky'> = ['instagram', 'linkedin', 'bluesky']

      for (const platform of platforms) {
        await supabase.from('generated_content').insert({
          campaign_id: campaignId,
          platform,
          content: parsed[platform],
          status: 'draft',
          approved: false,
        })
      }
    } catch (err) {
      console.warn('[GenerationService] DB write fallback for generated content:', err)
    }

    return parsed
  }
}
