import React from "react";

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, style = {} }) => {
  const edgePath = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;

  // Calculate midpoint of the line
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  // Calculate angle for the arrow
  const angle =
    Math.atan2(targetY - sourceY, targetX - sourceX) * (180 / Math.PI);

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd=""
      />
      <g transform={`translate(${midX}, ${midY}) rotate(${angle})`}>
        <polygon
          points="-10,-5 0,0 -10,5"
          fill="#333"
          stroke="#333"
          strokeWidth="1"
        />
      </g>
    </>
  );
};

export default CustomEdge;
