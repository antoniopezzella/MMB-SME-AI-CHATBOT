export type PortType = 'string' | 'number' | 'boolean' | 'json' | 'array' | 'binary' | 'any';

export type NodeCategory = 'source' | 'transform' | 'ai' | 'output' | 'preview';

export type NodeKind =
  | 'source.postgres'
  | 'source.rest-api'
  | 'source.file'
  | 'source.webhook'
  | 'source.static-json'
  | 'transform.filter'
  | 'transform.map'
  | 'transform.join'
  | 'transform.aggregate'
  | 'transform.javascript'
  | 'transform.sql'
  | 'ai.llm-prompt'
  | 'ai.embedding'
  | 'ai.classify'
  | 'ai.summarize'
  | 'output.http-post'
  | 'output.write-db'
  | 'output.s3'
  | 'output.console'
  | 'preview.table'
  | 'preview.json'
  | 'preview.stats';

export interface PortDef {
  id: string;
  label: string;
  type: PortType;
  required?: boolean;
}

export type NodeStatus = 'idle' | 'running' | 'success' | 'error';

export interface NodeData {
  kind: NodeKind;
  label: string;
  description?: string;
  inputs: PortDef[];
  outputs: PortDef[];
  config: Record<string, unknown>;
  status?: NodeStatus;
  [key: string]: unknown;
}
