import { useEffect } from 'react';

/**
 * DoubleClickPreventer component prevents double-click zoom behavior.
 * 
 * This component adds a direct event listener to the React Flow pane
 * to catch and prevent double-click events that might cause zooming,
 * even when doubleClickZoom={false} is set.
 */
export function DoubleClickPreventer() {
  useEffect(() => {
    const handleDoubleClick = (e) => {
      // Prevent double-click zoom behavior
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/fcf0f246-e793-4a41-aac1-1215f04aa15c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DoubleClickPreventer.jsx:handleDoubleClick',message:'Double click prevented at DOM level',data:{target:e.target.tagName,className:e.target.className,type:e.type},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return false;
    };

    // Wait for pane to be available
    const pane = document.querySelector('.react-flow__pane');
    if (pane) {
      // Use capture phase to intercept before React Flow's handler
      pane.addEventListener('dblclick', handleDoubleClick, { capture: true, passive: false });
      return () => {
        pane.removeEventListener('dblclick', handleDoubleClick, { capture: true });
      };
    }
  }, []);

  return null;
}

