import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNodes, setEdges } from "./store/store";
import { saveWorkflow, loadWorkflow } from "./api/api";
import FlowCanvas from "./components/FlowCanvas";
import Nodes from "./components/Nodes";

function App() {
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.workflow.nodes);
  const edges = useSelector((state) => state.workflow.edges);

  const handleSave = async () => {
    localStorage.setItem("workflow", JSON.stringify({ nodes, edges }));
    alert("Workflow saved!");
  };

  const handleLoad = async () => {
    const savedWorkflow = JSON.parse(localStorage.getItem("workflow"));
    if (savedWorkflow) {
      dispatch(setNodes(savedWorkflow.nodes || []));
      dispatch(setEdges(savedWorkflow.edges || []));
    }
  };

  return (
    <div className="flex h-screen">
      <Nodes />
      <FlowCanvas />
      <div className="absolute top-4 right-4 space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleLoad}
        >
          Load
        </button>
      </div>
    </div>
  );
}

export default App;
