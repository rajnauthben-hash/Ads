import React from "react";
import { C, FONT_BODY } from "../theme";
import { ezOut, prog } from "../util";
import { Glyph, IconName } from "./icons";

/**
 * Abstract local-search interface (deliberately NOT Google's UI, no
 * logo): a search field plus four modules — Places, Reviews, Photos,
 * Opening hours. The panel border draws itself, modules materialize one
 * at a time, a scan line sweeps continuously and each module exposes a
 * right-edge data port that brightens when its stream is flowing.
 */
export interface SearchInterfaceProps {
  frame: number;
  x: number;
  y: number;
  width?: number;
  appear?: number;
  streamStarts?: number[]; // per-module frame when its data stream turns on
}

export const MODULES: { icon: IconName; label: string }[] = [
  { icon: "pin", label: "Places" },
  { icon: "star", label: "Reviews" },
  { icon: "camera", label: "Photos" },
  { icon: "clock", label: "Opening hours" },
];

export const SEARCH_PANEL_H = 620;
export const MODULE_ROW_H = 104;
export const MODULE_FIRST_Y = 176; // relative to panel top

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  frame,
  x,
  y,
  width = 500,
  appear = 4,
  streamStarts = [],
}) => {
  const H = SEARCH_PANEL_H;
  const borderP = prog(frame, appear, 14);
  const bgO = prog(frame, appear + 2, 10) * 0.9;
  if (frame < appear) return null;

  const perim = 2 * (width + H);
  const scanY = ((frame * 7.5) % (H + 120)) - 60;
  const caretOn = Math.floor(frame / 14) % 2 === 0;
  const fieldP = prog(frame, appear + 6, 12);

  return (
    <div style={{ position: "absolute", left: x, top: y, width, height: H }}>
      {/* panel background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 30,
          background: "rgba(16, 18, 20, 0.82)",
          boxShadow: `0 0 60px rgba(0,210,255,0.06), inset 0 0 40px rgba(0,210,255,0.03)`,
          opacity: bgO,
        }}
      />
      {/* self-drawing border */}
      <svg width={width} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <rect
          x={1.5}
          y={1.5}
          width={width - 3}
          height={H - 3}
          rx={30}
          fill="none"
          stroke="rgba(0,210,255,0.35)"
          strokeWidth={1.6}
          strokeDasharray={`${(borderP * perim).toFixed(0)} ${perim.toFixed(0)}`}
        />
        {/* scan line */}
        {scanY > 8 && scanY < H - 8 && bgO > 0.5 ? (
          <line x1={16} y1={scanY} x2={width - 16} y2={scanY} stroke={C.cyan} strokeWidth={1.4} opacity={0.1} />
        ) : null}
        {/* module data ports on the right edge */}
        {MODULES.map((_, i) => {
          const cy = MODULE_FIRST_Y + i * MODULE_ROW_H + MODULE_ROW_H / 2;
          const on = streamStarts[i] !== undefined && frame >= streamStarts[i];
          const pulse = on ? 0.55 + 0.45 * Math.sin(frame * 0.28 + i * 1.4) : 0;
          return (
            <g key={i}>
              <circle cx={width - 2} cy={cy} r={4.5} fill={on ? C.cyan : "#243036"} opacity={on ? 0.5 + pulse * 0.5 : 0.6} />
              {on ? <circle cx={width - 2} cy={cy} r={9} fill="none" stroke={C.cyan} strokeWidth={1} opacity={pulse * 0.4} /> : null}
            </g>
          );
        })}
      </svg>

      {/* search field */}
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 28,
          right: 24,
          height: 96,
          borderRadius: 24,
          border: `1.5px solid rgba(0,210,255,${0.18 + fieldP * 0.22})`,
          background: "rgba(9,11,13,0.7)",
          display: "flex",
          alignItems: "center",
          padding: "0 26px",
          gap: 20,
          opacity: fieldP,
          clipPath: `inset(0 ${((1 - ezOut(fieldP)) * 100).toFixed(1)}% 0 0 round 24px)`,
        }}
      >
        <svg width={30} height={30} viewBox="-15 -15 30 30">
          <circle cx={-2.5} cy={-2.5} r={8} fill="none" stroke={C.cyan} strokeWidth={2.4} />
          <line x1={4} y1={4} x2={11} y2={11} stroke={C.cyan} strokeWidth={2.4} strokeLinecap="round" />
        </svg>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 400,
            fontSize: 23,
            color: C.text2,
            opacity: 0.85,
            whiteSpace: "nowrap",
            overflow: "hidden",
            flex: 1,
          }}
        >
          Search places, restaurants, services...
          <span style={{ opacity: caretOn ? 0.9 : 0, color: C.cyan, fontWeight: 500 }}>|</span>
        </div>
        <svg width={30} height={30} viewBox="-15 -15 30 30" opacity={0.8}>
          <line x1={-9} y1={-5} x2={9} y2={-5} stroke={C.cyan} strokeWidth={2} strokeLinecap="round" />
          <line x1={-9} y1={5} x2={9} y2={5} stroke={C.cyan} strokeWidth={2} strokeLinecap="round" />
          <circle cx={3} cy={-5} r={3.4} fill="#0B0C0E" stroke={C.cyan} strokeWidth={2} />
          <circle cx={-3} cy={5} r={3.4} fill="#0B0C0E" stroke={C.cyan} strokeWidth={2} />
        </svg>
      </div>

      {/* modules */}
      {MODULES.map((m, i) => {
        const mStart = appear + 16 + i * 7;
        const p = prog(frame, mStart, 12);
        if (p <= 0) return null;
        const on = streamStarts[i] !== undefined && frame >= streamStarts[i];
        return (
          <div
            key={m.label}
            style={{
              position: "absolute",
              left: 24,
              top: MODULE_FIRST_Y + i * MODULE_ROW_H,
              right: 24,
              height: MODULE_ROW_H - 14,
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "0 14px",
              borderBottom: i < MODULES.length - 1 ? "1px solid rgba(0,210,255,0.10)" : "none",
              opacity: p,
              transform: `translate3d(${((1 - p) * -18).toFixed(1)}px, 0, 0)`,
              filter: `blur(${((1 - p) * 8).toFixed(1)}px)`,
              clipPath: `inset(-10% ${((1 - p) * 100).toFixed(1)}% -10% 0)`,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: C.mutedUi,
                border: `1px solid rgba(0,210,255,${on ? 0.5 : 0.25})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width={34} height={34} viewBox="-17 -17 34 34">
                <Glyph name={m.icon} color={on ? C.cyan2 : C.cyan} scale={1.15} strokeWidth={1.9} />
              </svg>
            </div>
            <div style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 30, color: C.text, opacity: 0.92 }}>
              {m.label}
            </div>
            {/* activity ticks */}
            <div style={{ marginLeft: "auto", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map((k) => {
                const tick = 0.25 + 0.75 * Math.max(0, Math.sin(frame * 0.22 + i * 1.9 + k * 0.9));
                return (
                  <div
                    key={k}
                    style={{
                      width: 4,
                      height: 10 + tick * 10,
                      borderRadius: 2,
                      background: on ? C.cyan : "#2A343A",
                      opacity: on ? 0.3 + tick * 0.6 : 0.6,
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
