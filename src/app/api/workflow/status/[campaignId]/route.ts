import { NextResponse } from 'next/server'
import { JobStatusService } from '@/services/workflow/jobs'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const { campaignId } = await params
    const jobStatusService = new JobStatusService()
    const nodes = await jobStatusService.getWorkflowNodes(campaignId)

    return NextResponse.json({
      success: true,
      campaignId,
      nodes,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Workflow fetch failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
