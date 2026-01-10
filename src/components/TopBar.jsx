import './TopBar.css';

export function TopBar({ onBack }) {
  return (
    <div className="top-bar">
      <button className="top-bar-back" onClick={onBack} aria-label="Back to homepage">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Back</span>
      </button>
      <div className="top-bar-info">
        <h2>🌳 Hierarchy Creator</h2>
      </div>
    </div>
  );
}

