'use client';

import dynamic from 'next/dynamic';
import Toolbar from '@/components/toolbar/Toolbar';
import NodePalette from '@/components/sidebar/NodePalette';
import ConfigPanel from '@/components/config-panel/ConfigPanel';
import TemplateModal from '@/components/templates/TemplateModal';
import { useUIStore } from '@/store/uiStore';
import { useEffect } from 'react';

const PipelineCanvas = dynamic(() => import('@/components/canvas/PipelineCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[var(--canvas-bg)]">
      <div className="text-sm text-[var(--text-muted)]">Loading canvas...</div>
    </div>
  ),
});

export default function PipelinePage() {
  const { openTemplateModal } = useUIStore();

  useEffect(() => {
    const hasVisited = localStorage.getItem('pipeline-visited');
    if (!hasVisited) {
      openTemplateModal();
      localStorage.setItem('pipeline-visited', '1');
    }
  }, [openTemplateModal]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--canvas-bg)]">
      <Toolbar />
      <NodePalette />
      <div className="absolute inset-0 top-14 h-[calc(100%-56px)]">
        <PipelineCanvas />
      </div>
      <ConfigPanel />
      <TemplateModal />
    </div>
  );
}
