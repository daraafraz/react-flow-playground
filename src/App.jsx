import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';

import CustomNode from './nodes/CustomNode';
import './App.css';

// Define custom node types
const nodeTypes = {
  custom: CustomNode,
};

// Initial nodes with different types
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start Node' },
    position: { x: 250, y: 0 },
    style: {
      background: '#6ede87',
      color: '#fff',
      border: '1px solid #555',
      borderRadius: 8,
      padding: 10,
      fontSize: 14,
      fontWeight: 600,
    },
  },
  {
    id: '2',
    type: 'custom',
    data: { 
      label: 'Custom Node',
      description: 'This is a custom node!',
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Default Node' },
    position: { x: 400, y: 100 },
    style: {
      background: '#fff',
      border: '2px solid #4a90e2',
      borderRadius: 8,
      padding: 10,
    },
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'End Node' },
    position: { x: 250, y: 250 },
    style: {
      background: '#ff6b6b',
      color: '#fff',
      border: '1px solid #555',
      borderRadius: 8,
      padding: 10,
      fontSize: 14,
      fontWeight: 600,
    },
  },
];

// Initial edges connecting the nodes
const initialEdges = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2',
    animated: true,
    style: { stroke: '#6ede87', strokeWidth: 2 },
  },
  { 
    id: 'e1-3', 
    source: '1', 
    target: '3',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#4a90e2', strokeWidth: 2 },
  },
  { 
    id: 'e2-4', 
    source: '2', 
    target: '4',
    type: 'step',
    style: { strokeWidth: 2 },
  },
  { 
    id: 'e3-4', 
    source: '3', 
    target: '4',
    type: 'smoothstep',
    style: { strokeWidth: 2 },
  },
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle new connections
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // Handle node clicks
  const onNodeClick = useCallback((event, node) => {
    console.log('Node clicked:', node);
  }, []);

  // Handle edge clicks
  const onEdgeClick = useCallback((event, edge) => {
    console.log('Edge clicked:', edge);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap 
          nodeStrokeColor={(n) => {
            if (n.type === 'input') return '#6ede87';
            if (n.type === 'output') return '#ff6b6b';
            if (n.type === 'custom') return '#9b59b6';
            return '#4a90e2';
          }}
          nodeColor={(n) => {
            if (n.type === 'input') return '#6ede87';
            if (n.type === 'output') return '#ff6b6b';
            if (n.type === 'custom') return '#9b59b6';
            return '#fff';
          }}
          nodeBorderRadius={8}
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel position="top-left" className="info-panel">
          <h2>🎮 React Flow Playground</h2>
          <p>Drag nodes • Connect handles • Zoom & Pan</p>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default App;

