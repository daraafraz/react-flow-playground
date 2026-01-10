/**
 * Tree utility functions for hierarchy operations.
 */

/**
 * Recursively finds all descendant node IDs of a given node.
 * 
 * @param {string} nodeId - The ID of the parent node
 * @param {Array} edges - Array of edge objects
 * @returns {Set} Set of descendant node IDs
 */
export function getDescendantIds(nodeId, edges) {
  const descendants = new Set();

  const findDescendants = (parentId) => {
    edges.forEach((edge) => {
      if (edge.source === parentId && !descendants.has(edge.target)) {
        descendants.add(edge.target);
        findDescendants(edge.target);
      }
    });
  };

  findDescendants(nodeId);
  return descendants;
}

/**
 * Filters out collapsed nodes and their descendants.
 * 
 * @param {Array} nodes - Array of all node objects
 * @param {Array} edges - Array of all edge objects
 * @param {Function} getDescendantIds - Function to get descendants
 * @returns {Object} Object with collapsedNodeIds Set and visibleNodes Array
 */
export function filterVisibleNodes(nodes, edges, getDescendantIds) {
  const collapsedNodeIds = new Set();

  nodes.forEach((node) => {
    if (node.data?.isCollapsed) {
      const descendants = getDescendantIds(node.id, edges);
      descendants.forEach((id) => collapsedNodeIds.add(id));
    }
  });

  const visibleNodes = nodes.filter((node) => !collapsedNodeIds.has(node.id));

  return { collapsedNodeIds, visibleNodes };
}

/**
 * Filters edges to only include those between visible nodes.
 * 
 * @param {Array} edges - Array of all edge objects
 * @param {Set} collapsedNodeIds - Set of collapsed descendant node IDs
 * @param {Set} collapsedParents - Set of collapsed parent node IDs
 * @returns {Array} Array of visible edge objects
 */
export function filterVisibleEdges(edges, collapsedNodeIds, collapsedParents) {
  return edges.filter(
    (edge) =>
      !collapsedParents.has(edge.source) &&
      !collapsedNodeIds.has(edge.source) &&
      !collapsedNodeIds.has(edge.target)
  );
}

