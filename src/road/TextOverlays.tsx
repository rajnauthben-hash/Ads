import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { C, SAFE } from "./constants";

const FONT = "Inter, sans-serif";

// Merged enter (blur/translate/fade up) + exit (slice/pull toward route) style
// for a single line of copy, driven by the scene-local frame.
function lineStyle(
  local: number,
  delay: number,
  exitStart: number | null,
  { dist = 18, blur = 8, exitDur = 20 }: { dist?: number; blur?: number; exitDur?: number } = {},
): React.CSSProperties {
  const ep = interpolate(local - delay, [0, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const xp =
    exitStart === null
      ? 0
      : interpolate(local - exitStart, [0, exitDur], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.65, 0, 0.35, 1),
        });

  const ty = (1 - ep) * dist + xp * -24;
  const tx = xp * 44;
  const b = (1 - ep) * blur + xp * 6;
  return {
    opacity: ep * (1 - xp),
    transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`,
    filter: b > 0.05 ? `blur(${b.toFixed(2)}px)` : "none",
    clipPath: xp > 0.001 ? `inset(0 0 ${(xp * 100).toFixed(1)}% 0)` : "none",
    willChange: "transform, opacity, filter",
  };
}

interface Block {
  lines: string[];
  top: number;
  size: number;
  weight: number;
  color: string;
  lh: number;
  ls?: string;
  baseDelay: number;
  stagger: number;
}

const LineBlock: React.FC<{ block: Block; local: number; exitStart: number | null }> = ({
  block,
  local,
  exitStart,
}) => (
  <div style={{ position: "absolute", left: SAFE.left, top: block.top, width: 760 }}>
    {block.lines.map((ln, i) => (
      <div
        key={i}
        style={{
          fontFamily: FONT,
          fontSize: block.size,
          fontWeight: block.weight,
          color: block.color,
          lineHeight: block.lh,
          letterSpacing: block.ls ?? "-0.02em",
          ...lineStyle(local, block.baseDelay + i * block.stagger, exitStart),
        }}
      >
        {ln}
      </div>
    ))}
  </div>
);

const GoldDivider: React.FC<{ top: number; local: number; delay: number; exitStart: number | null }> = ({
  top,
  local,
  delay,
  exitStart,
}) => {
  const w = interpolate(local - delay, [0, 24], [0, 56], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const xp =
    exitStart === null
      ? 0
      : interpolate(local - exitStart, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top,
        width: w,
        height: 3,
        background: C.gold,
        opacity: 1 - xp,
        borderRadius: 2,
      }}
    />
  );
};

const Takeaway: React.FC<{ text: string; local: number; exitStart: number | null }> = ({
  text,
  local,
  exitStart,
}) => {
  const st = lineStyle(local, 40, exitStart, { dist: 12 });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: 1598,
        display: "flex",
        alignItems: "center",
        gap: 16,
        ...st,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: `2px solid ${C.gold}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.gold,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        !
      </div>
      <span style={{ fontFamily: FONT, fontSize: 30, fontWeight: 600, color: C.headline, letterSpacing: "-0.01em" }}>
        {text}
      </span>
    </div>
  );
};

interface SceneText {
  start: number;
  headline: Omit<Block, "top" | "baseDelay" | "stagger"> & { top: number };
  support: Omit<Block, "baseDelay" | "stagger">;
  dividerTop: number;
  body: Omit<Block, "baseDelay" | "stagger">;
  takeaway: string;
  hold: boolean; // scene 5 holds (no exit)
}

const HEAD = { color: C.headline, weight: 800, lh: 1.06, ls: "-0.035em" };
const SUPP = { color: C.support, weight: 500, lh: 1.14, ls: "-0.02em" };
const BODY = { color: C.body, weight: 400, lh: 1.42, ls: "-0.01em" };

const SCENES: SceneText[] = [
  {
    start: 0,
    headline: { lines: ["You built", "something good."], top: 250, size: 92, ...HEAD },
    support: { lines: ["So why does it suddenly", "feel quieter?"], top: 470, size: 42, ...SUPP },
    dividerTop: 592,
    body: {
      lines: ["Your business may not be", "the problem. The route people", "use to discover businesses", "has changed."],
      top: 620,
      size: 30,
      ...BODY,
    },
    takeaway: "This may be happening to your business right now.",
    hold: false,
  },
  {
    start: 120,
    headline: { lines: ["The", "customers", "didn't", "disappear."], top: 226, size: 96, ...HEAD },
    support: { lines: ["They still need", "what you sell."], top: 664, size: 42, ...SUPP },
    dividerTop: 786,
    body: { lines: ["They just search,", "compare and choose", "on a different road now."], top: 814, size: 30, ...BODY },
    takeaway: "Discovery moved online first.",
    hold: false,
  },
  {
    start: 240,
    headline: { lines: ["If you're not", "built into that road..."], top: 250, size: 76, ...HEAD },
    support: { lines: ["you get passed over before", "anyone compares you."], top: 448, size: 40, ...SUPP },
    dividerTop: 566,
    body: {
      lines: ["No click. No call. No direction", "request. The customer never", "reaches the part where your", "business gets judged."],
      top: 594,
      size: 30,
      ...BODY,
    },
    takeaway: "Visibility happens before comparison.",
    hold: false,
  },
  {
    start: 360,
    headline: { lines: ["That's why", "a good business", "can feel quiet."], top: 240, size: 80, ...HEAD },
    support: { lines: ["Nothing is wrong", "with the business."], top: 512, size: 42, ...SUPP },
    dividerTop: 634,
    body: {
      lines: ["The road moved. And the", "easier business to find gets", "the calls, the visits and", "the trust."],
      top: 662,
      size: 30,
      ...BODY,
    },
    takeaway: "Being hard to find is expensive.",
    hold: false,
  },
  {
    start: 480,
    headline: { lines: ["You don't", "need to move."], top: 250, size: 92, ...HEAD },
    support: { lines: ["You need an on-ramp."], top: 470, size: 44, ...SUPP },
    dividerTop: 556,
    body: {
      lines: ["OmniFlow Digital helps your", "business show up where local", "customers are already searching,", "comparing and deciding."],
      top: 584,
      size: 30,
      ...BODY,
    },
    takeaway: "Get found. Look professional. Grow online.",
    hold: true,
  },
];

// Persistent brand lockup — present in every reference, so mounted throughout.
const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [2, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const w = interpolate(frame, [10, 34], [0, 44], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: SAFE.left, top: SAFE.top, opacity: o }}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 600,
          color: C.headline,
          letterSpacing: "0.32em",
        }}
      >
        OMNIFLOW DIGITAL
      </div>
      <div style={{ marginTop: 14, width: w, height: 3, background: C.gold, borderRadius: 2 }} />
    </div>
  );
};

const SceneTextBlock: React.FC<{ s: SceneText }> = ({ s }) => {
  const frame = useCurrentFrame();
  const local = frame - s.start;
  if (local < -4 || local > 128) return null;
  const exitStart = s.hold ? null : 100;
  return (
    <>
      <LineBlock block={{ ...s.headline, baseDelay: 8, stagger: 6 }} local={local} exitStart={exitStart} />
      <LineBlock block={{ ...s.support, baseDelay: 22, stagger: 5 }} local={local} exitStart={exitStart} />
      <GoldDivider top={s.dividerTop} local={local} delay={30} exitStart={exitStart} />
      <LineBlock block={{ ...s.body, baseDelay: 34, stagger: 4 }} local={local} exitStart={exitStart} />
      <Takeaway text={s.takeaway} local={local} exitStart={exitStart} />
    </>
  );
};

export const TextOverlays: React.FC = () => {
  return (
    <>
      <Brand />
      {SCENES.map((s) => (
        <SceneTextBlock key={s.start} s={s} />
      ))}
    </>
  );
};
