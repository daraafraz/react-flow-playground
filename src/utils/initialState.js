/**
 * Initial state factory functions for React Flow nodes and edges.
 */

/**
 * Creates the initial root node.
 * 
 * @returns {Array} Array containing a single root node
 */
export function createInitialNodes() {
  return [
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
}

/**
 * Creates empty initial edges array.
 * 
 * @returns {Array} Empty array
 */
export function createInitialEdges() {
  return [];
}

