'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FolderKanban, 
  PlusCircle, 
  Calendar, 
  BarChart3, 
  Lightbulb, 
  Share2, 
  Settings,
  Zap,
  Home
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mainNavItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/campaigns', icon: FolderKanban },
  { name: 'Create Campaign', href: '/campaigns/create', icon: PlusCircle, highlight: true },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Insights', href: '/insights', icon: Lightbulb },
]

const secondaryNavItems = [
  { name: 'Connected Platforms', href: '/settings/integrations', icon: Share2 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r-3 border-black bg-[#FFFFFF] flex flex-col h-screen sticky top-0 select-none text-black z-30">
      {/* Brand Header */}
      <div className="p-4 border-b-3 border-black bg-[#FFDE59] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 border-2 border-black bg-black text-white flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000]">
            <Zap className="w-5 h-5 text-[#FFDE59] fill-[#FFDE59]" />
          </div>
          <div>
            <h1 className="font-black text-base tracking-tight text-black flex items-center gap-1">
              CREATOROS
              <span className="text-[10px] uppercase font-mono px-1 py-0.2 border border-black bg-white text-black font-extrabold">
                MVP
              </span>
            </h1>
            <p className="text-[10px] font-mono font-bold uppercase text-black">Content Automation</p>
          </div>
        </Link>
      </div>

      {/* Primary Navigation */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto bg-white">
        <div>
          <p className="px-3 text-[11px] font-mono uppercase tracking-wider text-black mb-2 font-black">
            Core Menu
          </p>
          <nav className="space-y-1.5">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-wide border-2 border-black transition-all',
                    isActive
                      ? 'bg-[#FFDE59] text-black shadow-[3px_3px_0px_0px_#000] translate-x-0.5'
                      : 'bg-white text-black hover:bg-[#F4F4F0] hover:shadow-[2px_2px_0px_0px_#000]',
                    item.highlight && !isActive && 'bg-[#00E5FF]/20 font-black'
                  )}
                >
                  <Icon className="w-4 h-4 text-black shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="pt-2 border-t-2 border-black">
          <p className="px-3 text-[11px] font-mono uppercase tracking-wider text-black mb-2 font-black">
            System & Publishing
          </p>
          <nav className="space-y-1.5">
            {secondaryNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-wide border-2 border-black transition-all',
                    isActive
                      ? 'bg-[#FFDE59] text-black shadow-[3px_3px_0px_0px_#000]'
                      : 'bg-white text-black hover:bg-[#F4F4F0] hover:shadow-[2px_2px_0px_0px_#000]'
                  )}
                >
                  <Icon className="w-4 h-4 text-black shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Home / Landing Link */}
        <div className="pt-2 border-t-2 border-black">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-xs font-black uppercase tracking-wide border-2 border-black bg-[#A3E635] text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5"
          >
            <Home className="w-4 h-4 text-black shrink-0" />
            <span>Landing Page</span>
          </Link>
        </div>
      </div>

      {/* Footer Profile / Connection Status */}
      <div className="p-3 border-t-3 border-black bg-[#F4F4F0]">
        <div className="flex items-center justify-between p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#00E5FF] border border-black font-black text-xs flex items-center justify-center text-black">
              CD
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-black truncate max-w-[100px]">Creator Demo</p>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-[#A3E635] border border-black"></span>
                <p className="text-[10px] font-mono font-bold text-black uppercase">Postiz Live</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

