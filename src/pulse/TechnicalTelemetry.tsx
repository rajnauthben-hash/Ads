import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { noise } from "./helpers";
import { COLORS, FONTS } from "./theme";

type Props = {
  // Scene tag shown in the header line, e.g. "SIGNAL / 01".
  tag: string;
  // Extra readout label for the right column.
  readout: string;
  seed?: number;
  opacity?: number;
};

// Quiet mono telemetry pinned to the frame edges: scene tag, timecode,
// a live metric and a small activity bar. Keeps every scene technically
// alive without competing with the copy.
export const TechnicalTelemetry: React.FC<Props> = ({
  tag,
  readout,
  seed = 2,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const secs = (frame / fps).toFixed(2).padStart(5, "0");
  const metric = (62 + Math.sin(frame * 0.09 + seed) * 21 + noise(seed, Math.floor(frame / 6)) * 9).toFixed(1);
  const bars = Array.from({ length: 14 }, (_, i) =>
    0.2 + 0.8 * noise(seed + 3, i + Math.floor(frame / 5)),
  );

  const mono: React.CSSProperties = {
    fontFamily: FONTS.mono,
    fontWeight: 500,
    fontSize: 16,
    letterSpacing: 4,
    color: "rgba(167, 175, 183, 0.66)",
  };

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}>
      <div
        style={{
          position: "absolute",
          top: 54,
          left: 64,
          right: 64,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ ...mono, color: COLORS.cyan, opacity: 0.75 }}>{tag}</div>
        <div style={mono}>T+{secs}s</div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 54,
          left: 64,
          right: 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 22 }}>
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                width: 3.5,
                height: 22 * h,
                background: i % 5 === 0 ? "rgba(221,174,74,0.6)" : "rgba(0,210,255,0.4)",
              }}
            />
          ))}
        </div>
        <div style={mono}>
          {readout} {metric}
        </div>
      </div>
    </div>
  );
};
