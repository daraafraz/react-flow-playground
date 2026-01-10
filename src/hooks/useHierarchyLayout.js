import { useEffect, useRef } from 'react';
import { calculateLayout } from '../utils/layout.js';
import { filterVisibleNodes, filterVisibleEdges } from '../utils/tree.js';

/**
 * Custom hook that manages hierarchy layout calculation and updates.
 * 
 * This hook:
 * - Filters visible nodes (excludes collapsed descendants)
 * - Calculates positions using actual measured heights
 * - Updates node positions and data when layout changes
 * - Manages empty state node display
 * 
 * @param {Array} nodes - All nodes from React Flow state
 * @param {Array} edges - All edges from React Flow state
 * @param {Object} nodeHeightsRef - Ref containing measured node heights
 * @param {number} layoutTrigger - Trigger value that forces recalculation
 * @param {Object} actions - Hierarchy action callbacks
 * @param {Function} setNodes - React Flow setNodes function
 */
export function useHierarchyLayout(
  nodes,
  edges,
  nodeHeightsRef,
  layoutTrigger,
  actions,
  setNodes
) {
  const edgesRef = useRef(edges);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  useEffect(() => {
    setNodes((nds) => {
      const hierarchyNodes = nds.filter((n) => n.type === 'hierarchy');
      const emptyStateNode = nds.find((n) => n.type === 'emptyState');
      const currentEdges = edgesRef.current;

      // Show empty state if no hierarchy nodes exist
      if (hierarchyNodes.length === 0) {
        if (!emptyStateNode) {
          return [
            {
              id: 'empty-state',
              type: 'emptyState',
              data: {
                onAddRoot: actions.handleAddRoot,
              },
              position: { x: 400, y: 300 },
              draggable: false,
            },
          ];
        }
        return nds;
      }

      // Filter collapsed nodes and their descendants
      const { collapsedNodeIds, visibleNodes } = filterVisibleNodes(
        hierarchyNodes,
        currentEdges,
        actions.getDescendantIds
      );

      // Filter edges for visible nodes
      const collapsedParents = new Set();
      hierarchyNodes.forEach((node) => {
        if (node.data?.isCollapsed) {
          collapsedParents.add(node.id);
        }
      });

      const visibleEdges = filterVisibleEdges(
        currentEdges,
        collapsedNodeIds,
        collapsedParents
      );

      // Calculate layout with actual heights
      const positions = calculateLayout(visibleNodes, visibleEdges, nodeHeightsRef.current);

      // Update nodes with new positions and data
      const updatedHierarchyNodes = hierarchyNodes.map((node) => {
        const newPosition = collapsedNodeIds.has(node.id)
          ? node.position
          : positions[node.id];
        const childrenCount = currentEdges.filter((e) => e.source === node.id).length;
        const isCollapsed = node.data?.isCollapsed === true;

        const newData = {
          ...node.data,
          childrenCount,
          isCollapsed,
          onAddChild: actions.handleAddChild,
          onRemoveChild: actions.handleRemoveChild,
          onUpdateLabel: actions.handleUpdateLabel,
          onToggleCollapse: actions.handleToggleCollapse,
        };

        // Only create new object if something changed (optimization)
        if (
          node.position.x !== newPosition?.x ||
          node.position.y !== newPosition?.y ||
          node.data.childrenCount !== newData.childrenCount ||
          node.data.label !== newData.label ||
          node.data.isCollapsed !== newData.isCollapsed
        ) {
          return {
            ...node,
            position: newPosition || node.position,
            data: newData,
          };
        }

        return node;
      });

      return updatedHierarchyNodes;
    });
  }, [
    nodes.length,
    edges.length,
    layoutTrigger,
    actions,
    nodeHeightsRef,
    setNodes,
  ]);
}

