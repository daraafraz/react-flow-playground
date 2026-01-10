import { useState, useEffect } from 'react';
import { Homepage } from './pages/Homepage';
import { Canvas } from './components/Canvas';
import './App.css';

/**
 * Get the current view from URL hash.
 * Defaults to 'homepage' if no hash or invalid hash.
 */
function getViewFromHash() {
  const hash = window.location.hash.slice(1); // Remove the '#'
  return hash === 'canvas' ? 'canvas' : 'homepage';
}

/**
 * Update URL hash to reflect current view.
 */
function updateHash(view) {
  const newHash = view === 'canvas' ? '#canvas' : '#homepage';
  if (window.location.hash !== newHash) {
    window.history.replaceState(null, '', newHash);
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/fcf0f246-e793-4a41-aac1-1215f04aa15c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:updateHash',message:'Updating URL hash',data:{view,newHash,currentHash:window.location.hash},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  }
}

function App() {
  // Initialize from URL hash, default to homepage
  const [currentView, setCurrentView] = useState(() => {
    const view = getViewFromHash();
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/fcf0f246-e793-4a41-aac1-1215f04aa15c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:useState',message:'Initializing view from hash',data:{view,hash:window.location.hash},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return view;
  });

  // Listen for hash changes (back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const newView = getViewFromHash();
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/fcf0f246-e793-4a41-aac1-1215f04aa15c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.jsx:handleHashChange',message:'Hash changed',data:{newView,hash:window.location.hash,currentView},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      setCurrentView(newView);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Update hash when view changes
  useEffect(() => {
    updateHash(currentView);
  }, [currentView]);

  const handleStartDemo = () => {
    setCurrentView('canvas');
  };

  const handleBack = () => {
    setCurrentView('homepage');
  };

  if (currentView === 'canvas') {
    return <Canvas onBack={handleBack} />;
  }

  return <Homepage onStartDemo={handleStartDemo} />;
}

export default App;
