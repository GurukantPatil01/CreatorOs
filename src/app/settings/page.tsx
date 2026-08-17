'use client'

import { useEffect, useState } from 'react'
import { Share2, Key, CheckCircle2, Loader2, ExternalLink, ShieldCheck, Cpu, Radio } from 'lucide-react'
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
        <p className="text-xs text-black font-bold">Configure Supabase User Auth, Postiz Social OAuth Connections, and Live Social API Credential Providers.</p>
      </div>

      {/* Architecture Separation Notice */}
      <div className="p-4 border-3 border-black bg-[#FFDE59] shadow-[4px_4px_0px_0px_#000] space-y-2">
        <div className="flex items-center gap-2 text-black font-mono font-black text-xs uppercase">
          <ShieldCheck className="w-4 h-4 text-black stroke-[3]" />
          <span>AUTHENTICATION & OAUTH ARCHITECTURE</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-black pt-1">
          <div className="p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]">
            <p className="font-mono font-black uppercase text-[#000]">1. CREATOROS USER AUTH</p>
            <p className="text-[11px]">Managed by <b>Supabase Auth</b> (@supabase/ssr). Handles user registration, passwords, & dashboard route protection.</p>
          </div>
          <div className="p-3 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000]">
            <p className="font-mono font-black uppercase text-[#000]">2. SOCIAL NETWORK OAUTH</p>
            <p className="text-[11px]">Managed by <b>Postiz Engine (Port 4007)</b>. Handles Meta / Facebook / Instagram / LinkedIn OAuth callbacks & scheduling.</p>
          </div>
        </div>
      </div>

      {/* Connected Social Accounts via Postiz */}
      <div className="creator-card p-6 space-y-4 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-3 border-black pb-4 gap-3">
          <div className="flex items-center gap-2 text-black">
            <Share2 className="w-5 h-5 text-black stroke-[3]" />
            <div>
              <h2 className="text-sm font-black uppercase font-mono">SOCIAL CHANNELS (POSTIZ OAUTH)</h2>
              <p className="text-[11px] font-bold text-black">Postiz Engine URL: <code>http://localhost:4007</code></p>
            </div>
          </div>
          
          <a
            href="http://localhost:4007"
            target="_blank"
            rel="noopener noreferrer"
            className="creator-button-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <span>CONNECT IN POSTIZ</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[3]" />
          </a>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center p-6 text-black text-xs font-mono font-black gap-2">
              <Loader2 className="w-5 h-5 animate-spin stroke-[3]" />
              <span>Fetching connected social channels from Postiz...</span>
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
            <div className="text-xs font-bold text-black p-3">No connected accounts found on Postiz instance. Click button above to connect channels via Postiz OAuth.</div>
          )}
        </div>
      </div>

      {/* API Credential Status Cards */}
      <div className="creator-card p-6 space-y-4 bg-white">
        <div className="flex items-center gap-2 text-black border-b-3 border-black pb-4">
          <Key className="w-5 h-5 text-black stroke-[3]" />
          <h2 className="text-sm font-black uppercase font-mono">SYSTEM SERVICES STATUS</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 border-2 border-black bg-[#FFDE59] shadow-[3px_3px_0px_0px_#000] space-y-1">
            <div className="flex items-center justify-between font-mono font-black text-black">
              <span>SUPABASE AUTH</span>
              <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
            </div>
            <p className="text-black font-black uppercase text-[11px]">SSR User Authentication</p>
          </div>

          <div className="p-4 border-2 border-black bg-[#00E5FF] shadow-[3px_3px_0px_0px_#000] space-y-1">
            <div className="flex items-center justify-between font-mono font-black text-black">
              <span>GROQ AI ENGINE</span>
              <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
            </div>
            <p className="text-black font-black uppercase text-[11px]">Whisper V3 & Llama 3.3</p>
          </div>

          <div className="p-4 border-2 border-black bg-[#A3E635] shadow-[3px_3px_0px_0px_#000] space-y-1">
            <div className="flex items-center justify-between font-mono font-black text-black">
              <span>POSTIZ ENGINE</span>
              <Radio className="w-4 h-4 text-black animate-pulse" />
            </div>
            <p className="text-black font-black uppercase text-[11px]">Port 4007 Docker Active</p>
          </div>
        </div>
      </div>
    </div>
  )
}
