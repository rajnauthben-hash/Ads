import React from "react";
import { useCurrentFrame } from "remotion";
import { SignalRing } from "./SignalRing";
import { COLORS, FONTS } from "./theme";

type Props = {
  x: number;
  y: number;
  scale?: number;
  // 0..1 — how alive the business reads. Scene 01/04 keep it dim,
  // scene 05 charges it up, scene 06 runs it fully lit.
  brightness: number;
  // 0..1 — activity of the visibility rings underneath.
  ringActivity?: number;
  // Local frame at which the storefront starts building in.
  appearFrame?: number;
  // Text on the facade sign board.
  label?: string;
  // Gold sign treatment (CRAFT & CO. in scene 06).
  goldSign?: boolean;
  // Topiary planters flanking the door.
  plants?: boolean;
};

// A premium dimensional storefront: main volume with a receding side face,
// cornice, brick coursing, scalloped awning, warm interiors with table
// hints, transom door, planters and a facade sign. Reveals from shadow.
export const StorefrontNode: React.FC<Props> = ({
  x,
  y,
  scale = 1,
  brightness,
  ringActivity = 0,
  appearFrame = 0,
  label = "YOUR BUSINESS",
  goldSign = false,
  plants = false,
}) => {
  const frame = useCurrentFrame();
  const build = Math.min(1, Math.max(0, (frame - appearFrame) / 14));
  if (build <= 0) {
    return null;
  }
  const b = Math.max(0.14, brightness);
  const warmFlicker = 0.88 + 0.12 * Math.sin(frame * 0.09);
  const w = 232;
  const h = 196;
  const signColor = goldSign ? COLORS.gold : `rgba(245,246,247,${0.35 + 0.5 * b})`;

  return (
    <g
      transform={`translate(${x - (w / 2) * scale} ${y - h * scale}) scale(${scale})`}
      opacity={build}
    >
      {ringActivity > 0 && (
        <SignalRing cx={w / 2} cy={h + 8} activity={ringActivity} maxRadius={150} />
      )}

      {/* Sidewalk slab + layered shadow */}
      <ellipse cx={w / 2} cy={h + 8} rx={w * 0.66} ry={18} fill="#000" opacity={0.55} />
      <path d={`M -26 ${h + 2} L ${w + 40} ${h + 2} L ${w + 62} ${h + 22} L -44 ${h + 22} Z`} fill="rgba(18,19,20,0.85)" opacity={build} />
      <line x1={-26} y1={h + 2} x2={w + 40} y2={h + 2} stroke="rgba(154,163,173,0.14)" strokeWidth={1} />

      {/* Receding side face */}
      <path
        d={`M ${w} 26 L ${w + 34} 12 L ${w + 34} ${h - 18} L ${w} ${h} Z`}
        fill="#0D0E10"
        stroke="rgba(154,163,173,0.1)"
        strokeWidth={1}
      />
      {/* Side face brick coursing */}
      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={i}
          x1={w + 2}
          y1={40 + i * 24}
          x2={w + 32}
          y2={28 + i * 24}
          stroke="rgba(154,163,173,0.06)"
          strokeWidth={1}
        />
      ))}

      {/* Cornice */}
      <rect x={-8} y={14} width={w + 16} height={14} rx={2} fill="#17181A" stroke="rgba(154,163,173,0.16)" strokeWidth={1} />
      <rect x={-4} y={26} width={w + 8} height={5} fill="#101113" />

      {/* Facade */}
      <rect x={0} y={31} width={w} height={h - 31} fill="#121316" stroke={`rgba(0,216,255,${0.14 * b})`} strokeWidth={1.2} />
      {/* Brick coursing */}
      {Array.from({ length: 5 }, (_, i) => (
        <line key={i} x1={2} y1={40 + i * 9} x2={w - 2} y2={40 + i * 9} stroke="rgba(154,163,173,0.05)" strokeWidth={1} />
      ))}

      {/* Sign board */}
      <rect x={16} y={44} width={w - 32} height={30} rx={3} fill="#0C0D0F" stroke={goldSign ? "rgba(224,184,91,0.5)" : "rgba(154,163,173,0.22)"} strokeWidth={1.2} />
      <text
        x={w / 2}
        y={65}
        textAnchor="middle"
        fill={signColor}
        fontFamily={FONTS.mono}
        fontWeight={500}
        fontSize={15.5}
        letterSpacing={3.2}
        opacity={0.55 + 0.45 * b * warmFlicker}
      >
        {label}
      </text>
      {/* Sign downlight wash */}
      <rect x={16} y={74} width={w - 32} height={16} fill={goldSign ? COLORS.gold : COLORS.cyan} opacity={0.05 + 0.1 * b} />

      {/* Scalloped awning */}
      <g>
        <rect x={6} y={86} width={w - 12} height={22} rx={2} fill="#1A1B1E" stroke="rgba(154,163,173,0.18)" strokeWidth={1} />
        {Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            d={`M ${6 + i * ((w - 12) / 7)} 108 a ${(w - 12) / 14} 9 0 0 0 ${(w - 12) / 7} 0 Z`}
            fill={i % 2 === 0 ? "#1E1F23" : "#141518"}
            stroke="rgba(0,0,0,0.4)"
            strokeWidth={0.8}
          />
        ))}
        {/* Awning underglow from windows */}
        <rect x={6} y={108} width={w - 12} height={8} fill={COLORS.gold} opacity={0.08 * b * warmFlicker} />
      </g>

      {/* Windows with warm interiors */}
      {[
        { wx: 12, ww: 78 },
        { wx: 142, ww: 78 },
      ].map((win, wi) => (
        <g key={wi}>
          <rect x={win.wx} y={122} width={win.ww} height={58} rx={2} fill="#0A0B0D" stroke="rgba(154,163,173,0.26)" strokeWidth={1.6} />
          {/* Interior warm glow */}
          <rect x={win.wx + 3} y={125} width={win.ww - 6} height={52} fill={`rgba(224,166,80,${0.13 + 0.36 * b * warmFlicker})`} />
          {/* Interior hints: pendant lights + table */}
          <circle cx={win.wx + win.ww * 0.3} cy={134} r={2.4} fill="#F5D9A0" opacity={0.5 + 0.5 * b} />
          <circle cx={win.wx + win.ww * 0.7} cy={134} r={2.4} fill="#F5D9A0" opacity={0.4 + 0.5 * b} />
          <rect x={win.wx + 14} y={158} width={win.ww - 28} height={5} rx={2} fill="rgba(0,0,0,0.5)" />
          {/* Mullions */}
          <line x1={win.wx + win.ww / 2} y1={122} x2={win.wx + win.ww / 2} y2={180} stroke="rgba(10,11,13,0.85)" strokeWidth={2.4} />
          {/* Glass reflection streak */}
          <line x1={win.wx + 10} y1={176} x2={win.wx + win.ww - 16} y2={128} stroke="rgba(245,246,247,0.07)" strokeWidth={5} />
        </g>
      ))}

      {/* Door with transom */}
      <rect x={98} y={126} width={36} height={54} rx={2} fill="#0B0C0E" stroke="rgba(154,163,173,0.3)" strokeWidth={1.4} />
      <rect x={101} y={132} width={30} height={12} fill={`rgba(224,166,80,${0.1 + 0.3 * b})`} />
      <rect x={101} y={148} width={30} height={30} fill={`rgba(224,166,80,${0.06 + 0.22 * b})`} />
      <circle cx={127} cy={162} r={1.6} fill="rgba(224,184,91,0.8)" />
      {/* Door light spill onto sidewalk */}
      <path d={`M 98 ${h} L 134 ${h} L 150 ${h + 20} L 82 ${h + 20} Z`} fill={COLORS.gold} opacity={0.05 + 0.1 * b * warmFlicker} />

      {plants && (
        <>
          {[
            { px: -6, s: 1 },
            { px: w - 22, s: 0.9 },
          ].map((p, pi) => (
            <g key={pi} transform={`translate(${p.px} ${h - 34}) scale(${p.s})`}>
              <circle cx={14} cy={6} r={13} fill="#131A12" stroke="rgba(90,120,80,0.5)" strokeWidth={1} />
              <circle cx={10} cy={2} r={4} fill="rgba(120,150,100,0.25)" />
              <path d="M 4 18 L 24 18 L 21 36 L 7 36 Z" fill="#141517" stroke="rgba(154,163,173,0.2)" strokeWidth={1} />
            </g>
          ))}
        </>
      )}
    </g>
  );
};
