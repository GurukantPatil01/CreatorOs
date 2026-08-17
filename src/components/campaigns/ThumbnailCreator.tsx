'use client'

import { useState, useEffect, useRef } from 'react'
import { Sparkles, Image as ImageIcon, Check, RefreshCw, Camera, Upload, Loader2, Monitor, Smartphone, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThumbnailConcept } from '@/services/ai/thumbnail'

interface ThumbnailCreatorProps {
  campaignName?: string
  transcript?: string
  sourceUrl?: string
  onAttach?: (thumbnail: ThumbnailConcept) => void
}

export function ThumbnailCreator({ campaignName, transcript, sourceUrl, onAttach }: ThumbnailCreatorProps) {
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isAttached, setIsAttached] = useState(false)

  // Customizer state
  const [title, setTitle] = useState(campaignName ? campaignName.toUpperCase() : 'VIRAL CREATOR MASTERCLASS')
  const [subtitle, setSubtitle] = useState('REPURPOSE 1 VIDEO INTO 12 MULTI-CHANNEL POSTS')
  const [badgeText, setBadgeText] = useState('MUST WATCH 🚨')
  const [themeColor, setThemeColor] = useState('#FFDE59')
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9')
  const [bgImage, setBgImage] = useState<string | undefined>(undefined)
  const [aiImagePrompt, setAiImagePrompt] = useState<string | undefined>(undefined)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Auto-generate Best AI Thumbnail on mount or topic change
  const fetchBestAiThumbnail = async () => {
    setIsAiLoading(true)
    try {
      const res = await fetch('/api/ai/generate-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignName,
          transcript,
        }),
      })

      const data = await res.json()
      if (data.success && data.thumbnail) {
        const t = data.thumbnail
        if (t.title) setTitle(t.title)
        if (t.subtitle) setSubtitle(t.subtitle)
        if (t.badgeText) setBadgeText(t.badgeText)
        if (t.themeColor) setThemeColor(t.themeColor)
        if (t.imageUrl) setBgImage(t.imageUrl)
        if (t.imagePrompt) setAiImagePrompt(t.imagePrompt)
      }
    } catch (err) {
      console.error('Failed to auto-generate AI thumbnail:', err)
    } finally {
      setIsAiLoading(false)
    }
  }

  useEffect(() => {
    fetchBestAiThumbnail()
  }, [campaignName])

  // Extract Video Frame Snapshot
  const handleCaptureVideoSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current

    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg')
      setBgImage(dataUrl)
    }
  }

  // Handle File Upload
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setBgImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAttachClick = () => {
    setIsAttached(true)
    if (onAttach) {
      onAttach({
        id: `thumb_${Date.now()}`,
        title,
        subtitle,
        badgeText,
        themeColor,
        textColor: '#000000',
        aspectRatio,
        layout: 'bold-header',
        backgroundImage: bgImage,
      })
    }
  }

  return (
    <div className="space-y-6 bg-white p-6 border-3 border-black shadow-[6px_6px_0px_0px_#000]">
      {/* Hidden elements for video frame extraction */}
      <canvas ref={canvasRef} className="hidden" />
      {sourceUrl && sourceUrl.startsWith('http') && (
        <video
          ref={videoRef}
          src={sourceUrl}
          crossOrigin="anonymous"
          className="hidden"
          preload="metadata"
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-black pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 stroke-[3] text-black" />
            <h2 className="text-sm font-black uppercase font-mono text-black">AUTOMATED AI THUMBNAIL GENERATOR</h2>
            <span className="creator-badge creator-badge-success text-[10px]">AI POWERED</span>
          </div>
          <p className="text-xs font-bold text-black mt-1">CreatorOS analyzes your video/topic and automatically generates the best high-CTR visual thumbnail & headline.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchBestAiThumbnail}
            disabled={isAiLoading}
            className="creator-button-primary text-xs py-2 px-4 shadow-[3px_3px_0px_0px_#000]"
          >
            {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin stroke-[3]" /> : <Sparkles className="w-4 h-4 stroke-[3]" />}
            <span>{isAiLoading ? 'GENERATING AI THUMBNAIL...' : '⚡ RE-GENERATE BEST AI THUMBNAIL'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Prompt Info & Customizer Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Image Generation Status */}
          <div className="p-4 border-2 border-black bg-[#FFDE59] shadow-[3px_3px_0px_0px_#000] space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono font-black uppercase text-black">🤖 AI VISUAL SCENE CONCEPT</p>
              <span className="text-[10px] font-mono font-black bg-white px-1.5 py-0.5 border border-black uppercase">AUTO GENERATED</span>
            </div>
            <p className="text-xs font-bold text-black italic">
              "{aiImagePrompt || `Cinematic visual scene analyzing subject: ${campaignName || 'Viral Content'}`}"
            </p>
            <div className="flex items-center gap-2 pt-1">
              {sourceUrl && sourceUrl.startsWith('http') && (
                <button
                  type="button"
                  onClick={handleCaptureVideoSnapshot}
                  className="creator-button-secondary text-[11px] py-1 px-2 bg-white"
                >
                  <Camera className="w-3.5 h-3.5 stroke-[3]" />
                  <span>📸 USE VIDEO SNAPSHOT FRAME</span>
                </button>
              )}
              <label className="creator-button-secondary cursor-pointer text-[11px] py-1 px-2 bg-white border border-black flex items-center gap-1 font-mono font-black">
                <Upload className="w-3.5 h-3.5 stroke-[3]" />
                <span>UPLOAD IMAGE</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Controls Form */}
          <div className="space-y-3 p-4 border-2 border-black bg-[#F4F4F0] shadow-[3px_3px_0px_0px_#000]">
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-black uppercase text-black">AI HEADLINE TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border-2 border-black p-2 text-xs text-black font-black focus:outline-none shadow-[2px_2px_0px_0px_#000]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-black uppercase text-black">AI SUBTITLE HOOK</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-white border-2 border-black p-2 text-xs text-black font-bold focus:outline-none shadow-[2px_2px_0px_0px_#000]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-black uppercase text-black">VIRAL BADGE</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full bg-white border-2 border-black p-2 text-xs text-black font-black focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-black uppercase text-black">ASPECT RATIO</label>
                <div className="flex border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]">
                  <button
                    onClick={() => setAspectRatio('16:9')}
                    className={cn('flex-1 py-1.5 text-xs font-black flex items-center justify-center gap-1', aspectRatio === '16:9' ? 'bg-[#FFDE59]' : 'hover:bg-[#F4F4F0]')}
                  >
                    <Monitor className="w-3.5 h-3.5 stroke-[3]" /> 16:9
                  </button>
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={cn('flex-1 py-1.5 text-xs font-black flex items-center justify-center gap-1 border-l border-black', aspectRatio === '9:16' ? 'bg-[#FFDE59]' : 'hover:bg-[#F4F4F0]')}
                  >
                    <Smartphone className="w-3.5 h-3.5 stroke-[3]" /> 9:16
                  </button>
                </div>
              </div>
            </div>

            {/* Color Palette Picker */}
            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-mono font-black uppercase text-black">CANVAS THEME COLOR</label>
              <div className="flex items-center gap-2">
                {['#FFDE59', '#00E5FF', '#A3E635', '#FF90E8', '#FFFFFF'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setThemeColor(c)}
                    style={{ backgroundColor: c }}
                    className={cn(
                      'w-7 h-7 border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-transform',
                      themeColor === c && 'ring-2 ring-black scale-110'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live AI Generated Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black uppercase text-black">AI GENERATED VISUAL THUMBNAIL</span>
              <span className="text-[10px] font-mono font-black uppercase bg-[#00E5FF] px-2 py-0.5 border border-black">
                {aspectRatio === '16:9' ? '16:9 YouTube / LinkedIn' : '9:16 Reels / Shorts'}
              </span>
            </div>

            {/* Canvas Box */}
            <div className="flex justify-center bg-[#F4F4F0] border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000] relative">
              {isAiLoading && (
                <div className="absolute inset-0 bg-white/90 z-30 flex items-center justify-center font-mono font-black text-xs text-black gap-2">
                  <Loader2 className="w-6 h-6 animate-spin stroke-[3]" />
                  <span>AI GENERATING VISUAL THUMBNAIL IMAGE...</span>
                </div>
              )}

              <div
                style={{
                  backgroundColor: themeColor,
                  backgroundImage: bgImage ? `url(${bgImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                className={cn(
                  'border-4 border-black p-6 flex flex-col justify-between relative overflow-hidden transition-all shadow-[6px_6px_0px_0px_#000]',
                  aspectRatio === '16:9' ? 'w-full max-w-[500px] h-[280px]' : 'w-[220px] h-[360px]'
                )}
              >
                {/* Background Dimmer overlay when background image is present */}
                {bgImage && <div className="absolute inset-0 bg-black/35 pointer-events-none" />}

                {/* Decorative Hatch Stripes Background when no image */}
                {!bgImage && <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:16px_16px] pointer-events-none" />}

                {/* Top Badge */}
                <div className="z-10 self-start">
                  <span className="bg-white text-black font-mono font-black text-xs px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] uppercase">
                    {badgeText || 'VIRAL BREAKTHROUGH'}
                  </span>
                </div>

                {/* Main Headline Card Overlay */}
                <div className="z-10 my-auto space-y-2">
                  <div className="bg-white border-3 border-black p-3.5 shadow-[4px_4px_0px_0px_#000]">
                    <h3 className="text-base sm:text-lg font-black text-black uppercase font-mono leading-tight tracking-tight">
                      {title || 'YOUR HEADLINE GOES HERE'}
                    </h3>
                  </div>
                  {subtitle && (
                    <div className="bg-black text-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_#000] inline-block">
                      <p className="text-xs font-mono font-bold uppercase">{subtitle}</p>
                    </div>
                  )}
                </div>

                {/* Bottom Branding Tag */}
                <div className="z-10 flex items-center justify-between border-t-2 border-black pt-2 bg-white/95 p-1 border">
                  <span className="text-[10px] font-mono font-black uppercase text-black">
                    POWERED BY CREATOROS
                  </span>
                  <span className="text-[10px] font-mono font-black uppercase text-black bg-[#A3E635] px-1.5 py-0.5 border border-black">
                    POSTIZ AI
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleAttachClick}
              disabled={isAttached}
              className="creator-button-primary text-xs py-2.5 px-6 shadow-[3px_3px_0px_0px_#000]"
            >
              {isAttached ? <Check className="w-4 h-4 stroke-[3]" /> : <ImageIcon className="w-4 h-4 stroke-[3]" />}
              <span>{isAttached ? 'THUMBNAIL ATTACHED!' : 'ATTACH AI THUMBNAIL TO CAMPAIGN'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
