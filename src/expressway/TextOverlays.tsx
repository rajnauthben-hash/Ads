import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { C, SAFE } from "./constants";

const FONT = "Inter, sans-serif";

// Merged blur/translate/fade entrance + slice exit for one line of copy.
function lineStyle(local: number, delay: number, exitStart: number | null, dist = 16): React.CSSProperties {
  const ep = interpolate(local - delay, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const xp = exitStart === null ? 0 : interpolate(local - exitStart, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const ty = (1 - ep) * dist + xp * -22;
  const b = (1 - ep) * 7 + xp * 5;
  return {
    opacity: ep * (1 - xp),
    transform: `translate(${(xp * 40).toFixed(1)}px, ${ty.toFixed(1)}px)`,
    filter: b > 0.05 ? `blur(${b.toFixed(2)}px)` : "none",
    clipPath: xp > 0.001 ? `inset(0 0 ${(xp * 100).toFixed(1)}% 0)` : "none",
  };
}

// A line can carry inline gold emphasis via {t, gold?} segments.
type Seg = { t: string; gold?: boolean };
type Line = string | Seg[];

const renderLine = (ln: Line) =>
  typeof ln === "string"
    ? ln
    : ln.map((s, i) => (
        <span key={i} style={{ color: s.gold ? C.gold : "inherit" }}>
          {s.t}
        </span>
      ));

const Block: React.FC<{
  lines: Line[];
  top: number;
  size: number;
  weight: number;
  color: string;
  lh: number;
  ls?: string;
  local: number;
  baseDelay: number;
  stagger: number;
  exitStart: number | null;
  width?: number;
}> = ({ lines, top, size, weight, color, lh, ls, local, baseDelay, stagger, exitStart, width = 620 }) => (
  <div style={{ position: "absolute", left: SAFE.left, top, width }}>
    {lines.map((ln, i) => (
      <div
        key={i}
        style={{
          fontFamily: FONT,
          fontSize: size,
          fontWeight: weight,
          color,
          lineHeight: lh,
          letterSpacing: ls ?? "-0.02em",
          ...lineStyle(local, baseDelay + i * stagger, exitStart),
        }}
      >
        {renderLine(ln)}
      </div>
    ))}
  </div>
);

const GoldRule: React.FC<{ top: number; local: number; delay: number; exitStart: number | null }> = ({ top, local, delay, exitStart }) => {
  const w = interpolate(local - delay, [0, 22], [0, 52], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const xp = exitStart === null ? 0 : interpolate(local - exitStart, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", left: SAFE.left, top, width: w, height: 3, background: C.gold, opacity: 1 - xp, borderRadius: 2 }} />;
};

// -------------------------------------------------------------------------
// Brand lockup — persistent.
const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [2, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const w = interpolate(frame, [10, 34], [0, 44], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: SAFE.left, top: SAFE.top, opacity: o }}>
      <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, color: C.headline, letterSpacing: "0.3em" }}>OMNIFLOW DIGITAL</div>
      <div style={{ marginTop: 12, width: w, height: 3, background: C.gold, borderRadius: 2 }} />
    </div>
  );
};

// Bottom statement (scenes 1,2,3) — gray, lower-left, above safe bottom.
const BottomStatement: React.FC<{ lines: Line[]; local: number; exitStart: number | null }> = ({ lines, local, exitStart }) => (
  <div style={{ position: "absolute", left: SAFE.left, top: 1592 }}>
    {lines.map((ln, i) => (
      <div key={i} style={{ fontFamily: FONT, fontSize: 26, fontWeight: 500, color: C.support, lineHeight: 1.32, ...lineStyle(local, 40 + i * 5, exitStart, 10) }}>
        {renderLine(ln)}
      </div>
    ))}
  </div>
);

// -------------------------------------------------------------------------
// Scene 2 — Search -> Maps -> Reviews -> Websites journey.
const JourneyIcons: React.FC<{ local: number; exitStart: number | null }> = ({ local, exitStart }) => {
  const items = ["Search", "Maps", "Reviews", "Websites"];
  const icon = (name: string, on: number) => {
    const col = C.gold;
    if (name === "Search")
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={on > 0.5 ? C.cyanBright : col} strokeWidth="2">
          <circle cx="10.5" cy="10.5" r="7" />
          <line x1="15.5" y1="15.5" x2="21" y2="21" />
        </svg>
      );
    if (name === "Maps")
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill={on > 0.5 ? C.cyanBright : col}>
          <path d="M12 2 C7.6 2 4 5.6 4 10 c0 5.2 8 12 8 12 s8-6.8 8-12 C20 5.6 16.4 2 12 2 z M12 13 a3 3 0 1 1 0-6 a3 3 0 0 1 0 6 z" />
        </svg>
      );
    if (name === "Reviews")
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill={on > 0.5 ? C.cyanBright : col}>
          <path d="M12 2 l2.9 6.3 l6.9 .7 l-5.2 4.6 l1.5 6.8 l-6.1-3.6 l-6.1 3.6 l1.5-6.8 l-5.2-4.6 l6.9-.7 z" />
        </svg>
      );
    return (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={on > 0.5 ? C.cyanBright : col} strokeWidth="2">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <circle cx="6" cy="6.5" r="0.6" fill={on > 0.5 ? C.cyanBright : col} />
      </svg>
    );
  };
  const xp = exitStart === null ? 0 : interpolate(local - exitStart, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Cyan pulse travels across the icons.
  const pulse = interpolate(local, [40, 92], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: SAFE.left, top: 720, display: "flex", alignItems: "center", opacity: 1 - xp }}>
      {items.map((it, i) => {
        const on = interpolate(pulse, [i - 0.5, i], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const appear = interpolate(local, [20 + i * 8, 40 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <React.Fragment key={it}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: appear, transform: `translateY(${(1 - appear) * 10}px)` }}>
              {icon(it, on)}
              <span style={{ fontFamily: FONT, fontSize: 20, fontWeight: 500, color: on > 0.5 ? C.headline : C.support }}>{it}</span>
            </div>
            {i < items.length - 1 && (
              <svg width="46" height="24" viewBox="0 0 46 24" style={{ margin: "0 4px 26px" }}>
                <line x1="4" y1="12" x2="34" y2="12" stroke={interpolate(pulse, [i, i + 0.5], [0, 1]) > 0.5 ? C.cyan : C.gold} strokeWidth="2" opacity={appear} />
                <path d="M34 6 l8 6 l-8 6 z" fill={interpolate(pulse, [i, i + 0.5], [0, 1]) > 0.5 ? C.cyan : C.gold} opacity={appear} />
              </svg>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// -------------------------------------------------------------------------
// Scene 4 — Google-Maps-style incomplete-information card, lower-right.
const InfoCard: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - 360;
  const y = interpolate(local, [55, 82], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(local, [55, 82, 116, 126], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const b = interpolate(local, [55, 82], [5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rows: [string, string][] = [
    ["Hours", "Not available"],
    ["Location", "Incomplete"],
    ["Phone", "Missing"],
    ["Website", "Not added"],
  ];
  return (
    <div
      style={{
        position: "absolute",
        right: 1080 - SAFE.right,
        top: 1300,
        width: 340,
        opacity: o,
        transform: `translateY(${y}px)`,
        filter: b > 0.05 ? `blur(${b}px)` : "none",
        background: "rgba(9,15,20,0.9)",
        border: `1px solid rgba(255,255,255,0.08)`,
        borderRadius: 14,
        padding: "18px 20px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.headline, marginBottom: 2 }}>Crown Hardware</div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "12px 0" }} />
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0" }}>
          <span style={{ fontFamily: FONT, fontSize: 18, color: C.support }}>{k}</span>
          <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 600, color: C.warn, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${C.warn}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>!</span>
            {v}
          </span>
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, color: C.warn, fontFamily: FONT, fontWeight: 700, fontSize: 15, letterSpacing: "0.04em" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill={C.warn}><path d="M12 2 L22 20 H2 Z" /><rect x="11" y="9" width="2" height="6" fill="#0b0b0b" /><rect x="11" y="16" width="2" height="2" fill="#0b0b0b" /></svg>
        INCOMPLETE INFORMATION
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
const HEAD = { color: C.headline, weight: 800, lh: 1.02, ls: "-0.035em" };
const SUPP = { color: C.support, weight: 500, lh: 1.16, ls: "-0.02em" };
const BODY = { color: C.body, weight: 400, lh: 1.4, ls: "-0.01em" };

const SceneText: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <>
      {/* SCENE 1 — 0..120 */}
      {frame < 130 && (
        <SceneAt start={0}>
          {(local, ex) => (
            <>
              <Block lines={["Has your", "business", [{ t: "felt " }, { t: "quieter", gold: true }], "lately?"]} top={196} size={92} {...HEAD} local={local} baseDelay={8} stagger={6} exitStart={ex} width={560} />
              <Block lines={["People may still need", "exactly what you sell."]} top={636} size={36} {...SUPP} local={local} baseDelay={26} stagger={5} exitStart={ex} width={480} />
              <Block lines={["The problem might", "not be demand.", "It might be where", "customers are", [{ t: "looking first.", gold: true }]]} top={782} size={30} {...BODY} local={local} baseDelay={40} stagger={4} exitStart={ex} width={430} />
              <BottomStatement lines={["There is still traffic.", [{ t: "It just may " }, { t: "not", gold: true }, { t: " be reaching you." }]]} local={local} exitStart={ex} />
            </>
          )}
        </SceneAt>
      )}

      {/* SCENE 2 — 120..240 */}
      {frame >= 112 && frame < 250 && (
        <SceneAt start={120}>
          {(local, ex) => (
            <>
              <Block lines={["A new", [{ t: "highway", gold: true }], "got built."]} top={200} size={96} {...HEAD} local={local} baseDelay={8} stagger={7} exitStart={ex} width={560} />
              <Block lines={["And it starts when", "someone searches for", "a business nearby."]} top={520} size={34} {...SUPP} local={local} baseDelay={24} stagger={5} exitStart={ex} width={460} />
              <JourneyIcons local={local} exitStart={ex} />
              <BottomStatement lines={["That's where many", "customers begin deciding", "where to go."]} local={local} exitStart={ex} />
            </>
          )}
        </SceneAt>
      )}

      {/* SCENE 3 — 240..360 */}
      {frame >= 232 && frame < 370 && (
        <SceneAt start={240}>
          {(local, ex) => (
            <>
              <Block lines={["If you're", "not on", "that road,", [{ t: "they pass", gold: true }], [{ t: "you.", gold: true }]]} top={196} size={80} {...HEAD} local={local} baseDelay={8} stagger={5} exitStart={ex} width={520} />
              <Block lines={["Often before they ever", "compare your business."]} top={742} size={32} {...SUPP} local={local} baseDelay={26} stagger={5} exitStart={ex} width={460} />
              <Block lines={["No click.", "No call.", "No direction request."]} top={870} size={30} {...BODY} local={local} baseDelay={40} stagger={6} exitStart={ex} width={440} />
              <Block lines={["They simply reach", "an easier-to-find", [{ t: "option first.", gold: true }]]} top={1044} size={30} {...BODY} local={local} baseDelay={58} stagger={4} exitStart={ex} width={430} />
              <BottomStatement lines={["Visibility happens", [{ t: "before comparison.", gold: true }]]} local={local} exitStart={ex} />
            </>
          )}
        </SceneAt>
      )}

      {/* SCENE 4 — 360..480 */}
      {frame >= 352 && frame < 490 && (
        <SceneAt start={360}>
          {(local, ex) => (
            <>
              <Block lines={["The traffic", "didn't", [{ t: "disappear.", gold: true }], "It relocated."]} top={184} size={70} {...HEAD} local={local} baseDelay={8} stagger={6} exitStart={ex} width={520} />
              <Block lines={["Your customers can", "still be out there."]} top={520} size={31} {...SUPP} local={local} baseDelay={24} stagger={5} exitStart={ex} width={430} />
              <Block lines={["But if the route they", "now use doesn't", "lead to you, another", "business gets the", [{ t: "attention first.", gold: true }]]} top={618} size={28} {...BODY} local={local} baseDelay={34} stagger={4} exitStart={ex} width={396} />
            </>
          )}
        </SceneAt>
      )}

      {/* SCENE 5 — 480..600 (holds) */}
      {frame >= 472 && (
        <SceneAt start={480} hold>
          {(local, ex) => (
            <>
              <Block lines={["Get on", [{ t: "the road", gold: true }], [{ t: "that's", gold: true }], [{ t: "moving.", gold: true }]]} top={196} size={88} {...HEAD} local={local} baseDelay={8} stagger={6} exitStart={ex} width={520} />
              <Block lines={["You don't need more", "traffic to exist.", [{ t: "You need the existing" }], [{ t: "traffic to " }, { t: "find you.", gold: true }]]} top={636} size={30} {...SUPP} local={local} baseDelay={24} stagger={4} exitStart={ex} width={470} />
              <Block lines={["OmniFlow Digital helps", "your business show up", "where local customers", "are already searching,", "comparing and deciding."]} top={886} size={27} {...BODY} local={local} baseDelay={40} stagger={4} exitStart={ex} width={392} />
            </>
          )}
        </SceneAt>
      )}
    </>
  );
};

// Wrapper computing local frame + exit trigger for a scene.
const SceneAt: React.FC<{ start: number; hold?: boolean; children: (local: number, exitStart: number | null) => React.ReactNode }> = ({ start, hold, children }) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const ex = hold ? null : 100;
  return <>{children(local, ex)}</>;
};

export const TextOverlays: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Brand />
      <SceneText />
      {frame >= 352 && frame < 496 && <InfoCard />}
      {/* Tagline (Scene 5) */}
      {frame >= 560 && <Tagline />}
    </>
  );
};

const Tagline: React.FC = () => {
  const frame = useCurrentFrame();
  const local = frame - 560;
  const st = lineStyle(local, 4, null, 10);
  return (
    <div style={{ position: "absolute", left: SAFE.left, top: 1600, display: "flex", alignItems: "center", gap: 10, ...st }}>
      <span style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, color: C.gold }}>Get Found.</span>
      <span style={{ fontFamily: FONT, fontSize: 30, fontWeight: 500, color: C.headline }}>Look Professional.</span>
      <span style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, color: C.gold }}>Grow Online.</span>
    </div>
  );
};

// Re-export gold rule for potential reuse.
export { GoldRule };
