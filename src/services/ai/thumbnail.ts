export interface ThumbnailConcept {
  id: string
  title: string
  subtitle: string
  badgeText: string
  themeColor: string
  textColor: string
  aspectRatio: '16:9' | '9:16'
  layout: 'bold-header' | 'badge-card' | 'split-contrarian'
  backgroundImage?: string
}

export function generateThumbnailConcepts(videoTitle?: string): ThumbnailConcept[] {
  const cleanTitle = (videoTitle || 'VIRAL CREATOR CONTENT MASTERCLASS').trim().toUpperCase()

  return [
    {
      id: 'thumb_1',
      title: cleanTitle,
      subtitle: `AI MASTERCLASS: ${cleanTitle.substring(0, 30)}...`,
      badgeText: 'VIRAL BREAKTHROUGH 🚨',
      themeColor: '#FFDE59', // Neon Yellow
      textColor: '#000000',
      aspectRatio: '16:9',
      layout: 'bold-header',
    },
    {
      id: 'thumb_2',
      title: `DONT MISS THIS: ${cleanTitle}`,
      subtitle: 'REPURPOSE 1 VIDEO INTO 12 MULTI-CHANNEL POSTS',
      badgeText: '10X VELOCITY ⚡️',
      themeColor: '#00E5FF', // Neon Cyan
      textColor: '#000000',
      aspectRatio: '9:16',
      layout: 'badge-card',
    },
    {
      id: 'thumb_3',
      title: `HOW TOP CREATORS DOMINATE ${cleanTitle.substring(0, 25)}`,
      subtitle: 'WHISPER V3 + GROQ LLM AUTOMATION',
      badgeText: 'SECRET METHOD 💎',
      themeColor: '#A3E635', // Neon Lime
      textColor: '#000000',
      aspectRatio: '16:9',
      layout: 'split-contrarian',
    },
  ]
}
