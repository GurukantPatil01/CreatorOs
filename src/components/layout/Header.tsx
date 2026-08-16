'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Radio, LogOut, User as UserIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get current authenticated user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login')
  }

  const getTitle = () => {
    if (pathname.startsWith('/dashboard')) return 'OVERVIEW'
    if (pathname.startsWith('/campaigns/create')) return 'CREATE CAMPAIGN'
    if (pathname.startsWith('/campaigns')) return 'CAMPAIGNS'
    if (pathname.startsWith('/calendar')) return 'SCHEDULED CALENDAR'
    if (pathname.startsWith('/analytics')) return 'ANALYTICS'
    if (pathname.startsWith('/insights')) return 'AI STRATEGY INSIGHTS'
    if (pathname.startsWith('/settings')) return 'SETTINGS & CONNECTIONS'
    if (pathname.startsWith('/login')) return 'SUPABASE AUTHENTICATION'
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
        {!loading && user ? (
          <div className="flex items-center gap-2 border-2 border-black bg-[#FFDE59] p-1 shadow-[2px_2px_0px_0px_#000]">
            <div className="w-6 h-6 border border-black bg-black text-white flex items-center justify-center text-[10px] font-black">
              <UserIcon className="w-3.5 h-3.5 text-[#FFDE59]" />
            </div>
            <span className="text-xs font-mono font-black uppercase max-w-[120px] truncate hidden sm:inline">
              {user.email?.split('@')[0] || 'CREATOR'}
            </span>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1 border border-black bg-white text-black hover:bg-[#FF5757] hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 p-1.5 border-2 border-black bg-[#FFDE59] text-xs font-black font-mono uppercase shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 transition-transform"
          >
            <span>SIGN IN WITH SUPABASE</span>
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
