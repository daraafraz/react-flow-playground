# ADR 001: Vertical Tree Layout Algorithm

## Status
Accepted

## Context
The hierarchy creator requires a strict vertical tree layout where:
- Nodes are stacked top-to-bottom in document order
- X-axis represents tree depth (indentation)
- Y-axis represents document order (one node per row)
- Children must never appear horizontally adjacent to siblings
- Layout must handle variable node heights (dynamic text length)
- Collapsed nodes must hide all descendants and adjust layout

This differs from typical graph layouts (force-directed, hierarchical DAG layouts) which allow horizontal sibling placement.

## Decision
Implement a preorder traversal-based layout algorithm that:
1. Maintains a running Y-cursor that increments per visible node
2. Uses X-position based on tree depth (indentation)
3. Measures actual DOM node heights for accurate spacing
4. Filters collapsed nodes and descendants before layout calculation
5. Ensures single-column invariant (one node per Y-row)

## Consequences

### Positive
- Predictable, document-like layout (similar to Notion/VS Code tree views)
- No horizontal sibling placement confusion
- Handles variable node heights accurately
- Collapse/expand works seamlessly with layout

### Negative
- More complex than simple grid layout
- Requires DOM measurement for accurate heights
- Layout recalculation needed on height changes

### Alternatives Considered
- **Force-directed layout**: Rejected - allows horizontal siblings, unpredictable
- **Dagre/ELK layouts**: Rejected - optimized for DAGs, not strict trees
- **Fixed grid layout**: Rejected - doesn't handle variable heights well

## Implementation Notes
- Layout calculation is pure function (no side effects)
- Height measurement uses `requestAnimationFrame` + `setTimeout` for DOM timing
- Layout trigger state forces recalculation when heights change
- Preorder traversal ensures parent appears before all descendants

