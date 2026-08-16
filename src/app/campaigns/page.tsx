'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Video, ArrowRight, Loader2 } from 'lucide-react'
import { ExtendedCampaign } from '@/lib/store'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<ExtendedCampaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/campaigns/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.campaigns)) {
          setCampaigns(data.campaigns)
        }
      })
      .catch((err) => console.error('Failed to load campaigns:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-3 border-black pb-4">
        <div>
          <h1 className="text-2xl font-black text-black uppercase tracking-tight font-mono">CAMPAIGNS</h1>
          <p className="text-xs text-black font-bold">Manage and view all your video content campaigns.</p>
        </div>
        <Link href="/campaigns/create" className="creator-button-primary">
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create Campaign</span>
        </Link>
      </div>

      {loading ? (
        <div className="creator-card p-12 text-center text-black flex items-center justify-center gap-2 font-mono font-black">
          <Loader2 className="w-5 h-5 animate-spin text-black stroke-[3]" />
          <span className="text-xs uppercase">Loading live campaigns...</span>
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {campaigns.map((camp) => (
            <div key={camp.id} className="creator-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 border-2 border-black bg-[#FFDE59] text-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000]">
                  <Video className="w-6 h-6 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-black text-black uppercase">{camp.name}</h3>
                    <span className="creator-badge creator-badge-success capitalize text-[10px]">
                      {camp.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-black">
                    Type: <span className="uppercase font-mono bg-[#00E5FF] px-1 border border-black text-black">{camp.source_type}</span> • Created: {new Date(camp.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Link href="/dashboard" className="creator-button-secondary text-xs">
                  <span>View Pipeline Graph</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="creator-card p-12 text-center space-y-4 bg-white">
          <div className="w-14 h-14 border-3 border-black bg-[#FFDE59] text-black flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#000]">
            <Video className="w-7 h-7 stroke-[3]" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-black text-black uppercase">NO CAMPAIGNS CREATED YET</h3>
            <p className="text-xs font-bold text-black">
              Turn one video into an entire multi-channel social campaign automatically.
            </p>
          </div>
          <div>
            <Link href="/campaigns/create" className="creator-button-primary">
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Campaign</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}


