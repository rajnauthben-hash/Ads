import React from "react";
import { C, FONT_BODY, FONT_MONO } from "../theme";
import { clamp01, ezIn, prog, rand } from "../util";

/**
 * Ranked local-search results 01–06. The top three are active (gold,
 * bright, connected); 04–06 are dim and visibly ignored. Thumbnails are
 * abstract SVG interiors — no photography. Rows rise from the map and
 * inactive rows can dissolve back into it on exit.
 */
export interface RankingSystemProps {
  frame: number;
  x: number;
  y: number;
  start?: number;
  rowH?: number;
  gap?: number;
  dimStart?: number; // frame when 04–06 lose further brightness
  exitInactive?: { start: number; dur: number };
  exitActive?: { start: number; dur: number };
  width?: number;
}

export const RANK_ENTRIES = [
  { label: "Top Choice", rating: "4.9", active: true },
  { label: "Great Option", rating: "4.7", active: true },
  { label: "Solid Pick", rating: "4.5", active: true },
  { label: "Looks Okay", rating: "4.1", active: false },
  { label: "Maybe Later", rating: "3.8", active: false },
  { label: "Nah", rating: "3.2", active: false },
] as const;

export const rankRowCenter = (y: number, i: number, rowH = 128, gap = 26): number =>
  y + i * (rowH + gap) + rowH / 2;

const Thumb: React.FC<{ i: number; active: boolean; frame: number }> = ({ i, active, frame }) => {
  const warm = active ? 0.75 : 0.2;
  const flicker = 0.9 + 0.1 * Math.sin(frame * 0.11 + i * 2.3);
  return (
    <svg width={118} height={92} viewBox="0 0 118 92" style={{ borderRadius: 10, display: "block" }}>
      <rect width={118} height={92} rx={10} fill="#0B0D0F" />
      <rect x={0.8} y={0.8} width={116.4} height={90.4} rx={9.5} fill="none" stroke={active ? "rgba(221,174,74,0.45)" : "#20262B"} strokeWidth={1.4} />
      {/* warm interior glow */}
      <ellipse cx={59 + rand(i * 3.3) * 16 - 8} cy={34} rx={44} ry={24} fill="#E8A94E" opacity={0.22 * warm * flicker} />
      <ellipse cx={40} cy={22} rx={16} ry={9} fill="#FFD9A0" opacity={0.3 * warm * flicker} />
      {/* hanging lights */}
      {[26, 59, 92].map((lx, k) => (
        <g key={k}>
          <line x1={lx} y1={6} x2={lx} y2={16 + k * 2} stroke="#2A2118" strokeWidth={1} />
          <circle cx={lx} cy={18 + k * 2} r={3} fill="#FFCB6B" opacity={warm * flicker} />
        </g>
      ))}
      {/* furniture silhouettes */}
      {[0, 1, 2].map((k) => {
        const bx = 14 + k * 34 + rand(i * 7.7 + k) * 6;
        return <rect key={k} x={bx} y={62} width={24} height={16 + rand(i + k * 2) * 6} rx={2} fill="#050708" opacity={0.9} />;
      })}
      <rect x={0} y={78} width={118} height={14} fill="#050708" opacity={0.7} />
    </svg>
  );
};

export const RankingSystem: React.FC<RankingSystemProps> = ({
  frame,
  x,
  y,
  start = 8,
  rowH = 128,
  gap = 26,
  dimStart,
  exitInactive,
  exitActive,
  width = 430,
}) => {
  return (
    <div style={{ position: "absolute", left: x, top: y, width }}>
      {RANK_ENTRIES.map((e, i) => {
        const p = prog(frame, start + i * 6, 14);
        if (p <= 0) return null;
        const extraDim =
          !e.active && dimStart !== undefined ? 1 - prog(frame, dimStart, 20) * 0.55 : 1;
        const exit = e.active ? exitActive : exitInactive;
        const xq = exit ? prog(frame, exit.start, exit.dur, ezIn) : 0;
        if (xq >= 1) return null;
        const baseO = e.active ? 1 : 0.4;
        return (
          <div
            key={e.label}
            style={{
              position: "absolute",
              left: 0,
              top: i * (rowH + gap),
              width,
              height: rowH,
              display: "flex",
              alignItems: "center",
              gap: 24,
              opacity: baseO * p * extraDim * (1 - xq),
              transform: `translate3d(0, ${((1 - p) * 34 + xq * 46).toFixed(1)}px, 0)`,
              filter: `blur(${(xq * 6).toFixed(1)}px)`,
            }}
          >
            {/* connector dot + number */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 66 }}>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontWeight: 500,
                  fontSize: 30,
                  letterSpacing: 2,
                  color: e.active ? C.gold : "#5A6167",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  marginTop: 8,
                  width: e.active ? 9 : 6,
                  height: e.active ? 9 : 6,
                  borderRadius: "50%",
                  background: e.active ? C.gold : "#39424A",
                  boxShadow: e.active ? `0 0 10px ${C.gold}` : "none",
                  opacity: e.active ? 0.75 + 0.25 * Math.sin(frame * 0.2 + i) : 0.7,
                }}
              />
            </div>
            <div style={{ filter: e.active ? "none" : "grayscale(0.7) brightness(0.7)" }}>
              <Thumb i={i} active={e.active} frame={frame} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                  fontSize: 31,
                  color: e.active ? C.goldWarm : "#6C737A",
                  whiteSpace: "nowrap",
                }}
              >
                {e.label}
              </div>
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontWeight: 500,
                  fontSize: 25,
                  marginTop: 6,
                  color: e.active ? C.text : "#565D63",
                }}
              >
                {e.rating} <span style={{ color: e.active ? C.gold : "#565D63" }}>★</span>
              </div>
            </div>
          </div>
        );
      })}
      {/* dashed spine linking ignored results */}
      <svg
        width={20}
        height={6 * (rowH + gap)}
        style={{ position: "absolute", left: 28, top: 0, overflow: "visible" }}
      >
        <line
          x1={5}
          y1={rankRowCenter(0, 3, rowH, gap) - 20}
          x2={5}
          y2={rankRowCenter(0, 5, rowH, gap)}
          stroke="#39424A"
          strokeWidth={1.4}
          strokeDasharray="3 9"
          opacity={clamp01((frame - start - 30) / 12) * 0.5 * (exitInactive ? 1 - prog(frame, exitInactive.start, exitInactive.dur) : 1)}
        />
      </svg>
    </div>
  );
};
