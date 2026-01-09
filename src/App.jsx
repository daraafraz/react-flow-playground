import { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
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
import LShapeEdge from './edges/LShapeEdge';
import './App.css';

// Define custom node types
const nodeTypes = {
  hierarchy: HierarchyNode,
  emptyState: EmptyStateNode,
};

// Define custom edge types
const edgeTypes = {
  lshape: LShapeEdge,
};

// Tree layout constants - Credit card proportions (approximately 1.59:1)
const NODE_WIDTH = 280;
const NODE_HEIGHT = 141; // 20% shorter: 176 * 0.8 ≈ 141
const INDENT_OFFSET = 48; // 200% increase: 16px * 3 = 48px
const VERTICAL_OFFSET = 16; // 1rem = 16px
const MIN_SIBLING_SPACING = 40; // Minimum spacing between sibling nodes (increased to prevent overlap)
const MIN_NODE_SPACING = 30; // Minimum spacing between any nodes

// Calculate tree layout positions - children 1rem down and 1rem indented
const calculateLayout = (nodes, edges) => {
  // Filter out empty state nodes
  const hierarchyNodes = nodes.filter(n => n.type === 'hierarchy');
  
  // Build parent-child relationships
  const childrenMap = {};
  const parentMap = {};
  
  hierarchyNodes.forEach(node => {
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
  
  // Find root node (node with no incoming edges)
  const hasIncomingEdge = new Set(edges.map(e => e.target));
  const rootNodes = hierarchyNodes.filter(n => !hasIncomingEdge.has(n.id));
  
  // Position root node
  if (rootNodes.length > 0) {
    rootNodes.forEach((root, index) => {
      positions[root.id] = { x: 100 + index * (NODE_WIDTH + 100), y: 50 };
    });
  }
  
  // Calculate positions for all nodes using BFS
  const queue = [...rootNodes];
  const visited = new Set(rootNodes.map(n => n.id));
  
  while (queue.length > 0) {
    const currentNode = queue.shift();
    const currentPos = positions[currentNode.id];
    const children = childrenMap[currentNode.id] || [];
    
    if (children.length > 0) {
      // Position children 1rem down and 1rem indented
      let currentX = currentPos.x + INDENT_OFFSET;
      const startY = currentPos.y + NODE_HEIGHT + VERTICAL_OFFSET;
      
      children.forEach((childId, index) => {
        // Check if this child would overlap with previous siblings
        if (index > 0) {
          const prevChildId = children[index - 1];
          const prevChildPos = positions[prevChildId];
          // Ensure minimum spacing from previous sibling
          currentX = Math.max(
            currentX,
            prevChildPos.x + NODE_WIDTH + MIN_SIBLING_SPACING
          );
        }
        
        // Position child - ensure it doesn't overlap with parent
        const childX = Math.max(currentX, currentPos.x + INDENT_OFFSET);
        positions[childId] = { x: childX, y: startY };
        
        // Move to next position for potential next sibling
        currentX = childX + NODE_WIDTH + MIN_SIBLING_SPACING;
        
        // Add to queue if not visited
        if (!visited.has(childId)) {
          const childNode = hierarchyNodes.find(n => n.id === childId);
          if (childNode) {
            queue.push(childNode);
            visited.add(childId);
          }
        }
      });
    }
  }
  
  // Comprehensive collision detection - check ALL nodes for overlaps
  const resolveCollisions = () => {
    const nodeIds = Object.keys(positions);
    const MIN_SPACING = MIN_NODE_SPACING; // Minimum spacing between any two nodes
    
    // Check all pairs of nodes
    let hasOverlaps = true;
    let iterations = 0;
    const maxIterations = 50;
    
    while (hasOverlaps && iterations < maxIterations) {
      hasOverlaps = false;
      iterations++;
      
      for (let i = 0; i < nodeIds.length; i++) {
        for (let j = i + 1; j < nodeIds.length; j++) {
          const node1Id = nodeIds[i];
          const node2Id = nodeIds[j];
          const pos1 = positions[node1Id];
          const pos2 = positions[node2Id];
          
          // Check if nodes overlap (considering both x and y)
          const overlapX = pos1.x + NODE_WIDTH + MIN_SPACING > pos2.x && 
                          pos2.x + NODE_WIDTH + MIN_SPACING > pos1.x;
          const overlapY = pos1.y + NODE_HEIGHT + MIN_SPACING > pos2.y && 
                          pos2.y + NODE_HEIGHT + MIN_SPACING > pos1.y;
          
          if (overlapX && overlapY) {
            hasOverlaps = true;
            
            // Determine which node to move (prefer moving the one further right/down)
            // If they're on the same level (similar y), move the right one
            const yDiff = Math.abs(pos1.y - pos2.y);
            if (yDiff < 10) {
              // Same level - move the rightmost one further right
              if (pos1.x < pos2.x) {
                positions[node2Id].x = pos1.x + NODE_WIDTH + MIN_SPACING;
              } else {
                positions[node1Id].x = pos2.x + NODE_WIDTH + MIN_SPACING;
              }
            } else {
              // Different levels - move the lower one down
              if (pos1.y < pos2.y) {
                positions[node2Id].y = pos1.y + NODE_HEIGHT + MIN_SPACING;
              } else {
                positions[node1Id].y = pos2.y + NODE_HEIGHT + MIN_SPACING;
              }
            }
          }
        }
      }
    }
    
    // Final pass: ensure siblings on same level don't overlap
    const nodesByLevel = {};
    nodeIds.forEach(nodeId => {
      const y = positions[nodeId].y;
      const level = Math.floor(y / 50) * 50; // Group by approximate level
      if (!nodesByLevel[level]) {
        nodesByLevel[level] = [];
      }
      nodesByLevel[level].push(nodeId);
    });
    
    Object.values(nodesByLevel).forEach(levelNodes => {
      // Sort by x position
      levelNodes.sort((a, b) => positions[a].x - positions[b].x);
      
      for (let i = 0; i < levelNodes.length - 1; i++) {
        const node1Id = levelNodes[i];
        const node2Id = levelNodes[i + 1];
        const pos1 = positions[node1Id];
        const pos2 = positions[node2Id];
        
        // Ensure minimum spacing
        if (pos1.x + NODE_WIDTH + MIN_SPACING > pos2.x) {
          positions[node2Id].x = pos1.x + NODE_WIDTH + MIN_SPACING;
        }
      }
    });
  };
  
  resolveCollisions();
  
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
      sourceHandle: 'bottom-left',
      targetHandle: 'top-left',
      type: 'lshape',
      animated: false,
      style: { stroke: '#4a90e2', strokeWidth: 2 },
    };
    
    // Add both node and edge
    setNodes((nds) => [...nds, newChild]);
    setEdges((eds) => [...eds, newEdge]);
  }, []);

  // Update layout positions when nodes or edges change
  useEffect(() => {
    setNodes((nds) => {
      // Handle empty state node
      const hasEmptyState = nds.some(n => n.type === 'emptyState');
      const hasHierarchyNodes = nds.some(n => n.type === 'hierarchy');
      
      // Add empty state node if no hierarchy nodes exist
      if (!hasHierarchyNodes && !hasEmptyState) {
        const emptyStateNode = {
          id: 'empty-state',
          type: 'emptyState',
          data: {
            onAddRoot: handleAddRoot,
          },
          position: { x: 400, y: 300 }, // Center-ish position
          draggable: false,
        };
        return [emptyStateNode];
      }
      
      // Remove empty state node if hierarchy nodes exist
      if (hasHierarchyNodes && hasEmptyState) {
        return nds.filter(n => n.type !== 'emptyState');
      }
      
      // If only empty state exists, return as is
      if (hasEmptyState && !hasHierarchyNodes) {
        return nds;
      }
      
      // Update hierarchy nodes
      const hierarchyNodes = nds.filter(n => n.type === 'hierarchy');
      const currentEdges = edgesRef.current;
      const positions = calculateLayout(hierarchyNodes, currentEdges);
      
      return hierarchyNodes.map((node) => {
        const newPosition = positions[node.id];
        const childrenCount = currentEdges.filter(e => e.source === node.id).length;
        const newData = {
          ...node.data,
          childrenCount: childrenCount,
          onAddChild: handleAddChild,
          onRemoveChild: handleRemoveChild,
        };
        
        // Only create new object if something actually changed
        if (
          node.position.x !== newPosition?.x ||
          node.position.y !== newPosition?.y ||
          node.data.childrenCount !== newData.childrenCount
        ) {
          return {
            ...node,
            position: newPosition || node.position,
            data: newData,
          };
        }
        return node;
      });
    });
  }, [nodes.length, edges.length, handleAddChild, handleRemoveChild, handleAddRoot, setNodes]);

  // Inner component that has access to ReactFlow context
  const FlowContent = () => {
    const { fitView, getViewport, setViewport } = useReactFlow();
    const hasInitialized = useRef(false);

    // Center viewport on initial load with lower zoom
    useEffect(() => {
      if (!hasInitialized.current && nodes.length > 0) {
        // Small delay to ensure React Flow is fully initialized
        const timer = setTimeout(() => {
          fitView({ padding: 0.2, duration: 0 });
          // Get current viewport after fitView and reduce zoom by 3 steps
          // Each zoom step in React Flow controls is typically ~0.1
          // So 3 clicks of minus = reduce zoom by ~0.3
          const currentViewport = getViewport();
          const newZoom = Math.max(0.1, currentViewport.zoom - 0.3);
          setViewport({ ...currentViewport, zoom: newZoom }, { duration: 0 });
          hasInitialized.current = true;
        }, 150);
        return () => clearTimeout(timer);
      }
    }, [nodes.length, fitView, getViewport, setViewport]);

    return (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true}
        panOnScroll={false}
        zoomOnScroll={true}
        fitView={false}
        attributionPosition="bottom-left"
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#6a6a6a" />
        <Panel position="top-left" className="info-panel">
          <h2>🌳 Hierarchy Creator</h2>
          <p>Click buttons on nodes to add/remove children</p>
        </Panel>
      </ReactFlow>
    );
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <FlowContent />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
