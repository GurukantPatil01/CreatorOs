'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Plus, Radio } from 'lucide-react'
import { useUser, UserButton, SignInButton } from '@clerk/nextjs'

export function Header() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { isSignedIn, isLoaded, user } = useUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  const getTitle = () => {
    if (pathname.startsWith('/dashboard')) return 'OVERVIEW'
    if (pathname.startsWith('/campaigns/create')) return 'CREATE CAMPAIGN'
    if (pathname.startsWith('/campaigns')) return 'CAMPAIGNS'
    if (pathname.startsWith('/calendar')) return 'SCHEDULED CALENDAR'
    if (pathname.startsWith('/analytics')) return 'ANALYTICS'
    if (pathname.startsWith('/insights')) return 'AI STRATEGY INSIGHTS'
    if (pathname.startsWith('/settings')) return 'SETTINGS & CONNECTIONS'
    if (pathname.startsWith('/login')) return 'AUTHENTICATION'
    return 'CREATOROS'
  }

  return (
    <header className="h-14 border-b-3 border-black bg-white sticky top-0 z-40 flex items-center justify-between px-6 text-black shadow-[0px_3px_0px_0px_#000]">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-black tracking-wider uppercase font-mono">{getTitle()}</h2>
        <div className="h-4 w-0.5 bg-black" />
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold bg-[#A3E635] px-2 py-0.5 border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
          <Radio className="w-3.5 h-3.5 text-black animate-pulse" />
          <span>POSTIZ: LIVE</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {mounted && isLoaded ? (
          isSignedIn ? (
            <div className="flex items-center gap-2 border-2 border-black bg-[#FFDE59] p-1 shadow-[2px_2px_0px_0px_#000]">
              <UserButton />
              <span className="text-xs font-mono font-black uppercase pr-1 hidden sm:inline">
                {user?.firstName || 'MY ACCOUNT'}
              </span>
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 p-1.5 border-2 border-black bg-[#FFDE59] shadow-[2px_2px_0px_0px_#000] text-xs font-black hover:-translate-x-0.5 font-mono uppercase">
                <span>SIGN IN WITH CLERK</span>
              </button>
            </SignInButton>
          )
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 p-1 border-2 border-black bg-[#FFDE59] text-xs font-black font-mono uppercase shadow-[2px_2px_0px_0px_#000]"
          >
            <span>SIGN IN</span>
          </Link>
        )}

        <Link
          href="/campaigns/create"
          className="creator-button-primary text-xs py-1 px-3"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Campaign</span>
        </Link>
      </div>
    </header>
  )
}
