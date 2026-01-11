import { CameraControls } from "@react-three/drei";
import React, { useState } from "react";
import { move } from "../../lib/useCameraMovement";

interface ArrowsProps {
  cameraControlsRef: React.RefObject<CameraControls | null>;
}
export function Arrows({ cameraControlsRef }: ArrowsProps) {
  const [pressed, setPressed] = useState({
    up: false,
    right: false,
    down: false,
    left: false,
  });
  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        left: "80px",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: "5px",
          width: "120px",
          height: "120px",
        }}
      >
        {/* Empty top-left */}
        <div></div>
        {/* Up */}
        <button
          onClick={() =>
            move({
              action: "up",
              cameraControlsRef: cameraControlsRef,
            })
          }
          onMouseDown={() => setPressed({ ...pressed, up: true })}
          onMouseUp={() => setPressed({ ...pressed, up: false })}
          onMouseLeave={() => setPressed({ ...pressed, up: false })} // Reset if mouse leaves
          style={{
            gridColumn: 2,
            gridRow: 1,
            padding: "8px",
            fontSize: "14px",
            backgroundColor: pressed.up ? "#555" : "#333", // Darker when pressed
            color: "white",
            border: "1px solid #555",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          ↑
        </button>
        {/* Empty top-right */}
        <div></div>
        {/* Left */}
        <button
          onClick={() =>
            move({
              action: "left",
              cameraControlsRef: cameraControlsRef,
            })
          }
          onMouseDown={() => setPressed({ ...pressed, left: true })}
          onMouseUp={() => setPressed({ ...pressed, left: false })}
          onMouseLeave={() => setPressed({ ...pressed, left: false })}
          style={{
            gridColumn: 1,
            gridRow: 2,
            padding: "8px",
            fontSize: "14px",
            backgroundColor: pressed.left ? "#555" : "#333",
            color: "white",
            border: "1px solid #555",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          ←
        </button>
        {/* Empty center */}
        <div></div>
        {/* Right */}
        <button
          onClick={() =>
            move({
              action: "right",
              cameraControlsRef: cameraControlsRef,
            })
          }
          onMouseDown={() => setPressed({ ...pressed, right: true })}
          onMouseUp={() => setPressed({ ...pressed, right: false })}
          onMouseLeave={() => setPressed({ ...pressed, right: false })}
          style={{
            gridColumn: 3,
            gridRow: 2,
            padding: "8px",
            fontSize: "14px",
            backgroundColor: pressed.right ? "#555" : "#333",
            color: "white",
            border: "1px solid #555",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          →
        </button>
        {/* Empty bottom-left */}
        <div></div>
        {/* Down */}
        <button
          onClick={() =>
            move({
              action: "down",
              cameraControlsRef: cameraControlsRef,
            })
          }
          onMouseDown={() => setPressed({ ...pressed, down: true })}
          onMouseUp={() => setPressed({ ...pressed, down: false })}
          onMouseLeave={() => setPressed({ ...pressed, down: false })}
          style={{
            gridColumn: 2,
            gridRow: 3,
            padding: "8px",
            fontSize: "14px",
            backgroundColor: pressed.down ? "#555" : "#333",
            color: "white",
            border: "1px solid #555",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
        >
          ↓
        </button>
        {/* Empty bottom-right */}
        <div></div>
      </div>
    </div>
  );
}
