import { Campaign, ScheduledPost, WorkflowNode } from '@/types/database'
import { createAdminClient } from '@/lib/supabase/admin'

export interface ExtendedCampaign extends Campaign {
  nodes?: WorkflowNode[]
  scheduledPosts?: ScheduledPost[]
  transcript?: string
  generatedPosts?: any
}

// Global server singleton store
class CampaignStore {
  private static instance: CampaignStore
  private campaigns: Map<string, ExtendedCampaign> = new Map()
  private scheduledPosts: Map<string, ScheduledPost> = new Map()
  private workflowNodes: Map<string, WorkflowNode[]> = new Map() // campaignId -> nodes

  private constructor() {
    // Seed default demo campaign if none present
    const defaultCampId = 'cmp_demo'
    const now = new Date().toISOString()
    
    this.campaigns.set(defaultCampId, {
      id: defaultCampId,
      user_id: null,
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
    if (!globalThis._creatorOsStore) {
      globalThis._creatorOsStore = new CampaignStore()
    }
    return globalThis._creatorOsStore
  }

  // Save or update campaign
  public async addCampaign(campaign: ExtendedCampaign): Promise<void> {
    this.campaigns.set(campaign.id, campaign)

    // Try Supabase insert
    try {
      const supabase = createAdminClient()
      await supabase.from('campaigns').upsert({
        id: campaign.id,
        name: campaign.name,
        source_type: campaign.source_type,
        source_url: campaign.source_url,
        status: campaign.status,
      })
    } catch (e) {
      // Supabase table fallback
    }
  }

  // Get all campaigns
  public async getCampaigns(): Promise<ExtendedCampaign[]> {
    try {
      const supabase = createAdminClient()
      const { data, error } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false })
      if (!error && data && data.length > 0) {
        return data as ExtendedCampaign[]
      }
    } catch (e) {
      // Fallback to in-memory
    }
    return Array.from(this.campaigns.values()).reverse()
  }

  // Get campaign by ID
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

  // Scheduled Posts
  public addScheduledPost(post: ScheduledPost): void {
    this.scheduledPosts.set(post.id, post)
    // Update campaign status
    const camp = this.campaigns.get(post.campaign_id)
    if (camp) {
      camp.status = 'scheduled'
      camp.updated_at = new Date().toISOString()
    }
  }

  public getScheduledPosts(): ScheduledPost[] {
    return Array.from(this.scheduledPosts.values())
  }
}

declare global {
  var _creatorOsStore: CampaignStore | undefined
}

export const store = CampaignStore.getInstance()
