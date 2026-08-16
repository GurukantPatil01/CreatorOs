'use client'

import { useState } from 'react'
import { SignIn, SignUp } from '@clerk/nextjs'
import { Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-8 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 border-3 border-black bg-[#FFDE59] text-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_#000]">
            <Sparkles className="w-6 h-6 stroke-[3]" />
          </div>
          <h1 className="text-2xl font-black text-black uppercase font-mono tracking-tight">CREATOROS AUTHENTICATION</h1>
          <p className="text-xs font-bold text-black uppercase">Sign in or create an account with Clerk</p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-3 border-black bg-white shadow-[4px_4px_0px_0px_#000]">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-2.5 text-xs font-mono font-black uppercase transition-colors ${
              mode === 'signin' ? 'bg-[#FFDE59] text-black border-r-3 border-black' : 'bg-white text-black/70 hover:bg-[#F4F4F0]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2.5 text-xs font-mono font-black uppercase transition-colors ${
              mode === 'signup' ? 'bg-[#00E5FF] text-black border-l-3 border-black' : 'bg-white text-black/70 hover:bg-[#F4F4F0]'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="flex justify-center border-4 border-black bg-white p-4 shadow-[6px_6px_0px_0px_#000]">
          {mode === 'signin' ? (
            <SignIn fallbackRedirectUrl="/dashboard" routing="hash" />
          ) : (
            <SignUp fallbackRedirectUrl="/dashboard" routing="hash" />
          )}
        </div>
      </div>
    </div>
  )
}
