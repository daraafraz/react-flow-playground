import { BaseEdge } from '@xyflow/react';

export default function LShapeEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style }) {
  // Calculate L-shape: straight down from source, then straight right to target
  // Since source is bottom-left and target is top-left, we go:
  // 1. Down from source Y to target Y level
  // 2. Right from source X to target X
  
  // Create path: Move to source, Line down to target Y, Line right to target
  const path = `M ${sourceX},${sourceY} L ${sourceX},${targetY} L ${targetX},${targetY}`;
  
  return (
    <BaseEdge
      id={id}
      path={path}
      style={style}
    />
  );
}

