import './Homepage.css';

export function Homepage({ onStartDemo }) {
  return (
    <div className="homepage">
      <div className="homepage-container">
        <header className="homepage-header">
          <h1 className="homepage-title">🌳 React Flow Hierarchy Creator</h1>
          <p className="homepage-subtitle">
            A production-ready tool for creating and managing hierarchical tree structures
            with automatic layout, collision detection, and intuitive interactions.
          </p>
        </header>

        <div className="homepage-actions">
          <button className="demo-button" onClick={onStartDemo}>
            Launch Demo →
          </button>
        </div>

        <section className="homepage-features">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📐</div>
              <h3 className="feature-title">Strict Vertical Tree Layout</h3>
              <p className="feature-description">
                Preorder traversal algorithm ensures one node per row, creating a predictable,
                document-like layout similar to Notion or VS Code tree views.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📏</div>
              <h3 className="feature-title">Dynamic Node Heights</h3>
              <p className="feature-description">
                Automatically measures and adjusts layout for variable-length content.
                Nodes grow vertically when text is lengthy, and downstream nodes shift accordingly.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔽</div>
              <h3 className="feature-title">Collapse/Expand</h3>
              <p className="feature-description">
                Hide or show entire subtrees with recursive collapse support.
                Collapsed nodes are removed from layout flow, pulling downstream nodes up.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3 className="feature-title">Figma-like Zoom/Pan</h3>
              <p className="feature-description">
                Intuitive interaction model: scroll to pan, Cmd/Ctrl+Scroll to zoom.
                Matches the behavior of modern design tools like Figma, Notion, and Miro.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✏️</div>
              <h3 className="feature-title">Inline Editing</h3>
              <p className="feature-description">
                Click any node label to edit directly. Hover shows a pen cursor,
                and changes save automatically when you click away.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚫</div>
              <h3 className="feature-title">Zero Overlaps</h3>
              <p className="feature-description">
                Guaranteed spacing with collision detection. Cards, including children,
                never overlap, maintaining clean visual hierarchy.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏗️</div>
              <h3 className="feature-title">Clean Architecture</h3>
              <p className="feature-description">
                Hook-based separation of concerns with custom hooks, pure utility functions,
                and reusable components. Production-ready code structure.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Production Ready</h3>
              <p className="feature-description">
                Includes ESLint, Prettier, CI/CD workflows, comprehensive documentation,
                and Architecture Decision Records (ADRs) for key design choices.
              </p>
            </div>
          </div>
        </section>

        <section className="homepage-decisions">
          <h2 className="section-title">Key Design Decisions</h2>
          <div className="decisions-list">
            <div className="decision-item">
              <h4 className="decision-title">Vertical Tree Layout (ADR 001)</h4>
              <p className="decision-description">
                Chose preorder traversal over force-directed or DAG layouts to ensure
                strict vertical stacking. This creates a predictable, document-like
                experience where children always appear below their parent.
              </p>
            </div>

            <div className="decision-item">
              <h4 className="decision-title">Figma-like Interactions (ADR 002)</h4>
              <p className="decision-description">
                Implemented custom scroll/zoom handler to match user expectations from
                modern design tools. Scroll pans by default, modifier key enables zoom.
              </p>
            </div>

            <div className="decision-item">
              <h4 className="decision-title">Hook-based Architecture (ADR 003)</h4>
              <p className="decision-description">
                Refactored from monolithic component to modular architecture with
                custom hooks, utilities, and components. This improves testability,
                maintainability, and code reuse.
              </p>
            </div>
          </div>
        </section>

        <footer className="homepage-footer">
          <p>
            Built with <a href="https://reactflow.dev/" target="_blank" rel="noopener noreferrer">React Flow</a> v12
          </p>
          <p className="footer-license">MIT License</p>
        </footer>
      </div>
    </div>
  );
}

