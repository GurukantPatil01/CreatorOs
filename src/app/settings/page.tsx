'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Share2, Key, CheckCircle2, Loader2, ExternalLink, ShieldCheck, Radio, Check, Save, Lock, User as UserIcon } from 'lucide-react'
import { SocialAccount } from '@/services/publishing/types'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
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
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
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

        // Fetch Postiz integrations
        fetch('/api/publishing/integrations')
          .then((res) => res.json())
          .then((data) => {
            if (data.success && Array.isArray(data.integrations)) {
              setIntegrations(data.integrations)
            }
          })
          .catch((err) => console.error('Integrations error:', err))
          .finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })
  }, [])

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setSaveSuccess(false)
    setAuthError(null)

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
      } else {
        setAuthError(data.error || 'Failed to save integrations')
      }
    } catch (err: any) {
      setAuthError('Network error saving integration credentials.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="border-b-3 border-black pb-3">
        <h1 className="text-2xl font-black text-black uppercase tracking-tight font-mono">PLATFORM INTEGRATIONS & SETTINGS</h1>
        <p className="text-xs text-black font-bold">Manage your authenticated account credentials, connect social apps once, and configure publishing engines.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 text-black font-mono font-black gap-3 creator-card bg-white">
          <Loader2 className="w-6 h-6 animate-spin stroke-[3]" />
          <span>VERIFYING SUPABASE AUTHENTICATION...</span>
        </div>
      ) : !user ? (
        /* Unauthenticated Notice */
        <div className="creator-card p-8 bg-white space-y-6 text-center">
          <div className="w-14 h-14 border-3 border-black bg-[#FF5757] text-black flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_#000]">
            <Lock className="w-7 h-7 stroke-[3]" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-lg font-black text-black uppercase font-mono">SUPABASE AUTHENTICATION REQUIRED</h2>
            <p className="text-xs font-bold text-black">
              Platform integrations are isolated per user account. Please Sign In or Create an Account with Supabase Auth to connect and save your social media apps.
            </p>
          </div>
          <Link
            href="/login"
            className="creator-button-primary text-xs py-3 px-6 inline-flex items-center gap-2 shadow-[4px_4px_0px_0px_#000]"
          >
            <UserIcon className="w-4 h-4 stroke-[3]" />
            <span>SIGN IN WITH SUPABASE AUTH</span>
          </Link>
        </div>
      ) : (
        /* Authenticated User Integrations Suite */
        <div className="space-y-6">
          {/* User Profile Badge */}
          <div className="p-4 border-3 border-black bg-[#A3E635] shadow-[4px_4px_0px_0px_#000] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-black bg-black text-white flex items-center justify-center font-mono font-black text-xs">
                <UserIcon className="w-4 h-4 text-[#A3E635]" />
              </div>
              <div>
                <p className="text-xs font-mono font-black uppercase text-black">AUTHENTICATED ACCOUNT</p>
                <p className="text-sm font-black text-black">{user.email}</p>
              </div>
            </div>
            <span className="creator-badge creator-badge-success text-xs">SUPABASE VERIFIED</span>
          </div>

          {/* Saved User Platform Connections Form */}
          <form onSubmit={handleSaveCredentials} className="creator-card p-6 space-y-6 bg-white">
            <div className="flex items-center justify-between border-b-3 border-black pb-4">
              <div className="flex items-center gap-2 text-black">
                <Share2 className="w-5 h-5 text-black stroke-[3]" />
                <h2 className="text-sm font-black uppercase font-mono">CONNECT PLATFORM APPS</h2>
              </div>
              {saveSuccess && (
                <span className="creator-badge creator-badge-success text-xs flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>SAVED TO USER ACCOUNT</span>
                </span>
              )}
            </div>

            {authError && (
              <div className="p-3 border-2 border-black bg-[#FF5757] text-xs font-black text-black">
                ⚠️ {authError}
              </div>
            )}

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
                className="creator-button-primary text-xs py-3 px-6 shadow-[3px_3px_0px_0px_#000]"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin stroke-[3]" /> : <Save className="w-4 h-4 stroke-[3]" />}
                <span>{saving ? 'SAVING TO ACCOUNT...' : 'SAVE INTEGRATIONS TO ACCOUNT'}</span>
              </button>
            </div>
          </form>

          {/* Postiz Engine Integration */}
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
              {integrations.length > 0 ? (
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
      )}
    </div>
  )
}
