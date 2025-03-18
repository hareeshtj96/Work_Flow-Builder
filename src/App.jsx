import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNodes, setEdges } from "./store/store";
import FlowCanvas from "./components/FlowCanvas";
import toast from "react-hot-toast";
import Nodes from "./components/Nodes";

function App() {
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.workflow.nodes);
  const edges = useSelector((state) => state.workflow.edges);

  const handleSave = async () => {
    // store in Redux
    localStorage.setItem("workflow", JSON.stringify({ nodes, edges }));
    toast.success("Workflow saved!");
  };

  const handleLoad = async () => {
    try {
      const savedWorkflow = JSON.parse(localStorage.getItem("workflow"));
      if (savedWorkflow) {
        dispatch(setNodes(savedWorkflow.nodes || []));
        dispatch(setEdges(savedWorkflow.edges || []));
        toast.success("Workflow loaded successfully!");
      } else {
        toast.error("No saved workflow found!");
      }
    } catch (error) {
      console.error("Error loading workflow:", error);
      toast.error("Failed to load workflow!");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen over">
      {/* Nodes Panel */}
      <div className="w-full md:w-64 h-auto md:h-screen bg-gray-200">
        <Nodes />
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <FlowCanvas />

        {/* Save & Load Buttons */}
        <div className="fixed top-4 right-4 flex flex-wrap space-x-2">
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
    </div>
  );
}

export default App;
