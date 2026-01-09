# Contributing to React Flow Hierarchy Creator

Thank you for your interest in contributing! This guide will help you get started.

## How to Set Up the Project Locally

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd react-flow-playground
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000`

## Development Workflow

### Running the Project

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Style

- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Keep components focused and single-purpose
- Add comments for complex logic

### File Structure

```
src/
├── nodes/           # Custom node components
│   ├── HierarchyNode.jsx
│   ├── EmptyStateNode.jsx
│   └── *.css        # Node-specific styles
├── App.jsx          # Main application component
├── App.css          # Application styles
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## How to Submit a Pull Request

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes:**
   - Write clear, focused code
   - Test your changes locally
   - Ensure the app runs without errors

3. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```
   Use clear, descriptive commit messages.

4. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request:**
   - Provide a clear description of what changed and why
   - Reference any related issues
   - Include screenshots if UI changes are involved

## What Kinds of Contributions Are Welcome

### Bug Fixes
- Fixing layout issues
- Resolving edge cases in collision detection
- Correcting node state management bugs

### Features
- New node types or behaviors
- Layout algorithm improvements
- UI/UX enhancements
- Performance optimizations

### Documentation
- Improving README clarity
- Adding code comments
- Creating examples or tutorials

### Testing
- Adding test coverage (if test setup is added)
- Reporting bugs with clear reproduction steps

## Expectations

### Scope
- Keep PRs focused on a single issue or feature
- Large changes should be discussed in an issue first
- Breaking changes require discussion

### Communication
- Be respectful and constructive
- Ask questions if something is unclear
- Respond to feedback on your PRs

### Code Quality
- Code should work and be tested locally
- Follow existing patterns and style
- Ensure no console errors or warnings

## Questions?

If you're unsure about anything:
- Open an issue to ask questions
- Check existing issues for similar discussions
- Review the codebase to understand patterns

Thank you for contributing! 🎉

