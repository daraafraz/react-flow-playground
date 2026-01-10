# Architecture Overview

This document provides a high-level overview of the React Flow Hierarchy Creator architecture.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      App Component                       │
│  (Orchestration: composes hooks, renders ReactFlow)     │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ useNodeHeights│  │useHierarchy  │  │useHierarchy  │
│              │  │Actions       │  │Layout        │
│ Measures DOM │  │              │  │              │
│ heights      │  │Add/Remove    │  │Calculates    │
│              │  │Update/Toggle │  │positions     │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   layout.js  │  │   tree.js    │  │  constants/  │
│              │  │              │  │  layout.js   │
│ Preorder     │  │ Descendant   │  │              │
│ traversal    │  │ filtering    │  │ Config values│
└──────────────┘  └──────────────┘  └──────────────┘
```

## Core Components

### 1. App Component (`src/App.jsx`)
**Responsibility**: Orchestration and UI rendering

- Composes custom hooks
- Manages React Flow state (`useNodesState`, `useEdgesState`)
- Renders ReactFlow canvas with controls
- Filters visible nodes/edges for display

### 2. Custom Hooks

#### `useNodeHeights` (`src/hooks/useNodeHeights.js`)
**Responsibility**: Measure and track actual DOM node heights

- Measures `offsetHeight` of rendered nodes
- Detects label changes via dependency string
- Triggers layout recalculation when heights change
- Uses `requestAnimationFrame` for DOM timing

#### `useHierarchyActions` (`src/hooks/useHierarchyActions.js`)
**Responsibility**: Hierarchy manipulation callbacks

- `handleAddChild`: Creates new child node and edge
- `handleRemoveChild`: Recursively removes node and descendants
- `handleAddRoot`: Creates new root node
- `handleUpdateLabel`: Updates node label text
- `handleToggleCollapse`: Toggles collapse/expand state

All callbacks use `useCallback` for referential stability.

#### `useHierarchyLayout` (`src/hooks/useHierarchyLayout.js`)
**Responsibility**: Calculate and apply layout positions

- Filters visible nodes (excludes collapsed descendants)
- Calculates positions using `calculateLayout` utility
- Updates node positions and data when layout changes
- Manages empty state node display

### 3. Utilities

#### `layout.js` (`src/utils/layout.js`)
**Responsibility**: Pure layout calculation functions

- `buildTreeRelationships`: Builds parent-child maps
- `findRootNodes`: Identifies root nodes (no incoming edges)
- `calculateLayout`: Preorder traversal layout algorithm

#### `tree.js` (`src/utils/tree.js`)
**Responsibility**: Tree operation utilities

- `getDescendantIds`: Recursively finds all descendants
- `filterVisibleNodes`: Excludes collapsed nodes and descendants
- `filterVisibleEdges`: Excludes edges to/from collapsed nodes

### 4. Constants

#### `layout.js` (`src/constants/layout.js`)
**Responsibility**: Configuration values

- Node dimensions (width, height)
- Spacing constants (vertical offset, indent offset)
- Viewport configuration
- Layout starting positions

### 5. Components

#### `WheelHandler` (`src/components/WheelHandler.jsx`)
**Responsibility**: Custom scroll/zoom interaction

- Intercepts wheel events
- Pan on scroll (no modifier)
- Zoom on Cmd/Ctrl + scroll
- Uses React Flow's `useReactFlow` hook

#### Node Components (`src/nodes/`)
- `HierarchyNode`: Main hierarchy node with buttons and inline editing
- `EmptyStateNode`: Empty state with "Create Root" button

## Data Flow

1. **User Action** (e.g., click "Add Child")
2. **Action Handler** (`handleAddChild` from `useHierarchyActions`)
3. **State Update** (React Flow `setNodes`, `setEdges`)
4. **Layout Hook** (`useHierarchyLayout`) detects change
5. **Layout Calculation** (`calculateLayout` utility)
6. **Node Update** (positions and data updated)
7. **Height Measurement** (`useNodeHeights` measures DOM)
8. **Layout Recalculation** (if heights changed)
9. **UI Render** (React Flow renders updated nodes)

## Key Design Decisions

1. **Preorder Traversal Layout**: Ensures strict vertical tree (see [ADR 001](./adr/001-vertical-tree-layout.md))
2. **Figma-like Zoom/Pan**: Intuitive interaction model (see [ADR 002](./adr/002-figma-like-zoom-pan.md))
3. **Hook-based Architecture**: Separation of concerns (see [ADR 003](./adr/003-hook-based-architecture.md))

## File Structure

```
src/
├── App.jsx                 # Main orchestration component
├── App.css                 # Global styles
├── main.jsx                # Entry point
├── index.css               # Base styles
├── components/
│   └── WheelHandler.jsx    # Custom scroll/zoom handler
├── hooks/
│   ├── useNodeHeights.js   # Height measurement hook
│   ├── useHierarchyActions.js  # Action callbacks hook
│   └── useHierarchyLayout.js   # Layout calculation hook
├── utils/
│   ├── layout.js           # Layout calculation utilities
│   ├── tree.js             # Tree operation utilities
│   └── initialState.js     # Initial state factories
├── constants/
│   └── layout.js           # Configuration constants
└── nodes/
    ├── HierarchyNode.jsx   # Main hierarchy node component
    ├── HierarchyNode.css    # Node styles
    ├── EmptyStateNode.jsx   # Empty state component
    └── EmptyStateNode.css   # Empty state styles
```

## Testing Strategy

- **Unit Tests**: Test utilities (`layout.js`, `tree.js`) as pure functions
- **Hook Tests**: Test custom hooks with `@testing-library/react-hooks`
- **Component Tests**: Test node components in isolation
- **Integration Tests**: Test App component with React Flow

## Performance Considerations

- **Memoization**: `useMemo` for visible nodes/edges filtering
- **Referential Stability**: `useCallback` for all action handlers
- **Layout Optimization**: Only recalculate when dependencies change
- **Height Measurement**: Debounced with `requestAnimationFrame` + `setTimeout`

## Future Enhancements

- Virtualization for large trees (1000+ nodes)
- Undo/redo functionality
- Export to JSON/PNG/PDF
- Multi-root support
- Drag-and-drop reordering

