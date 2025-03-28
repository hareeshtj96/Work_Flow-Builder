import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { useDispatch } from "react-redux";
import { updateNodeText } from "../store/store";
import PropertiesPanel from "./PropertiesPanel";

const CustomNode = ({ id, data }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateNode = (updatedData) => {
    dispatch(updateNodeText({ id, ...updatedData }));
  };

  const isDecision = data.shapeStyles.transform === "rotate(45deg)";

  const contentStyle = isDecision ? { transform: "rotate(-45deg)" } : {};

  return (
    <div className="relative w-full max-w-[150px] min-w-0">
      {/* Main node shape container */}
      <div
        className="border shadow cursor-pointer flex items-center justify-center p-2"
        style={{
          backgroundColor: data.color || "white",
          ...data.shapeStyles,
          // for circle
          aspectRatio: data.label === "Start" ? "1 / 1" : "auto",
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <div
          className="text-center text-xs px-1 truncate w-full"
          style={contentStyle}
        >
          {data.label}
        </div>
      </div>

      {/* Delete button  */}
      <button
        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs p-0 w-4 h-4 flex items-center justify-center rounded-full z-20"
        onClick={(e) => {
          e.stopPropagation();
          data.onDelete && data.onDelete(id);
        }}
      >
        ✕
      </button>

      {/* Handles */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      {/* Additional Handles for Decision node */}
      {isDecision && (
        <>
          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Left} />
          <Handle type="target" position={Position.Right} />
          <Handle type="source" position={Position.Right} />
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <PropertiesPanel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={data}
          onUpdate={handleUpdateNode}
        />
      )}
    </div>
  );
};

export default CustomNode;
