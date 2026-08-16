'use client'

import { useState } from 'react'
import { Upload, CheckCircle2, Loader2, ArrowRight, Sparkles, SlidersHorizontal, Calendar, Send, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReviewContentCard, PlatformPostContent } from '@/components/campaigns/ReviewContentCard'

const steps = [
  { id: 'upload', name: 'Upload Video', icon: Upload },
  { id: 'transcribe', name: 'Transcribe & Analyze', icon: Sparkles },
  { id: 'generate', name: 'Generate Content', icon: SlidersHorizontal },
  { id: 'review', name: 'Review & Edit', icon: CheckCircle2 },
  { id: 'schedule', name: 'Schedule Postiz', icon: Calendar },
]

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState('upload')
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [topicInput, setTopicInput] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // AI & Approval State
  const [campaignData, setCampaignData] = useState<{ campaignId: string; campaignName: string } | null>(null)
  const [transcript, setTranscript] = useState<string>('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [generatedPosts, setGeneratedPosts] = useState<any>(null)
  const [approvedPost, setApprovedPost] = useState<{ platform: string; content: PlatformPostContent } | null>(null)
  const [isAiProcessing, setIsAiProcessing] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduleResult, setScheduleResult] = useState<any>(null)
  const [schedulingError, setSchedulingError] = useState<string | null>(null)
  const [bskyHandle, setBskyHandle] = useState('')
  const [bskyPassword, setBskyPassword] = useState('')
  const [liToken, setLiToken] = useState('')
  const [liUrn, setLiUrn] = useState('')
  const [igAccountId, setIgAccountId] = useState('')
  const [igToken, setIgToken] = useState('')

  // Step 1: Upload handler
  const handleUploadSubmit = async (fileToUpload?: File | null, topicText?: string) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      if (fileToUpload) {
        formData.append('file', fileToUpload)
      } else if (topicText) {
        formData.append('topic', topicText)
      } else {
        setIsUploading(false)
        return
      }

      const res = await fetch('/api/campaigns/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success && data.campaign) {
        setCampaignData(data.campaign)
        setCurrentStep('transcribe')
        runAiPipeline(data.campaign.campaignId)
      }
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setIsUploading(false)
    }
  }

  // Step 2 & 3: Run AI Pipeline
  const runAiPipeline = async (campId: string) => {
    setIsAiProcessing(true)
    try {
      // Transcribe
      const txRes = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: campId }),
      })
      const txData = await txRes.json()
      const txText = txData.transcription?.transcript || 'Sample video transcript.'
      setTranscript(txText)

      // Analyze
      const anzRes = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: campId, transcript: txText }),
      })
      const anzData = await anzRes.json()
      setAnalysis(anzData.analysis)

      // Generate
      const genRes = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: campId, transcript: txText, analysis: anzData.analysis }),
      })
      const genData = await genRes.json()
      setGeneratedPosts(genData.generatedContent)

    } catch (err) {
      console.error('AI Pipeline error:', err)
    } finally {
      setIsAiProcessing(false)
    }
  }

  // Step 4: Handle Content Approval
  const handleContentApprove = async (platform: string, content: PlatformPostContent) => {
    setApprovedPost({ platform, content })
    try {
      await fetch('/api/campaigns/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaignData?.campaignId || 'cmp_demo',
          platform,
          content,
        }),
      })
    } catch (err) {
      console.error('Approval API call error:', err)
    }
    // Advance to Step 5 (Schedule)
    setCurrentStep('schedule')
  }

  // Step 5: Postiz Scheduling
  const handleScheduleSubmit = async () => {
    if (!approvedPost) return
    setIsScheduling(true)
    setSchedulingError(null)

    try {
      const fullText = `${approvedPost.content.hook}\n\n${approvedPost.content.caption}\n\n${approvedPost.content.cta}`
      const res = await fetch('/api/publishing/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaignData?.campaignId || 'cmp_demo',
          platform: approvedPost.platform,
          content: fullText,
          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
          blueskyHandle: bskyHandle,
          blueskyPassword: bskyPassword,
          linkedinToken: liToken,
          linkedinUrn: liUrn,
          instagramAccountId: igAccountId,
          instagramToken: igToken,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setScheduleResult(data.data)
      } else {
        setSchedulingError(data.error || 'Publishing failed. Unable to schedule this post.')
      }
    } catch (err: any) {
      setSchedulingError('Publishing failed. Unable to connect to publishing server.')
    } finally {
      setIsScheduling(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b-3 border-black pb-3">
        <h1 className="text-2xl font-black text-black uppercase tracking-tight font-mono">CREATE CAMPAIGN</h1>
        <p className="text-xs font-bold text-black">Transform one video into platform-ready social content.</p>
      </div>

      {/* Stepper Header */}
      <div className="creator-card p-4 bg-white">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => {
            const isCompleted = steps.findIndex((s) => s.id === currentStep) > idx
            const isCurrent = step.id === currentStep

            return (
              <div key={step.id} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-8 h-8 border-2 border-black flex items-center justify-center text-xs font-black shadow-[2px_2px_0px_0px_#000]',
                      isCompleted ? 'bg-[#A3E635] text-black' :
                      isCurrent ? 'bg-[#FFDE59] text-black' : 'bg-white text-black'
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : idx + 1}
                  </div>
                  <span className={cn(
                    'text-xs font-black uppercase hidden sm:inline',
                    isCurrent ? 'text-black font-extrabold' : 'text-black'
                  )}>
                    {step.name}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-4 sm:w-8 h-0.5 bg-black mx-1" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step 1: Upload */}
      {currentStep === 'upload' && (
        <div className="creator-card p-8 space-y-6 bg-white">
          <div className="space-y-1">
            <h2 className="text-base font-black text-black uppercase">1. SELECT SOURCE VIDEO</h2>
            <p className="text-xs font-bold text-black">Upload an MP4 or MOV file to trigger transcription and content extraction.</p>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragActive(false)
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0]
                setSelectedFile(file)
                handleUploadSubmit(file)
              }
            }}
            className={cn(
              'border-3 border-dashed border-black p-10 text-center cursor-pointer transition-all shadow-[4px_4px_0px_0px_#000]',
              dragActive ? 'bg-[#FFDE59]' : 'bg-[#F4F4F0] hover:bg-[#FFE600]/20'
            )}
          >
            <div className="w-14 h-14 border-2 border-black bg-[#FFDE59] text-black flex items-center justify-center mx-auto mb-3 shadow-[2px_2px_0px_0px_#000]">
              {isUploading ? <Loader2 className="w-7 h-7 animate-spin stroke-[3]" /> : <Upload className="w-7 h-7 stroke-[3]" />}
            </div>
            <p className="text-sm font-black text-black uppercase mb-1">
              {selectedFile ? selectedFile.name : 'DROP YOUR VIDEO HERE'}
            </p>
            <p className="text-xs font-bold text-black mb-4">MP4, MOV (max 100MB for MVP demo)</p>
            
            <label className="creator-button-secondary cursor-pointer text-xs">
              <span>{isUploading ? 'UPLOADING...' : 'BROWSE FILES'}</span>
              <input
                type="file"
                accept="video/mp4,video/quicktime"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0]
                    setSelectedFile(file)
                    handleUploadSubmit(file)
                  }
                }}
              />
            </label>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t-2 border-black"></div>
            <span className="flex-shrink mx-4 text-xs font-mono font-black text-black uppercase">OR START WITH A TOPIC</span>
            <div className="flex-grow border-t-2 border-black"></div>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g., 5 mistakes every content creator makes in 2026..."
              className="flex-1 bg-white border-3 border-black p-3 text-xs text-black font-bold placeholder:text-black/60 focus:outline-none shadow-[3px_3px_0px_0px_#000]"
            />
            <button
              onClick={() => handleUploadSubmit(null, topicInput)}
              disabled={isUploading || (!selectedFile && !topicInput.trim())}
              className="creator-button-primary text-xs disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin stroke-[3]" /> : <ArrowRight className="w-4 h-4 stroke-[3]" />}
              <span>{isUploading ? 'PROCESSING' : 'CONTINUE'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2 & 3: Transcribe / Analyze */}
      {currentStep === 'transcribe' && (
        <div className="creator-card p-8 space-y-6 bg-white">
          <div className="flex items-center justify-between border-b-3 border-black pb-4">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-black uppercase">2. VIDEO TRANSCRIPTION & AI ANALYSIS</h2>
              <p className="text-xs font-mono font-bold text-black">Campaign ID: {campaignData?.campaignId || 'cmp_demo'}</p>
            </div>
            <span className={cn(
              'creator-badge',
              isAiProcessing ? 'creator-badge-running' : 'creator-badge-success'
            )}>
              {isAiProcessing ? 'GROQ AI PROCESSING' : 'ANALYSIS COMPLETE'}
            </span>
          </div>

          <div className="space-y-3 bg-[#F4F4F0] p-5 border-3 border-black shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center gap-3 text-xs">
              <CheckCircle2 className="w-5 h-5 text-black stroke-[3] shrink-0" />
              <span className="text-black font-black uppercase">Video uploaded</span>
              <span className="text-[10px] font-mono font-black text-black ml-auto bg-white px-2 py-0.5 border border-black">Supabase Storage</span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              {transcript ? <CheckCircle2 className="w-5 h-5 text-black stroke-[3] shrink-0" /> : <Loader2 className="w-5 h-5 text-black animate-spin stroke-[3] shrink-0" />}
              <span className="text-black font-black uppercase">
                Transcribing audio via Groq Whisper
              </span>
              <span className="text-[10px] font-mono font-black text-black ml-auto bg-white px-2 py-0.5 border border-black">Whisper V3</span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              {analysis ? <CheckCircle2 className="w-5 h-5 text-black stroke-[3] shrink-0" /> : transcript ? <Loader2 className="w-5 h-5 text-black animate-spin stroke-[3] shrink-0" /> : <div className="w-5 h-5 border-2 border-black bg-white shrink-0" />}
              <span className="text-black font-black uppercase">
                Analyzing content (hooks, tone, summary)
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              {generatedPosts ? <CheckCircle2 className="w-5 h-5 text-black stroke-[3] shrink-0" /> : analysis ? <Loader2 className="w-5 h-5 text-black animate-spin stroke-[3] shrink-0" /> : <div className="w-5 h-5 border-2 border-black bg-white shrink-0" />}
              <span className="text-black font-black uppercase">
                Generating 12 platform assets (Hooks, Captions, Scripts, Carousels)
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setCurrentStep('generate')}
              disabled={isAiProcessing && !generatedPosts}
              className="creator-button-primary text-xs disabled:opacity-50"
            >
              <span>NEXT: REVIEW & EDIT POSTS</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review Screen */}
      {(currentStep === 'generate' || currentStep === 'review') && (
        <ReviewContentCard
          campaignId={campaignData?.campaignId || 'cmp_demo'}
          initialContent={generatedPosts || {
            instagram: {
              hook: '5 mistakes every creator makes in 2026 🚨',
              caption: 'Building a social audience isn\'t about working 80 hours a week—it\'s about having an autonomous workflow.',
              hashtags: ['#creatoros', '#contentcreation'],
              cta: 'Save this post for later! 📌'
            },
            linkedin: {
              hook: 'The biggest bottleneck for modern content creators isn\'t ideation—it\'s execution velocity.',
              caption: 'In 2026, top-performing creators aren\'t working longer hours. They turn single videos into multi-platform campaigns automatically.',
              cta: 'Repost if you found this valuable ♻️'
            },
            bluesky: {
              hook: 'Stop manually retyping your video captions for every social platform.',
              caption: 'Turn 1 raw video into platform-ready posts for Bluesky, Instagram & LinkedIn in under 10 seconds. Powered by Groq Whisper & Postiz.',
              cta: 'Try CreatorOS MVP today ⚡️'
            }
          }}
          onApprove={(platform, content) => handleContentApprove(platform, content)}
          onRegenerate={() => runAiPipeline(campaignData?.campaignId || 'cmp_demo')}
        />
      )}

      {/* Step 5: Schedule Screen (Postiz & Live Social Integration) */}
      {currentStep === 'schedule' && (
        <div className="creator-card p-8 space-y-6 bg-white">
          <div className="flex items-center justify-between border-b-3 border-black pb-4">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-black uppercase">5. PUBLISH / SCHEDULE CAMPAIGN</h2>
              <p className="text-xs font-bold text-black">Approved Platform: <span className="uppercase font-black text-black bg-[#FFDE59] px-1 border border-black">{approvedPost?.platform || 'Bluesky'}</span></p>
            </div>
            <span className="creator-badge creator-badge-success">CONTENT APPROVED</span>
          </div>

          {schedulingError && (
            <div className="p-4 border-3 border-black bg-[#FF5757] text-xs font-black text-black space-y-2 shadow-[4px_4px_0px_0px_#000]">
              <p className="uppercase font-mono">PUBLISHING FAILED</p>
              <p>{schedulingError}</p>
              <button
                onClick={handleScheduleSubmit}
                className="creator-button-secondary text-[11px] py-1 px-2 text-black bg-white"
              >
                RETRY
              </button>
            </div>
          )}

          {!scheduleResult ? (
            <div className="space-y-4">
              <div className="p-4 border-3 border-black bg-[#F4F4F0] shadow-[4px_4px_0px_0px_#000] space-y-3">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <p className="text-xs font-mono font-black uppercase text-black">TARGET PLATFORM & INTEGRATION</p>
                  <span className="text-[10px] font-mono font-black bg-[#00E5FF] px-1.5 py-0.5 border border-black">LIVE POSTIZ ENGINE</span>
                </div>
                <p className="text-sm text-black font-black uppercase">☑ {approvedPost?.platform || 'Bluesky'}</p>
              </div>

              {/* Direct Bluesky Live Credentials */}
              {(approvedPost?.platform?.toLowerCase() === 'bluesky' || !approvedPost?.platform) && (
                <div className="p-4 border-3 border-black bg-[#FFDE59] shadow-[4px_4px_0px_0px_#000] space-y-3">
                  <p className="text-xs font-mono font-black uppercase text-black">⚡ PUBLISH DIRECT LIVE TO BLUESKY (OPTIONAL)</p>
                  <p className="text-[11px] font-bold text-black">Enter your Bluesky Handle & App Password below to post a <b>REAL LIVE POST</b> to Bluesky immediately, or click Schedule to queue via Postiz.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={bskyHandle}
                      onChange={(e) => setBskyHandle(e.target.value)}
                      placeholder="yourhandle.bsky.social"
                      className="bg-white border-2 border-black p-2 text-xs font-bold text-black placeholder:text-black/50 shadow-[2px_2px_0px_0px_#000]"
                    />
                    <input
                      type="password"
                      value={bskyPassword}
                      onChange={(e) => setBskyPassword(e.target.value)}
                      placeholder="Bluesky App Password"
                      className="bg-white border-2 border-black p-2 text-xs font-bold text-black placeholder:text-black/50 shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>
                </div>
              )}

              {/* Direct LinkedIn Live Credentials */}
              {approvedPost?.platform?.toLowerCase() === 'linkedin' && (
                <div className="p-4 border-3 border-black bg-[#00E5FF] shadow-[4px_4px_0px_0px_#000] space-y-3">
                  <p className="text-xs font-mono font-black uppercase text-black">💼 PUBLISH DIRECT LIVE TO LINKEDIN (OPTIONAL)</p>
                  <p className="text-[11px] font-bold text-black">Enter your LinkedIn Access Token & Person URN below to publish a <b>REAL LIVE POST</b> directly to your LinkedIn feed.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="password"
                      value={liToken}
                      onChange={(e) => setLiToken(e.target.value)}
                      placeholder="LinkedIn Access Token (OAuth2)"
                      className="bg-white border-2 border-black p-2 text-xs font-bold text-black placeholder:text-black/50 shadow-[2px_2px_0px_0px_#000]"
                    />
                    <input
                      type="text"
                      value={liUrn}
                      onChange={(e) => setLiUrn(e.target.value)}
                      placeholder="LinkedIn Person URN (e.g. 123456789)"
                      className="bg-white border-2 border-black p-2 text-xs font-bold text-black placeholder:text-black/50 shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>
                </div>
              )}

              {/* Direct Instagram Live Credentials */}
              {approvedPost?.platform?.toLowerCase() === 'instagram' && (
                <div className="p-4 border-3 border-black bg-[#FF90E8] shadow-[4px_4px_0px_0px_#000] space-y-3">
                  <p className="text-xs font-mono font-black uppercase text-black">📸 PUBLISH DIRECT LIVE TO INSTAGRAM (OPTIONAL)</p>
                  <p className="text-[11px] font-bold text-black">Enter your Instagram Business Account ID & Graph API Access Token below to publish a <b>REAL LIVE REEL/POST</b> to Instagram.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={igAccountId}
                      onChange={(e) => setIgAccountId(e.target.value)}
                      placeholder="Instagram Business Account ID"
                      className="bg-white border-2 border-black p-2 text-xs font-bold text-black placeholder:text-black/50 shadow-[2px_2px_0px_0px_#000]"
                    />
                    <input
                      type="password"
                      value={igToken}
                      onChange={(e) => setIgToken(e.target.value)}
                      placeholder="Graph API Access Token"
                      className="bg-white border-2 border-black p-2 text-xs font-bold text-black placeholder:text-black/50 shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleScheduleSubmit}
                  disabled={isScheduling}
                  className="creator-button-primary text-xs"
                >
                  {isScheduling ? <Loader2 className="w-4 h-4 animate-spin stroke-[3]" /> : <Send className="w-4 h-4 stroke-[3]" />}
                  <span>{isScheduling ? 'PUBLISHING LIVE...' : bskyHandle && bskyPassword ? 'PUBLISH LIVE TO BLUESKY' : 'SCHEDULE CAMPAIGN'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Postiz & Live Schedule Confirmation UI */
            <div className="p-6 border-3 border-black bg-[#A3E635] shadow-[6px_6px_0px_0px_#000] space-y-4 text-center">
              <div className="w-14 h-14 border-3 border-black bg-white text-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#000]">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-black uppercase">CAMPAIGN PUBLISHED SUCCESSFULLY!</h3>
                <p className="text-xs text-black font-mono font-black">
                  ✓ Content approved &nbsp;•&nbsp; ✓ Post created &nbsp;•&nbsp; ✓ Dispatched to social network
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <div className="p-3 border-2 border-black bg-white inline-block text-xs font-mono font-black text-black shadow-[2px_2px_0px_0px_#000]">
                  Post ID: {scheduleResult.postizPostId || scheduleResult.externalPostId}
                </div>

                {scheduleResult.publishedUrl && (
                  <a
                    href={scheduleResult.publishedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="creator-button-primary text-xs py-2 px-4 shadow-[3px_3px_0px_0px_#000]"
                  >
                    <span>VIEW LIVE PUBLIC POST</span>
                    <Send className="w-4 h-4 stroke-[3]" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

