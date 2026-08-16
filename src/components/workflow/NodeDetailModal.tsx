'use client'

import { X, CheckCircle2, Clock, AlertTriangle, Layers, Cpu } from 'lucide-react'
import { WorkflowNodeState } from '@/services/workflow/jobs'
import { cn } from '@/lib/utils'

interface NodeDetailModalProps {
  node: WorkflowNodeState | null
  onClose: () => void
}

export function NodeDetailModal({ node, onClose }: NodeDetailModalProps) {
  if (!node) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="creator-card max-w-md w-full p-6 space-y-6 shadow-[8px_8px_0px_0px_#000] relative border-4 border-black bg-white text-black font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-black pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border-2 border-black bg-[#FFDE59] text-black flex items-center justify-center font-mono text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000]">
              {node.nodeType.substring(0, 3)}
            </div>
            <div>
              <h3 className="text-sm font-black text-black uppercase font-mono">{node.nodeType} STEP DETAILS</h3>
              <p className="text-[11px] font-bold text-black">Workflow Node Execution Spec</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-black bg-[#FF5757] text-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Execution Metadata Table */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 border-2 border-black bg-[#F4F4F0] shadow-[2px_2px_0px_0px_#000]">
            <span className="text-black font-mono font-black uppercase">STATUS</span>
            <span
              className={cn(
                'creator-badge uppercase font-black',
                node.status === 'completed' ? 'creator-badge-success' :
                node.status === 'running' ? 'creator-badge-running' :
                node.status === 'failed' ? 'creator-badge-error' : 'creator-badge-pending'
              )}
            >
              {node.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border-2 border-black bg-[#F4F4F0] space-y-1 shadow-[2px_2px_0px_0px_#000]">
              <span className="text-black text-[10px] font-mono font-black uppercase">STARTED</span>
              <p className="text-black font-mono font-black text-xs">{node.startedAt || '18:31:04'}</p>
            </div>
            <div className="p-3 border-2 border-black bg-[#F4F4F0] space-y-1 shadow-[2px_2px_0px_0px_#000]">
              <span className="text-black text-[10px] font-mono font-black uppercase">COMPLETED</span>
              <p className="text-black font-mono font-black text-xs">{node.completedAt || '18:31:07'}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border-2 border-black bg-[#F4F4F0] shadow-[2px_2px_0px_0px_#000]">
            <span className="text-black font-mono font-black uppercase">DURATION</span>
            <span className="text-black font-mono font-black bg-[#FFDE59] px-2 py-0.5 border border-black">{node.duration || '3.2s'}</span>
          </div>

          {/* Platforms List */}
          {node.metadata?.platforms && (
            <div className="p-3 border-2 border-black bg-[#F4F4F0] space-y-1 shadow-[2px_2px_0px_0px_#000]">
              <span className="text-black text-[10px] font-mono font-black uppercase">TARGET PLATFORMS</span>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {node.metadata.platforms.map((p: string) => (
                  <span key={p} className="text-[11px] text-black font-black bg-[#A3E635] px-1.5 py-0.5 border border-black flex items-center gap-1">
                    ✓ {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Job ID */}
          <div className="p-3 border-2 border-black bg-[#F4F4F0] flex items-center justify-between font-mono text-[11px] font-black shadow-[2px_2px_0px_0px_#000]">
            <span className="text-black uppercase">JOB ID</span>
            <span className="text-black bg-[#00E5FF] px-1.5 py-0.5 border border-black">{node.metadata?.jobId || `gen_${node.id.substring(0, 8)}`}</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="creator-button-secondary w-full text-xs"
          >
            CLOSE INSPECTOR
          </button>
        </div>
      </div>
    </div>
  )
}

