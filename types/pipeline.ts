import type { Node, Edge } from '@xyflow/react';
import type { NodeData } from './nodes';
import type { EdgeData } from './edges';

export interface SerializedPipeline {
  id: string;
  name: string;
  nodes: Node<NodeData>[];
  edges: Edge<EdgeData>[];
  createdAt: string;
  updatedAt: string;
}

export interface PipelineTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  pipeline: SerializedPipeline;
}
