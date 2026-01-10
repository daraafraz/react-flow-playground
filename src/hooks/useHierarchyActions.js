import { useCallback, useRef } from 'react';
import { getDescendantIds } from '../utils/tree.js';

/**
 * Custom hook for hierarchy manipulation actions.
 * 
 * Provides callbacks for adding/removing nodes, updating labels, and toggling collapse state.
 * All actions maintain referential stability for React optimization.
 * 
 * @param {Function} setNodes - React Flow setNodes function
 * @param {Function} setEdges - React Flow setEdges function
 * @param {Object} edgesRef - Ref to current edges array
 * @returns {Object} Object containing all hierarchy action callbacks
 */
export function useHierarchyActions(setNodes, setEdges, edgesRef) {
  /**
   * Adds a new child node to the specified parent.
   * 
   * @param {string} parentId - ID of the parent node
   */
  const handleAddChild = useCallback(
    (parentId) => {
      const childId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const currentEdges = edgesRef.current;
      const childNumber = currentEdges.filter((e) => e.source === parentId).length + 1;

      const newChild = {
        id: childId,
        type: 'hierarchy',
        data: {
          label: `Child ${childNumber}`,
          childrenCount: 0,
        },
        position: { x: 0, y: 0 }, // Will be recalculated by layout
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

      setNodes((nds) => [...nds, newChild]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [setNodes, setEdges, edgesRef]
  );

  /**
   * Removes a node and all its descendants recursively.
   * 
   * @param {string} nodeId - ID of the node to remove
   */
  const handleRemoveChild = useCallback(
    (nodeId) => {
      // Get current edges to calculate descendants
      const currentEdges = edgesRef.current;
      const toRemove = new Set([nodeId]);

      const findDescendants = (parentId) => {
        currentEdges.forEach((edge) => {
          if (edge.source === parentId && !toRemove.has(edge.target)) {
            toRemove.add(edge.target);
            findDescendants(edge.target);
          }
        });
      };

      findDescendants(nodeId);

      // Update nodes and edges separately
      setNodes((nds) => nds.filter((n) => !toRemove.has(n.id)));
      setEdges((eds) =>
        eds.filter((e) => !toRemove.has(e.source) && !toRemove.has(e.target))
      );
    },
    [setNodes, setEdges, edgesRef]
  );

  /**
   * Creates a new root node, replacing all existing nodes.
   */
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
  }, [setNodes, setEdges]);

  /**
   * Updates the label of a node.
   * 
   * @param {string} nodeId - ID of the node to update
   * @param {string} newLabel - New label text
   */
  const handleUpdateLabel = useCallback(
    (nodeId, newLabel) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
    },
    [setNodes]
  );

  /**
   * Toggles the collapse/expand state of a node.
   * 
   * @param {string} nodeId - ID of the node to toggle
   */
  const handleToggleCollapse = useCallback(
    (nodeId) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, isCollapsed: !node.data?.isCollapsed } }
            : node
        )
      );
    },
    [setNodes]
  );

  /**
   * Gets all descendant IDs for a node (memoized version).
   */
  const getDescendantIdsMemoized = useCallback(
    (nodeId, edges) => {
      return getDescendantIds(nodeId, edges);
    },
    []
  );

  return {
    handleAddChild,
    handleRemoveChild,
    handleAddRoot,
    handleUpdateLabel,
    handleToggleCollapse,
    getDescendantIds: getDescendantIdsMemoized,
  };
}

