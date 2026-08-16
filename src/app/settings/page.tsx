'use client'

import { useEffect, useState } from 'react'
import { Share2, Key, CheckCircle2, Loader2 } from 'lucide-react'
import { SocialAccount } from '@/services/publishing/types'

export default function SettingsPage() {
  const [integrations, setIntegrations] = useState<SocialAccount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/publishing/integrations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.integrations)) {
          setIntegrations(data.integrations)
        }
      })
      .catch((err) => console.error('Integrations error:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b-3 border-black pb-3">
        <h1 className="text-2xl font-black text-black uppercase tracking-tight font-mono">SETTINGS & CONNECTIONS</h1>
        <p className="text-xs text-black font-bold">Configure Postiz publishing integration, API credentials, and social channels.</p>
      </div>

      {/* Connected Social Accounts */}
      <div className="creator-card p-6 space-y-4 bg-white">
        <div className="flex items-center justify-between border-b-3 border-black pb-4">
          <div className="flex items-center gap-2 text-black">
            <Share2 className="w-5 h-5 text-black stroke-[3]" />
            <h2 className="text-sm font-black uppercase font-mono">SOCIAL PLATFORMS (POSTIZ)</h2>
          </div>
          <span className="creator-badge creator-badge-success">POSTIZ CONNECTED</span>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center p-6 text-black text-xs font-mono font-black gap-2">
              <Loader2 className="w-5 h-5 animate-spin stroke-[3]" />
              <span>Fetching connected platforms from Postiz...</span>
            </div>
          ) : integrations.length > 0 ? (
            integrations.map((acc) => (
              <div key={acc.id} className="flex items-center justify-between p-3.5 border-2 border-black bg-[#F4F4F0] shadow-[3px_3px_0px_0px_#000]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 border border-black bg-[#FFDE59] text-black font-black flex items-center justify-center text-xs uppercase shadow-[1.5px_1.5px_0px_0px_#000]">
                    {acc.platform.substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-black uppercase">{acc.name || acc.platform}</p>
                    <p className="text-[11px] font-mono font-bold text-black">{acc.identifier}</p>
                  </div>
                </div>
                <span className={acc.connected ? "creator-badge creator-badge-success text-[10px]" : "creator-badge creator-badge-pending text-[10px]"}>
                  {acc.connected ? 'ACTIVE' : 'DISCONNECTED'}
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs font-bold text-black p-3">No connected accounts found on Postiz instance.</div>
          )}
        </div>
      </div>

      {/* API Configuration Overview */}
      <div className="creator-card p-6 space-y-4 bg-white">
        <div className="flex items-center gap-2 text-black border-b-3 border-black pb-4">
          <Key className="w-5 h-5 text-black stroke-[3]" />
          <h2 className="text-sm font-black uppercase font-mono">API CREDENTIALS STATUS</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 border-2 border-black bg-[#00E5FF] shadow-[3px_3px_0px_0px_#000] space-y-1">
            <div className="flex items-center justify-between font-mono font-black text-black">
              <span>GROQ API</span>
              <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
            </div>
            <p className="text-black font-black uppercase">Whisper & Groq LLM</p>
          </div>

          <div className="p-4 border-2 border-black bg-[#A3E635] shadow-[3px_3px_0px_0px_#000] space-y-1">
            <div className="flex items-center justify-between font-mono font-black text-black">
              <span>POSTIZ API</span>
              <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
            </div>
            <p className="text-black font-black uppercase">Social Scheduling API</p>
          </div>
        </div>
      </div>
    </div>
  )
}


