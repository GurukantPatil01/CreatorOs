export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface User {
  id: string
  email: string
  name: string | null
  created_at: string
}

export interface Campaign {
  id: string
  user_id: string | null
  name: string
  source_type: 'video' | 'topic'
  source_url: string | null
  status: 'draft' | 'transcribing' | 'analyzing' | 'generating' | 'ready' | 'scheduled' | 'published'
  created_at: string
  updated_at: string
}

export interface ContentAsset {
  id: string
  campaign_id: string
  type: 'original_video' | 'thumbnail' | 'audio'
  url: string
  title: string | null
  created_at: string
}

export interface ContentAnalysis {
  id: string
  campaign_id: string
  transcript: string | null
  summary: string | null
  topics: string[]
  hooks: string[]
  tone: string | null
  keywords: string[]
  created_at: string
}

export interface PlatformContent {
  hook?: string
  caption?: string
  hashtags?: string[]
  cta?: string
  rawText?: string
}

export interface GeneratedContent {
  id: string
  campaign_id: string
  platform: 'instagram' | 'linkedin' | 'bluesky' | 'x'
  content: PlatformContent
  status: 'draft' | 'approved' | 'rejected'
  approved: boolean
  created_at: string
  updated_at: string
}

export interface ScheduledPost {
  id: string
  campaign_id: string
  generated_content_id: string | null
  platform: string
  account_id: string | null
  publishing_provider: string // 'postiz'
  external_post_id: string | null
  postiz_post_id?: string | null
  scheduled_at: string
  status: 'scheduled' | 'published' | 'failed'
  published_url: string | null
  created_at: string
}

export interface WorkflowRun {
  id: string
  campaign_id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  created_at: string
  completed_at: string | null
}

export interface WorkflowNode {
  id: string
  workflow_run_id: string
  node_type: 'upload' | 'transcribe' | 'analyze' | 'generate' | 'review' | 'schedule' | 'publish'
  status: 'pending' | 'running' | 'completed' | 'failed'
  started_at: string | null
  completed_at: string | null
  error: string | null
  metadata: Record<string, unknown>
}
