'use client'

import { useState } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { WorkflowNodeState } from '@/services/workflow/jobs'
import { NodeDetailModal } from './NodeDetailModal'
import { CheckCircle2, Loader2, Circle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WorkflowGraphProps {
  campaignId: string
  initialNodes?: WorkflowNodeState[]
}

// Custom Node Layout Component matching Neo-Brutalist aesthetics
function CustomPipelineNode({ data }: { data: any }) {
  const status = data.nodeState?.status || 'pending'

  return (
    <div className={cn(
      'px-4 py-2.5 border-3 border-black min-w-[130px] text-center shadow-[4px_4px_0px_0px_#000] transition-all font-mono font-black',
      status === 'completed' ? 'bg-[#A3E635] text-black' :
      status === 'running' ? 'bg-[#00E5FF] text-black' :
      status === 'failed' ? 'bg-[#FF5757] text-black' : 'bg-white text-black'
    )}>
      <Handle type="target" position={Position.Left} className="!bg-black !w-2.5 !h-2.5 !border-1 !border-black" />
      <div className="flex items-center gap-1.5 justify-center mb-0.5">
        {status === 'completed' ? (
          <CheckCircle2 className="w-4 h-4 stroke-[3] text-black" />
        ) : status === 'running' ? (
          <Loader2 className="w-4 h-4 text-black animate-spin stroke-[3]" />
        ) : status === 'failed' ? (
          <AlertTriangle className="w-4 h-4 text-black stroke-[3]" />
        ) : (
          <Circle className="w-4 h-4 text-black stroke-[2]" />
        )}
        <span className="text-xs font-black uppercase text-black">{data.label}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-wider text-black">{status}</p>
      <Handle type="source" position={Position.Right} className="!bg-black !w-2.5 !h-2.5 !border-1 !border-black" />
    </div>
  )
}

const nodeTypes = {
  pipelineNode: CustomPipelineNode,
}

export function WorkflowGraph({ campaignId, initialNodes }: WorkflowGraphProps) {
  const [selectedNode, setSelectedNode] = useState<WorkflowNodeState | null>(null)

  const nodeStates: WorkflowNodeState[] = initialNodes || [
    { id: 'upload', nodeType: 'upload', status: 'completed', startedAt: '18:31:00', completedAt: '18:31:02', duration: '2.1s', metadata: { fileSize: '14.2MB', format: 'MP4' } },
    { id: 'transcribe', nodeType: 'transcribe', status: 'completed', startedAt: '18:31:02', completedAt: '18:31:04', duration: '1.9s', metadata: { engine: 'Groq Whisper V3', wordCount: 84 } },
    { id: 'analyze', nodeType: 'analyze', status: 'completed', startedAt: '18:31:04', completedAt: '18:31:06', duration: '2.4s', metadata: { model: 'llama-3.3-70b', hooksCount: 3 } },
    { id: 'generate', nodeType: 'generate', status: 'completed', startedAt: '18:31:06', completedAt: '18:31:09', duration: '3.2s', metadata: { jobId: 'gen_8f72a91b', platforms: ['Instagram', 'LinkedIn', 'Bluesky'] } },
    { id: 'review', nodeType: 'review', status: 'completed', startedAt: '18:31:09', completedAt: '18:31:12', duration: '3.0s', metadata: { approvedBy: 'Creator Demo', platform: 'Bluesky' } },
    { id: 'schedule', nodeType: 'schedule', status: 'completed', startedAt: '18:31:12', completedAt: '18:31:14', duration: '2.0s', metadata: { postizPostId: 'postiz_8f72a91b', target: 'Bluesky API' } },
    { id: 'publish', nodeType: 'publish', status: 'running', startedAt: '18:31:14', metadata: { targetUrl: 'https://bsky.app/profile/creator.bsky.social' } },
  ]

  // Construct React Flow Nodes
  const initialFlowNodes = nodeStates.map((ns, idx) => ({
    id: ns.id,
    type: 'pipelineNode',
    position: { x: idx * 175 + 20, y: 70 },
    data: { label: ns.nodeType, nodeState: ns },
  }))

  // Construct React Flow Edges
  const initialFlowEdges = nodeStates.slice(0, -1).map((ns, idx) => ({
    id: `e_${ns.id}_${nodeStates[idx + 1].id}`,
    source: ns.id,
    target: nodeStates[idx + 1].id,
    animated: ns.status === 'running' || nodeStates[idx + 1].status === 'running',
    style: { stroke: '#000000', strokeWidth: 3 },
  }))

  const [nodes] = useNodesState(initialFlowNodes)
  const [edges] = useEdgesState(initialFlowEdges)

  return (
    <div className="creator-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b-3 border-black pb-3">
        <div>
          <h3 className="text-xs font-black text-black uppercase tracking-wider font-mono">
            WORKFLOW EXECUTION PIPELINE
          </h3>
          <p className="text-[11px] font-bold text-black">Real-time backend job execution graph</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono font-black">
          <span className="flex items-center gap-1 bg-[#A3E635] px-2 py-0.5 border border-black text-black">
            COMPLETED
          </span>
          <span className="flex items-center gap-1 bg-[#00E5FF] px-2 py-0.5 border border-black text-black">
            RUNNING
          </span>
        </div>
      </div>

      <div className="h-56 w-full border-3 border-black bg-[#F4F4F0] overflow-hidden shadow-[4px_4px_0px_0px_#000]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => {
            const state = node.data.nodeState as WorkflowNodeState
            setSelectedNode(state)
          }}
          fitView
          colorMode="light"
        >
          <Background color="#000000" gap={16} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      <NodeDetailModal
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  )
}

