// Scene 3 — Customer Decision Mechanism (frames 264-419)
import React from "react";
import { COLORS } from "../tokens";
import { reveal, clampInterp } from "../framePlan";
import { HeadlineBlock, SupportingCopy, TakeawayStrip } from "../components/text";
import { MagnifierIcon, BookIcon, ShieldIcon, SendIcon, PersonIcon } from "../components/icons";

const NODE_Y = 1000;
const NODES = [
  { x: 145, key: "search", title: "Search", caption: ["They start", "looking."], Icon: MagnifierIcon, lit: 286 },
  { x: 350, key: "understand", title: "Understand", caption: ["They look for", "clear answers."], Icon: BookIcon, lit: 300 },
  { x: 555, key: "trust", title: "Trust", caption: ["They look for", "confidence."], Icon: ShieldIcon, lit: 316 },
  { x: 760, key: "act", title: "Act", caption: ["They take", "action."], Icon: SendIcon, lit: 332 },
] as const;

const DecisionNode: React.FC<{ frame: number; node: (typeof NODES)[number] }> = ({ frame, node }) => {
  const isAct = node.key === "act";
  const litP = clampInterp(frame, [node.lit, node.lit + 12], [0, 1]);
  const appear = clampInterp(frame, [node.lit - 4, node.lit + 6], [0, 1]);
  const dim = isAct ? 0.38 : 1;
  const color = isAct ? COLORS.disabledGrey : COLORS.cyan;
  const glow = isAct ? 0 : 10 * litP;
  const d = 100;
  return (
    <div style={{ position: "absolute", left: node.x - d / 2, top: NODE_Y - d / 2, width: d, height: d, opacity: appear }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `2px ${isAct ? "dashed" : "solid"} ${color}`,
          background: COLORS.canvasBlack,
          boxShadow: glow > 0 ? `0 0 ${glow}px ${COLORS.cyanGlow}` : undefined,
          opacity: dim,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isAct ? <SendIcon size={40} color={COLORS.disabledGrey} /> : <node.Icon size={42} color={COLORS.cyan} />}
      </div>
      {/* title */}
      <div style={{ position: "absolute", top: d + 14, left: -40, width: d + 80, textAlign: "center", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 30, color: isAct ? COLORS.disabledGrey : COLORS.cyan }}>
        {node.title}
      </div>
      {/* caption */}
      <div style={{ position: "absolute", top: d + 54, left: -50, width: d + 100, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 22, lineHeight: 1.25, color: isAct ? COLORS.disabledGrey : COLORS.softWhite }}>
        {node.caption.map((c, i) => (
          <div key={i}>{c}</div>
        ))}
      </div>
    </div>
  );
};

export const Scene3Copy: React.FC<{ frame: number }> = ({ frame }) => {
  const out = 396;
  const h1 = reveal(frame, 270, out);
  const cyanLine = reveal(frame, 275, out);
  const sup1 = reveal(frame, 304, out);
  const sup2 = reveal(frame, 315, out);
  const take = reveal(frame, 344, out);

  // track line drawing: solid S->U->T (296-326), dashed weak toward Act (328-340)
  const solidDraw = clampInterp(frame, [286, 326], [0, 1]);
  const dashOpacity = clampInterp(frame, [328, 340], [0, 0.38]);

  return (
    <>
      <HeadlineBlock
        lines={[{ text: "Customers are not always" }, { text: "driving around looking" }]}
        x={80}
        y={195}
        width={720}
        fontSize={66}
        lineHeight={0.98}
        weight={620}
        anim={h1}
      />
      <HeadlineBlock
        lines={[{ text: "for your sign.", color: COLORS.cyan }]}
        x={80}
        y={324}
        width={720}
        fontSize={66}
        lineHeight={0.98}
        weight={620}
        anim={cyanLine}
      />

      {/* DECISION TRACK */}
      <svg width={1080} height={20} viewBox="0 0 1080 20" style={{ position: "absolute", left: 0, top: NODE_Y - 10, overflow: "visible" }}>
        {/* base line */}
        <line x1="95" y1="10" x2="805" y2="10" stroke="rgba(34,211,238,0.12)" strokeWidth={2.5} />
        {/* solid energized S->T */}
        <line x1="145" y1="10" x2="555" y2="10" stroke={COLORS.cyan} strokeWidth={2.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - solidDraw} style={{ filter: "blur(2px)" }} opacity={0.9} />
        <line x1="145" y1="10" x2="555" y2="10" stroke={COLORS.cyanBright} strokeWidth={2.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - solidDraw} />
        {/* dashed weak T->Act */}
        <line x1="555" y1="10" x2="760" y2="10" stroke={COLORS.cyan} strokeWidth={2} strokeDasharray="8 8" opacity={dashOpacity} />
      </svg>

      {NODES.map((n) => (
        <DecisionNode key={n.key} frame={frame} node={n} />
      ))}

      <SupportingCopy
        lines={[
          "They search from where they are. They look for a clear service,",
          "current hours, a trusted location and one simple action: call,",
          "message or get directions.",
        ]}
        x={110}
        y={1185}
        width={700}
        fontSize={26}
        lineHeight={1.34}
        anim={sup1}
      />
      <SupportingCopy
        lines={["When the screen gives them no certainty, the search", "continues without you."]}
        x={110}
        y={1300}
        width={700}
        fontSize={26}
        lineHeight={1.34}
        anim={sup2}
      />

      <TakeawayStrip
        x={105}
        y={1360}
        width={700}
        icon={<PersonIcon size={44} />}
        lines={["If customers cannot understand you quickly,", "they rarely reach the next step."]}
        anim={take}
        fontSize={28}
      />
    </>
  );
};
