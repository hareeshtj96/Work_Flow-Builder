import React, { useState, useEffect, useRef } from "react";

const PropertiesPanel = ({ isOpen, onClose, data, onUpdate }) => {
  const [title, setTitle] = useState(data.label || "");
  const [description, setDescription] = useState(data.description || "");
  const [color, setColor] = useState(data.color || "#ffffff");

  const prevDataRef = useRef();

  useEffect(() => {
    if (
      !prevDataRef.current ||
      prevDataRef.current.label !== data.label ||
      prevDataRef.current.description !== data.description ||
      prevDataRef.current.color !== data.color
    ) {
      setTitle(data.label || "");
      setDescription(data.description || "");
      setColor(data.color || "#ffffff");
      prevDataRef.current = data;
    }
  }, [data]);

  const handleSave = (e) => {
    e.stopPropagation();
    onUpdate({ label: title, description, color });
    onClose();
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Properties Panel</h2>

        {/* Title Input */}
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          className="border w-full p-2 rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <label className="block text-sm font-medium">Description</label>
        <textarea
          className="border w-full p-2 rounded mb-4"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {/* Color pick */}
        <label className="block text-sm font-medium">Color</label>
        <input
          type="color"
          className="w-full h-10 cursor-pointer mb-4"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
