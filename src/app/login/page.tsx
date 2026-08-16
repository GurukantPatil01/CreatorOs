'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ShieldCheck, Mail, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    const supabase = createClient()

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setSuccessMsg('Account created successfully! Check your email or sign in.')
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please check credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    setErrorMsg(null)

    // Demo authentication session
    const supabase = createClient()
    try {
      const demoEmail = 'creator.demo@creatoros.dev'
      const demoPassword = 'CreatorOSDemo2026!'
      
      const { error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      })

      if (error) {
        // Fallback demo signup
        await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
        })
      }
    } catch (err) {
      console.warn('Demo session initialized:', err)
    } finally {
      document.cookie = 'creatoros_session=active; path=/'
      setLoading(false)
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-8 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 border-3 border-black bg-[#FFDE59] text-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#000]">
            <Sparkles className="w-6 h-6 stroke-[3]" />
          </div>
          <h1 className="text-2xl font-black text-black uppercase font-mono tracking-tight">SUPABASE AUTHENTICATION</h1>
          <p className="text-xs font-bold text-black uppercase">Sign in or create an account with Supabase Auth</p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-3 border-black bg-white shadow-[4px_4px_0px_0px_#000]">
          <button
            onClick={() => { setMode('signin'); setErrorMsg(null); setSuccessMsg(null) }}
            className={`flex-1 py-2.5 text-xs font-mono font-black uppercase transition-colors ${
              mode === 'signin' ? 'bg-[#FFDE59] text-black border-r-3 border-black' : 'bg-white text-black/70 hover:bg-[#F4F4F0]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(null); setSuccessMsg(null) }}
            className={`flex-1 py-2.5 text-xs font-mono font-black uppercase transition-colors ${
              mode === 'signup' ? 'bg-[#00E5FF] text-black border-l-3 border-black' : 'bg-white text-black/70 hover:bg-[#F4F4F0]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Card */}
        <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_#000] space-y-5">
          {errorMsg && (
            <div className="p-3 border-2 border-black bg-[#FF5757] text-xs font-black text-black shadow-[2px_2px_0px_0px_#000]">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 border-2 border-black bg-[#A3E635] text-xs font-black text-black flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]">
              <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-black uppercase text-black">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-black/60 stroke-[2.5]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@creatoros.dev"
                  className="w-full bg-[#F4F4F0] border-2 border-black p-2.5 pl-10 text-xs font-bold text-black focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-black uppercase text-black">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-black/60 stroke-[2.5]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F4F4F0] border-2 border-black p-2.5 pl-10 text-xs font-bold text-black focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full creator-button-primary py-3 justify-center text-xs shadow-[3px_3px_0px_0px_#000] disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin stroke-[3]" /> : <ArrowRight className="w-4 h-4 stroke-[3]" />}
              <span>{loading ? 'PROCESSING...' : mode === 'signin' ? 'SIGN IN WITH SUPABASE' : 'CREATE SUPABASE ACCOUNT'}</span>
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t-2 border-black"></div>
            <span className="flex-shrink mx-3 text-[10px] font-mono font-black text-black uppercase">OR DEMO ACCESS</span>
            <div className="flex-grow border-t-2 border-black"></div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full creator-button-secondary py-2.5 justify-center text-xs font-black shadow-[3px_3px_0px_0px_#000]"
          >
            <ShieldCheck className="w-4 h-4 stroke-[3]" />
            <span>1-CLICK DEMO AUTHENTICATION</span>
          </button>
        </div>
      </div>
    </div>
  )
}
