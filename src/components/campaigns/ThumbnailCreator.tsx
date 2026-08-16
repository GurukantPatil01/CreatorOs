'use client'

import { useState } from 'react'
import { Sparkles, Download, Check, RefreshCw, Image, Layers, Smartphone, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateThumbnailConcepts, ThumbnailConcept } from '@/services/ai/thumbnail'

interface ThumbnailCreatorProps {
  campaignName?: string
  onAttach?: (thumbnail: ThumbnailConcept) => void
}

export function ThumbnailCreator({ campaignName, onAttach }: ThumbnailCreatorProps) {
  const [concepts, setConcepts] = useState<ThumbnailConcept[]>(() => generateThumbnailConcepts(campaignName))
  const [selectedConcept, setSelectedConcept] = useState<ThumbnailConcept>(concepts[0])
  const [isAttached, setIsAttached] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  // Customizer state
  const [title, setTitle] = useState(selectedConcept.title)
  const [subtitle, setSubtitle] = useState(selectedConcept.subtitle)
  const [badgeText, setBadgeText] = useState(selectedConcept.badgeText)
  const [themeColor, setThemeColor] = useState(selectedConcept.themeColor)
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>(selectedConcept.aspectRatio)

  const handleSelectConcept = (concept: ThumbnailConcept) => {
    setSelectedConcept(concept)
    setTitle(concept.title)
    setSubtitle(concept.subtitle)
    setBadgeText(concept.badgeText)
    setThemeColor(concept.themeColor)
    setAspectRatio(concept.aspectRatio)
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
      })
    }
  }

  return (
    <div className="space-y-6 bg-white p-6 border-3 border-black shadow-[6px_6px_0px_0px_#000]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-black pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 stroke-[3] text-black" />
            <h2 className="text-sm font-black uppercase font-mono text-black">AI THUMBNAIL STUDIO</h2>
            <span className="creator-badge creator-badge-success text-[10px]">NEO-BRUTALIST CANVAS</span>
          </div>
          <p className="text-xs font-bold text-black mt-1">Design high-CTR video thumbnail covers with bold text overlays.</p>
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
        {/* Left Column: Preset Concepts & Customizer Controls */}
        <div className="lg:col-span-5 space-y-4">
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

        {/* Right Column: Live Neo-Brutalist Canvas Preview */}
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
                style={{ backgroundColor: themeColor }}
                className={cn(
                  'border-4 border-black p-6 flex flex-col justify-between relative overflow-hidden transition-all shadow-[6px_6px_0px_0px_#000]',
                  aspectRatio === '16:9' ? 'w-full max-w-[500px] h-[280px]' : 'w-[220px] h-[360px]'
                )}
              >
                {/* Decorative Hatch Stripes Background */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:16px_16px] pointer-events-none" />

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
                      {title || 'YOUR headline GOES HERE'}
                    </h3>
                  </div>
                  {subtitle && (
                    <div className="bg-black text-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_#000] inline-block">
                      <p className="text-xs font-mono font-bold uppercase">{subtitle}</p>
                    </div>
                  )}
                </div>

                {/* Bottom Branding Tag */}
                <div className="z-10 flex items-center justify-between border-t-2 border-black pt-2">
                  <span className="text-[10px] font-mono font-black uppercase text-black bg-white px-1.5 py-0.5 border border-black">
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
              {isAttached ? <Check className="w-4 h-4 stroke-[3]" /> : <Image className="w-4 h-4 stroke-[3]" />}
              <span>{isAttached ? 'THUMBNAIL ATTACHED!' : 'ATTACH TO POSTIZ CAMPAIGN'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
