import { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import './HierarchyNode.css';

function HierarchyNode({ data, id }) {
  const { label, childrenCount = 0, onAddChild, onRemoveChild, onUpdateLabel } = data;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Update editValue when label changes externally
  useEffect(() => {
    if (!isEditing) {
      setEditValue(label);
    }
  }, [label, isEditing]);

  const handleButtonClick = (e, callback) => {
    e.stopPropagation();
    e.preventDefault();
    if (callback) callback(id);
  };

  const handleButtonMouseDown = (e) => {
    e.stopPropagation();
  };

  const handleLabelClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isEditing && onUpdateLabel) {
      setIsEditing(true);
      setEditValue(label);
    }
  };

  const handleLabelMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    // Also stop on pointer events
    if (e.nativeEvent) {
      e.nativeEvent.stopPropagation();
    }
  };

  const handleLabelBlur = () => {
    if (isEditing && onUpdateLabel) {
      const trimmedValue = editValue.trim();
      if (trimmedValue && trimmedValue !== label) {
        onUpdateLabel(id, trimmedValue);
      } else {
        setEditValue(label); // Reset to original if empty or unchanged
      }
      setIsEditing(false);
    }
  };

  const handleLabelKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditValue(label);
      setIsEditing(false);
    }
  };

  const handleNodeMouseDown = (e) => {
    // Stop propagation to prevent React Flow from capturing the event
    // This allows label clicks to work while preventing node dragging/panning
    e.stopPropagation();
  };

  return (
    <div className="hierarchy-node" onMouseDown={handleNodeMouseDown}>
      <Handle type="target" position={Position.Left} id="left" isConnectable={true} className="hierarchy-handle-left" />
      <Handle type="source" position={Position.Left} id="left" isConnectable={true} className="hierarchy-handle-left" />
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
        {isEditing ? (
          <input
            ref={inputRef}
            className="hierarchy-node-label-input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleLabelBlur}
            onKeyDown={handleLabelKeyDown}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        ) : (
          <div 
            className="hierarchy-node-label"
            onClick={handleLabelClick}
            onMouseDown={handleLabelMouseDown}
            onPointerDown={handleLabelMouseDown}
            onMouseUp={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            title="Click to edit"
          >
            {label}
          </div>
        )}
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

