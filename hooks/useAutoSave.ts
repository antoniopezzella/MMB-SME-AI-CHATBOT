'use client';

import { useEffect } from 'react';
import { usePipelineStore } from '@/store/pipelineStore';

const STORAGE_KEY = 'pipeline-autosave';

export function useAutoSave() {
  const { nodes, edges, exportToJSON, loadFromJSON, setLastSavedAt } = usePipelineStore();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && JSON.parse(saved)?.nodes?.length > 0) {
        loadFromJSON(JSON.parse(saved));
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(exportToJSON()));
        setLastSavedAt(new Date());
      } catch { /* ignore */ }
    }, 1500);
    return () => clearTimeout(timer);
  }, [nodes, edges, exportToJSON, setLastSavedAt]);
}
