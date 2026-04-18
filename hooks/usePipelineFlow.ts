'use client';

import { useCallback } from 'react';
import { useReactFlow, type Connection } from '@xyflow/react';
import type { NodeKind } from '@/types/nodes';
import { usePipelineStore } from '@/store/pipelineStore';
import { useUIStore } from '@/store/uiStore';
import { NODE_REGISTRY } from '@/lib/nodeRegistry';
import { arePortsCompatible } from '@/lib/typeSystem';

export function usePipelineFlow() {
  const { screenToFlowPosition } = useReactFlow();
  const { addNode, onConnect: storeConnect, nodes, setSelectedNode } = usePipelineStore();
  const { openConfigPanel, closeConfigPanel } = useUIStore();

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const kind = e.dataTransfer.getData('application/reactflow-node-kind') as NodeKind;
      if (!kind || !NODE_REGISTRY[kind]) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addNode(kind, position);
    },
    [screenToFlowPosition, addNode]
  );

  const isValidConnection = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (!sourceNode || !targetNode) return true;
      const sourcePort = sourceNode.data.outputs.find((o) => o.id === connection.sourceHandle);
      const targetPort = targetNode.data.inputs.find((i) => i.id === connection.targetHandle);
      if (!sourcePort || !targetPort) return true;
      return arePortsCompatible(sourcePort.type, targetPort.type);
    },
    [nodes]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      setSelectedNode(node.id);
      openConfigPanel();
    },
    [setSelectedNode, openConfigPanel]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    closeConfigPanel();
  }, [setSelectedNode, closeConfigPanel]);

  return { onDragOver, onDrop, isValidConnection, onNodeClick, onPaneClick, onConnect: storeConnect };
}
