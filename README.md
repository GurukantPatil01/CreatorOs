# CreatorOS — Autonomous Content Pipeline & Postiz Engine

> Turn 1 raw video into 12 platform-native social content assets, approve captions, schedule via Postiz API, and execute automated multi-channel distribution.

---

## 🚀 What is it?

**CreatorOS** is an autonomous content repurposing pipeline designed for modern creators, media teams, and developer advocates. By uploading a single raw video or providing a topic, CreatorOS automatically transcribes the audio, extracts viral hooks and summaries via Groq AI, generates platform-tailored post variations (Instagram, LinkedIn, Bluesky), and automates social queueing using the Postiz API.

---

## 🛠️ Built With

### Frontend & UI
* **[Next.js 16](https://nextjs.org/)** (App Router) — Full-stack React framework
* **[React 19](https://react.dev/)** — UI library
* **[TypeScript](https://www.typescriptlang.org/)** — Strict type safety
* **[Tailwind CSS 4](https://tailwindcss.com/)** — Utility-first styling with custom Neo-Brutalist design system
* **[Lucide React](https://lucide.dev/)** — Icon set
* **[Framer Motion](https://www.framer.com/motion/)** — Micro-animations & layout transitions

### Visual Workflow Engine
* **[@xyflow/react](https://reactflow.dev/)** (React Flow v12) — Interactive node-based visual pipeline execution graph

### AI & Speech Processing
* **[Groq AI](https://groq.com/)** — Ultra-fast LLM inference API
* **Groq Llama 3.3 70B** (`llama-3.3-70b-versatile`) — Content analysis, hook extraction, and platform adaptation
* **Groq Whisper V3** — High-accuracy video audio speech-to-text transcription

### Publishing & Social Distribution Engine
* **[Postiz API](https://postiz.com/)** — Open-source social media scheduling and distribution engine
* **Multi-Platform Sync** — Bluesky, LinkedIn, Instagram, and Mastodon support

### Database & Storage
* **[Supabase](https://supabase.com/)** — Backend database & storage platform
* **`@supabase/supabase-js` & `@supabase/ssr`** — PostgreSQL database queries & file storage for raw videos

---

## 🎯 Problem

Content creators and media teams spend **5–10 hours per week** re-editing, re-formatting, and manually scheduling post variations across fragmented social networks. 
- Traditional social schedulers lack automated AI repurposing engines.
- Generic LLM wrappers produce plain text without platform-native structures (hashtags, hooks, carousels).
- Creators lack visual visibility into their content processing pipeline.

---

## 💡 Solution

CreatorOS bridges AI content extraction directly with automated social publishing infrastructure:
1. **Instant Transcription & Analysis:** Powered by Groq Whisper V3 & Groq Llama-3.3-70B.
2. **Multi-Asset Repurposing:** Generates 12 platform-tailored social assets per video.
3. **Interactive Visual Workflow Graph:** Powered by React Flow (`@xyflow/react`).
4. **1-Click Postiz Automated Distribution:** Seamless scheduling to social networks via Postiz API.

---

## ⚡ Key Features

* 🎨 **Neo-Brutalist Interface:** High-contrast, vibrant visual aesthetic designed for high usability and engagement.
* 🎙️ **Groq Whisper Transcription:** Sub-second video audio speech-to-text conversion.
* 🧠 **Llama 3.3 70B Content Extraction:** Automated extraction of core themes, tone, viral hooks, and platform-native captions.
* 📊 **React Flow Execution Pipeline:** Real-time visual node graph showing live status across pipeline stages.
* 🖼️ **Built-in Thumbnail Creator:** Custom canvas editor for generating promotional post thumbnails.
* 📅 **Postiz Social Queue & Calendar:** Unified scheduling across Bluesky, LinkedIn, Mastodon, and Instagram.

---

## 🔄 How It Works

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────────┐     ┌──────────────────┐
│  Raw Video   │ ──> │ Groq Whisper V3  │ ──> │ Groq Llama 3.3 70B   │ ──> │ 12 Social Assets │
│  MP4 / MOV   │     │  Transcription   │     │ AI Hook Analysis     │     │ IG, LinkedIn, Bsky│
└──────────────┘     └──────────────────┘     └──────────────────────┘     └──────────────────┘
                                                                                     │
                                                                                     ▼
┌──────────────┐     ┌──────────────────┐     ┌──────────────────────┐     ┌──────────────────┐
│ Published    │ <── │ Postiz API Sync  │ <── │ Interactive Approval │ <── │  Thumbnail &     │
│ Social Posts │     │ Automated Queue  │     │ & Edit Stepper       │     │ Content Preview  │
└──────────────┘     └──────────────────┘     └──────────────────────┘     └──────────────────┘
```

---

## 💻 Getting Started

### Prerequisites

* Node.js 18+ or Node.js 20+
* npm / yarn / pnpm / bun

### Installation

```bash
git clone https://github.com/your-username/creator-os.git
cd creator-os
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# AI Configuration (Groq)
GROQ_API_KEY=gsk_your_groq_api_key

# Postiz Social Publishing Configuration
POSTIZ_API_URL=https://api.postiz.com
POSTIZ_API_KEY=your_postiz_api_key

# Queue & Cache (Optional)
REDIS_URL=redis://localhost:6379
```

> **Note:** If API keys are omitted, CreatorOS automatically runs in **Built-in Mock Mode** so judges can test all UI flows without live credentials.

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🛡️ License

MIT License.
