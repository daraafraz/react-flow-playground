import { useCallback, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

/**
 * WheelHandler component implements Figma-like scroll/zoom interaction.
 * 
 * Behavior:
 * - Scroll (without modifier) → Pan canvas
 * - Cmd/Ctrl + Scroll → Zoom canvas
 * 
 * This provides a more intuitive interaction model than default React Flow behavior.
 */
export function WheelHandler() {
  const { getViewport, setViewport } = useReactFlow();

  const handleWheel = useCallback(
    (event) => {
      // Zoom when modifier key is held (Cmd on Mac, Ctrl on Windows/Linux)
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault();
        event.stopPropagation();

        const viewport = getViewport();
        const zoomMultiplier = 1.5;
        const zoomDelta = (event.deltaY || 0) * zoomMultiplier;
        const zoomChange = -zoomDelta * 0.001; // Scale down for sensitivity
        const newZoom = Math.max(0.1, Math.min(2, viewport.zoom + zoomChange));

        setViewport({ ...viewport, zoom: newZoom });
      } else {
        // Pan when no modifier key
        event.preventDefault();
        event.stopPropagation();

        const viewport = getViewport();
        const panMultiplier = 1.5;
        const panX = (event.deltaX || 0) * panMultiplier;
        const panY = (event.deltaY || 0) * panMultiplier;

        setViewport({
          x: viewport.x - panX,
          y: viewport.y - panY,
          zoom: viewport.zoom,
        });
      }
    },
    [getViewport, setViewport]
  );

  useEffect(() => {
    const pane = document.querySelector('.react-flow__pane');
    if (pane) {
      pane.addEventListener('wheel', handleWheel, { passive: false, capture: true });
      return () => {
        pane.removeEventListener('wheel', handleWheel, { capture: true });
      };
    }
  }, [handleWheel]);

  return null;
}

