'use client'

import { useState } from 'react'
import { Edit3, RefreshCw, CheckCircle2, Check, Sparkles, Layers, Video, FileText, Zap, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThumbnailCreator } from '@/components/campaigns/ThumbnailCreator'

export interface PlatformPostContent {
  hook: string
  caption: string
  hashtags?: string[]
  cta: string
}

export interface ReviewContentCardProps {
  campaignId: string
  initialContent: any
  onApprove: (approvedPlatform: 'instagram' | 'linkedin' | 'bluesky' | 'youtube', content: PlatformPostContent) => void
  onRegenerate: () => void
}

export function ReviewContentCard({
  campaignId,
  initialContent,
  onApprove,
  onRegenerate,
}: ReviewContentCardProps) {
  const [activeCategory, setActiveCategory] = useState<'captions' | 'hooks' | 'scripts' | 'carousels' | 'thumbnails'>('captions')
  const [activePlatform, setActivePlatform] = useState<'bluesky' | 'instagram' | 'linkedin' | 'youtube'>('bluesky')
  const [contentMap, setContentMap] = useState(initialContent)
  const [isEditing, setIsEditing] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isApproved, setIsApproved] = useState(false)

  const currentContent = contentMap[activePlatform] || initialContent[activePlatform] || {
    hook: '5 mistakes every creator makes in 2026 🚨',
    caption: 'Building a social audience isn\'t about working 80 hours a week—it\'s about having an autonomous workflow.',
    cta: 'Try CreatorOS MVP today ⚡️',
  }

  const handleFieldChange = (field: keyof PlatformPostContent, value: string) => {
    setContentMap((prev: any) => ({
      ...prev,
      [activePlatform]: {
        ...prev[activePlatform],
        [field]: value,
      },
    }))
  }

  const handleRegenerateClick = async () => {
    setIsRegenerating(true)
    await onRegenerate()
    setIsRegenerating(false)
  }

  const handleApproveClick = async () => {
    setIsApproved(true)
    onApprove(activePlatform, currentContent)
  }

  const hooks = initialContent?.hooks || [
    { id: 'h1', title: 'Curiosity Hook', content: '5 mistakes 90% of content creators make in 2026 🚨' },
    { id: 'h2', title: 'Bold Contrarian Hook', content: 'Stop spending 80 hours a week manually retyping video captions.' },
    { id: 'h3', title: 'Direct Question Hook', content: 'What if you could turn 1 raw video into 12 social posts automatically?' },
  ]

  const scripts = initialContent?.scripts || [
    { id: 's1', title: '30s TikTok / Reels Script', content: '[HOOK] Stop scrolling if you make videos.\n[BODY] 1. Transcribe with Groq Whisper. 2. Extract hooks. 3. Auto-schedule with Postiz.\n[CTA] Try CreatorOS now!' },
    { id: 's2', title: '15s YouTube Shorts Script', content: '[HOOK] This 1 AI workflow saves 15 hours a week.\n[BODY] Upload 1 video, generate 12 assets, publish to 4 platforms.\n[CTA] Link in bio.' },
    { id: 's3', title: '10s Teaser Audio Voiceover', content: '[AUDIO] "The secret to scaling social content isn\'t working longer—it\'s execution velocity."' },
  ]

  const carousels = initialContent?.carousels || [
    { id: 'c1', title: 'Carousel Slide 1: Cover Hook', content: 'SLIDE 1: 5 Video Distribution Mistakes Holding Your Channel Back' },
    { id: 'c2', title: 'Carousel Slide 2: Value Infographic', content: 'SLIDE 2: Mistake #1 - Re-creating content from scratch for every app instead of repurposing.' },
    { id: 'c3', title: 'Carousel Slide 3: Conversion CTA', content: 'SLIDE 3: Save & Share this carousel. Powered by CreatorOS & Postiz.' },
  ]

  return (
    <div className="creator-card p-6 space-y-6 bg-white">
      {/* Header & 12 Asset Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-black pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-black uppercase font-mono">GENERATED CONTENT REVIEW</h2>
            <span className="creator-badge creator-badge-success text-[10px]">12 ASSETS GENERATED</span>
          </div>
          <p className="text-xs font-bold text-black">Review 12 repurposed content assets extracted from your source video.</p>
        </div>

        {/* Asset Category Tabs */}
        <div className="flex p-1 bg-[#F4F4F0] border-2 border-black shadow-[2px_2px_0px_0px_#000] flex-wrap gap-1">
          <button
            onClick={() => setActiveCategory('captions')}
            className={cn(
              'px-2.5 py-1 text-xs font-black uppercase transition-all flex items-center gap-1.5 border border-black',
              activeCategory === 'captions' ? 'bg-[#FFDE59] text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-white text-black hover:bg-white/80'
            )}
          >
            <FileText className="w-3.5 h-3.5 stroke-[3]" />
            <span>Captions (3)</span>
          </button>
          <button
            onClick={() => setActiveCategory('hooks')}
            className={cn(
              'px-2.5 py-1 text-xs font-black uppercase transition-all flex items-center gap-1.5 border border-black',
              activeCategory === 'hooks' ? 'bg-[#FFDE59] text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-white text-black hover:bg-white/80'
            )}
          >
            <Zap className="w-3.5 h-3.5 stroke-[3]" />
            <span>Hooks (3)</span>
          </button>
          <button
            onClick={() => setActiveCategory('scripts')}
            className={cn(
              'px-2.5 py-1 text-xs font-black uppercase transition-all flex items-center gap-1.5 border border-black',
              activeCategory === 'scripts' ? 'bg-[#A3E635] text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-white text-black hover:bg-white/80'
            )}
          >
            <Video className="w-3.5 h-3.5 stroke-[3]" />
            <span>Scripts (3)</span>
          </button>
          <button
            onClick={() => setActiveCategory('carousels')}
            className={cn(
              'px-2.5 py-1 text-xs font-black uppercase transition-all flex items-center gap-1.5 border border-black',
              activeCategory === 'carousels' ? 'bg-[#00E5FF] text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-white text-black hover:bg-white/80'
            )}
          >
            <Layers className="w-3.5 h-3.5 stroke-[3]" />
            <span>Carousels (3)</span>
          </button>
          <button
            onClick={() => setActiveCategory('thumbnails')}
            className={cn(
              'px-2.5 py-1 text-xs font-black uppercase transition-all flex items-center gap-1.5 border border-black',
              activeCategory === 'thumbnails' ? 'bg-[#FF90E8] text-black shadow-[2px_2px_0px_0px_#000]' : 'bg-white text-black hover:bg-white/80'
            )}
          >
            <ImageIcon className="w-3.5 h-3.5 stroke-[3]" />
            <span>Thumbnails (AI)</span>
          </button>
        </div>
      </div>

      {/* Category View */}
      {activeCategory === 'captions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono font-black uppercase text-black">Target Platform for Scheduling:</span>
            <div className="flex p-1 bg-[#F4F4F0] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              {(['bluesky', 'instagram', 'linkedin', 'youtube'] as const).map((platform) => (
                <button
                  key={platform}
                  onClick={() => setActivePlatform(platform)}
                  className={cn(
                    'px-3 py-1 text-xs font-black capitalize transition-all border border-black',
                    activePlatform === platform
                      ? 'bg-[#FFDE59] text-black shadow-[1.5px_1.5px_0px_0px_#000]'
                      : 'bg-white text-black'
                  )}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-black uppercase text-black">ATTENTION HOOK</label>
              {isEditing ? (
                <input
                  type="text"
                  value={currentContent.hook}
                  onChange={(e) => handleFieldChange('hook', e.target.value)}
                  className="w-full bg-white border-2 border-black p-2.5 text-xs text-black font-bold focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                />
              ) : (
                <div className="p-3 bg-[#FFDE59] border-2 border-black text-xs text-black font-black shadow-[3px_3px_0px_0px_#000]">
                  {currentContent.hook}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-black uppercase text-black">MAIN CAPTION</label>
              {isEditing ? (
                <textarea
                  rows={4}
                  value={currentContent.caption}
                  onChange={(e) => handleFieldChange('caption', e.target.value)}
                  className="w-full bg-white border-2 border-black p-3 text-xs text-black font-bold focus:outline-none leading-relaxed shadow-[2px_2px_0px_0px_#000]"
                />
              ) : (
                <div className="p-4 bg-[#F4F4F0] border-2 border-black text-xs text-black font-bold whitespace-pre-wrap leading-relaxed shadow-[3px_3px_0px_0px_#000]">
                  {currentContent.caption}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-black uppercase text-black">CALL TO ACTION (CTA)</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentContent.cta}
                    onChange={(e) => handleFieldChange('cta', e.target.value)}
                    className="w-full bg-white border-2 border-black p-2 text-xs text-black font-bold focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                  />
                ) : (
                  <div className="p-3 bg-[#00E5FF] border-2 border-black text-xs text-black font-black shadow-[2px_2px_0px_0px_#000]">
                    {currentContent.cta}
                  </div>
                )}
              </div>

              {currentContent.hashtags && currentContent.hashtags.length > 0 && (
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-black uppercase text-black">HASHTAGS</label>
                  <div className="p-3 bg-white border-2 border-black text-xs text-black font-mono font-black flex flex-wrap gap-1 shadow-[2px_2px_0px_0px_#000]">
                    {currentContent.hashtags.map((h: string, i: number) => (
                      <span key={i} className="bg-[#A3E635] px-1 border border-black">{h}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeCategory === 'hooks' && (
        <div className="grid grid-cols-1 gap-3">
          {hooks.map((h: any) => (
            <div key={h.id} className="p-4 bg-[#FFDE59] border-3 border-black space-y-1 shadow-[4px_4px_0px_0px_#000]">
              <p className="text-[11px] font-mono font-black uppercase text-black">{h.title}</p>
              <p className="text-xs text-black font-black">{h.content}</p>
            </div>
          ))}
        </div>
      )}

      {activeCategory === 'scripts' && (
        <div className="grid grid-cols-1 gap-3">
          {scripts.map((s: any) => (
            <div key={s.id} className="p-4 bg-[#A3E635] border-3 border-black space-y-2 shadow-[4px_4px_0px_0px_#000]">
              <p className="text-[11px] font-mono font-black uppercase text-black">{s.title}</p>
              <p className="text-xs text-black font-bold whitespace-pre-wrap leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      )}

      {activeCategory === 'carousels' && (
        <div className="grid grid-cols-1 gap-3">
          {carousels.map((c: any) => (
            <div key={c.id} className="p-4 bg-[#00E5FF] border-3 border-black space-y-2 shadow-[4px_4px_0px_0px_#000]">
              <p className="text-[11px] font-mono font-black uppercase text-black">{c.title}</p>
              <p className="text-xs text-black font-black">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {activeCategory === 'thumbnails' && (
        <ThumbnailCreator campaignName={currentContent.hook} />
      )}

      {/* Control Actions: Edit | Regenerate | Approve */}
      <div className="flex items-center justify-between pt-4 border-t-3 border-black">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="creator-button-secondary text-xs"
        >
          <Edit3 className="w-4 h-4 stroke-[3]" />
          <span>{isEditing ? 'DONE EDITING' : 'EDIT CONTENT'}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRegenerateClick}
            disabled={isRegenerating}
            className="creator-button-secondary text-xs disabled:opacity-50"
          >
            <RefreshCw className={cn('w-4 h-4 stroke-[3]', isRegenerating && 'animate-spin')} />
            <span>REGENERATE ASSETS</span>
          </button>

          <button
            onClick={handleApproveClick}
            disabled={isApproved}
            className="creator-button-primary text-xs"
          >
            {isApproved ? <Check className="w-4 h-4 stroke-[3]" /> : <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
            <span>{isApproved ? 'APPROVED!' : 'APPROVE & SCHEDULE POSTIZ'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}



