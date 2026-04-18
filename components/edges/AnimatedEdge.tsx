'use client';

import { getBezierPath, type EdgeProps } from '@xyflow/react';
import { PORT_COLORS } from '@/lib/typeSystem';
import type { PortType } from '@/types/nodes';

export default function AnimatedEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, selected,
}: EdgeProps) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const edgeData = data as { portType?: PortType; animated?: boolean } | undefined;
  const portType: PortType = edgeData?.portType ?? 'any';
  const color = PORT_COLORS[portType];
  const isAnimated = edgeData?.animated;

  return (
    <>
      <path id={`${id}-shadow`} d={edgePath} fill="none" stroke={color} strokeWidth={selected ? 6 : 4} strokeOpacity={0.12} strokeLinecap="round" />
      <path id={id} d={edgePath} fill="none" stroke={color} strokeWidth={selected ? 2.5 : 1.5} strokeOpacity={selected ? 1 : 0.7} strokeLinecap="round" />
      {isAnimated && (
        <path d={edgePath} fill="none" stroke={color} strokeWidth={2} strokeOpacity={0.9} strokeDasharray="8 8" strokeLinecap="round" style={{ animation: 'flow-dash 1.2s linear infinite' }} />
      )}
    </>
  );
}
