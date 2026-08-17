'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, PlusCircle, Loader2 } from 'lucide-react'
import { ScheduledPost } from '@/types/database'

export default function CalendarPage() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/calendar')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.scheduledPosts)) {
          setScheduledPosts(data.scheduledPosts)
        }
      })
      .catch((err) => console.error('Calendar data error:', err))
      .finally(() => setLoading(false))
  }, [])

  // Days for August 2026 week view
  const daysOfWeek = [
    { label: 'MON 17', dateNum: 17 },
    { label: 'TUE 18', dateNum: 18 },
    { label: 'WED 19', dateNum: 19 },
    { label: 'THU 20', dateNum: 20 },
    { label: 'FRI 21', dateNum: 21 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-black pb-4">
        <div>
          <h1 className="text-2xl font-black text-black uppercase tracking-tight font-mono">SCHEDULED CALENDAR</h1>
          <p className="text-xs text-black font-bold">View upcoming and published posts on their exact scheduled date.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]">
            <button aria-label="Previous week" className="p-1.5 text-black hover:bg-[#FFDE59] transition-colors border-r border-black">
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
            </button>
            <span className="text-xs font-mono font-black text-black px-3 py-1 uppercase">
              AUGUST 2026
            </span>
            <button aria-label="Next week" className="p-1.5 text-black hover:bg-[#FFDE59] transition-colors border-l border-black">
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
          <Link href="/campaigns/create" className="creator-button-primary">
            <PlusCircle className="w-4 h-4 stroke-[3]" />
            <span>Create Campaign</span>
          </Link>
        </div>
      </div>

      {/* Neo-Brutalist Week View Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {daysOfWeek.map(({ label, dateNum }) => {
          // Filter posts matching the exact date number of scheduled_at
          const postsForDay = scheduledPosts.filter((post) => {
            if (!post.scheduled_at) return false
            const d = new Date(post.scheduled_at)
            return d.getDate() === dateNum
          })

          return (
            <div key={label} className="creator-card p-4 min-h-[260px] flex flex-col justify-between bg-white">
              <div>
                <p className="text-xs font-mono font-black text-black border-b-2 border-black pb-2 mb-3 uppercase">
                  {label}
                </p>
                {loading ? (
                  <div className="flex justify-center pt-8 text-black">
                    <Loader2 className="w-5 h-5 animate-spin stroke-[3]" />
                  </div>
                ) : postsForDay.length > 0 ? (
                  postsForDay.map((post) => (
                    <div key={post.id} className="p-2.5 border-2 border-black bg-[#FFDE59] text-black text-xs space-y-1 mb-2 shadow-[2px_2px_0px_0px_#000]">
                      <div className="flex items-center justify-between text-[10px] font-mono font-black uppercase">
                        <span>{post.platform}</span>
                        <span>{new Date(post.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-black text-[11px] font-black truncate">ID: {post.external_post_id || post.id}</p>
                      <span className="creator-badge creator-badge-running text-[9px] py-0 px-1 capitalize">{post.status}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs font-mono font-bold text-black/50 text-center pt-10">NO POSTS</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Info Banner */}
      <div className="creator-card p-6 text-center space-y-3 bg-[#00E5FF]">
        <div className="w-12 h-12 border-2 border-black bg-white text-black flex items-center justify-center mx-auto shadow-[2px_2px_0px_0px_#000]">
          <CalendarIcon className="w-6 h-6 stroke-[3]" />
        </div>
        <h3 className="text-sm font-black text-black uppercase">REAL-TIME WORKFLOW CALENDAR</h3>
        <p className="text-xs font-bold text-black max-w-xl mx-auto">
          Posts appear on the exact date and time they are published or scheduled across Instagram, LinkedIn, and Bluesky.
        </p>
      </div>
    </div>
  )
}
