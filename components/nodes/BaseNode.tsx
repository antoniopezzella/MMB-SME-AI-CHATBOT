'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { NodeData } from '@/types/nodes';
import { NODE_REGISTRY, getCategoryColor, getKindCategory } from '@/lib/nodeRegistry';
import { PORT_COLORS } from '@/lib/typeSystem';
import { cn } from '@/lib/utils';
import * as icons from 'lucide-react';

const STATUS_RING: Record<string, string> = {
  running: 'shadow-[0_0_12px_2px_rgba(59,130,246,0.4)]',
  success: 'shadow-[0_0_12px_2px_rgba(16,185,129,0.4)]',
  error: 'shadow-[0_0_12px_2px_rgba(239,68,68,0.4)]',
  idle: '',
};

type LucideIconName = keyof typeof icons;

function Icon({ name, size = 14 }: { name: string; size?: number }) {
  const LucideIcon = icons[name as LucideIconName] as React.ComponentType<{ size: number; strokeWidth: number }>;
  if (!LucideIcon) return null;
  return <LucideIcon size={size} strokeWidth={1.5} />;
}

export default function BaseNode({ data: rawData, selected }: NodeProps) {
  const data = rawData as unknown as NodeData;
  const def = NODE_REGISTRY[data.kind];
  if (!def) return null;

  const category = getKindCategory(data.kind);
  const categoryColor = getCategoryColor(category);
  const status = data.status ?? 'idle';

  const configEntries = Object.entries(data.config)
    .filter(([, v]) => v !== '' && v !== null && v !== undefined)
    .slice(0, 3);

  return (
    <div
      className={cn(
        'relative min-w-[200px] max-w-[260px] rounded-xl border transition-all duration-150',
        'border-[var(--border-default)] bg-[var(--surface-2)]',
        selected && 'border-white/30 ring-1 ring-white/20',
        STATUS_RING[status] ?? ''
      )}
      style={{ borderLeftWidth: 3, borderLeftColor: categoryColor }}
    >
      {data.inputs.map((port, i) => (
        <Handle key={port.id} id={port.id} type="target" position={Position.Left}
          style={{ top: `${((i + 1) / (data.inputs.length + 1)) * 100}%`, background: PORT_COLORS[port.type], left: -6 }}
          title={`${port.label} (${port.type})`} />
      ))}

      <div className="flex items-center gap-2 rounded-t-xl px-3 py-2" style={{ background: `${categoryColor}18` }}>
        <span style={{ color: categoryColor }}><Icon name={def.icon} size={14} /></span>
        <span className="flex-1 truncate text-xs font-semibold text-[var(--text-primary)]">{data.label}</span>
        <span className="rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
          style={{ background: `${categoryColor}22`, color: categoryColor }}>{category}</span>
      </div>

      {status !== 'idle' && (
        <div className="h-0.5" style={{ background: status === 'running' ? 'var(--status-running)' : status === 'success' ? 'var(--status-success)' : 'var(--status-error)' }} />
      )}

      {configEntries.length > 0 && (
        <div className="px-3 py-2 space-y-1">
          {configEntries.map(([k, v]) => (
            <div key={k} className="flex gap-1 text-[10px]">
              <span className="text-[var(--text-muted)] shrink-0">{k}:</span>
              <span className="text-[var(--text-secondary)] truncate">{String(v).slice(0, 30)}</span>
            </div>
          ))}
        </div>
      )}

      {data.outputs.map((port, i) => (
        <Handle key={port.id} id={port.id} type="source" position={Position.Right}
          style={{ top: `${((i + 1) / (data.outputs.length + 1)) * 100}%`, background: PORT_COLORS[port.type], right: -6 }}
          title={`${port.label} (${port.type})`} />
      ))}
    </div>
  );
}
