import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import './HierarchyNode.css';

function HierarchyNode({ data, id }) {
  const { label, childrenCount = 0, onAddChild, onRemoveChild } = data;

  const handleButtonClick = (e, callback) => {
    e.stopPropagation();
    e.preventDefault();
    if (callback) callback(id);
  };

  const handleButtonMouseDown = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="hierarchy-node" onMouseDown={(e) => e.stopPropagation()}>
      <Handle type="target" position={Position.Top} isConnectable={true} />
      <Handle type="source" position={Position.Bottom} isConnectable={true} />
      <button
        className="hierarchy-btn-remove-icon"
        onClick={(e) => handleButtonClick(e, onRemoveChild)}
        onMouseDown={handleButtonMouseDown}
        title="Remove This Node"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      <button
        className="hierarchy-btn-add-icon"
        onClick={(e) => handleButtonClick(e, onAddChild)}
        onMouseDown={handleButtonMouseDown}
        title="Add Child"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      <div className="hierarchy-node-content" onMouseDown={(e) => e.stopPropagation()}>
        <div className="hierarchy-node-label">{label}</div>
        {childrenCount > 0 && (
          <div className="hierarchy-node-count">
            {childrenCount} {childrenCount === 1 ? 'child' : 'children'}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(HierarchyNode);

