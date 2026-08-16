import Link from 'next/link'
import { ArrowRight, Video, Sparkles, CalendarCheck, Share2, Layers, CheckCircle2, Zap, Rocket } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F4F4F0] text-black font-sans pb-16">
      {/* Landing Marketing Navbar */}
      <header className="border-b-3 border-black bg-[#FFDE59] px-6 py-4 sticky top-0 z-50 shadow-[0px_4px_0px_0px_#000]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-black bg-black text-white flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000]">
              <Zap className="w-6 h-6 text-[#FFDE59] fill-[#FFDE59]" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-black font-mono">CREATOROS</span>
              <span className="ml-2 text-[10px] uppercase font-mono px-1.5 py-0.5 border border-black bg-white text-black font-extrabold shadow-[1px_1px_0px_0px_#000]">
                AUTONOMOUS MVP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="creator-button-primary py-2 px-5 text-xs font-black"
            >
              <span>USE APP</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Marketing Section */}
      <div className="max-w-5xl mx-auto px-6 pt-12 space-y-10">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border-3 border-black bg-[#00E5FF] shadow-[4px_4px_0px_0px_#000] text-xs font-mono font-black text-black uppercase">
            <Zap className="w-4 h-4 fill-black" />
            <span>Autonomous Content Pipeline & Postiz Engine</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-black uppercase leading-none font-mono">
            ONE PIECE OF CONTENT.<br />
            <span className="bg-[#FFDE59] px-3 py-1 border-3 border-black shadow-[6px_6px_0px_0px_#000] inline-block mt-2">
              AN ENTIRE CAMPAIGN.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-black font-bold max-w-2xl mx-auto leading-relaxed border-2 border-black p-4 bg-white shadow-[4px_4px_0px_0px_#000]">
            Turn 1 raw video into 12 platform-native social content assets, approve captions, schedule via Postiz API, and execute automated distribution.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="creator-button-primary py-3.5 px-8 text-base shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000]"
            >
              <Rocket className="w-5 h-5 stroke-[3]" />
              <span>USE CREATOROS APP</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </Link>
            <Link
              href="/campaigns/create"
              className="creator-button-secondary py-3.5 px-8 text-base shadow-[6px_6px_0px_0px_#000]"
            >
              <span>Create Campaign</span>
            </Link>
          </div>
        </div>

        {/* Visual Pipeline Flow Architecture Diagram */}
        <div className="border-4 border-black bg-white p-6 sm:p-8 space-y-6 shadow-[8px_8px_0px_0px_#000]">
          <div className="flex items-center justify-between border-b-3 border-black pb-4">
            <div className="flex items-center gap-2 text-black">
              <Sparkles className="w-5 h-5 fill-black" />
              <h2 className="text-sm font-black uppercase tracking-wider font-mono">NEO-BRUTALIST ARCHITECTURE DIAGRAM</h2>
            </div>
            <span className="creator-badge creator-badge-success text-xs font-black">POSTIZ LIVE SYNC</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 py-4 text-center items-center">
            {/* Step 1: ONE VIDEO */}
            <div className="p-5 border-3 border-black bg-[#FFDE59] shadow-[4px_4px_0px_0px_#000] space-y-2">
              <div className="w-12 h-12 border-2 border-black bg-white text-black flex items-center justify-center mx-auto shadow-[2px_2px_0px_0px_#000]">
                <Video className="w-6 h-6 stroke-[3]" />
              </div>
              <p className="text-xs font-black text-black uppercase font-mono">1. ONE VIDEO</p>
              <p className="text-[11px] font-bold text-black">MP4 / MOV Upload</p>
            </div>

            <div className="hidden md:flex justify-center text-black">
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </div>

            {/* Step 2: AI ANALYSIS */}
            <div className="p-5 border-3 border-black bg-[#00E5FF] shadow-[4px_4px_0px_0px_#000] space-y-2">
              <div className="w-12 h-12 border-2 border-black bg-white text-black flex items-center justify-center mx-auto shadow-[2px_2px_0px_0px_#000]">
                <Sparkles className="w-6 h-6 stroke-[3]" />
              </div>
              <p className="text-xs font-black text-black uppercase font-mono">2. AI ANALYSIS</p>
              <p className="text-[11px] font-bold text-black">Groq Whisper & LLM</p>
            </div>

            <div className="hidden md:flex justify-center text-black">
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </div>

            {/* Step 3: 12 ASSETS */}
            <div className="p-5 border-3 border-black bg-[#A3E635] shadow-[4px_4px_0px_0px_#000] space-y-2">
              <div className="w-12 h-12 border-2 border-black bg-white text-black flex items-center justify-center mx-auto shadow-[2px_2px_0px_0px_#000]">
                <Layers className="w-6 h-6 stroke-[3]" />
              </div>
              <p className="text-xs font-black text-black uppercase font-mono">3. 12 ASSETS</p>
              <p className="text-[11px] font-bold text-black">Hooks, Posts, Scripts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 border-3 border-black bg-[#FF90E8] shadow-[4px_4px_0px_0px_#000] flex items-center justify-between text-xs font-mono font-black">
              <span>4 TARGET PLATFORMS</span>
              <span className="bg-white px-2 py-1 border border-black text-black">Instagram • LinkedIn • Bluesky • X</span>
            </div>
            <div className="p-4 border-3 border-black bg-[#00E5FF] shadow-[4px_4px_0px_0px_#000] flex items-center justify-between text-xs font-mono font-black">
              <span>POSTIZ AUTOMATION</span>
              <span className="bg-white px-2 py-1 border border-black text-black flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 stroke-[3]" /> 1-Click Scheduled
              </span>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="creator-card p-5 space-y-2 bg-[#FFDE59]">
            <div className="w-10 h-10 border-2 border-black bg-white text-black flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000]">
              <Video className="w-5 h-5 stroke-[3]" />
            </div>
            <h3 className="text-xs font-black text-black uppercase font-mono">1. Video Storage</h3>
            <p className="text-xs font-bold text-black">Upload MP4 files directly to CreatorOS pipeline.</p>
          </div>

          <div className="creator-card p-5 space-y-2 bg-[#00E5FF]">
            <div className="w-10 h-10 border-2 border-black bg-white text-black flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000]">
              <Sparkles className="w-5 h-5 stroke-[3]" />
            </div>
            <h3 className="text-xs font-black text-black uppercase font-mono">2. AI Extraction</h3>
            <p className="text-xs font-bold text-black">Whisper transcription and Groq LLM intelligence.</p>
          </div>

          <div className="creator-card p-5 space-y-2 bg-[#A3E635]">
            <div className="w-10 h-10 border-2 border-black bg-white text-black flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000]">
              <CalendarCheck className="w-5 h-5 stroke-[3]" />
            </div>
            <h3 className="text-xs font-black text-black uppercase font-mono">3. 12 Asset Review</h3>
            <p className="text-xs font-bold text-black">Edit and approve Hooks, Posts, Scripts & Carousels.</p>
          </div>

          <div className="creator-card p-5 space-y-2 bg-[#FF90E8]">
            <div className="w-10 h-10 border-2 border-black bg-white text-black flex items-center justify-center font-black shadow-[2px_2px_0px_0px_#000]">
              <Share2 className="w-5 h-5 stroke-[3]" />
            </div>
            <h3 className="text-xs font-black text-black uppercase font-mono">4. Postiz Sync</h3>
            <p className="text-xs font-bold text-black">Publish automatically with real-time graph status.</p>
          </div>
        </div>
      </div>
    </div>
  )
}


