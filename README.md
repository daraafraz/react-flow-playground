# React Flow Playground 🎮

A fully interactive playground for experimenting with [React Flow](https://reactflow.dev/) - a highly customizable React component for building node-based editors and interactive diagrams.

## Features ✨

- **Interactive Canvas**: Drag nodes, connect handles, zoom & pan
- **Custom Nodes**: Example custom node with gradient styling
- **Multiple Edge Types**: Animated, smoothstep, and step edges
- **Built-in Components**: 
  - MiniMap for navigation
  - Controls for zoom/fit view
  - Background with dots pattern
  - Info Panel
- **Live Updates**: Hot module replacement with Vite

## Getting Started 🚀

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Available Scripts 📜

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure 📁

```
react-flow-playground/
├── src/
│   ├── nodes/
│   │   ├── CustomNode.jsx      # Custom node component
│   │   └── CustomNode.css      # Custom node styles
│   ├── App.jsx                 # Main React Flow component
│   ├── App.css                 # App styles
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## Customization 🎨

### Adding New Node Types

1. Create a new node component in `src/nodes/`
2. Register it in the `nodeTypes` object in `App.jsx`
3. Use it in your `initialNodes` array

Example:

```jsx
const nodeTypes = {
  custom: CustomNode,
  yourNewType: YourNewNode,
};
```

### Modifying Edges

Change edge types and styles in the `initialEdges` array:

```jsx
{
  id: 'e1-2',
  source: '1',
  target: '2',
  type: 'smoothstep', // default, step, smoothstep, straight
  animated: true,
  style: { stroke: '#6ede87', strokeWidth: 2 },
}
```

## Learn More 📚

- [React Flow Documentation](https://reactflow.dev/learn)
- [React Flow Examples](https://reactflow.dev/examples)
- [React Flow API Reference](https://reactflow.dev/api-reference)
- [React Flow Pro](https://reactflow.dev/pro) - Advanced features and support

## Key Concepts 💡

- **Nodes**: Building blocks of your diagram (input, output, default, custom)
- **Edges**: Connections between nodes with various styles
- **Handles**: Connection points on nodes (source/target)
- **Controls**: Built-in UI for zoom, fit view, etc.
- **MiniMap**: Overview navigation component
- **Background**: Visual grid or dots pattern

## Tips 🎯

- **Drag nodes**: Click and drag any node
- **Connect nodes**: Drag from a handle (dot) to another node's handle
- **Select multiple**: Hold Shift and drag to select multiple nodes
- **Delete**: Select nodes/edges and press Delete/Backspace
- **Zoom**: Use mouse wheel or controls
- **Pan**: Drag on empty canvas space
- **Fit view**: Click the fit view icon in controls

## Next Steps 🔥

Try these examples from the official docs:

1. [Add Node on Edge Drop](https://reactflow.dev/examples/nodes/add-node-on-edge-drop)
2. [Drag and Drop](https://reactflow.dev/examples/interaction/drag-and-drop)
3. [Validation](https://reactflow.dev/examples/interaction/validation)
4. [Save and Restore](https://reactflow.dev/examples/interaction/save-and-restore)
5. [Custom Edges](https://reactflow.dev/examples/edges/custom-edges)

## Resources 🔗

- [React Flow Website](https://reactflow.dev/)
- [GitHub Repository](https://github.com/xyflow/xyflow)
- [Discord Community](https://discord.gg/RVmnytFmGW)

## License 📄

This playground is open source. React Flow is MIT licensed.

---

Built with ❤️ using React Flow v12

