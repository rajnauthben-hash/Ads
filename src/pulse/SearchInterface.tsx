import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "./theme";
import { EASE_UI } from "./motion";

type Props = {
  // Local frame at which the interface begins constructing itself.
  buildFrame: number;
  width?: number;
  style?: React.CSSProperties;
};

export const SEARCH_ROWS = [
  { label: "Places", icon: "pin" },
  { label: "Reviews", icon: "star" },
  { label: "Photos", icon: "photo" },
  { label: "Opening hours", icon: "clock" },
] as const;

// Geometry shared with the scene so data strands can attach to each row.
export const SEARCH_PANEL = { width: 540, barH: 76, rowH: 78, rowsTop: 100 };
export const searchRowCenterY = (i: number): number =>
  SEARCH_PANEL.rowsTop + SEARCH_PANEL.rowH * i + SEARCH_PANEL.rowH / 2;

// Each intent row carries its own restrained hero micro-animation, driven by
// frames since the row activated: Places pings a map coordinate, Reviews
// sweeps its rating fill, Photos runs a thumbnail scan, Opening hours
// completes its clock arc.
const RowIcon: React.FC<{ kind: string; a: number; since: number }> = ({ kind, a, since }) => {
  const stroke = `rgba(0, 216, 255, ${0.4 + 0.5 * a})`;
  switch (kind) {
    case "pin": {
      // Coordinate pulse — a ring expands from the pin tip, twice, staggered.
      const ping = since > 0 ? ((since * 0.022) % 1) : 0;
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" style={{ overflow: "visible" }}>
          {since > 2 && (
            <circle cx="15" cy="11" r={3 + ping * 13} fill="none" stroke={stroke} strokeWidth={1.2} opacity={(1 - ping) * 0.7} />
          )}
          <path d="M15 26 C 9 18 7.5 15 7.5 10.5 A 7.5 7.5 0 1 1 22.5 10.5 C 22.5 15 21 18 15 26 Z" fill="none" stroke={stroke} strokeWidth={1.8} />
          <circle cx="15" cy="11" r="2.8" fill={stroke} />
        </svg>
      );
    }
    case "star": {
      // Rating sweep — the star fills once, left to right, then settles.
      const sweep = Math.min(1, Math.max(0, (since - 4) / 16));
      return (
        <svg width="30" height="30" viewBox="0 0 30 30">
          <path d="M15 3 L18.2 11 L27 11.5 L20 17 L22.4 25.6 L15 20.6 L7.6 25.6 L10 17 L3 11.5 L11.8 11 Z" fill="none" stroke={stroke} strokeWidth={1.8} strokeLinejoin="round" />
          {sweep > 0 && (
            <path
              d="M15 3 L18.2 11 L27 11.5 L20 17 L22.4 25.6 L15 20.6 L7.6 25.6 L10 17 L3 11.5 L11.8 11 Z"
              fill={COLORS.gold}
              opacity={0.75}
              clipPath={`inset(0 ${(1 - sweep) * 100}% 0 0)`}
            />
          )}
        </svg>
      );
    }
    case "photo": {
      // Thumbnail scan — a bright line crosses the frame once.
      const scan = Math.min(1, Math.max(0, (since - 6) / 18));
      return (
        <svg width="30" height="30" viewBox="0 0 30 30">
          <rect x="4" y="6" width="22" height="18" rx="3" fill="none" stroke={stroke} strokeWidth={1.8} />
          <circle cx="10.5" cy="12" r="2.2" fill={stroke} />
          <path d="M 6 21 L 13 14 L 17.5 18.5 L 21 15 L 24 18" fill="none" stroke={stroke} strokeWidth={1.8} />
          {scan > 0 && scan < 1 && (
            <line x1={5 + scan * 20} y1={7} x2={5 + scan * 20} y2={23} stroke="#CFF6FF" strokeWidth={1.6} opacity={0.9 * Math.sin(scan * Math.PI)} />
          )}
        </svg>
      );
    }
    default: {
      // Clock arc completes once on activation.
      const arc = Math.min(1, Math.max(0, (since - 2) / 20));
      const circ = 2 * Math.PI * 10;
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="15" cy="15" r="10" fill="none" stroke={stroke} strokeWidth={1.8} opacity={0.4} />
          <circle
            cx="15"
            cy="15"
            r="10"
            fill="none"
            stroke={stroke}
            strokeWidth={1.8}
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - arc)}
            strokeLinecap="round"
          />
          <path d="M 15 9.5 L 15 15 L 19.5 17.5" fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" transform="rotate(90 15 15)" />
        </svg>
      );
    }
  }
};

// Premium translucent search surface (deliberately not Google's UI): a pill
// search field with placeholder + filter control, then four quiet intent
// rows divided by hairlines. Constructs from the incoming route cable, kept
// alive by a soft scan sweep and breathing row icons.
export const SearchInterface: React.FC<Props> = ({ buildFrame, width = SEARCH_PANEL.width, style }) => {
  const frame = useCurrentFrame();
  const t = (from: number, dur: number, easing = EASE_UI) =>
    interpolate(frame, [buildFrame + from, buildFrame + from + dur], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing,
    });

  const bar = t(0, 12);
  const panel = t(4, 14);
  const totalH = SEARCH_PANEL.rowsTop + SEARCH_PANEL.rowH * SEARCH_ROWS.length + 18;
  const scanY = ((frame - buildFrame) * 3.4) % totalH;

  return (
    <div style={{ width, position: "relative", height: totalH, ...style }}>
      {/* Panel body behind the rows */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 40,
          bottom: 0,
          borderRadius: 28,
          background: "linear-gradient(160deg, rgba(22,24,27,0.78), rgba(14,15,17,0.62))",
          border: "1px solid rgba(0,216,255,0.13)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(245,246,247,0.05)",
          opacity: panel,
          transform: `translate3d(0, ${(1 - panel) * 26}px, 0)`,
        }}
      />

      {/* Search pill */}
      <div
        style={{
          position: "relative",
          height: SEARCH_PANEL.barH,
          borderRadius: SEARCH_PANEL.barH / 2,
          background: "rgba(16,17,19,0.92)",
          border: `1.4px solid rgba(0,216,255,${0.22 + 0.4 * bar})`,
          boxShadow: `0 0 ${30 * bar}px rgba(0,216,255,0.13), inset 0 1px 0 rgba(245,246,247,0.06)`,
          display: "flex",
          alignItems: "center",
          padding: "0 26px",
          gap: 18,
          clipPath: `inset(0 ${(1 - bar) * 100}% 0 0 round ${SEARCH_PANEL.barH / 2}px)`,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28">
          <circle cx="12" cy="12" r="7.5" fill="none" stroke={COLORS.cyan} strokeWidth={2.2} />
          <line x1="18" y1="18" x2="24" y2="24" stroke={COLORS.cyan} strokeWidth={2.4} strokeLinecap="round" />
        </svg>
        <div
          style={{
            flex: 1,
            fontFamily: FONTS.body,
            fontWeight: 400,
            fontSize: 20,
            letterSpacing: 0.2,
            color: "rgba(154,163,173,0.85)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            opacity: t(6, 10),
          }}
        >
          Search places, restaurants, services...
        </div>
        {/* Filter control */}
        <svg width="30" height="30" viewBox="0 0 30 30" style={{ opacity: t(8, 8) }}>
          <circle cx="15" cy="15" r="12" fill="none" stroke="rgba(0,216,255,0.4)" strokeWidth={1.4} />
          <line x1="9" y1="12" x2="21" y2="12" stroke={COLORS.cyan} strokeWidth={1.6} />
          <line x1="9" y1="18" x2="21" y2="18" stroke={COLORS.cyan} strokeWidth={1.6} />
          <circle cx="17.5" cy="12" r="2" fill={COLORS.bg} stroke={COLORS.cyan} strokeWidth={1.4} />
          <circle cx="12.5" cy="18" r="2" fill={COLORS.bg} stroke={COLORS.cyan} strokeWidth={1.4} />
        </svg>
      </div>

      {/* Intent rows */}
      {SEARCH_ROWS.map((row, i) => {
        const rt = t(12 + i * 6, 12);
        if (rt <= 0) {
          return null;
        }
        const breathe = 0.8 + 0.2 * Math.sin(frame * 0.07 + i * 1.4);
        return (
          <div
            key={row.label}
            style={{
              position: "absolute",
              left: 26,
              right: 26,
              top: SEARCH_PANEL.rowsTop + i * SEARCH_PANEL.rowH,
              height: SEARCH_PANEL.rowH,
              display: "flex",
              alignItems: "center",
              gap: 22,
              opacity: rt,
              transform: `translate3d(${(1 - rt) * -30}px, 0, 0)`,
              filter: `blur(${(1 - rt) * 5}px)`,
              borderBottom: i < SEARCH_ROWS.length - 1 ? "1px solid rgba(154,163,173,0.1)" : "none",
            }}
          >
            <div style={{ opacity: 0.55 + 0.45 * breathe }}>
              <RowIcon kind={row.icon} a={rt} since={frame - (buildFrame + 12 + i * 6)} />
            </div>
            <div
              style={{
                fontFamily: FONTS.body,
                fontWeight: 400,
                fontSize: 27,
                letterSpacing: 0.2,
                color: "#DEE3E7",
              }}
            >
              {row.label}
            </div>
          </div>
        );
      })}

      {/* Scan sweep */}
      {panel > 0.5 && (
        <div
          style={{
            position: "absolute",
            left: 8,
            right: 8,
            top: scanY,
            height: 34,
            background: "linear-gradient(180deg, transparent, rgba(0,216,255,0.05), transparent)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};
