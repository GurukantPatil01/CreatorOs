'use client'

import { useState, useRef } from 'react'
import { Sparkles, Image as ImageIcon, Check, RefreshCw, Camera, Upload, Loader2, Monitor, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateThumbnailConcepts, ThumbnailConcept } from '@/services/ai/thumbnail'

interface ThumbnailCreatorProps {
  campaignName?: string
  sourceUrl?: string
  onAttach?: (thumbnail: ThumbnailConcept) => void
}

export function ThumbnailCreator({ campaignName, sourceUrl, onAttach }: ThumbnailCreatorProps) {
  const [concepts, setConcepts] = useState<ThumbnailConcept[]>(() => generateThumbnailConcepts(campaignName))
  const [selectedConcept, setSelectedConcept] = useState<ThumbnailConcept>(concepts[0])
  const [isAttached, setIsAttached] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isAiGeneratingImage, setIsAiGeneratingImage] = useState(false)

  // Customizer state
  const [title, setTitle] = useState(selectedConcept.title)
  const [subtitle, setSubtitle] = useState(selectedConcept.subtitle)
  const [badgeText, setBadgeText] = useState(selectedConcept.badgeText)
  const [themeColor, setThemeColor] = useState(selectedConcept.themeColor)
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>(selectedConcept.aspectRatio)
  const [bgImage, setBgImage] = useState<string | undefined>(selectedConcept.backgroundImage)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleSelectConcept = (concept: ThumbnailConcept) => {
    setSelectedConcept(concept)
    setTitle(concept.title)
    setSubtitle(concept.subtitle)
    setBadgeText(concept.badgeText)
    setThemeColor(concept.themeColor)
    setAspectRatio(concept.aspectRatio)
    if (concept.backgroundImage) setBgImage(concept.backgroundImage)
  }

  const handleRegenerate = () => {
    setIsRegenerating(true)
    setTimeout(() => {
      const fresh = generateThumbnailConcepts(campaignName)
      setConcepts(fresh)
      setSelectedConcept(fresh[0])
      setTitle(fresh[0].title)
      setSubtitle(fresh[0].subtitle)
      setBadgeText(fresh[0].badgeText)
      setThemeColor(fresh[0].themeColor)
      setIsRegenerating(false)
    }, 400)
  }

  // 1. AI Generate Background Image via AI Image Engine
  const handleAiGenerateImage = () => {
    setIsAiGeneratingImage(true)
    const promptText = `youtube thumbnail background, high contrast, vibrant colors, cinematic photography, theme of ${campaignName || title || 'content creator'}`
    const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?width=1280&height=720&nologo=true&seed=${Date.now()}`
    
    // Preload image
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = aiImageUrl
    img.onload = () => {
      setBgImage(aiImageUrl)
      setIsAiGeneratingImage(false)
    }
    img.onerror = () => {
      setIsAiGeneratingImage(false)
    }
  }

  // 2. Extract Video Frame Snapshot
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

  // 3. Handle File Upload
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
        ...selectedConcept,
        title,
        subtitle,
        badgeText,
        themeColor,
        aspectRatio,
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
            <Sparkles className="w-5 h-5 stroke-[3] text-black" />
            <h2 className="text-sm font-black uppercase font-mono text-black">AI THUMBNAIL STUDIO & VIDEO SNAPSHOT</h2>
            <span className="creator-badge creator-badge-success text-[10px]">NEO-BRUTALIST CANVAS</span>
          </div>
          <p className="text-xs font-bold text-black mt-1">Generate AI visual background images, capture video frame snapshots, or style high-CTR text overlays.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="creator-button-secondary text-xs"
          >
            <RefreshCw className={cn('w-4 h-4 stroke-[3]', isRegenerating && 'animate-spin')} />
            <span>Regenerate Concepts</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Controls & AI Image Generators */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Image Generation & Video Snapshot Actions */}
          <div className="p-4 border-2 border-black bg-[#FFDE59] shadow-[3px_3px_0px_0px_#000] space-y-3">
            <p className="text-xs font-mono font-black uppercase text-black">⚡ THUMBNAIL BACKGROUND SOURCES</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={handleAiGenerateImage}
                disabled={isAiGeneratingImage}
                className="creator-button-primary text-xs justify-center py-2 bg-white"
              >
                {isAiGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin stroke-[3]" /> : <Sparkles className="w-4 h-4 stroke-[3]" />}
                <span>{isAiGeneratingImage ? 'GENERATING AI IMAGE...' : '⚡ AI GENERATE BACKGROUND IMAGE'}</span>
              </button>

              {sourceUrl && sourceUrl.startsWith('http') && (
                <button
                  type="button"
                  onClick={handleCaptureVideoSnapshot}
                  className="creator-button-secondary text-xs justify-center py-2 bg-white"
                >
                  <Camera className="w-4 h-4 stroke-[3]" />
                  <span>📸 CAPTURE VIDEO SNAPSHOT FRAME</span>
                </button>
              )}

              <label className="creator-button-secondary cursor-pointer text-xs justify-center py-2 bg-white border-2 border-black flex items-center gap-2 font-mono font-black">
                <Upload className="w-4 h-4 stroke-[3]" />
                <span>UPLOAD CUSTOM BACKGROUND IMAGE</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomImageUpload}
                  className="hidden"
                />
              </label>

              {bgImage && (
                <button
                  type="button"
                  onClick={() => setBgImage(undefined)}
                  className="text-[10px] font-mono font-black text-black underline text-right pt-1"
                >
                  REMOVE BACKGROUND IMAGE (USE SOLID COLOR)
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-black uppercase text-black">Preset AI Concepts:</label>
            <div className="space-y-2">
              {concepts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectConcept(c)}
                  style={{ backgroundColor: c.themeColor }}
                  className={cn(
                    'w-full text-left p-3 border-2 border-black font-mono shadow-[2.5px_2.5px_0px_0px_#000] transition-all',
                    selectedConcept.id === c.id ? 'ring-3 ring-black shadow-[4px_4px_0px_0px_#000]' : 'hover:translate-x-0.5'
                  )}
                >
                  <p className="text-[10px] font-black uppercase text-black bg-white px-1.5 py-0.5 border border-black inline-block mb-1">
                    {c.badgeText}
                  </p>
                  <p className="text-xs font-black text-black truncate">{c.title}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Controls Form */}
          <div className="space-y-3 p-4 border-2 border-black bg-[#F4F4F0] shadow-[3px_3px_0px_0px_#000]">
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-black uppercase text-black">HEADLINE TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border-2 border-black p-2 text-xs text-black font-black focus:outline-none shadow-[2px_2px_0px_0px_#000]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-black uppercase text-black">SUBTITLE CAPTION</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-white border-2 border-black p-2 text-xs text-black font-bold focus:outline-none shadow-[2px_2px_0px_0px_#000]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-black uppercase text-black">BADGE TEXT</label>
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

        {/* Right Column: Live Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black uppercase text-black">LIVE THUMBNAIL CANVAS PREVIEW</span>
              <span className="text-[10px] font-mono font-black uppercase bg-[#00E5FF] px-2 py-0.5 border border-black">
                {aspectRatio === '16:9' ? '16:9 YouTube / LinkedIn' : '9:16 Reels / Shorts'}
              </span>
            </div>

            {/* Canvas Box */}
            <div className="flex justify-center bg-[#F4F4F0] border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
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
                {bgImage && <div className="absolute inset-0 bg-black/30 pointer-events-none" />}

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
                <div className="z-10 flex items-center justify-between border-t-2 border-black pt-2 bg-white/90 p-1 border">
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
              className="creator-button-primary text-xs py-2.5 px-6"
            >
              {isAttached ? <Check className="w-4 h-4 stroke-[3]" /> : <ImageIcon className="w-4 h-4 stroke-[3]" />}
              <span>{isAttached ? 'THUMBNAIL ATTACHED!' : 'ATTACH TO POSTIZ CAMPAIGN'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
