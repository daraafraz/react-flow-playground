# ADR 003: Hook-based Architecture for Separation of Concerns

## Status
Accepted

## Context
The original `App.jsx` was a monolithic 559-line component containing:
- Layout calculation logic
- Node height measurement
- Hierarchy manipulation actions
- State management
- UI rendering

This made the code difficult to:
- Test in isolation
- Understand at a glance
- Reuse logic
- Maintain and refactor

## Decision
Refactor into focused, single-responsibility modules:
1. **Custom Hooks**: Extract reusable logic (`useNodeHeights`, `useHierarchyActions`, `useHierarchyLayout`)
2. **Utilities**: Pure functions for layout and tree operations (`layout.js`, `tree.js`)
3. **Constants**: Configuration values (`layout.js`)
4. **Components**: Reusable UI components (`WheelHandler`)
5. **Main App**: Orchestration only (composes hooks and renders UI)

## Consequences

### Positive
- Clear separation of concerns
- Testable units (hooks and utilities)
- Reusable logic across components
- Self-documenting code structure
- Easier to maintain and extend

### Negative
- More files to navigate
- Requires understanding of React hooks
- Slight overhead from hook abstractions

### Alternatives Considered
- **Class components**: Rejected - hooks are modern React standard
- **Context API**: Not needed - state is local to App
- **State management library**: Rejected - React Flow state is sufficient
- **Keep monolithic**: Rejected - violates single responsibility principle

## Implementation Notes
- Hooks use `useCallback` for referential stability
- Utilities are pure functions (no side effects)
- Constants are exported for easy configuration
- Main App component is now ~100 lines (down from 559)

