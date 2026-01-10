import {
  NODE_HEIGHT,
  VERTICAL_OFFSET,
  INDENT_OFFSET,
  LAYOUT_START_Y,
  LAYOUT_BASE_X,
} from '../constants/layout.js';

/**
 * Builds parent-child relationship maps from nodes and edges.
 * 
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @returns {Object} Object containing childrenMap, parentMap, and nodeMap
 */
export function buildTreeRelationships(nodes, edges) {
  const childrenMap = {};
  const parentMap = {};
  const nodeMap = {};

  nodes.forEach((node) => {
    childrenMap[node.id] = [];
    nodeMap[node.id] = node;
  });

  edges.forEach((edge) => {
    if (!childrenMap[edge.source]) {
      childrenMap[edge.source] = [];
    }
    childrenMap[edge.source].push(edge.target);
    parentMap[edge.target] = edge.source;
  });

  return { childrenMap, parentMap, nodeMap };
}

/**
 * Finds root nodes (nodes with no incoming edges).
 * 
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @returns {Array} Array of root node objects
 */
export function findRootNodes(nodes, edges) {
  const hasIncomingEdge = new Set(edges.map((e) => e.target));
  return nodes.filter((n) => !hasIncomingEdge.has(n.id));
}

/**
 * Calculates tree layout positions using preorder traversal.
 * 
 * This implements a strict vertical tree layout where:
 * - X-axis represents tree depth (indentation)
 * - Y-axis represents document order (one node per row)
 * - Collapsed nodes hide all descendants
 * - Uses actual measured node heights for accurate spacing
 * 
 * @param {Array} nodes - Array of visible node objects
 * @param {Array} edges - Array of visible edge objects
 * @param {Object} nodeHeights - Map of nodeId to actual measured height
 * @returns {Object} Map of nodeId to {x, y} position
 */
export function calculateLayout(nodes, edges, nodeHeights = {}) {
  const { childrenMap, nodeMap } = buildTreeRelationships(nodes, edges);
  const positions = {};
  const rootNodes = findRootNodes(nodes, edges);

  let currentY = LAYOUT_START_Y;

  const getNodeHeight = (nodeId) => {
    return nodeHeights[nodeId] || NODE_HEIGHT;
  };

  const traverse = (nodeId, depth) => {
    const node = nodeMap[nodeId];
    if (!node) return;

    const x = LAYOUT_BASE_X + depth * INDENT_OFFSET;
    positions[nodeId] = { x, y: currentY };

    const actualHeight = getNodeHeight(nodeId);
    currentY += actualHeight + VERTICAL_OFFSET;

    const isCollapsed = node.data?.isCollapsed === true;

    if (!isCollapsed) {
      const children = childrenMap[nodeId] || [];
      children.forEach((childId) => {
        traverse(childId, depth + 1);
      });
    }
  };

  rootNodes.forEach((root) => {
    traverse(root.id, 0);
  });

  return positions;
}

