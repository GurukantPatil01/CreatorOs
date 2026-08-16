import { PublishingProvider, SocialAccount, PostResult } from './types'
import { PostizProvider } from './providers/postiz.provider'
import { createAdminClient } from '@/lib/supabase/admin'
import { store } from '@/lib/store'

export interface SchedulePostRequest {
  campaignId: string
  generatedContentId?: string
  platform: 'bluesky' | 'mastodon' | 'linkedin' | 'x' | string
  content: string
  scheduledAt: string // ISO date string
  accountId?: string
}

export class PublishingService {
  private provider: PublishingProvider

  constructor() {
    this.provider = new PostizProvider()
  }

  async getConnectedPlatforms(): Promise<SocialAccount[]> {
    return await this.provider.getAccounts()
  }

  async schedulePost(req: SchedulePostRequest): Promise<{
    scheduledPostId: string
    externalPostId: string
    postizPostId: string
    publishingProvider: string
    status: string
    scheduledAt: string
  }> {
    // 1. Get connected channels from Postiz provider
    const accounts = await this.getConnectedPlatforms()
    const targetAccount = accounts.find(
      (a) => a.platform.toLowerCase() === req.platform.toLowerCase()
    ) || accounts[0]

    const accountId = req.accountId || targetAccount?.id || 'int_bluesky_01'

    // 2. Schedule via PostizProvider
    let postResult: PostResult
    try {
      postResult = await this.provider.schedulePost({
        content: req.content,
        accountId,
        platform: req.platform,
        scheduledAt: req.scheduledAt,
        campaignId: req.campaignId,
      })
    } catch (err: any) {
      console.error('[PublishingService] Provider error:', err)
      throw new Error(`Publishing failed: ${err.message || 'Unable to schedule post via Postiz.'}`)
    }

    // 3. Persist record in central store & Supabase database
    let scheduledPostId = `sp_${Date.now()}`
    
    store.addScheduledPost({
      id: scheduledPostId,
      campaign_id: req.campaignId,
      generated_content_id: req.generatedContentId || null,
      platform: req.platform,
      account_id: accountId,
      publishing_provider: 'postiz',
      external_post_id: postResult.externalPostId,
      postiz_post_id: postResult.externalPostId,
      scheduled_at: req.scheduledAt,
      status: postResult.status as any,
      published_url: postResult.publishedUrl || null,
      created_at: new Date().toISOString(),
    })

    try {
      const supabase = createAdminClient()
      const { data, error } = await supabase
        .from('scheduled_posts')
        .insert({
          campaign_id: req.campaignId,
          generated_content_id: req.generatedContentId || null,
          platform: req.platform,
          account_id: accountId,
          publishing_provider: 'postiz',
          external_post_id: postResult.externalPostId,
          postiz_post_id: postResult.externalPostId,
          scheduled_at: req.scheduledAt,
          status: postResult.status,
          published_url: postResult.publishedUrl || null,
        })
        .select()
        .single()

      if (!error && data) {
        scheduledPostId = data.id
      }
    } catch (dbErr) {
      console.warn('[PublishingService] Database record fallback active:', dbErr)
    }

    return {
      scheduledPostId,
      externalPostId: postResult.externalPostId,
      postizPostId: postResult.externalPostId,
      publishingProvider: 'postiz',
      status: postResult.status,
      scheduledAt: req.scheduledAt,
    }
  }

  async getPostStatus(postId: string): Promise<PostResult> {
    return await this.provider.getPostStatus(postId)
  }
}
