import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import './CustomNode.css';

function CustomNode({ data, isConnectable }) {
  return (
    <div className="custom-node">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="custom-handle"
      />
      <div className="custom-node-header">
        <strong>⭐ {data.label}</strong>
      </div>
      {data.description && (
        <div className="custom-node-body">
          <p>{data.description}</p>
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="custom-handle"
      />
    </div>
  );
}

export default memo(CustomNode);

