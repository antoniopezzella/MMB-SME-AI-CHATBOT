import type { PortType } from '@/types/nodes';

const COMPATIBLE: Record<PortType, PortType[]> = {
  any: ['string', 'number', 'boolean', 'json', 'array', 'binary', 'any'],
  string: ['string', 'any', 'number', 'boolean'],
  number: ['number', 'any', 'string'],
  boolean: ['boolean', 'any', 'string'],
  json: ['json', 'any', 'array'],
  array: ['array', 'any', 'json'],
  binary: ['binary', 'any'],
};

export function arePortsCompatible(source: PortType, target: PortType): boolean {
  if (source === 'any' || target === 'any') return true;
  return COMPATIBLE[source]?.includes(target) ?? false;
}

export const PORT_COLORS: Record<PortType, string> = {
  string: 'var(--port-string)',
  number: 'var(--port-number)',
  boolean: 'var(--port-boolean)',
  json: 'var(--port-json)',
  array: 'var(--port-array)',
  binary: 'var(--port-binary)',
  any: 'var(--port-any)',
};
