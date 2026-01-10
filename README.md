# React Flow Hierarchy Creator

A production-ready hierarchy creator built with React Flow. Create and manage tree structures with automatic layout, collision detection, and intuitive Figma-like interactions.

## Problem Statement

Building hierarchical tree interfaces in React Flow requires:
- Custom layout algorithms for strict vertical trees
- Collision detection to prevent node overlaps
- Dynamic height handling for variable-length content
- Intuitive interaction models (zoom/pan)
- Clean separation of concerns for maintainability

This project provides a **production-ready solution** that addresses all of these challenges.

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Build

```bash
npm run build
```

### Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Validate (lint + format check)
npm run validate
```

## Features

- ✅ **Strict Vertical Tree Layout**: Preorder traversal ensures one node per row
- ✅ **Dynamic Node Heights**: Automatically adjusts layout for variable-length content
- ✅ **Collapse/Expand**: Hide/show subtrees with recursive collapse support
- ✅ **Figma-like Zoom/Pan**: Scroll to pan, Cmd/Ctrl+Scroll to zoom
- ✅ **Inline Editing**: Click node labels to edit directly
- ✅ **Clean Architecture**: Hook-based separation of concerns
- ✅ **Zero Overlaps**: Guaranteed spacing with collision detection
- ✅ **Production Ready**: Linting, formatting, CI/CD configured

## Architecture Overview

The project uses a **hook-based architecture** with clear separation of concerns:

- **Custom Hooks**: `useNodeHeights`, `useHierarchyActions`, `useHierarchyLayout`
- **Utilities**: Pure functions for layout calculation and tree operations
- **Constants**: Centralized configuration values
- **Components**: Reusable UI components (WheelHandler, nodes)

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed documentation.

## Usage

### Basic Operations

**Add Child:**
1. Click the "+" button (bottom-right) on any node
2. A new child appears below and indented from the parent

**Remove Node:**
1. Click the "−" button (top-right) on any node
2. The node and all its descendants are removed

**Edit Label:**
1. Click on a node's label text
2. Edit inline
3. Click away or press Enter to save

**Collapse/Expand:**
1. Click the chevron icon (top-left) on nodes with children
2. Collapses/expands all descendants recursively

### Navigation

- **Pan**: Scroll (trackpad or mouse wheel)
- **Zoom**: Cmd/Ctrl + Scroll
- **Controls**: Use React Flow controls in bottom-left corner

## Architecture Decisions

Key architectural decisions are documented in [Architecture Decision Records (ADRs)](./docs/adr/):

- [ADR 001: Vertical Tree Layout](./docs/adr/001-vertical-tree-layout.md)
- [ADR 002: Figma-like Zoom/Pan](./docs/adr/002-figma-like-zoom-pan.md)
- [ADR 003: Hook-based Architecture](./docs/adr/003-hook-based-architecture.md)

## Project Structure

```
src/
├── App.jsx                 # Main orchestration component
├── components/             # Reusable components
│   └── WheelHandler.jsx    # Custom scroll/zoom handler
├── hooks/                  # Custom React hooks
│   ├── useNodeHeights.js
│   ├── useHierarchyActions.js
│   └── useHierarchyLayout.js
├── utils/                  # Pure utility functions
│   ├── layout.js
│   ├── tree.js
│   └── initialState.js
├── constants/              # Configuration values
│   └── layout.js
└── nodes/                  # React Flow node components
    ├── HierarchyNode.jsx
    └── EmptyStateNode.jsx
```

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- Setup instructions
- Code style guidelines
- Pull request process
- Issue reporting

### First-Time Contributors

Check out [`.github/ISSUE_TEMPLATE/good_first_issue.md`](./.github/ISSUE_TEMPLATE/good_first_issue.md) for beginner-friendly issues.

## Development

### Code Quality

The project enforces code quality through:

- **ESLint**: JavaScript/React linting
- **Prettier**: Code formatting
- **CI/CD**: Automated checks on pull requests

Run `npm run validate` before committing.

### Testing

```bash
# Run tests (when implemented)
npm test
```

## Project Status

**Status:** Active Development

- ✅ Core functionality complete
- ✅ Architecture refactored
- ✅ Documentation added
- 🔄 Tests (planned)
- 🔄 Performance optimizations (planned)

## License

MIT License. See [LICENSE](./LICENSE) for details.

---

Built with [React Flow](https://reactflow.dev/) v12
