import { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
  useReactFlow,
} from '@xyflow/react';

import HierarchyNode from './nodes/HierarchyNode';
import EmptyStateNode from './nodes/EmptyStateNode';
import './App.css';

// Define custom node types
const nodeTypes = {
  hierarchy: HierarchyNode,
  emptyState: EmptyStateNode,
};

// Tree layout constants - Credit card proportions (approximately 1.59:1)
const NODE_WIDTH = 280;
const NODE_HEIGHT = 141; // 20% shorter: 176 * 0.8 ≈ 141
const VERTICAL_OFFSET = 32; // 2rem vertical spacing between cards
const INDENT_OFFSET = 32; // 2rem indentation for children
const MIN_SIBLING_SPACING = 40; // Minimum spacing between sibling nodes
const MIN_NODE_SPACING = 30; // Minimum spacing between any nodes

// Calculate tree layout positions - strict vertical tree with preorder traversal
// X-axis = depth, Y-axis = document order (one node per row)
const calculateLayout = (nodes, edges) => {
  // Build parent-child relationships
  const childrenMap = {};
  const parentMap = {};
  
  nodes.forEach(node => {
    childrenMap[node.id] = [];
  });
  
  edges.forEach(edge => {
    if (!childrenMap[edge.source]) {
      childrenMap[edge.source] = [];
    }
    childrenMap[edge.source].push(edge.target);
    parentMap[edge.target] = edge.source;
  });
  
  const positions = {};
  
  // Find root nodes (nodes with no incoming edges)
  const hasIncomingEdge = new Set(edges.map(e => e.target));
  const rootNodes = nodes.filter(n => !hasIncomingEdge.has(n.id));
  
  // Running Y cursor - increments for each node in document order
  let currentY = 50;
  const baseX = 100; // Base X position for root nodes
  
  // Preorder traversal: visit node, then recursively visit all descendants
  const traverse = (nodeId, depth) => {
    // Position current node
    const x = baseX + (depth * INDENT_OFFSET);
    positions[nodeId] = { x, y: currentY };
    
    // Move Y cursor down for this node
    currentY += NODE_HEIGHT + VERTICAL_OFFSET;
    
    // Get children and process them recursively (depth-first)
    const children = childrenMap[nodeId] || [];
    children.forEach(childId => {
      traverse(childId, depth + 1);
    });
    
    // After processing all descendants, Y cursor is already positioned
    // for the next sibling or next node in document order
  };
  
  // Process all root nodes in order
  rootNodes.forEach(root => {
    traverse(root.id, 0);
  });
  
  return positions;
};

// Initial setup - single root node
const createInitialNodes = () => [
  {
    id: 'root',
    type: 'hierarchy',
    data: { 
      label: 'Root',
      childrenCount: 0,
    },
    position: { x: 400, y: 50 },
    draggable: false,
  },
];

const createInitialEdges = () => [];

// Custom wheel handler component to intercept scroll events
// Implements Figma-like smooth zoom and fast pan
function WheelHandler() {
  const { getViewport, setViewport } = useReactFlow();

  const handleWheel = useCallback((event) => {
    // Check if Cmd (metaKey on Mac) or Ctrl (on Windows/Linux) is pressed
    if (event.metaKey || event.ctrlKey) {
      // Zoom when modifier key is held - match pan's direct, responsive approach
      event.preventDefault();
      event.stopPropagation();
      
      const viewport = getViewport();
      const currentZoom = viewport.zoom;
      
      // Match pan's multiplier approach - direct and immediate
      const zoomMultiplier = 1.5; // Same as pan multiplier for consistency
      const zoomDelta = (event.deltaY || 0) * zoomMultiplier;
      
      // Direct zoom calculation - similar to pan's direct application
      // Convert pixel delta to zoom change (negative deltaY = zoom in)
      const zoomChange = -zoomDelta * 0.001; // Scale down for zoom sensitivity
      const newZoom = Math.max(0.1, Math.min(2, currentZoom + zoomChange));
      
      // Apply zoom immediately (no smoothing, matching pan's responsiveness)
      setViewport({ ...viewport, zoom: newZoom });
    } else {
      // Pan when no modifier key - fast, responsive movement
      event.preventDefault();
      event.stopPropagation();
      
      const viewport = getViewport();
      
      // Aggressive pan multiplier for fast, responsive panning
      // Trackpad should feel close to 1:1 gesture movement
      const panMultiplier = 1.5; // Increase for faster pan
      const panX = (event.deltaX || 0) * panMultiplier;
      const panY = (event.deltaY || 0) * panMultiplier;
      
      // Apply pan immediately (no damping for responsiveness)
      setViewport({
        x: viewport.x - panX,
        y: viewport.y - panY,
        zoom: viewport.zoom,
      });
    }
  }, [getViewport, setViewport]);

  useEffect(() => {
    const pane = document.querySelector('.react-flow__pane');
    if (pane) {
      // Use capture phase to intercept before React Flow's handler
      pane.addEventListener('wheel', handleWheel, { passive: false, capture: true });
      return () => {
        pane.removeEventListener('wheel', handleWheel, { capture: true });
      };
    }
  }, [handleWheel]);

  return null;
}

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(createInitialEdges);
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  
  // Keep refs in sync
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  // Get children count for a node
  const getChildrenCount = useCallback((nodeId) => {
    return edges.filter(e => e.source === nodeId).length;
  }, [edges]);

  // Remove node and all its descendants
  const handleRemoveChild = useCallback((nodeId) => {
    setEdges((currentEdges) => {
      // Find all descendants to remove (including the node itself)
      const toRemove = new Set([nodeId]);
      const findDescendants = (parentId) => {
        currentEdges.forEach(edge => {
          if (edge.source === parentId && !toRemove.has(edge.target)) {
            toRemove.add(edge.target);
            findDescendants(edge.target);
          }
        });
      };
      findDescendants(nodeId);
      
      // Remove all nodes in the toRemove set
      setNodes((nds) => nds.filter(n => !toRemove.has(n.id)));
      
      // Remove all edges connected to nodes being removed
      return currentEdges.filter(e => 
        !toRemove.has(e.source) && !toRemove.has(e.target)
      );
    });
  }, []);

  // Add new root node
  const handleAddRoot = useCallback(() => {
    const rootId = `root-${Date.now()}`;
    const newRoot = {
      id: rootId,
      type: 'hierarchy',
      data: {
        label: 'Root',
        childrenCount: 0,
      },
      position: { x: 400, y: 50 },
      draggable: false,
    };
    setNodes([newRoot]);
    setEdges([]);
  }, []);

  // Update node label
  const handleUpdateLabel = useCallback((nodeId, newLabel) => {
    setNodes((nds) => 
      nds.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
  }, []);

  // Add child node
  const handleAddChild = useCallback((parentId) => {
    const childId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const currentEdges = edgesRef.current;
    const childNumber = currentEdges.filter(e => e.source === parentId).length + 1;
    
    const newChild = {
      id: childId,
      type: 'hierarchy',
      data: {
        label: `Child ${childNumber}`,
        childrenCount: 0,
      },
      position: { x: 0, y: 0 }, // Will be recalculated
      draggable: false,
    };
    
    const newEdge = {
      id: `e-${parentId}-${childId}`,
      source: parentId,
      target: childId,
      sourceHandle: 'left',
      targetHandle: 'left',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#4a90e2', strokeWidth: 2.5 },
    };
    
    // Add both node and edge
    setNodes((nds) => [...nds, newChild]);
    setEdges((eds) => [...eds, newEdge]);
  }, []);

  // Update layout positions when nodes or edges change
  useEffect(() => {
    setNodes((nds) => {
      const hierarchyNodes = nds.filter(n => n.type === 'hierarchy');
      const emptyStateNode = nds.find(n => n.type === 'emptyState');
      const currentEdges = edgesRef.current;
      
      // If no hierarchy nodes, show empty state node
      if (hierarchyNodes.length === 0) {
        if (!emptyStateNode) {
          return [{
            id: 'empty-state',
            type: 'emptyState',
            data: {
              onAddRoot: handleAddRoot,
            },
            position: { x: 400, y: 300 },
            draggable: false,
          }];
        }
        // Keep existing empty state node
        return nds;
      }
      
      // If hierarchy nodes exist, remove empty state node and update hierarchy nodes
      const positions = calculateLayout(hierarchyNodes, currentEdges);
      const updatedHierarchyNodes = hierarchyNodes.map((node) => {
        const newPosition = positions[node.id];
        const childrenCount = currentEdges.filter(e => e.source === node.id).length;
        const newData = {
          ...node.data,
          childrenCount: childrenCount,
          onAddChild: handleAddChild,
          onRemoveChild: handleRemoveChild,
          onUpdateLabel: handleUpdateLabel,
        };
        
        // Only create new object if something actually changed
        if (
          node.position.x !== newPosition?.x ||
          node.position.y !== newPosition?.y ||
          node.data.childrenCount !== newData.childrenCount ||
          node.data.label !== newData.label
        ) {
          return {
            ...node,
            position: newPosition || node.position,
            data: newData,
          };
        }
        return node;
      });
      
      // Return hierarchy nodes only (empty state node is removed)
      return updatedHierarchyNodes;
    });
  }, [nodes.length, edges.length, handleAddChild, handleRemoveChild, handleAddRoot, handleUpdateLabel, setNodes]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true}
        panOnScroll={true}
        zoomOnScroll={false}
        fitView
        attributionPosition="bottom-left"
        onPaneMouseDown={(e) => {
          // Prevent panning if clicking on a node or its children
          if (e.target.closest('.hierarchy-node')) {
            e.preventDefault();
          }
        }}
      >
        <WheelHandler />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#6a6a6a" />
        <Panel position="top-left" className="info-panel">
          <h2>🌳 Hierarchy Creator</h2>
          <p>Click buttons on nodes to add/remove children</p>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default App;
