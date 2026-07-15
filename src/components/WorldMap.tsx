import React, { useMemo } from "react";
import { COLORS, MAP_TRANSFORM, W, H } from "../config/design";
import { FONT_MONO } from "../config/fonts";
import { PerspectiveGrid, PLANE_W, PLANE_H } from "./PerspectiveGrid";
import { hash } from "./pathMath";

interface Building {
  x: number;
  y: number;
  w: number;
  h: number;
  opacity: number;
}

const buildFootprints = (): Building[] => {
  const items: Building[] = [];
  for (let i = 0; i < 70; i++) {
    const x = hash(i * 3.1) * PLANE_W;
    const y = 260 + hash(i * 5.7 + 1) * (PLANE_H - 400);
    const w = 34 + hash(i * 7.3 + 2) * 70;
    const h = 34 + hash(i * 9.9 + 3) * 70;
    const opacity = 0.05 + hash(i * 4.4 + 4) * 0.1;
    items.push({ x, y, w, h, opacity });
  }
  return items;
};

const MAP_TOP = 560;

export const WorldMap: React.FC<{ frame: number; dim?: number }> = ({ frame, dim = 1 }) => {
  const buildings = useMemo(buildFootprints, []);
  const driftX = Math.sin(frame / 260) * 8;
  const driftRotate = Math.sin(frame / 340) * 0.8;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: MAP_TOP,
        height: H - MAP_TOP,
        overflow: "hidden",
        opacity: dim,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: `${MAP_TRANSFORM.perspective}px`,
          perspectiveOrigin: "50% 0%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: -120,
            width: PLANE_W,
            height: PLANE_H,
            transform: `translateX(calc(-50% + ${driftX}px)) rotateX(${MAP_TRANSFORM.rotateX}deg) rotateZ(${
              MAP_TRANSFORM.rotateZ + driftRotate
            }deg)`,
            transformOrigin: "50% 0%",
          }}
        >
          {buildings.map((b, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: b.x,
                top: b.y,
                width: b.w,
                height: b.h,
                background: `rgba(0,210,255,${b.opacity * 0.5})`,
                border: `1px solid rgba(0,210,255,${b.opacity * 1.6})`,
              }}
            />
          ))}
          <PerspectiveGrid />
        </div>
      </div>
      {/* vignette so the grid dissolves into the matte background at the edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 85% 78% at 50% 8%, transparent 38%, ${COLORS.bg} 92%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to top, transparent 82%, ${COLORS.bg} 100%)`,
        }}
      />
    </div>
  );
};

export const TelemetryReadout: React.FC<{ x: number; y: number; frame: number; start: number }> = ({
  x,
  y,
  frame,
  start,
}) => {
  const local = frame - start;
  const widths = [58, 92, 40, 74, 30];
  return (
    <div style={{ position: "absolute", left: x, top: y, fontFamily: FONT_MONO }}>
      {widths.map((w, i) => {
        const reveal = Math.max(0, Math.min(1, (local - i * 4) / 14));
        return (
          <div
            key={i}
            style={{
              width: w * reveal,
              height: 2,
              marginBottom: 7,
              background: i % 2 === 0 ? "rgba(0,210,255,0.4)" : "rgba(244,246,247,0.22)",
            }}
          />
        );
      })}
    </div>
  );
};

export const MAP_TOP_Y = MAP_TOP;
export const CANVAS_W = W;
export const CANVAS_H = H;
