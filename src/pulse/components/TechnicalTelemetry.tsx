import React from "react";
import { C, FONT_MONO } from "../theme";
import { prog } from "../util";

/**
 * Quiet monospace telemetry cluster: coordinates, a live signal counter,
 * a scan meter and a blinking status dot. Keeps corners of the frame
 * alive without competing with the copy.
 */
export interface TechnicalTelemetryProps {
  frame: number;
  x: number;
  y: number;
  appear?: number;
  align?: "left" | "right";
  rows?: string[];
  tag?: string;
  opacity?: number;
}

export const TechnicalTelemetry: React.FC<TechnicalTelemetryProps> = ({
  frame,
  x,
  y,
  appear = 0,
  align = "right",
  rows,
  tag = "LOCAL SIGNAL",
  opacity = 1,
}) => {
  const p = prog(frame, appear, 12);
  if (p <= 0) return null;
  const sig = String(34 + (Math.floor(frame / 6) % 61)).padStart(3, "0");
  const lines = rows ?? [`${tag}`, `SIG ${sig} / ACTIVE`];
  const meter = 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.055));
  const blink = Math.floor(frame / 16) % 2 === 0;

  return (
    <div
      style={{
        position: "absolute",
        left: align === "left" ? x : undefined,
        right: align === "right" ? 1080 - x : undefined,
        top: y,
        textAlign: align,
        opacity: p * opacity,
        transform: `translate3d(0, ${((1 - p) * 10).toFixed(1)}px, 0)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: align === "right" ? "flex-end" : "flex-start" }}>
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: C.cyan,
            opacity: blink ? 0.9 : 0.25,
            boxShadow: blink ? `0 0 8px ${C.cyan}` : "none",
          }}
        />
        <div style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: 19, letterSpacing: 4, color: C.cyan, opacity: 0.75 }}>
          {lines[0]}
        </div>
      </div>
      {lines.slice(1).map((l, i) => (
        <div
          key={i}
          style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: 18, letterSpacing: 3, color: C.text2, opacity: 0.55, marginTop: 7 }}
        >
          {l}
        </div>
      ))}
      <div
        style={{
          marginTop: 9,
          height: 3,
          width: 120,
          background: "rgba(0,210,255,0.12)",
          borderRadius: 2,
          marginLeft: align === "right" ? "auto" : 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${(meter * 100).toFixed(1)}%`,
            background: C.cyan,
            opacity: 0.55,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
};
