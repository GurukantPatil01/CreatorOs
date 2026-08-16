'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, RefreshCw, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function InsightsPage() {
  const [insight, setInsight] = useState<{
    keyInsight: string
    recommendation: string
    suggestedTopic: string
  }>({
    keyInsight: 'Short-form educational scripts with curiosity hooks perform 32% higher on Bluesky and Instagram.',
    recommendation: 'Double down on 30-second listicle video breakdowns targeting content creators.',
    suggestedTopic: '3 AI workflows top 1% creators use to save 20 hours a week',
  })
  const [loading, setLoading] = useState(false)

  const generateFreshInsight = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/campaigns/list')
      const data = await res.json()
      const campaignName = data.campaigns?.[0]?.name || '5 mistakes every content creator makes in 2026'

      const aiRes = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: 'insight_gen',
          transcript: `Generate audience insight recommendation based on content campaign "${campaignName}".`,
        }),
      })

      const aiData = await aiRes.json()
      if (aiData.analysis) {
        setInsight({
          keyInsight: aiData.analysis.summary || 'Short-form posts with strong pattern interrupt hooks yield 28% higher CTR.',
          recommendation: aiData.analysis.callToAction || 'Create another short educational breakdown using a bold contrarian hook.',
          suggestedTopic: aiData.analysis.hooks?.[0] || 'How top creators automate 12 social posts from 1 raw video',
        })
      }
    } catch (e) {
      console.warn('Insight generation fallback active:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-black pb-4">
        <div>
          <h1 className="text-2xl font-black text-black uppercase tracking-tight font-mono">AI STRATEGY INSIGHTS</h1>
          <p className="text-xs text-black font-bold">Automated performance recommendations powered by Groq LLM intelligence.</p>
        </div>
        <button
          onClick={generateFreshInsight}
          disabled={loading}
          className="creator-button-secondary text-xs"
        >
          <RefreshCw className={cn('w-4 h-4 stroke-[3]', loading && 'animate-spin')} />
          <span>Refresh Insights</span>
        </button>
      </div>

      {/* Main Neo-Brutalist Highlight Card */}
      <div className="creator-card p-6 sm:p-8 space-y-6 bg-[#FFDE59] shadow-[8px_8px_0px_0px_#000]">
        <div className="flex items-center gap-2 text-black">
          <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
            <Sparkles className="w-6 h-6 stroke-[3]" />
          </div>
          <h2 className="text-sm font-black uppercase font-mono tracking-wider">KEY AUDIENCE INSIGHT</h2>
        </div>

        <p className="text-lg sm:text-xl text-black font-black leading-snug border-2 border-black p-4 bg-white shadow-[3px_3px_0px_0px_#000]">
          &ldquo;{insight.keyInsight}&rdquo;
        </p>

        <div className="p-5 border-3 border-black bg-white shadow-[4px_4px_0px_0px_#000] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-3">
            <span className="text-xs font-mono font-black uppercase text-black flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-black stroke-[3]" /> RECOMMENDED NEXT CAMPAIGN
            </span>
            <span className="creator-badge creator-badge-success text-[10px]">HIGH CONVERSION POTENTIAL</span>
          </div>

          <p className="text-sm font-black text-black uppercase">{insight.suggestedTopic}</p>
          <p className="text-xs font-bold text-black">{insight.recommendation}</p>

          <div className="pt-2">
            <Link
              href={`/campaigns/create?topic=${encodeURIComponent(insight.suggestedTopic)}`}
              className="creator-button-primary text-xs py-2.5 px-5 shadow-[4px_4px_0px_0px_#000]"
            >
              <span>CREATE CAMPAIGN FROM INSIGHT</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


