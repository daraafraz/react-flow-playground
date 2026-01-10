import { useEffect, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { NODE_WIDTH, NODE_HEIGHT, LAYOUT_BASE_X } from '../constants/layout';

/**
 * InitialCentering component centers the root node on initial page load.
 * 
 * Behavior:
 * - Waits for nodes to be laid out
 * - Identifies the root node (no incoming edges)
 * - Pans viewport to center the root node
 * - Preserves zoom level
 * - Runs only once on initial load
 */
export function InitialCentering({ nodes, edges }) {
  const { setCenter, getViewport } = useReactFlow();
  const hasCenteredRef = useRef(false);

  useEffect(() => {
    // Only run once on initial load
    if (hasCenteredRef.current) {
      return;
    }

    // Wait for hierarchy nodes to exist
    const hierarchyNodes = nodes.filter((n) => n.type === 'hierarchy');
    if (hierarchyNodes.length === 0) {
      return;
    }

    // Find root node (node with no incoming edges)
    const hasIncomingEdge = new Set(edges.map((e) => e.target));
    const rootNode = hierarchyNodes.find((n) => !hasIncomingEdge.has(n.id));

    if (!rootNode || !rootNode.position) {
      return;
    }

    // Check if layout has been calculated
    // Initial position is { x: 400, y: 50 }, layout recalculates to { x: 100, y: 50 }
    // If position is still at initial value, layout hasn't run yet
    const INITIAL_X = 400;
    if (rootNode.position.x === INITIAL_X) {
      // Layout not yet calculated, wait for next render
      return;
    }

    // Ensure position is valid (layout has been applied)
    if (rootNode.position.x < LAYOUT_BASE_X || rootNode.position.y < 0) {
      // Layout not yet calculated, wait for next render
      return;
    }

    // Use requestAnimationFrame to ensure DOM is ready
    const rafId = requestAnimationFrame(() => {
      if (!hasCenteredRef.current) {
        hasCenteredRef.current = true;
        centerRootNode(rootNode, getViewport, setCenter);
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [nodes, edges, getViewport, setCenter]);

  return null;
}

/**
 * Centers the root node in the viewport by panning only (no zoom change).
 * 
 * Uses React Flow's setCenter method which handles the viewport transform correctly.
 * 
 * @param {Object} rootNode - The root node object with position
 * @param {Function} getViewport - React Flow function to get current viewport
 * @param {Function} setCenter - React Flow function to center viewport on coordinates
 */
function centerRootNode(rootNode, getViewport, setCenter) {
  const viewport = getViewport();
  const currentZoom = viewport.zoom;

  // Calculate root node center (in world coordinates)
  const nodeCenterX = rootNode.position.x + NODE_WIDTH / 2;
  const nodeCenterY = rootNode.position.y + NODE_HEIGHT / 2;

  // Use setCenter to center the viewport on the node, preserving zoom
  setCenter(nodeCenterX, nodeCenterY, { zoom: currentZoom });
}

