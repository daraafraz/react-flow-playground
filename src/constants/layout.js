/**
 * Layout constants for the hierarchy tree.
 * 
 * Node dimensions follow credit card proportions (approximately 1.59:1 width-to-height),
 * then reduced by 20% for a more compact appearance.
 */
export const NODE_WIDTH = 280;
export const NODE_HEIGHT = 141; // 20% shorter: 176 * 0.8 ≈ 141

/**
 * Spacing constants (in pixels).
 * All spacing uses 2rem (32px) for consistency with design system.
 */
export const VERTICAL_OFFSET = 32; // 2rem vertical spacing between cards
export const INDENT_OFFSET = 32; // 2rem indentation for children

/**
 * Minimum spacing constants for collision detection.
 * These ensure nodes never overlap, even in complex hierarchies.
 */
export const MIN_SIBLING_SPACING = 40; // Minimum spacing between sibling nodes
export const MIN_NODE_SPACING = 30; // Minimum spacing between any nodes

/**
 * Initial viewport configuration.
 * Matches Figma's default: 100% zoom (1.0) at origin.
 */
export const INITIAL_VIEWPORT = { x: 0, y: 0, zoom: 1.0 };

/**
 * Layout calculation starting positions.
 */
export const LAYOUT_START_Y = 50;
export const LAYOUT_BASE_X = 100;

