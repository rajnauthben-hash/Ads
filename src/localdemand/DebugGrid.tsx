import React from "react";

/** Coordinate grid for tracing routes/anchors against the plates. Debug only. */
export const DebugGrid: React.FC = () => {
  const lines: React.ReactNode[] = [];
  for (let x = 0; x <= 1080; x += 100) {
    lines.push(<line key={`x${x}`} x1={x} y1={0} x2={x} y2={1920} stroke="rgba(0,255,0,0.35)" strokeWidth={1} />);
    lines.push(
      <text key={`xt${x}`} x={x + 2} y={26} fill="#0f0" fontSize={20} fontFamily="monospace">
        {x}
      </text>,
    );
  }
  for (let y = 0; y <= 1920; y += 100) {
    lines.push(<line key={`y${y}`} x1={0} y1={y} x2={1080} y2={y} stroke="rgba(0,255,0,0.35)" strokeWidth={1} />);
    lines.push(
      <text key={`yt${y}`} x={2} y={y - 4} fill="#0f0" fontSize={20} fontFamily="monospace">
        {y}
      </text>,
    );
  }
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {lines}
    </svg>
  );
};
