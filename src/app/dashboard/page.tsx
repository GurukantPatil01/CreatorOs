'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlusCircle, ArrowUpRight, Zap, CheckCircle2 } from 'lucide-react'
import { WorkflowGraph } from '@/components/workflow/WorkflowGraph'
import { ExtendedCampaign } from '@/lib/store'
import { ScheduledPost } from '@/types/database'

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<ExtendedCampaign[]>([])
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/campaigns/list').then((res) => res.json()),
      fetch('/api/calendar').then((res) => res.json()),
    ])
      .then(([cData, sData]) => {
        if (cData.success && Array.isArray(cData.campaigns)) {
          setCampaigns(cData.campaigns)
        }
        if (sData.success && Array.isArray(sData.scheduledPosts)) {
          setScheduledPosts(sData.scheduledPosts)
        }
      })
      .catch((err) => console.error('Dashboard data error:', err))
      .finally(() => setLoading(false))
  }, [])

  const publishedCount = scheduledPosts.filter((p) => p.status === 'published').length
  const scheduledCount = scheduledPosts.filter((p) => p.status === 'scheduled').length
  const activeCampaignsCount = campaigns.length
  const latestCampaign = campaigns[0] || {
    id: 'cmp_demo',
    name: '5 mistakes every content creator makes in 2026',
    source_type: 'video',
    status: 'scheduled',
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-black pb-4">
        <div>
          <h1 className="text-2xl font-black text-black uppercase tracking-tight font-mono">DASHBOARD OVERVIEW</h1>
          <p className="text-xs text-black font-bold">Monitor active campaigns, scheduled posts, and workflow execution pipeline.</p>
        </div>
        <Link href="/campaigns/create" className="creator-button-primary">
          <PlusCircle className="w-4 h-4 stroke-[3]" />
          <span>New Campaign</span>
        </Link>
      </div>

      {/* Neo-Brutalist KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="creator-card p-4 space-y-1 bg-[#FFDE59]">
          <p className="text-xs text-black font-mono font-black uppercase">PUBLISHED POSTS</p>
          <p className="text-3xl font-black text-black font-mono">{publishedCount}</p>
          <p className="text-[11px] font-black text-black uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> Postiz Connected
          </p>
        </div>

        <div className="creator-card p-4 space-y-1 bg-[#00E5FF]">
          <p className="text-xs text-black font-mono font-black uppercase">SCHEDULED POSTS</p>
          <p className="text-3xl font-black text-black font-mono">{scheduledCount || 1}</p>
          <p className="text-[11px] font-black text-black uppercase">Bluesky / Postiz API</p>
        </div>

        <div className="creator-card p-4 space-y-1 bg-[#A3E635]">
          <p className="text-xs text-black font-mono font-black uppercase">ACTIVE CAMPAIGNS</p>
          <p className="text-3xl font-black text-black font-mono">{activeCampaignsCount || 1}</p>
          <p className="text-[11px] font-black text-black uppercase">Groq AI Pipeline</p>
        </div>

        <div className="creator-card p-4 space-y-1 bg-[#FF90E8]">
          <p className="text-xs text-black font-mono font-black uppercase">AI PROVIDER</p>
          <p className="text-xl font-black text-black font-mono uppercase">Groq Whisper</p>
          <p className="text-[11px] font-black text-black uppercase">LLM Generation Active</p>
        </div>
      </div>

      {/* Interactive React Flow Execution Pipeline */}
      <WorkflowGraph campaignId={latestCampaign.id} />

      {/* Recent Campaign Quick Card */}
      <div className="creator-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b-3 border-black pb-3">
          <h3 className="text-xs font-black text-black uppercase tracking-wider font-mono">
            ACTIVE CAMPAIGN PIPELINE
          </h3>
          <span className="creator-badge creator-badge-success">{latestCampaign.status}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-black text-black uppercase">{latestCampaign.name}</h4>
            <p className="text-xs font-bold text-black mt-1">Source: {latestCampaign.source_type.toUpperCase()} • Repurposed for Bluesky, Instagram & LinkedIn</p>
          </div>
          <Link href="/campaigns/create" className="creator-button-secondary text-xs shrink-0">
            <span>Create New Campaign</span>
            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
          </Link>
        </div>
      </div>
    </div>
  )
}


