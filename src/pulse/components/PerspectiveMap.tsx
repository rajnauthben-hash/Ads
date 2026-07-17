import React, { useMemo } from "react";
import { C } from "../theme";
import { rand } from "../util";

/**
 * Dimensional neighborhood map: street grid, avenues, building blocks and
 * ambient light dots on a perspective-tilted plane. Static geometry is
 * memoized; ambient dots and dashed gold roads breathe with the frame so
 * the plane is never dead.
 */
export interface PerspectiveMapProps {
  frame: number;
  seed?: number;
  x: number; // screen position of the map centre
  y: number;
  size?: number; // svg square size (pre-transform)
  tilt?: number; // rotateX deg
  rotate?: number; // rotateZ deg
  scale?: number;
  opacity?: number;
  accents?: number;
  driftX?: number; // slow in-plane drift px (applied via frame)
  driftY?: number;
}

const GRID = 1600;

export const PerspectiveMap: React.FC<PerspectiveMapProps> = ({
  frame,
  seed = 1,
  x,
  y,
  size = 1900,
  tilt = 55,
  rotate = -12,
  scale = 1,
  opacity = 1,
  accents = 34,
  driftX = -0.06,
  driftY = 0.03,
}) => {
  const staticLayer = useMemo(() => {
    const els: React.ReactNode[] = [];
    const step = 100;
    // street grid
    for (let i = 0; i <= GRID / step; i++) {
      const o = 0.05 + rand(seed * 3.7 + i) * 0.08;
      const wgt = i % 4 === 0 ? 2.4 : 1.2;
      els.push(
        <line key={`v${i}`} x1={i * step} y1={0} x2={i * step} y2={GRID} stroke="#2A3238" strokeWidth={wgt} opacity={o} />,
        <line key={`h${i}`} x1={0} y1={i * step} x2={GRID} y2={i * step} stroke="#2A3238" strokeWidth={wgt} opacity={o} />,
      );
    }
    // diagonal avenues
    const avs = [
      `M -50 ${GRID * 0.72} L ${GRID * 0.45} ${GRID * 0.42} L ${GRID + 50} ${GRID * 0.3}`,
      `M ${GRID * 0.2} ${GRID + 50} L ${GRID * 0.55} ${GRID * 0.55} L ${GRID * 0.8} -50`,
    ];
    avs.forEach((d, i) =>
      els.push(
        <path key={`av${i}`} d={d} stroke="#39424A" strokeWidth={7} fill="none" opacity={0.22} />,
      ),
    );
    // building blocks
    const cells = GRID / step;
    for (let cx = 0; cx < cells; cx++) {
      for (let cy = 0; cy < cells; cy++) {
        const r = rand(seed * 13.1 + cx * 31 + cy * 7);
        if (r < 0.42) continue;
        const inset = 10 + rand(seed + cx + cy * 2) * 14;
        const w = step - inset * 2;
        const h = step - inset * 2 - rand(seed * 2 + cx * 3 + cy) * 24;
        els.push(
          <rect
            key={`b${cx}-${cy}`}
            x={cx * step + inset}
            y={cy * step + inset}
            width={Math.max(20, w)}
            height={Math.max(18, h)}
            rx={4}
            fill="#0F1214"
            stroke="#1C2226"
            strokeWidth={1}
            opacity={0.5 + r * 0.4}
          />,
        );
      }
    }
    return els;
  }, [seed]);

  // living elements
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < accents; i++) {
    const s = seed * 51.3 + i * 2.17;
    const gold = rand(s + 9) > 0.55;
    const px = rand(s) * GRID;
    const py = rand(s + 1) * GRID;
    const tw = 0.5 + 0.5 * Math.sin(frame * (0.04 + rand(s + 2) * 0.05) + i * 1.7);
    dots.push(
      <circle
        key={i}
        cx={px}
        cy={py}
        r={2.2 + rand(s + 3) * 2.6}
        fill={gold ? C.goldWarm : C.cyan}
        opacity={(0.08 + tw * 0.3) * (gold ? 1 : 0.8)}
      />,
    );
  }

  const dash = (frame * 0.55) % 60;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 0,
        height: 0,
        opacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -size / 2,
          top: -size / 2,
          width: size,
          height: size,
          transform: `perspective(1500px) rotateX(${tilt}deg) rotateZ(${rotate}deg) scale(${scale}) translate3d(${(
            frame * driftX
          ).toFixed(2)}px, ${(frame * driftY).toFixed(2)}px, 0)`,
          transformOrigin: "50% 50%",
        }}
      >
        <svg viewBox={`0 0 ${GRID} ${GRID}`} width={size} height={size} style={{ display: "block" }}>
          {staticLayer}
          {/* dashed gold traffic on the avenues — slowly flowing */}
          <path
            d={`M -50 ${GRID * 0.72} L ${GRID * 0.45} ${GRID * 0.42} L ${GRID + 50} ${GRID * 0.3}`}
            stroke={C.goldWarm}
            strokeWidth={2.4}
            fill="none"
            opacity={0.18}
            strokeDasharray="4 26"
            strokeDashoffset={-dash}
          />
          <path
            d={`M ${GRID * 0.2} ${GRID + 50} L ${GRID * 0.55} ${GRID * 0.55} L ${GRID * 0.8} -50`}
            stroke={C.goldWarm}
            strokeWidth={2.4}
            fill="none"
            opacity={0.14}
            strokeDasharray="4 30"
            strokeDashoffset={dash}
          />
          {dots}
        </svg>
      </div>
    </div>
  );
};
