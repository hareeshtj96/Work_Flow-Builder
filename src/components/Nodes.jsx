import React from "react";

const Nodes = () => {
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-full max-w-xs h-auto min-h-screen bg-gray-200 flex flex-col items-center justify-start p-4">
      <h3 className="text-lg font-bold mb-4">Drag Nodes</h3>

      <div className="flex flex-wrap justify-center gap-4 w-full">
        {/* Circle Shape */}
        <div
          className="group relative w-12 h-12 flex items-center justify-center border border-black cursor-pointer rounded-full"
          draggable
          onDragStart={(e) => handleDragStart(e, "Start")}
        >
          {/* Tooltip */}
          <span className="absolute bottom-full mb-2 bg-white text-black text-xs px-2 py-1 rounded hidden group-hover:flex whitespace-nowrap">
            Start Node
          </span>
        </div>

        {/* Rectangle Shape */}
        <div
          className="group relative w-24 h-12 flex items-center justify-center border border-black cursor-pointer rounded"
          draggable
          onDragStart={(e) => handleDragStart(e, "Process")}
        >
          {/* Tooltip */}
          <span className="absolute bottom-full mb-2 bg-white text-black text-xs px-2 py-1 rounded hidden group-hover:flex whitespace-nowrap">
            Process Node
          </span>
        </div>

        {/* Diamond Shape */}
        <div
          className="group relative w-12 h-12 border border-black cursor-pointer flex items-center justify-center transform rotate-45"
          draggable
          onDragStart={(e) => handleDragStart(e, "Decision")}
        >
          {/* Tooltip */}
          <span className="absolute bottom-full mb-2 bg-white text-black text-xs px-2 py-1 rounded hidden group-hover:flex whitespace-nowrap transform -rotate-45">
            Decision Node
          </span>
        </div>
      </div>
    </div>
  );
};

export default Nodes;
