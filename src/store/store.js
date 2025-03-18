import { configureStore, createSlice } from "@reduxjs/toolkit";


const workflowSlice = createSlice({
    name: 'workflow',
    initialState: { nodes: [], edges: [] },
    reducers: {
        setNodes: (state, action) => {
            state.nodes = action.payload;
            localStorage.setItem("workflow", JSON.stringify({ nodes: state.nodes, edges: state.edges }));
        },
        setEdges: (state, action) => {
            state.edges = action.payload;
            localStorage.setItem("workflow", JSON.stringify({ nodes: state.nodes, edges: state.edges }));
        },
        addNode: (state, action) => {
            state.nodes.push(action.payload);
            localStorage.setItem("workflow", JSON.stringify({ nodes: state.nodes, edges: state.edges }));
        },
        deleteNode: (state, action) => {
            const nodeId = action.payload.id;
            state.nodes = state.nodes.filter(node => node.id !== nodeId);
            state.edges = state.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);
            localStorage.setItem("workflow", JSON.stringify({ nodes: state.nodes, edges: state.edges }));
        },
        addEdge: (state, action) => {
            state.edges.push(action.payload);
            localStorage.setItem("workflow", JSON.stringify({ nodes: state.nodes, edges: state.edges }));
        },
        updateNodeText: (state, action) => {
            const { id, label, description, color } = action.payload;
            state.nodes = state.nodes.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, label, description, color } } : node
            );
            localStorage.setItem("workflow", JSON.stringify({ nodes: state.nodes, edges: state.edges }));
        }
    }
});

export const { setNodes, setEdges, addNode, addEdge, deleteNode, updateNodeText } = workflowSlice.actions;
export const store = configureStore({
    reducer: { workflow: workflowSlice.reducer }
});