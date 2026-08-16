'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart3, PlusCircle, TrendingUp, Share2 } from 'lucide-react'
import { ScheduledPost } from '@/types/database'

export default function AnalyticsPage() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])

  useEffect(() => {
    fetch('/api/calendar')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.scheduledPosts)) {
          setScheduledPosts(data.scheduledPosts)
        }
      })
      .catch((err) => console.error('Analytics data error:', err))
  }, [])

  const publishedCount = scheduledPosts.filter((p) => p.status === 'published').length
  const scheduledCount = scheduledPosts.filter((p) => p.status === 'scheduled').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-black pb-4">
        <div>
          <h1 className="text-2xl font-black text-black uppercase tracking-tight font-mono">ANALYTICS</h1>
          <p className="text-xs text-black font-bold">Track social campaign reach and post engagement performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="creator-badge creator-badge-success">POSTIZ ENGINE ACTIVE</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="creator-card p-4 space-y-1 bg-[#FFDE59]">
          <p className="text-xs text-black font-mono font-black uppercase">PUBLISHED</p>
          <p className="text-3xl font-black text-black font-mono">{publishedCount}</p>
          <p className="text-[11px] font-black text-black uppercase">Total live posts</p>
        </div>
        <div className="creator-card p-4 space-y-1 bg-[#00E5FF]">
          <p className="text-xs text-black font-mono font-black uppercase">SCHEDULED</p>
          <p className="text-3xl font-black text-black font-mono">{scheduledCount || 1}</p>
          <p className="text-[11px] font-black text-black uppercase">In queue via Postiz</p>
        </div>
        <div className="creator-card p-4 space-y-1 bg-[#A3E635]">
          <p className="text-xs text-black font-mono font-black uppercase">ENGAGEMENT RATE</p>
          <p className="text-3xl font-black text-black font-mono">+18%</p>
          <p className="text-[11px] font-black text-black uppercase">Vs previous month</p>
        </div>
        <div className="creator-card p-4 space-y-1 bg-[#FF90E8]">
          <p className="text-xs text-black font-mono font-black uppercase">TOP PERFORMER</p>
          <p className="text-xl font-black text-black font-mono uppercase">Bluesky</p>
          <p className="text-[11px] font-black text-black uppercase">Highest CTR</p>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart 1: Impressions Reach Growth */}
        <div className="lg:col-span-2 creator-card p-6 space-y-4 bg-white">
          <div className="flex items-center justify-between border-b-3 border-black pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-black stroke-[3]" />
              <h3 className="text-xs font-black text-black uppercase tracking-wider font-mono">
                CAMPAIGN IMPRESSIONS REACH (WEEKLY)
              </h3>
            </div>
            <span className="text-[11px] font-mono font-black bg-[#A3E635] px-2 py-0.5 border border-black text-black">+24.5% VS LAST WEEK</span>
          </div>

          {/* Neo-Brutalist Bar Chart Graphics */}
          <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 px-2 bg-[#F4F4F0] border-2 border-black p-4 shadow-[3px_3px_0px_0px_#000]">
            {[35, 42, 68, 55, 84, 92, 120].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  style={{ height: `${(val / 120) * 100}%` }}
                  className="w-full max-w-[40px] bg-[#FFDE59] border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFE600] transition-all relative group"
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-[10px] font-mono font-black text-white px-1.5 py-0.5 border border-black shadow">
                    {val}k
                  </div>
                </div>
                <span className="text-[10px] font-mono font-black uppercase text-black">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Channel Repurposing Breakdown */}
        <div className="creator-card p-6 space-y-4 bg-white">
          <div className="flex items-center gap-2 border-b-3 border-black pb-3">
            <Share2 className="w-5 h-5 text-black stroke-[3]" />
            <h3 className="text-xs font-black text-black uppercase tracking-wider font-mono">
              CHANNEL SHARE
            </h3>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs font-black uppercase mb-1">
                <span>Bluesky</span>
                <span className="font-mono bg-[#00E5FF] px-1 border border-black">45%</span>
              </div>
              <div className="w-full h-3 border-2 border-black bg-[#F4F4F0] overflow-hidden">
                <div className="h-full bg-[#00E5FF] w-[45%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-black uppercase mb-1">
                <span>LinkedIn</span>
                <span className="font-mono bg-[#FFDE59] px-1 border border-black">30%</span>
              </div>
              <div className="w-full h-3 border-2 border-black bg-[#F4F4F0] overflow-hidden">
                <div className="h-full bg-[#FFDE59] w-[30%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-black uppercase mb-1">
                <span>Instagram</span>
                <span className="font-mono bg-[#FF90E8] px-1 border border-black">25%</span>
              </div>
              <div className="w-full h-3 border-2 border-black bg-[#F4F4F0] overflow-hidden">
                <div className="h-full bg-[#FF90E8] w-[25%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



