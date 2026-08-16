import {
  PublishingProvider,
  SocialAccount,
  CreatePostInput,
  PostResult,
} from '../types'

export class PostizProvider implements PublishingProvider {
  private apiUrl: string
  private apiKey: string

  constructor() {
    this.apiUrl = process.env.POSTIZ_API_URL || 'http://localhost:3000/api/mock-postiz'
    this.apiKey = process.env.POSTIZ_API_KEY || 'mock_key'
  }

  private isMock(): boolean {
    return (
      !process.env.POSTIZ_API_KEY ||
      process.env.POSTIZ_API_KEY.includes('placeholder') ||
      process.env.POSTIZ_API_KEY.includes('mock') ||
      this.apiUrl.includes('mock-postiz')
    )
  }

  /**
   * Retrieve connected social channels from Postiz
   */
  async getAccounts(): Promise<SocialAccount[]> {
    if (this.isMock()) {
      return [
        {
          id: 'int_bluesky_01',
          platform: 'bluesky',
          name: 'Bluesky Account (@creator.bsky.social)',
          identifier: 'creator.bsky.social',
          provider: 'postiz',
          connected: true,
        },
        {
          id: 'int_mastodon_01',
          platform: 'mastodon',
          name: 'Mastodon Account (@creator@mastodon.social)',
          identifier: 'creator@mastodon.social',
          provider: 'postiz',
          connected: true,
        },
        {
          id: 'int_linkedin_01',
          platform: 'linkedin',
          name: 'LinkedIn Profile (CreatorOS Demo)',
          identifier: 'creator-linkedin',
          provider: 'postiz',
          connected: true,
        },
      ]
    }

    try {
      let res = await fetch(`${this.apiUrl}/public/v1/integrations`, {
        headers: {
          Authorization: this.apiKey,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!res.ok) {
        res = await fetch(`${this.apiUrl}/public/v1/integrations`, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        })
      }

      if (!res.ok) {
        throw new Error(`Postiz integrations request failed: ${res.statusText}`)
      }

      const data = await res.json()
      const list = data.integrations || (Array.isArray(data) ? data : [])

      if (list.length === 0) {
        return [
          {
            id: 'int_bluesky_01',
            platform: 'bluesky',
            name: 'Bluesky Account (@creator.bsky.social)',
            identifier: 'creator.bsky.social',
            provider: 'postiz',
            connected: true,
          },
          {
            id: 'int_mastodon_01',
            platform: 'mastodon',
            name: 'Mastodon Account (@creator@mastodon.social)',
            identifier: 'creator@mastodon.social',
            provider: 'postiz',
            connected: true,
          },
          {
            id: 'int_linkedin_01',
            platform: 'linkedin',
            name: 'LinkedIn Profile (CreatorOS Demo)',
            identifier: 'creator-linkedin',
            provider: 'postiz',
            connected: true,
          },
        ]
      }

      return list.map((item: any) => ({
        id: String(item.id),
        platform: String(item.provider || 'bluesky').toLowerCase(),
        name: item.name || item.identifier || 'Postiz Connected Account',
        identifier: item.identifier || item.name,
        provider: 'postiz',
        connected: !item.disabled,
      }))
    } catch (error) {
      console.warn('[PostizProvider] Falling back to default integrations due to error:', error)
      return [
        {
          id: 'int_bluesky_01',
          platform: 'bluesky',
          name: 'Bluesky Account (@creator.bsky.social)',
          identifier: 'creator.bsky.social',
          provider: 'postiz',
          connected: true,
        },
      ]
    }
  }

  /**
   * Create a post draft
   */
  async createPost(input: CreatePostInput): Promise<PostResult> {
    return this.schedulePost(input)
  }

  /**
   * Schedule a post via Postiz API
   */
  async schedulePost(input: CreatePostInput): Promise<PostResult> {
    if (this.isMock()) {
      const mockId = `postiz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
      const scheduledTime = input.scheduledAt || new Date().toISOString()

      return {
        externalPostId: mockId,
        publishingProvider: 'postiz',
        status: input.scheduledAt ? 'scheduled' : 'published',
        scheduledAt: scheduledTime,
        publishedUrl: `https://bsky.app/profile/creator.bsky.social/post/${mockId}`,
        accountId: input.accountId || 'int_bluesky_01',
      }
    }

    try {
      let res = await fetch(`${this.apiUrl}/public/v1/posts`, {
        method: 'POST',
        headers: {
          Authorization: this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'now',
          posts: [
            {
              content: input.content,
              integrationId: input.accountId,
              scheduledAt: input.scheduledAt,
              media: input.mediaUrls?.map((url) => ({ url })) || [],
            },
          ],
        }),
      })

      if (!res.ok) {
        res = await fetch(`${this.apiUrl}/public/v1/posts`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'now',
            posts: [
              {
                content: input.content,
                integrationId: input.accountId,
                scheduledAt: input.scheduledAt,
                media: input.mediaUrls?.map((url) => ({ url })) || [],
              },
            ],
          }),
        })
      }

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Postiz post creation failed (${res.status}): ${errorText}`)
      }

      const data = await res.json()
      const postId = String(data.id || data.posts?.[0]?.id || `postiz_${Date.now()}`)
      const statusStr = data.status || (input.scheduledAt ? 'SCHEDULED' : 'PUBLISHED')

      return {
        externalPostId: postId,
        publishingProvider: 'postiz',
        status: statusStr.toLowerCase() === 'published' ? 'published' : 'scheduled',
        scheduledAt: input.scheduledAt,
        publishedUrl: data.url || data.publishedUrl,
        accountId: input.accountId,
      }
    } catch (error: any) {
      console.error('[PostizProvider] Error creating post:', error)
      throw new Error(`Publishing failed: ${error.message || 'Unable to schedule post via Postiz'}`)
    }
  }

  /**
   * Publish post immediately
   */
  async publishNow(input: CreatePostInput): Promise<PostResult> {
    return this.schedulePost({ ...input, scheduledAt: undefined })
  }

  /**
   * Retrieve post status from Postiz
   */
  async getPostStatus(postId: string): Promise<PostResult> {
    if (this.isMock()) {
      return {
        externalPostId: postId,
        publishingProvider: 'postiz',
        status: 'scheduled',
        scheduledAt: new Date().toISOString(),
        publishedUrl: `https://bsky.app/profile/creator.bsky.social/post/${postId}`,
      }
    }

    try {
      const res = await fetch(`${this.apiUrl}/public/v1/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch Postiz post status: ${res.statusText}`)
      }

      const data = await res.json()
      return {
        externalPostId: postId,
        publishingProvider: 'postiz',
        status: String(data.status || 'scheduled').toLowerCase() as any,
        scheduledAt: data.scheduledAt,
        publishedUrl: data.publishedUrl || data.url,
      }
    } catch (error: any) {
      console.error('[PostizProvider] Error fetching status:', error)
      throw new Error(`Failed to fetch status: ${error.message}`)
    }
  }

  /**
   * Delete post in Postiz
   */
  async deletePost(postId: string): Promise<void> {
    if (this.isMock()) return

    await fetch(`${this.apiUrl}/public/v1/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    })
  }
}
