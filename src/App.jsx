import { useRef, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
  ReactFlowProvider,
} from '@xyflow/react';

import HierarchyNode from './nodes/HierarchyNode';
import EmptyStateNode from './nodes/EmptyStateNode';
import { WheelHandler } from './components/WheelHandler';
import { InitialCentering } from './components/InitialCentering';
import { useNodeHeights } from './hooks/useNodeHeights';
import { useHierarchyActions } from './hooks/useHierarchyActions';
import { useHierarchyLayout } from './hooks/useHierarchyLayout';
import { createInitialNodes, createInitialEdges } from './utils/initialState';
import { filterVisibleNodes, filterVisibleEdges } from './utils/tree';
import { INITIAL_VIEWPORT } from './constants/layout';
import './App.css';

const nodeTypes = {
  hierarchy: HierarchyNode,
  emptyState: EmptyStateNode,
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(createInitialEdges);
  const edgesRef = useRef(edges);

  // Keep edges ref in sync
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  // Measure and track node heights for dynamic layout
  const { nodeHeightsRef, layoutTrigger } = useNodeHeights(nodes);

  // Hierarchy manipulation actions
  const actions = useHierarchyActions(setNodes, setEdges, edgesRef);

  // Calculate and update layout
  useHierarchyLayout(
    nodes,
    edges,
    nodeHeightsRef,
    layoutTrigger,
    actions,
    setNodes
  );

  // Filter visible nodes (hide collapsed descendants)
  const visibleNodes = useMemo(() => {
    const { visibleNodes: filtered } = filterVisibleNodes(
      nodes,
      edges,
      actions.getDescendantIds
    );
    return filtered;
  }, [nodes, edges, actions.getDescendantIds]);

  // Filter visible edges (hide edges to/from collapsed nodes)
  const visibleEdges = useMemo(() => {
    const collapsedNodeIds = new Set();
    const collapsedParents = new Set();

    nodes.forEach((node) => {
      if (node.data?.isCollapsed) {
        collapsedParents.add(node.id);
        const descendants = actions.getDescendantIds(node.id, edges);
        descendants.forEach((id) => collapsedNodeIds.add(id));
      }
    });

    return filterVisibleEdges(edges, collapsedNodeIds, collapsedParents);
  }, [nodes, edges, actions.getDescendantIds]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={visibleNodes}
          edges={visibleEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={true}
          panOnScroll={true}
          zoomOnScroll={false}
          defaultViewport={INITIAL_VIEWPORT}
          fitView={false}
          attributionPosition="bottom-left"
          onPaneMouseDown={(e) => {
            // Prevent panning if clicking on a node or its children
            if (e.target.closest('.hierarchy-node')) {
              e.preventDefault();
            }
          }}
        >
          <WheelHandler />
          <InitialCentering nodes={nodes} edges={edges} />
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#6a6a6a" />
          <Panel position="top-left" className="info-panel">
            <h2>🌳 Hierarchy Creator</h2>
            <p>Click buttons on nodes to add/remove children</p>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

export default App;
