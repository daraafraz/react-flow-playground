import { useEffect, useRef, useState, useMemo } from 'react';
import { NODE_HEIGHT } from '../constants/layout.js';

/**
 * Custom hook to measure and track actual node heights from the DOM.
 * 
 * This handles dynamic node growth/shrinkage when labels change length.
 * Heights are measured after render and trigger layout recalculation.
 * 
 * @param {Array} nodes - Array of node objects
 * @returns {Object} Object containing nodeHeightsRef and layoutTrigger state
 */
export function useNodeHeights(nodes) {
  const nodeHeightsRef = useRef({});
  const [layoutTrigger, setLayoutTrigger] = useState(0);

  // Create dependency string from node labels to detect label changes
  const nodeLabelsKey = useMemo(() => {
    return nodes
      .filter((n) => n.type === 'hierarchy')
      .map((n) => `${n.id}:${n.data?.label || ''}`)
      .join('|');
  }, [nodes]);

  useEffect(() => {
    const measureNodeHeights = () => {
      let hasChanges = false;
      const newHeights = { ...nodeHeightsRef.current };

      nodes.forEach((node) => {
        if (node.type === 'hierarchy') {
          const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
          if (nodeElement) {
            const hierarchyNode = nodeElement.querySelector('.hierarchy-node');
            if (hierarchyNode) {
              const height = hierarchyNode.offsetHeight;
              const currentHeight = nodeHeightsRef.current[node.id] || NODE_HEIGHT;

              // Update if height changed significantly (>1px threshold to avoid rounding issues)
              if (Math.abs(height - currentHeight) > 1) {
                newHeights[node.id] = Math.max(height, NODE_HEIGHT);
                hasChanges = true;
              } else if (!nodeHeightsRef.current[node.id]) {
                // Initialize if not set
                newHeights[node.id] = Math.max(height, NODE_HEIGHT);
                hasChanges = true;
              }
            }
          }
        }
      });

      if (hasChanges) {
        nodeHeightsRef.current = newHeights;
        setLayoutTrigger((prev) => prev + 1);
      }
    };

    // Measure after DOM update using requestAnimationFrame for better timing
    let rafId;
    let timeoutId;

    rafId = requestAnimationFrame(() => {
      timeoutId = setTimeout(measureNodeHeights, 50);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [nodes.length, nodeLabelsKey]);

  return { nodeHeightsRef, layoutTrigger };
}

