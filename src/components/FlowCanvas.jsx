import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useDispatch, useSelector } from "react-redux";
import { setNodes, setEdges, deleteNode } from "../store/store";
import { v4 as uuidv4 } from "uuid";
import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const FlowCanvas = () => {
  const dispatch = useDispatch();
  const reduxNodes = useSelector((state) => state.workflow.nodes);
  const reduxEdges = useSelector((state) => state.workflow.edges);

  // Nodes with delete handlers
  const prepareNodesWithHandlers = useCallback((nodes) => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onDelete: (nodeId) => handleDeleteNode(nodeId),
      },
    }));
  }, []);

  // Initialize local state
  const [nodesState, setNodesState, onNodesChange] = useNodesState([]);
  const [edgesState, setEdgesState, onEdgesChange] = useEdgesState([]);

  // Process node deletions
  const handleDeleteNode = useCallback(
    (nodeId) => {
      setNodesState((prevNodes) =>
        prevNodes.filter((node) => node.id !== nodeId)
      );
      setEdgesState((prevEdges) =>
        prevEdges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        )
      );

      // Dispatch to Store
      dispatch(deleteNode({ id: nodeId }));
    },
    [dispatch, setNodesState, setEdgesState]
  );

  // Sync from Redux to local state
  useEffect(() => {
    const nodesWithHandlers = prepareNodesWithHandlers(reduxNodes);
    setNodesState(nodesWithHandlers);
  }, [reduxNodes, prepareNodesWithHandlers]);

  useEffect(() => {
    setEdgesState(reduxEdges);
  }, [reduxEdges]);

  // Node changes handler
  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);

      setNodesState((currentNodes) => {
        const cleanNodes = currentNodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            onDelete: undefined,
          },
        }));

        // Dispatch to store
        dispatch(setNodes(cleanNodes));
        return currentNodes;
      });
    },
    [onNodesChange, dispatch]
  );

  const onConnect = useCallback(
    (connection) => {
      const { source, target } = connection;

      // get source and target position
      const sourceNode = nodesState.find((node) => node.id === source);
      const targetNode = nodesState.find((node) => node.id === target);

      if (!sourceNode || !targetNode) return;

      const adjustedConnection =
        sourceNode.position.y > targetNode.position.y
          ? { ...connection, source: target, target: source }
          : connection;

      const newEdge = addEdge(
        {
          ...adjustedConnection,
          type: "custom",
          style: {
            strokeWidth: 1,
            stroke: "#333",
          },
        },
        edgesState
      );
      setEdgesState(newEdge);

      // Save edges to Redux
      dispatch(setEdges(newEdge));
    },
    [edgesState, setEdgesState, dispatch, nodesState]
  );

  // Drop feature
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/reactflow");
      if (!nodeType) return;

      // Calculate position relative to pane
      const reactFlowBounds = document
        .querySelector(".react-flow")
        .getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      // Set shape styles based on node type
      let shapeStyles = {};
      if (nodeType === "Start") {
        shapeStyles = {
          borderRadius: "50%",
          width: "80px",
          height: "80px",
        };
      } else if (nodeType === "Decision") {
        shapeStyles = {
          transform: "rotate(45deg)",
          width: "60px",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        };
      } else if (nodeType === "Process") {
        shapeStyles = {
          borderRadius: "4px",
          width: "120px",
          height: "50px",
        };
      }

      // Create the node
      const newNode = {
        id: uuidv4(),
        type: "custom",
        position,
        data: {
          label: nodeType,
          onDelete: handleDeleteNode,
          shapeStyles,
        },
      };

      // Add to local state
      setNodesState((prevNodes) => [...prevNodes, newNode]);

      // Create a copy
      const cleanNode = {
        ...newNode,
        data: {
          ...newNode.data,
          onDelete: undefined,
        },
      };

      // Update Redux
      dispatch(setNodes([...reduxNodes, cleanNode]));
    },
    [setNodesState, dispatch, handleDeleteNode, reduxNodes]
  );

  return (
    <div
      className="h-screen min-h-screen w-full bg-gray-100 flex flex-col"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex-1 w-full">
        <ReactFlow
          nodes={nodesState}
          edges={edgesState}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowCanvas;
