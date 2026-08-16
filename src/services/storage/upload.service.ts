import { createAdminClient } from '@/lib/supabase/admin'
import { store } from '@/lib/store'
import { WorkflowNode } from '@/types/database'

export interface CampaignUploadResult {
  campaignId: string
  campaignName: string
  sourceType: 'video' | 'topic'
  sourceUrl: string
  status: string
  workflowRunId: string
}

export class UploadService {
  /**
   * Upload video file or initialize topic campaign scoped to userId
   */
  async createCampaignFromUpload(
    file?: File | Blob | null,
    fileName?: string,
    topicText?: string,
    userId?: string | null
  ): Promise<CampaignUploadResult> {
    const campaignId = `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    const workflowRunId = `wf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    const ownerId = userId || 'demo_user'

    let sourceType: 'video' | 'topic' = 'video'
    let sourceUrl = 'https://assets.creatoros.dev/demo-video.mp4'
    let campaignName = topicText || fileName || 'Untitled Campaign'

    // Handle File Upload to Supabase Storage if file present
    if (file) {
      sourceType = 'video'
      const sanitizedName = (fileName || 'video.mp4').replace(/[^a-zA-Z0-9.-]/g, '_')
      const storagePath = `${campaignId}/${sanitizedName}`

      try {
        const supabase = createAdminClient()
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const { data, error } = await supabase.storage
          .from('campaign-videos')
          .upload(storagePath, buffer, {
            contentType: file.type || 'video/mp4',
            upsert: true,
          })

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('campaign-videos')
            .getPublicUrl(storagePath)
          sourceUrl = publicUrlData.publicUrl
        } else {
          sourceUrl = `https://storage.creatoros.dev/${storagePath}`
        }
      } catch (err) {
        console.warn('[UploadService] Supabase storage upload fallback:', err)
        sourceUrl = `https://storage.creatoros.dev/${storagePath}`
      }
    } else if (topicText) {
      sourceType = 'topic'
      sourceUrl = `topic://${encodeURIComponent(topicText)}`
    }

    const now = new Date().toISOString()
    const initialNodes: WorkflowNode[] = [
      { id: `node_1_${campaignId}`, workflow_run_id: workflowRunId, node_type: 'upload', status: 'completed', started_at: now, completed_at: now, error: null, metadata: { sourceType, fileName: fileName || campaignName } },
      { id: `node_2_${campaignId}`, workflow_run_id: workflowRunId, node_type: 'transcribe', status: 'running', started_at: now, completed_at: null, error: null, metadata: { engine: 'Groq Whisper V3' } },
      { id: `node_3_${campaignId}`, workflow_run_id: workflowRunId, node_type: 'analyze', status: 'pending', started_at: null, completed_at: null, error: null, metadata: { model: 'llama-3.3-70b' } },
      { id: `node_4_${campaignId}`, workflow_run_id: workflowRunId, node_type: 'generate', status: 'pending', started_at: null, completed_at: null, error: null, metadata: { platforms: ['Instagram', 'LinkedIn', 'Bluesky'] } },
      { id: `node_5_${campaignId}`, workflow_run_id: workflowRunId, node_type: 'review', status: 'pending', started_at: null, completed_at: null, error: null, metadata: {} },
      { id: `node_6_${campaignId}`, workflow_run_id: workflowRunId, node_type: 'schedule', status: 'pending', started_at: null, completed_at: null, error: null, metadata: {} },
      { id: `node_7_${campaignId}`, workflow_run_id: workflowRunId, node_type: 'publish', status: 'pending', started_at: null, completed_at: null, error: null, metadata: {} },
    ]

    // Save to central store scoped per user
    await store.addCampaign({
      id: campaignId,
      user_id: ownerId,
      name: campaignName,
      source_type: sourceType,
      source_url: sourceUrl,
      status: 'transcribing',
      created_at: now,
      updated_at: now,
    })
    store.setNodes(campaignId, initialNodes)

    // Persist campaign & asset record to Supabase DB (with fallback)
    try {
      const supabase = createAdminClient()
      
      // 1. Insert Campaign
      await supabase.from('campaigns').insert({
        id: campaignId,
        user_id: ownerId !== 'demo_user' ? ownerId : null,
        name: campaignName,
        source_type: sourceType,
        source_url: sourceUrl,
        status: 'transcribing',
      })

      // 2. Insert Asset
      await supabase.from('content_assets').insert({
        campaign_id: campaignId,
        type: 'original_video',
        url: sourceUrl,
        title: campaignName,
      })

      // 3. Create Workflow Run & Initial Nodes
      await supabase.from('workflow_runs').insert({
        id: workflowRunId,
        campaign_id: campaignId,
        status: 'running',
      })

      await supabase.from('workflow_nodes').insert(initialNodes)
    } catch (dbErr) {
      console.warn('[UploadService] Database insertion fallback mode active:', dbErr)
    }

    return {
      campaignId,
      campaignName,
      sourceType,
      sourceUrl,
      status: 'transcribing',
      workflowRunId,
    }
  }
}
