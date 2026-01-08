import { memo } from 'react';
import './EmptyStateNode.css';

function EmptyStateNode({ data }) {
  const { onAddRoot } = data;

  const handleButtonClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onAddRoot) onAddRoot();
  };

  const handleButtonMouseDown = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="empty-state-node" onMouseDown={(e) => e.stopPropagation()}>
      <div className="empty-state-content">
        <h2>No Hierarchy</h2>
        <p>Create a new root node to get started</p>
        <button 
          className="empty-state-button" 
          onClick={handleButtonClick}
          onMouseDown={handleButtonMouseDown}
        >
          + Create Root Node
        </button>
      </div>
    </div>
  );
}

export default memo(EmptyStateNode);

