// Scene 2 — Physical Reality vs Digital Version (frames 132-263)
import React from "react";
import { COLORS } from "../tokens";
import { reveal, clampInterp } from "../framePlan";
import { HeadlineBlock } from "../components/text";

const BrokenX: React.FC<{ frame: number; y: number; opacity: number }> = ({ frame, y, opacity }) => {
  // single pulse near frame 228
  const pulse = Math.max(0, 1 - Math.abs(frame - 228) / 6);
  const glow = 6 + pulse * 10;
  const dash = "22 16";
  return (
    <svg width={1080} height={80} viewBox="0 0 1080 80" style={{ position: "absolute", left: 0, top: y - 40, opacity, overflow: "visible" }}>
      <line x1="130" y1="40" x2="470" y2="40" stroke={COLORS.cyan} strokeWidth={2} strokeDasharray={dash} strokeLinecap="round" opacity={0.8} />
      <line x1="610" y1="40" x2="950" y2="40" stroke={COLORS.cyan} strokeWidth={2} strokeDasharray={dash} strokeLinecap="round" opacity={0.8} />
      {/* centre X */}
      <g style={{ filter: `blur(${(glow - 6) * 0.2}px)` }}>
        <line x1="522" y1="26" x2="558" y2="54" stroke={COLORS.cyanBright} strokeWidth={2.4} strokeLinecap="round" />
        <line x1="558" y1="26" x2="522" y2="54" stroke={COLORS.cyanBright} strokeWidth={2.4} strokeLinecap="round" />
      </g>
      <circle cx="540" cy="40" r={4 + pulse * 4} fill={COLORS.cyanBright} opacity={0.5 + pulse * 0.5} />
    </svg>
  );
};

export const Scene2Copy: React.FC<{ frame: number }> = ({ frame }) => {
  const out = 241;
  const h1 = reveal(frame, 139, out);
  const h2 = reveal(frame, 151, out);
  const pr = reveal(frame, 178, out);
  const dv = reveal(frame, 182, out);
  const prs = reveal(frame, 194, out);
  const dvs = reveal(frame, 198, out);
  const xOpacity = clampInterp(frame, [160, 178, 241, 258], [0, 1, 1, 0]);

  const label = (text: string, x: number): React.CSSProperties => ({
    position: "absolute",
    left: x,
    width: 340,
    top: 1240,
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
    fontWeight: 600,
    fontSize: 30,
    letterSpacing: 1.5,
    color: COLORS.cyan,
  });

  return (
    <>
      <HeadlineBlock
        lines={[{ text: "Your doors may be open." }]}
        x={80}
        y={195}
        width={760}
        fontSize={67}
        weight={650}
        anim={h1}
      />
      <HeadlineBlock
        lines={[{ text: "Online, it can look", color: COLORS.cyan }, { text: "like you are not.", color: COLORS.cyan }]}
        x={165}
        y={290}
        width={690}
        fontSize={72}
        lineHeight={0.98}
        weight={600}
        align="center"
        anim={h2}
      />

      <BrokenX frame={frame} y={1180} opacity={xOpacity} />

      {/* vertical divider */}
      <div style={{ position: "absolute", left: 538, top: 1245, width: 1, height: 205, background: "rgba(34,211,238,0.35)", opacity: xOpacity }} />

      {/* PHYSICAL REALITY */}
      <div style={{ ...label("", 90), opacity: pr.opacity, transform: `translateY(${pr.translateY}px)` }}>
        PHYSICAL REALITY
        <div style={{ height: 2, width: 220, background: COLORS.cyan, margin: "10px auto 0" }} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 1310, width: 340, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 27, lineHeight: 1.4, color: COLORS.softWhite, opacity: prs.opacity, transform: `translateY(${prs.translateY}px)` }}>
        Warm lights. Ready shelves.<br />Staff prepared.
      </div>

      {/* DIGITAL VERSION */}
      <div style={{ ...label("", 560), opacity: dv.opacity, transform: `translateY(${dv.translateY}px)` }}>
        DIGITAL VERSION
        <div style={{ height: 2, width: 220, background: COLORS.cyan, margin: "10px auto 0" }} />
      </div>
      <div style={{ position: "absolute", left: 560, top: 1310, width: 340, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 27, lineHeight: 1.4, color: COLORS.softWhite, opacity: dvs.opacity, transform: `translateY(${dvs.translateY}px)` }}>
        No clear result. No obvious hours.<br />No confirmed location.<br />No easy next step.
      </div>
    </>
  );
};
