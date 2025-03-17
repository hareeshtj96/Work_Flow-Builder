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
  const nodes = useSelector((state) => state.workflow.nodes);
  const edges = useSelector((state) => state.workflow.edges);

  const [nodesState, setNodesState, onNodesChange] = useNodesState(nodes);
  const [edgesState, setEdgesState, onEdgesChange] = useEdgesState(edges);

  // Syncing with local state
  useEffect(() => {
    setNodesState(nodes);
  }, [nodes]);

  useEffect(() => {
    setEdgesState(edges);
  }, [edges]);

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
      dispatch(setEdges(newEdge));
    },
    [edgesState, setEdgesState, dispatch, nodesState]
  );

  const handleDeleteNode = (nodeId) => {
    setNodesState((prevNodes) =>
      prevNodes.filter((node) => node.id !== nodeId)
    );
    setEdgesState((prevEdges) =>
      prevEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );
    dispatch(deleteNode({ id: nodeId }));
  };

  //  Drop feature
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

      const newNode = {
        id: uuidv4(),
        type: "custom",
        position,
        data: {
          label: `${nodeType}`,
          onDelete: handleDeleteNode,
          shapeStyles,
        },
      };

      setNodesState((prevNodes) => {
        const updatedNodes = [...prevNodes, newNode];
        dispatch(setNodes(updatedNodes));
        return updatedNodes;
      });
    },
    [setNodesState, dispatch, handleDeleteNode]
  );

  return (
    <div
      className="h-screen w-full bg-gray-100"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
