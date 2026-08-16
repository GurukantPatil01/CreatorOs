export interface SocialAccount {
  id: string
  platform: string // 'bluesky' | 'mastodon' | 'linkedin' | 'x' | 'instagram'
  name: string
  identifier: string
  provider: string // 'postiz'
  connected: boolean
  avatar?: string
}

export interface CreatePostInput {
  content: string
  accountId: string
  platform: string
  scheduledAt?: string // ISO 8601 string
  mediaUrls?: string[]
  campaignId?: string
}

export interface PostResult {
  externalPostId: string
  publishingProvider: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  scheduledAt?: string
  publishedUrl?: string
  error?: string
  accountId?: string
}

export interface PublishingProvider {
  getAccounts(): Promise<SocialAccount[]>
  createPost(input: CreatePostInput): Promise<PostResult>
  schedulePost(input: CreatePostInput): Promise<PostResult>
  publishNow(input: CreatePostInput): Promise<PostResult>
  getPostStatus(postId: string): Promise<PostResult>
  deletePost(postId: string): Promise<void>
}
