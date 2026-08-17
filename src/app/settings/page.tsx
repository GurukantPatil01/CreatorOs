'use client'

import { useEffect, useState } from 'react'
import { Share2, Key, CheckCircle2, Loader2, ExternalLink, ShieldCheck, Radio, Check, Save } from 'lucide-react'
import { SocialAccount } from '@/services/publishing/types'

export default function SettingsPage() {
  const [integrations, setIntegrations] = useState<SocialAccount[]>([])
  const [loading, setLoading] = useState(true)

  // Direct Platform Credentials State
  const [bskyHandle, setBskyHandle] = useState('')
  const [bskyPassword, setBskyPassword] = useState('')
  const [liToken, setLiToken] = useState('')
  const [liUrn, setLiUrn] = useState('')
  const [igAccountId, setIgAccountId] = useState('')
  const [igToken, setIgToken] = useState('')

  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    // Fetch Postiz integrations
    fetch('/api/publishing/integrations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.integrations)) {
          setIntegrations(data.integrations)
        }
      })
      .catch((err) => console.error('Integrations error:', err))

    // Fetch user direct credentials
    fetch('/api/publishing/user-integrations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.credentials) {
          if (data.credentials.blueskyHandle) setBskyHandle(data.credentials.blueskyHandle)
          if (data.credentials.linkedinUrn) setLiUrn(data.credentials.linkedinUrn)
          if (data.credentials.instagramAccountId) setIgAccountId(data.credentials.instagramAccountId)
        }
      })
      .catch((err) => console.error('User credentials fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)

    try {
      const res = await fetch('/api/publishing/user-integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (err) {
      console.error('Save credentials error:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="border-b-3 border-black pb-3">
        <h1 className="text-2xl font-black text-black uppercase tracking-tight font-mono">SETTINGS & CONNECTIONS</h1>
        <p className="text-xs text-black font-bold">Manage your authenticated account, connect social apps once, and configure publishing engines.</p>
      </div>

      {/* Architecture Separation Notice */}
      <div className="p-4 border-3 border-black bg-[#FFDE59] shadow-[4px_4px_0px_0px_#000] space-y-2">
        <div className="flex items-center gap-2 text-black font-mono font-black text-xs uppercase">
          <ShieldCheck className="w-4 h-4 text-black stroke-[3]" />
          <span>AUTHENTICATED USER INTEGRATIONS HUB</span>
        </div>
        <p className="text-xs font-bold text-black">
          Connect your social apps below once under your signed-in account. When you create campaigns, CreatorOS automatically dispatches live posts using your saved integrations!
        </p>
      </div>

      {/* Saved User Platform Connections Form */}
      <form onSubmit={handleSaveCredentials} className="creator-card p-6 space-y-6 bg-white">
        <div className="flex items-center justify-between border-b-3 border-black pb-4">
          <div className="flex items-center gap-2 text-black">
            <Share2 className="w-5 h-5 text-black stroke-[3]" />
            <h2 className="text-sm font-black uppercase font-mono">DIRECT PLATFORM INTEGRATIONS</h2>
          </div>
          {saveSuccess && (
            <span className="creator-badge creator-badge-success text-xs flex items-center gap-1">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>SAVED TO ACCOUNT</span>
            </span>
          )}
        </div>

        {/* Bluesky Integration Card */}
        <div className="p-4 border-3 border-black bg-[#FFDE59] shadow-[4px_4px_0px_0px_#000] space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono font-black uppercase text-black">⚡ BLUESKY ATPROTO INTEGRATION</p>
            {bskyHandle && <span className="text-[10px] font-mono font-black bg-[#A3E635] text-black px-1.5 py-0.5 border border-black uppercase">CONNECTED ({bskyHandle})</span>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={bskyHandle}
              onChange={(e) => setBskyHandle(e.target.value)}
              placeholder="Bluesky Handle (e.g. handle.bsky.social)"
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

        {/* LinkedIn Integration Card */}
        <div className="p-4 border-3 border-black bg-[#00E5FF] shadow-[4px_4px_0px_0px_#000] space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono font-black uppercase text-black">💼 LINKEDIN V2 API INTEGRATION</p>
            {liUrn && <span className="text-[10px] font-mono font-black bg-[#A3E635] text-black px-1.5 py-0.5 border border-black uppercase">CONNECTED (URN: {liUrn})</span>}
          </div>
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

        {/* Instagram Integration Card */}
        <div className="p-4 border-3 border-black bg-[#FF90E8] shadow-[4px_4px_0px_0px_#000] space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono font-black uppercase text-black">📸 INSTAGRAM GRAPH API INTEGRATION</p>
            {igAccountId && <span className="text-[10px] font-mono font-black bg-[#A3E635] text-black px-1.5 py-0.5 border border-black uppercase">CONNECTED (ID: {igAccountId})</span>}
          </div>
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

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="creator-button-primary text-xs py-2.5 px-6 shadow-[3px_3px_0px_0px_#000]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin stroke-[3]" /> : <Save className="w-4 h-4 stroke-[3]" />}
            <span>{saving ? 'SAVING INTEGRATIONS...' : 'SAVE INTEGRATIONS TO ACCOUNT'}</span>
          </button>
        </div>
      </form>

      {/* Connected Social Accounts via Postiz Engine */}
      <div className="creator-card p-6 space-y-4 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-3 border-black pb-4 gap-3">
          <div className="flex items-center gap-2 text-black">
            <Radio className="w-5 h-5 text-black stroke-[3] animate-pulse" />
            <div>
              <h2 className="text-sm font-black uppercase font-mono">POSTIZ OAUTH ENGINE (PORT 4007)</h2>
              <p className="text-[11px] font-bold text-black">Postiz Engine URL: <code>http://localhost:4007</code></p>
            </div>
          </div>
          
          <a
            href="http://localhost:4007"
            target="_blank"
            rel="noopener noreferrer"
            className="creator-button-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <span>OPEN POSTIZ ENGINE</span>
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
    </div>
  )
}
