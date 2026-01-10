# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial release of React Flow Hierarchy Creator
- Strict vertical tree layout with preorder traversal
- Dynamic node height measurement and layout adjustment
- Collapse/expand functionality with recursive descendant hiding
- Figma-like zoom/pan interaction (scroll to pan, Cmd/Ctrl+Scroll to zoom)
- Inline node label editing
- Empty state with "Create Root" button
- Hook-based architecture for separation of concerns
- Comprehensive documentation (README, ARCHITECTURE.md, ADRs)
- ESLint and Prettier configuration
- CI/CD workflow for automated quality checks
- Architecture Decision Records (ADRs) for key design decisions

### Architecture
- Refactored from monolithic 559-line component to modular architecture
- Extracted custom hooks: `useNodeHeights`, `useHierarchyActions`, `useHierarchyLayout`
- Created utility modules: `layout.js`, `tree.js`, `initialState.js`
- Centralized constants in `constants/layout.js`
- Separated components: `WheelHandler` for custom interactions

### Code Quality
- Removed debug instrumentation and dead code
- Added comprehensive JSDoc comments
- Enforced consistent code style with Prettier
- Added linting rules with ESLint
- Improved error handling and edge case coverage

### Documentation
- Complete architecture overview
- Three ADRs documenting key decisions
- Updated README with quick start and usage
- Contributing guidelines
- Code of conduct

[1.0.0]: https://github.com/yourusername/react-flow-hierarchy-creator/releases/tag/v1.0.0

