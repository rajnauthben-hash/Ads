// Scene 5 — Repaired Connection and Final Brand (frames 552-719)
import React from "react";
import { COLORS } from "../tokens";
import { reveal, clampInterp } from "../framePlan";
import { HeadlineBlock, SupportingCopy } from "../components/text";
import { PersonIcon, PinIcon, ListIcon, PhoneIcon, ShieldIcon, RefreshIcon, CheckCircleIcon } from "../components/icons";

const CHECK_X = 80;
const CHECK_Y = 535;
const ROW_H = 68;
const ROW_GAP = 10;

const ROWS: { Icon: React.FC<{ size?: number; color?: string }>; lines: string[]; settle: number }[] = [
  { Icon: (p) => <PersonIcon {...p} />, lines: ["Clear business profile"], settle: 592 },
  { Icon: (p) => <PinIcon {...p} />, lines: ["Accurate hours and location"], settle: 600 },
  { Icon: (p) => <ListIcon {...p} />, lines: ["Understandable services"], settle: 608 },
  { Icon: (p) => <PhoneIcon {...p} />, lines: ["Direct call and", "direction actions"], settle: 616 },
  { Icon: (p) => <ShieldIcon {...p} star />, lines: ["Professional website", "and trust signals"], settle: 624 },
  { Icon: (p) => <RefreshIcon {...p} />, lines: ["Information kept current"], settle: 632 },
];

const ChecklistRow: React.FC<{ frame: number; idx: number; row: (typeof ROWS)[number] }> = ({ frame, idx, row }) => {
  const y = CHECK_Y + idx * (ROW_H + ROW_GAP);
  const start = row.settle - 12;
  const barW = clampInterp(frame, [start, start + 6], [0, 1]);
  const iconA = clampInterp(frame, [start + 3, start + 9], [0, 1]);
  const textA = clampInterp(frame, [start + 5, start + 11], [0, 1]);
  const checkP = clampInterp(frame, [row.settle - 4, row.settle + 4], [0, 1]);
  const twoLine = row.lines.length > 1;
  return (
    <div style={{ position: "absolute", left: CHECK_X, top: y, width: 430, height: ROW_H }}>
      {/* underline / bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, width: `${barW * 100}%`, height: 1, background: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 52, height: 52, borderRadius: "50%", border: `1.5px solid rgba(34,211,238,0.45)`, display: "flex", alignItems: "center", justifyContent: "center", opacity: iconA }}>
        <row.Icon size={26} color={COLORS.cyan} />
      </div>
      <div style={{ position: "absolute", left: 78, top: "50%", transform: "translateY(-50%)", width: 300, fontFamily: "Inter, sans-serif", fontSize: twoLine ? 25 : 27, lineHeight: 1.12, color: COLORS.softWhite, opacity: textA }}>
        {row.lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: 30, height: 30, opacity: clampInterp(frame, [row.settle - 6, row.settle - 2], [0, 1]) }}>
        <CheckCircleIcon size={30} progress={checkP} />
      </div>
    </div>
  );
};

export const Scene5Copy: React.FC<{ frame: number }> = ({ frame }) => {
  const h = reveal(frame, 558, null);
  const sup = reveal(frame, 570, null);
  const payoff = reveal(frame, 615, null);
  const cta = reveal(frame, 621, null);

  // brand lockup masked reveals
  const wordMask = clampInterp(frame, [630, 656], [0, 100]);
  const tagOpacity = clampInterp(frame, [636, 662], [0, 1]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 200,
          width: 520,
          fontFamily: "Inter, sans-serif",
          fontWeight: 620,
          fontSize: 40,
          lineHeight: 1.1,
          letterSpacing: -0.5,
          opacity: h.opacity,
          transform: `translateY(${h.translateY}px)`,
          filter: h.blur > 0.05 ? `blur(${h.blur}px)` : undefined,
        }}
      >
        <div style={{ color: COLORS.editorialWhite, whiteSpace: "nowrap" }}>OmniFlow Digital closes</div>
        <div style={{ whiteSpace: "nowrap" }}>
          <span style={{ color: COLORS.editorialWhite }}>the gap between </span>
          <span style={{ color: COLORS.cyan }}>being open</span>
        </div>
        <div style={{ color: COLORS.cyan, whiteSpace: "nowrap" }}>and being found.</div>
      </div>

      <SupportingCopy
        lines={[
          "We organise and improve the information",
          "customers rely on so they can find your",
          "business, understand what you offer and",
          "take the next step with confidence.",
        ]}
        x={80}
        y={378}
        width={500}
        fontSize={26}
        lineHeight={1.42}
        anim={sup}
      />

      {ROWS.map((r, i) => (
        <ChecklistRow key={i} frame={frame} idx={i} row={r} />
      ))}

      {/* payoff */}
      <HeadlineBlock
        lines={[{ text: "Fill both", color: COLORS.cyan }, { text: "rooms at once.", color: COLORS.cyan }]}
        x={80}
        y={1035}
        width={330}
        fontSize={57}
        lineHeight={0.98}
        weight={620}
        anim={payoff}
      />

      {/* CTA */}
      <div style={{ position: "absolute", left: 80, top: 1195, width: 400, fontFamily: "Inter, sans-serif", fontSize: 29, lineHeight: 1.32, opacity: cta.opacity, transform: `translateY(${cta.translateY}px)` }}>
        <div style={{ color: COLORS.softWhite }}>See what customers see.</div>
        <div style={{ color: COLORS.cyan }}>Start with an OmniFlow</div>
        <div style={{ color: COLORS.cyan }}>visibility audit.</div>
      </div>

      {/* FINAL BRAND LOCKUP (text-only — no logo asset supplied) */}
      <div style={{ position: "absolute", left: 80, top: 1335, width: 700, height: 130 }}>
        <div style={{ overflow: "hidden", width: `${wordMask}%` }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 66, whiteSpace: "nowrap", lineHeight: 1 }}>
            <span style={{ color: COLORS.editorialWhite }}>OmniFlow </span>
            <span style={{ color: COLORS.cyan }}>Digital</span>
          </div>
        </div>
        <div style={{ marginTop: 16, fontFamily: "Inter, sans-serif", fontSize: 26, color: COLORS.cyan, opacity: tagOpacity, letterSpacing: 0.3 }}>
          Get Found. Look Professional. Grow Online.
        </div>
      </div>
    </>
  );
};
