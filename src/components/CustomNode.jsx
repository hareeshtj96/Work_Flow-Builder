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

  const getContentStyle = () => {
    if (data.label === "Decision") {
      return { transform: "rotate(-45deg)" };
    }
    return {};
  };

  const isDecision = data.label === "Decision";

  return (
    <div className="relative">
      {/* Main node shape container */}
      <div
        className="border shadow cursor-pointer flex items-center justify-center"
        style={{
          backgroundColor: data.color || "white",
          ...data.shapeStyles,
          // Ensure aspect ratio is maintained for circles
          aspectRatio: data.label === "Start" ? "1 / 1" : "auto",
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <div
          className="text-center text-xs px-1 truncate w-full"
          style={getContentStyle()}
        >
          {data.label}
        </div>
      </div>

      {/* Delete button - Positioned relative to outer container */}
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
          {/* The default handles are already at Top and Bottom */}
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
