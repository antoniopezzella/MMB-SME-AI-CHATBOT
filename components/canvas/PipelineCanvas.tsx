'use client';

import {
  ReactFlow, Background, BackgroundVariant, MiniMap, Controls,
  ReactFlowProvider, ConnectionMode, type Node,
} from '@xyflow/react';
import { usePipelineStore } from '@/store/pipelineStore';
import { usePipelineFlow } from '@/hooks/usePipelineFlow';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAutoSave } from '@/hooks/useAutoSave';
import { nodeTypes } from '@/lib/nodeTypes';
import { edgeTypes } from '@/lib/edgeTypes';
import { getCategoryColor, getKindCategory } from '@/lib/nodeRegistry';
import type { NodeData } from '@/types/nodes';

function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange } = usePipelineStore();
  const { onDragOver, onDrop, isValidConnection, onNodeClick, onPaneClick, onConnect } = usePipelineFlow();
  useKeyboardShortcuts();
  useAutoSave();

  return (
    <div className="h-full w-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        onConnect={onConnect} onNodeClick={onNodeClick as never}
        onPaneClick={onPaneClick} isValidConnection={isValidConnection as never}
        nodeTypes={nodeTypes as never} edgeTypes={edgeTypes as never}
        defaultEdgeOptions={{ type: 'animated' }}
        connectionMode={ConnectionMode.Loose}
        fitView proOptions={{ hideAttribution: true }}
        style={{ background: 'var(--canvas-bg)' }}
      >
        <Background variant={BackgroundVariant.Dots} color="var(--canvas-dot)" gap={20} size={1.2} />
        <MiniMap
          nodeColor={(node: Node) => {
            const data = node.data as unknown as NodeData;
            if (!data?.kind) return 'var(--surface-4)';
            return getCategoryColor(getKindCategory(data.kind));
          }}
          maskColor="rgba(13,13,20,0.75)"
          style={{ background: 'var(--minimap-bg)', border: '1px solid var(--border-default)', borderRadius: 8 }}
          position="bottom-right"
        />
        <Controls position="bottom-left" />
      </ReactFlow>
    </div>
  );
}

export default function PipelineCanvas() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
