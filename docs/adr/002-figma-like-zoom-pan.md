# ADR 002: Figma-like Zoom/Pan Interaction Model

## Status
Accepted

## Context
Default React Flow behavior uses scroll-to-zoom, which conflicts with expected "document-like" canvas behavior. Users expect:
- Scroll gesture → Pan canvas (move viewport)
- Modifier key + Scroll → Zoom canvas (change scale)

This matches interaction patterns in Figma, Notion, Miro, and other modern design tools.

## Decision
Implement custom wheel event handler that:
1. Intercepts wheel events on React Flow pane
2. Default behavior: Pan canvas (translate viewport)
3. With Cmd/Ctrl modifier: Zoom canvas (scale viewport)
4. Uses capture phase to intercept before React Flow's default handler
5. Applies multipliers for responsive, direct interaction

## Consequences

### Positive
- Intuitive interaction model matching user expectations
- Fast, responsive panning (1.5x multiplier)
- Smooth, controllable zooming (0.001 sensitivity)
- Consistent across trackpad and mouse wheel

### Negative
- Requires custom event handling (more code)
- Must prevent default React Flow behavior
- Platform-specific modifier keys (Cmd on Mac, Ctrl on Windows/Linux)

### Alternatives Considered
- **Default React Flow behavior**: Rejected - scroll-to-zoom is unintuitive
- **Separate zoom controls only**: Rejected - users expect scroll-to-pan
- **Touch gestures**: Not implemented - desktop-first approach

## Implementation Notes
- Handler uses `passive: false` to allow `preventDefault()`
- Capture phase ensures handler runs before React Flow's handler
- Zoom clamped to [0.1, 2.0] range for usability
- Pan multiplier (1.5x) matches zoom multiplier for consistency

