export type NodeStatus = 'idle' | 'running' | 'success' | 'error';

export interface LogEntry {
  nodeId: string;
  message: string;
  level: 'info' | 'warn' | 'error';
  timestamp: number;
}
