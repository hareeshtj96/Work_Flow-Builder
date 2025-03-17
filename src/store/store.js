import { configureStore, createSlice } from "@reduxjs/toolkit";


const workflowSlice = createSlice({
    name: 'workflow',
    initialState: { nodes: [], edges: [] },
    reducers: {
        setNodes: (state, action) => { state.nodes = action.payload },
        setEdges: (state, action) => { state.edges = action.payload },
        addNode: (state, action) => { state.nodes.push(action.payload) },
        deleteNode: (state, action) => {
            const nodeId = action.payload.id;
            console.log("node id in store:", nodeId);

            state.nodes = state.nodes.filter(node => node.id !== nodeId);
            console.log("state nodes:", state.nodes);

            state.edges = state.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);
            console.log("state edges:", state.edges);
        },
        addEdge: (state, action) => { state.edges.push(action.payload) },
        updateNodeText: (state, action) => {
            const { id, label, description, color } = action.payload;
            state.nodes = state.nodes.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, label, description, color } } : node
            );
        }

    }
});

export const { setNodes, setEdges, addNode, addEdge, deleteNode, updateNodeText } = workflowSlice.actions;
export const store = configureStore({
    reducer: { workflow: workflowSlice.reducer }
});