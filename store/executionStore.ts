'use client';

import { create } from 'zustand';
import type { NodeStatus } from '@/types/execution';

interface ExecutionStore {
  isRunning: boolean;
  nodeStatuses: Record<string, NodeStatus>;
  nodeLogs: Record<string, string[]>;
  executionOrder: string[];
  startRun: (orderedNodeIds: string[]) => void;
  stopRun: () => void;
  setNodeStatus: (id: string, status: NodeStatus) => void;
  appendNodeLog: (id: string, line: string) => void;
  clearExecution: () => void;
}

export const useExecutionStore = create<ExecutionStore>((set, get) => ({
  isRunning: false,
  nodeStatuses: {},
  nodeLogs: {},
  executionOrder: [],

  startRun: (orderedNodeIds) => {
    set({
      isRunning: true,
      executionOrder: orderedNodeIds,
      nodeStatuses: Object.fromEntries(orderedNodeIds.map((id) => [id, 'idle' as NodeStatus])),
      nodeLogs: {},
    });
  },

  stopRun: () => {
    const { executionOrder } = get();
    set((s) => ({
      isRunning: false,
      nodeStatuses: Object.fromEntries(
        executionOrder.map((id) => [id, s.nodeStatuses[id] === 'running' ? 'idle' : (s.nodeStatuses[id] ?? 'idle')])
      ),
    }));
  },

  setNodeStatus: (id, status) => set((s) => ({ nodeStatuses: { ...s.nodeStatuses, [id]: status } })),
  appendNodeLog: (id, line) => set((s) => ({ nodeLogs: { ...s.nodeLogs, [id]: [...(s.nodeLogs[id] ?? []), line] } })),
  clearExecution: () => set({ isRunning: false, nodeStatuses: {}, nodeLogs: {}, executionOrder: [] }),
}));
