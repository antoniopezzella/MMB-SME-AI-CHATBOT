import type { PortType } from './nodes';

export interface EdgeData {
  portType?: PortType;
  animated?: boolean;
  [key: string]: unknown;
}
