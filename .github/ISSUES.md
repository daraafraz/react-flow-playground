# Example Issues

This document provides example issues that would be good for the project. These can be used as templates or inspiration for creating actual GitHub issues.

## Good First Issue Example

**Title:** Add keyboard shortcuts for common actions

**Description:**
Add keyboard shortcuts to improve the user experience:
- `Delete` or `Backspace` to remove selected node
- `Enter` to add a child to selected node
- `Escape` to deselect

**Why it's good for first-time contributors:**
- Focused scope
- Clear acceptance criteria
- Good learning opportunity with React Flow event handling
- Non-breaking change

**Acceptance Criteria:**
- [ ] Delete/Backspace removes selected node
- [ ] Enter adds child to selected node
- [ ] Escape deselects
- [ ] Shortcuts work when canvas is focused
- [ ] Documentation updated

**Helpful Resources:**
- React Flow keyboard events: https://reactflow.dev/api-reference/hooks/use-key-press
- React Flow selection: https://reactflow.dev/api-reference/types/selection-mode

---

## Help Wanted Example

**Title:** Improve collision detection algorithm performance

**Description:**
The current collision detection algorithm can be slow with large hierarchies (50+ nodes). We need to optimize it for better performance.

**Why we need help:**
- Performance optimization requires expertise
- Community may have better algorithms
- Testing with various hierarchy sizes needed

**Current Status:**
- Current algorithm uses O(n²) approach checking all node pairs
- Works well for small hierarchies but slows down with many nodes
- Consider spatial indexing or other optimizations

**Acceptance Criteria:**
- [ ] Algorithm handles 100+ nodes smoothly
- [ ] No visual regressions
- [ ] Performance improvement measurable
- [ ] Code remains readable

**Technical Details:**
- See `calculateLayout` function in `src/App.jsx`
- Collision detection in `resolveCollisions` function
- Consider using spatial data structures (quadtree, R-tree)

---

## Enhancement Example

**Title:** Add ability to rename nodes

**Description:**
Allow users to rename nodes by double-clicking on the node label or adding an edit button.

**Problem it solves:**
Currently nodes have fixed labels ("Root", "Child 1", etc.). Users should be able to customize these to reflect their actual hierarchy (e.g., "Engineering", "Product", "Design").

**Proposed Solution:**
- Double-click on node label to enter edit mode
- Show input field with current label
- Save on Enter or blur
- Cancel on Escape

**Alternatives Considered:**
- Edit button in node toolbar (more discoverable but adds UI clutter)
- Right-click context menu (requires context menu implementation)

**Additional Context:**
- Should work with the existing node data structure
- Consider validation (max length, allowed characters)
- May want to persist names if save/load is added later

