import React from "react";
import { COLORS } from "../styles/tokens";
import { FONTS } from "../styles/typography";
import { CustomerIcon, PinIcon } from "./Icons";

// Three mini diagram cards along the bottom of Scene 3.
export const MiniDiagramCard: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  heading: string;
  kind: "customer" | "competitor" | "business";
  progress?: number;
}> = ({ x, y, width, height, heading, kind, progress = 1 }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        opacity: progress,
        transform: `translateY(${(1 - progress) * 22}px)`,
        borderRadius: 18,
        background: COLORS.panelRaised,
        border: `1.5px solid ${COLORS.darkBorder}`,
        boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
        padding: 22,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 27, color: COLORS.headline, marginBottom: 10 }}>{heading}</div>
      <div style={{ position: "relative", width: "100%", height: height - 90 }}>
        {kind === "customer" && (
          <>
            <Ripples cx="24%" cy="72%" color={COLORS.cyan} />
            <div style={{ position: "absolute", left: "18%", top: "40%" }}>
              <CustomerIcon size={40} color={COLORS.cyan} />
            </div>
            <div style={{ position: "absolute", left: "62%", top: "34%" }}>
              <PinIcon size={34} color={COLORS.mutedGray} />
            </div>
            <svg style={{ position: "absolute", inset: 0 }} width="100%" height="100%">
              <path d="M55 90 Q120 130 175 78" stroke={COLORS.cyan} strokeWidth={2} strokeDasharray="3 5" fill="none" opacity={0.7} />
            </svg>
          </>
        )}
        {kind === "competitor" && (
          <>
            <Ripples cx="50%" cy="70%" color={COLORS.gold} />
            <div style={{ position: "absolute", left: "20%", top: "26%" }}><PinIcon size={30} color={COLORS.gold} /></div>
            <div style={{ position: "absolute", left: "45%", top: "40%" }}><StarPin /></div>
            <div style={{ position: "absolute", left: "70%", top: "26%" }}><PinIcon size={30} color={COLORS.gold} /></div>
            <svg style={{ position: "absolute", inset: 0 }} width="100%" height="100%">
              <path d="M60 78 Q120 120 175 78" stroke={COLORS.gold} strokeWidth={2} strokeDasharray="3 5" fill="none" opacity={0.6} />
            </svg>
          </>
        )}
        {kind === "business" && (
          <>
            <Ripples cx="28%" cy="70%" color={COLORS.mutedGray} />
            <div style={{ position: "absolute", left: "22%", top: "34%" }}><PinIcon size={32} color={COLORS.mutedGray} /></div>
            <svg style={{ position: "absolute", inset: 0 }} width="100%" height="100%">
              <path d="M70 84 H180" stroke={COLORS.mutedGray} strokeWidth={2} strokeDasharray="3 5" fill="none" opacity={0.6} />
              <path d="M186 78 l10 12 M196 78 l-10 12" stroke={COLORS.mutedGray} strokeWidth={2} opacity={0.8} />
            </svg>
            <div style={{ position: "absolute", right: "6%", top: 0, bottom: 0, width: 10, background: "repeating-linear-gradient(transparent 0 4px, rgba(242,163,61,0.4) 4px 8px)" }} />
          </>
        )}
      </div>
    </div>
  );
};

const Ripples: React.FC<{ cx: string; cy: string; color: string }> = ({ cx, cy, color }) => (
  <div style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)" }}>
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          width: i * 34,
          height: i * 12,
          left: -i * 17,
          top: -i * 6,
          borderRadius: "50%",
          border: `1.5px solid ${color}`,
          opacity: 0.32 / i,
        }}
      />
    ))}
  </div>
);

const StarPin: React.FC = () => (
  <svg width={38} height={38} viewBox="0 0 24 24" fill="none">
    <path d="M12 21c4-5 7-8 7-12a7 7 0 0 0-14 0c0 4 3 7 7 12z" fill="rgba(229,164,71,0.18)" stroke={COLORS.gold} strokeWidth={1.6} />
    <path d="M12 5l1.3 2.7 2.9.4-2.1 2 .5 2.9L12 13.6 9.4 15l.5-2.9-2.1-2 2.9-.4z" fill={COLORS.gold} />
  </svg>
);
