# React Flow Hierarchy Creator

A fixed hierarchy creator built with React Flow. Create and manage tree structures with a clean, minimal interface where nodes can add children, remove themselves, and maintain proper spacing without overlaps.

## What Problem This Solves

Building hierarchical tree interfaces in React Flow often requires custom layout logic, collision detection, and node management. This project provides a ready-to-use hierarchy creator with:

- Automatic tree layout with collision prevention
- Fixed positioning (nodes aren't draggable, maintaining structure)
- Self-contained node management (each node can add/remove children)
- Clean, design-system-aligned UI

## Who This Is For

- Developers building tree/hierarchy visualizations
- Teams needing a React Flow-based organizational chart tool
- Anyone prototyping node-based hierarchy interfaces
- Contributors looking to extend React Flow patterns

## Why This Exists

React Flow is powerful but building a fixed hierarchy with proper spacing, collision detection, and node management requires significant setup. This project removes that friction by providing:

- Pre-configured layout algorithms
- Working collision detection
- Node lifecycle management
- A clean starting point for hierarchy-based applications

**What pain this removes:**
- Manual layout calculations
- Overlap detection and resolution
- Node state synchronization
- Edge connection management

**What motivated its creation:**
The need for a simple, working hierarchy creator that "just works" without requiring deep React Flow expertise.

## What This Project Does

- ✅ Creates fixed hierarchical tree structures
- ✅ Automatically positions children with proper indentation
- ✅ Prevents node overlaps with collision detection
- ✅ Allows nodes to add children via button
- ✅ Allows nodes to remove themselves and descendants
- ✅ Maintains clean, minimal UI aligned with design systems
- ✅ Provides empty state when no nodes exist
- ✅ Supports zoom and pan on the canvas

## What This Project Does NOT Do

- ❌ Allow dragging nodes (structure is fixed)
- ❌ Support multiple root nodes simultaneously
- ❌ Provide data persistence (no save/load)
- ❌ Include user authentication or multi-user features
- ❌ Export to formats like JSON, PNG, or PDF
- ❌ Support undo/redo operations
- ❌ Include advanced layout algorithms (Dagre, ELK, etc.)

## Quick Start

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Minimal Example

The app starts with a single "Root" node. Click the "+" button on any node to add a child. Click the "−" button to remove a node and all its descendants.

## Usage

**Adding Children:**
1. Click the "+" button (bottom-right) on any node
2. A new child appears below and indented from the parent

**Removing Nodes:**
1. Click the "−" button (top-right) on any node
2. The node and all its descendants are removed

**Navigation:**
- Zoom with mouse wheel
- Pan by dragging empty canvas space
- Use controls in bottom-left for zoom/fit view

## How It Works

The hierarchy creator uses:

1. **Layout Algorithm**: Calculates positions using BFS traversal, positioning children 1rem down and indented from parents
2. **Collision Detection**: Iteratively resolves overlaps by adjusting node positions
3. **Node State Management**: React Flow's `useNodesState` and `useEdgesState` hooks manage the tree
4. **Custom Node Components**: Each node is a React component with add/remove buttons

Nodes are not draggable—the structure is maintained automatically. Edges connect from parent to child using React Flow's default handles.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- How to set up the project locally
- How to run tests and linting
- How to submit a pull request
- What kinds of contributions are welcome

## Project Status

**Status:** Active development

This project is in active use and development. Response times for issues and PRs may vary, but contributions are reviewed regularly.

**Current Focus:**
- Stability and bug fixes
- Documentation improvements
- Performance optimizations

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

Built with [React Flow](https://reactflow.dev/) v12
