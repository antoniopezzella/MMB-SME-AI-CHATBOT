'use client';

import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type XYPosition,
  type Connection,
} from '@xyflow/react';
import { produce } from 'immer';
import type { NodeData, NodeKind } from '@/types/nodes';
import type { EdgeData } from '@/types/edges';
import type { SerializedPipeline } from '@/types/pipeline';
import { NODE_REGISTRY } from '@/lib/nodeRegistry';
import { generateId } from '@/lib/utils';

interface HistoryEntry {
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
}

interface PipelineStore {
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
  onNodesChange: OnNodesChange<Node<NodeData>>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  selectedNodeId: string | null;
  setSelectedNode: (id: string | null) => void;
  addNode: (kind: NodeKind, position: XYPosition) => void;
  updateNodeData: (id: string, patch: Partial<NodeData>) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  history: HistoryEntry[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  loadFromJSON: (pipeline: SerializedPipeline) => void;
  exportToJSON: () => SerializedPipeline;
  pipelineName: string;
  setPipelineName: (name: string) => void;
  lastSavedAt: Date | null;
  setLastSavedAt: (date: Date) => void;
}

export const usePipelineStore = create<PipelineStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  history: [],
  historyIndex: -1,
  pipelineName: 'Untitled Pipeline',
  lastSavedAt: null,

  setLastSavedAt: (date) => set({ lastSavedAt: date }),
  setPipelineName: (name) => set({ pipelineName: name }),

  onNodesChange: (changes) => {
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) }));
  },

  onConnect: (connection: Connection) => {
    const { nodes } = get();
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const portType = sourceNode?.data.outputs.find(
      (o) => o.id === connection.sourceHandle
    )?.type ?? 'any';
    get().pushHistory();
    set((state) => ({
      edges: addEdge({ ...connection, type: 'animated', data: { portType } }, state.edges),
    }));
  },

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  addNode: (kind, position) => {
    const def = NODE_REGISTRY[kind];
    if (!def) return;
    const newNode: Node<NodeData> = {
      id: generateId(),
      type: def.category,
      position,
      data: {
        kind,
        label: def.label,
        description: def.description,
        inputs: def.inputs,
        outputs: def.outputs,
        config: { ...def.defaultConfig },
        status: 'idle',
      },
    };
    get().pushHistory();
    set((state) => ({ nodes: [...state.nodes, newNode] }));
  },

  updateNodeData: (id, patch) => {
    set(produce((state: PipelineStore) => {
      const node = state.nodes.find((n) => n.id === id);
      if (node) Object.assign(node.data, patch);
    }));
  },

  deleteNode: (id) => {
    get().pushHistory();
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },

  duplicateNode: (id) => {
    const { nodes } = get();
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    get().pushHistory();
    const newNode: Node<NodeData> = {
      ...node,
      id: generateId(),
      position: { x: node.position.x + 40, y: node.position.y + 40 },
      data: { ...node.data, config: { ...node.data.config } },
    };
    set((state) => ({ nodes: [...state.nodes, newNode] }));
  },

  pushHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const snapshot: HistoryEntry = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    const trimmed = history.slice(0, historyIndex + 1);
    const newHistory = [...trimmed, snapshot].slice(-50);
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const prev = history[historyIndex - 1];
    set({ nodes: prev.nodes, edges: prev.edges, historyIndex: historyIndex - 1 });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    set({ nodes: next.nodes, edges: next.edges, historyIndex: historyIndex + 1 });
  },

  loadFromJSON: (pipeline) => {
    set({ nodes: pipeline.nodes, edges: pipeline.edges, pipelineName: pipeline.name, selectedNodeId: null, history: [], historyIndex: -1 });
  },

  exportToJSON: (): SerializedPipeline => {
    const { nodes, edges, pipelineName } = get();
    return { id: generateId(), name: pipelineName, nodes, edges, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  },
}));
