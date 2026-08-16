export interface ThumbnailConcept {
  id: string
  title: string
  subtitle: string
  badgeText: string
  themeColor: string
  textColor: string
  aspectRatio: '16:9' | '9:16'
  layout: 'bold-header' | 'badge-card' | 'split-contrarian'
}

export function generateThumbnailConcepts(videoTitle?: string): ThumbnailConcept[] {
  const baseTitle = videoTitle || '5 MISTAKES EVERY CREATOR MAKES IN 2026'

  return [
    {
      id: 'thumb_1',
      title: baseTitle.toUpperCase(),
      subtitle: 'REPURPOSE 1 VIDEO INTO 12 POSTS',
      badgeText: 'AI WORKFLOW 🚨',
      themeColor: '#FFDE59', // Neon Yellow
      textColor: '#000000',
      aspectRatio: '16:9',
      layout: 'bold-header',
    },
    {
      id: 'thumb_2',
      title: 'STOP WASTING 20 HOURS A WEEK ON CAPTIONS',
      subtitle: 'AUTONOMOUS POSTIZ SCHEDULING ENGINE',
      badgeText: '10X VELOCITY ⚡️',
      themeColor: '#00E5FF', // Neon Cyan
      textColor: '#000000',
      aspectRatio: '9:16',
      layout: 'badge-card',
    },
    {
      id: 'thumb_3',
      title: 'HOW TOP 1% CREATORS SCALE MULTI-CHANNEL',
      subtitle: 'WHISPER TRANSCRIPTION + GROQ AI',
      badgeText: 'SECRET METHOD 💎',
      themeColor: '#A3E635', // Neon Lime
      textColor: '#000000',
      aspectRatio: '16:9',
      layout: 'split-contrarian',
    },
  ]
}
