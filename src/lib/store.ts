import { Campaign, ScheduledPost, WorkflowNode } from '@/types/database'
import { createAdminClient } from '@/lib/supabase/admin'

export interface ExtendedCampaign extends Campaign {
  nodes?: WorkflowNode[]
  scheduledPosts?: ScheduledPost[]
  transcript?: string
  generatedPosts?: any
}

export interface ExtendedScheduledPost extends ScheduledPost {
  user_id?: string | null
}

export interface UserSocialCredentials {
  userId: string
  blueskyHandle?: string
  blueskyPassword?: string
  linkedinToken?: string
  linkedinUrn?: string
  instagramAccountId?: string
  instagramToken?: string
}

// Global server singleton store with multi-account isolation
class CampaignStore {
  private static instance: CampaignStore
  private campaigns: Map<string, ExtendedCampaign> = new Map()
  private scheduledPosts: Map<string, ExtendedScheduledPost> = new Map()
  private workflowNodes: Map<string, WorkflowNode[]> = new Map() // campaignId -> nodes
  private userCredentials: Map<string, UserSocialCredentials> = new Map() // userId -> credentials

  private constructor() {
    // Seed default demo campaign for demo user
    const defaultCampId = 'cmp_demo'
    const now = new Date().toISOString()
    
    this.campaigns.set(defaultCampId, {
      id: defaultCampId,
      user_id: 'demo_user',
      name: '5 mistakes every content creator makes in 2026',
      source_type: 'video',
      source_url: 'https://assets.creatoros.dev/demo-video.mp4',
      status: 'scheduled',
      created_at: now,
      updated_at: now,
    })

    const mockNodes: WorkflowNode[] = [
      { id: 'node_1', workflow_run_id: 'wf_demo', node_type: 'upload', status: 'completed', started_at: '18:31:00', completed_at: '18:31:02', error: null, metadata: { fileSize: '14.2MB', format: 'MP4' } },
      { id: 'node_2', workflow_run_id: 'wf_demo', node_type: 'transcribe', status: 'completed', started_at: '18:31:02', completed_at: '18:31:04', error: null, metadata: { engine: 'Groq Whisper V3', wordCount: 84 } },
      { id: 'node_3', workflow_run_id: 'wf_demo', node_type: 'analyze', status: 'completed', started_at: '18:31:04', completed_at: '18:31:06', error: null, metadata: { model: 'llama-3.3-70b', hooksCount: 3 } },
      { id: 'node_4', workflow_run_id: 'wf_demo', node_type: 'generate', status: 'completed', started_at: '18:31:06', completed_at: '18:31:09', error: null, metadata: { jobId: 'gen_8f72a91b', platforms: ['Instagram', 'LinkedIn', 'Bluesky'] } },
      { id: 'node_5', workflow_run_id: 'wf_demo', node_type: 'review', status: 'completed', started_at: '18:31:09', completed_at: '18:31:12', error: null, metadata: { approvedBy: 'Creator Demo', platform: 'Bluesky' } },
      { id: 'node_6', workflow_run_id: 'wf_demo', node_type: 'schedule', status: 'completed', started_at: '18:31:12', completed_at: '18:31:14', error: null, metadata: { postizPostId: 'postiz_8f72a91b', target: 'Bluesky API via Postiz' } },
      { id: 'node_7', workflow_run_id: 'wf_demo', node_type: 'publish', status: 'completed', started_at: '18:31:14', completed_at: '18:31:16', error: null, metadata: { targetUrl: 'https://bsky.app/profile/creator.bsky.social' } },
    ]
    this.workflowNodes.set(defaultCampId, mockNodes)

    this.scheduledPosts.set('sp_demo', {
      id: 'sp_demo',
      campaign_id: defaultCampId,
      user_id: 'demo_user',
      generated_content_id: null,
      platform: 'bluesky',
      account_id: 'int_bluesky_01',
      publishing_provider: 'postiz',
      external_post_id: 'postiz_demo_01',
      postiz_post_id: 'postiz_demo_01',
      scheduled_at: new Date(Date.now() + 86400000).toISOString(),
      status: 'scheduled',
      published_url: 'https://bsky.app/profile/creator.bsky.social/post/postiz_demo_01',
      created_at: now,
    })
  }

  public static getInstance(): CampaignStore {
    if (!globalThis._creatorOsStore || typeof globalThis._creatorOsStore.getUserCredentials !== 'function') {
      globalThis._creatorOsStore = new CampaignStore()
    }
    return globalThis._creatorOsStore
  }

  // User Social Credentials
  public setUserCredentials(creds: UserSocialCredentials): void {
    if (!this.userCredentials) {
      this.userCredentials = new Map()
    }
    const existing = this.userCredentials.get(creds.userId) || { userId: creds.userId }
    this.userCredentials.set(creds.userId, { ...existing, ...creds })
  }

  public getUserCredentials(userId: string): UserSocialCredentials | null {
    if (!this.userCredentials) {
      this.userCredentials = new Map()
    }
    return this.userCredentials.get(userId) || null
  }

  // Save or update campaign scoped to user
  public async addCampaign(campaign: ExtendedCampaign): Promise<void> {
    this.campaigns.set(campaign.id, campaign)

    try {
      const supabase = createAdminClient()
      await supabase.from('campaigns').upsert({
        id: campaign.id,
        user_id: campaign.user_id || null,
        name: campaign.name,
        source_type: campaign.source_type,
        source_url: campaign.source_url,
        status: campaign.status,
      })
    } catch (e) {
      // Supabase fallback
    }
  }

  // Get campaigns scoped per user account
  public async getCampaigns(userId?: string | null): Promise<ExtendedCampaign[]> {
    try {
      const supabase = createAdminClient()
      let query = supabase.from('campaigns').select('*').order('created_at', { ascending: false })
      if (userId && userId !== 'demo_user') {
        query = query.eq('user_id', userId)
      }
      const { data, error } = await query
      if (!error && data && data.length > 0) {
        return data as ExtendedCampaign[]
      }
    } catch (e) {
      // Fallback
    }

    const all = Array.from(this.campaigns.values()).reverse()
    if (userId) {
      const userCampaigns = all.filter((c) => c.user_id === userId)
      return userCampaigns.length > 0 ? userCampaigns : (userId === 'demo_user' ? all : [])
    }
    return all
  }

  // Get single campaign
  public async getCampaign(id: string): Promise<ExtendedCampaign | null> {
    return this.campaigns.get(id) || null
  }

  // Workflow Nodes
  public setNodes(campaignId: string, nodes: WorkflowNode[]): void {
    this.workflowNodes.set(campaignId, nodes)
  }

  public getNodes(campaignId: string): WorkflowNode[] {
    return this.workflowNodes.get(campaignId) || this.workflowNodes.get('cmp_demo') || []
  }

  // Scheduled Posts scoped per user
  public addScheduledPost(post: ExtendedScheduledPost): void {
    this.scheduledPosts.set(post.id, post)
    const camp = this.campaigns.get(post.campaign_id)
    if (camp) {
      camp.status = 'scheduled'
      camp.updated_at = new Date().toISOString()
    }
  }

  public getScheduledPosts(userId?: string | null): ExtendedScheduledPost[] {
    const all = Array.from(this.scheduledPosts.values())
    if (userId) {
      const userPosts = all.filter((p) => p.user_id === userId)
      return userPosts.length > 0 ? userPosts : (userId === 'demo_user' ? all : [])
    }
    return all
  }
}

declare global {
  var _creatorOsStore: CampaignStore | undefined
}

export const store = CampaignStore.getInstance()
