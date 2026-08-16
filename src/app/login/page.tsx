'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDemoLogin = () => {
    setLoading(true)
    setTimeout(() => {
      document.cookie = 'creatoros_session=active; path=/'
      router.push('/dashboard')
    }, 600)
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12">
      <div className="creator-card p-8 space-y-6 max-w-md w-full border-4 border-black bg-[#FFDE59] shadow-[8px_8px_0px_0px_#000]">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 border-3 border-black bg-white text-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#000]">
            <Sparkles className="w-7 h-7 stroke-[3]" />
          </div>
          <h1 className="text-2xl font-black text-black uppercase font-mono tracking-tight">WELCOME TO CREATOROS</h1>
          <p className="text-xs font-bold text-black uppercase">Autonomous Content Pipeline & Postiz Engine</p>
        </div>

        <div className="p-4 border-3 border-black bg-white space-y-2 text-xs shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center gap-2 text-black font-black uppercase">
            <ShieldCheck className="w-4 h-4 stroke-[3]" />
            <span>HACKATHON DEMO ACCESS MODE</span>
          </div>
          <p className="text-black font-bold">
            Click below to launch an authenticated session with pre-configured Groq AI credentials and Postiz social channels.
          </p>
        </div>

        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full creator-button-primary py-3.5 justify-center text-sm shadow-[4px_4px_0px_0px_#000]"
        >
          <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN AS CREATOR DEMO'}</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>

        <div className="text-center text-[11px] font-mono font-black text-black uppercase border-t-2 border-black pt-3">
          Connected to Groq Whisper & Postiz Infrastructure
        </div>
      </div>
    </div>
  )
}

