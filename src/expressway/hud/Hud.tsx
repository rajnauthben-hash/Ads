import React from "react";
import { useCurrentFrame } from "remotion";
import { T, FONT, SAFE } from "../theme";
import { reveal, win, envelope } from "../anim";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// A phrase line with staggered blur/rise reveal.
const Line: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const r = reveal(frame, delay);
  return <div style={{ ...r, ...style }}>{children}</div>;
};

// Wraps a scene's text with an overall in/out envelope + gentle exit drift.
const SceneText: React.FC<{
  a: number;
  b: number;
  c: number;
  d: number;
  children: React.ReactNode;
}> = ({ a, b, c, d, children }) => {
  const frame = useCurrentFrame();
  const op = envelope(frame, a, b, c, d);
  const exit = win(frame, c, d, 0, -26);
  const blur = win(frame, c, d, 0, 5);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: op,
        transform: `translateX(${exit}px)`,
        filter: blur ? `blur(${blur}px)` : undefined,
        pointerEvents: "none",
      }}
    >
      {children}
    </div>
  );
};

const HEAD: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 800,
  fontSize: 92,
  lineHeight: 0.98,
  letterSpacing: -1.5,
  color: T.headline,
};
const SUP: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 600,
  fontSize: 35,
  lineHeight: 1.22,
  color: T.support,
};
const BODY: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 500,
  fontSize: 31,
  lineHeight: 1.28,
  color: T.support,
};
const g = { color: T.gold };
const w = { color: T.headline };

const LEFT = SAFE.left;

// Persistent brand mark.
const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const op = clamp01(win(frame, 4, 24, 0, 1));
  return (
    <div style={{ position: "absolute", left: LEFT, top: 64, opacity: op }}>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: T.headline }}>
        OMNIFLOW <span style={{ color: T.support, fontWeight: 500 }}>DIGITAL</span>
      </div>
      <div style={{ width: 64, height: 3, background: T.gold, marginTop: 12, borderRadius: 2 }} />
    </div>
  );
};

// --- Scene 2 journey: Search -> Maps -> Reviews -> Websites ------------------
const IconSearch = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <circle cx="18" cy="18" r="12" stroke={T.cyan} strokeWidth="3" />
    <line x1="27" y1="27" x2="37" y2="37" stroke={T.cyan} strokeWidth="3" strokeLinecap="round" />
  </svg>
);
const IconPin = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <path d="M21 4 C13 4 8 10 8 17 C8 27 21 38 21 38 C21 38 34 27 34 17 C34 10 29 4 21 4 Z" stroke={T.gold} strokeWidth="3" />
    <circle cx="21" cy="17" r="4.5" fill={T.gold} />
  </svg>
);
const IconStar = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill={T.gold}>
    <path d="M21 4 L26 16 L39 17 L29 26 L32 39 L21 32 L10 39 L13 26 L3 17 L16 16 Z" />
  </svg>
);
const IconBrowser = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" stroke={T.gold} strokeWidth="3">
    <rect x="4" y="7" width="34" height="28" rx="3" />
    <line x1="4" y1="16" x2="38" y2="16" />
    <circle cx="9" cy="11.5" r="1.4" fill={T.gold} />
    <circle cx="14" cy="11.5" r="1.4" fill={T.gold} />
  </svg>
);

const Journey: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    { Icon: IconSearch, label: "Search" },
    { Icon: IconPin, label: "Maps" },
    { Icon: IconStar, label: "Reviews" },
    { Icon: IconBrowser, label: "Websites" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {steps.map((s, i) => {
        const d = 145 + i * 12;
        const r = reveal(frame, d, 16);
        // travelling cyan pulse highlight
        const pulse = (frame - 150) / 12;
        const hot = clamp01(1 - Math.abs(pulse - i) * 1.4);
        return (
          <React.Fragment key={i}>
            <div style={{ ...r, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 108 }}>
              <div style={{ filter: hot ? `drop-shadow(0 0 ${8 + hot * 10}px ${T.cyan})` : "none" }}>
                <s.Icon />
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, color: T.headline }}>{s.label}</div>
            </div>
            {i < steps.length - 1 ? (
              <svg width="34" height="20" style={{ opacity: reveal(frame, d + 6, 14).opacity }}>
                <path d="M2 10 L26 10 M20 4 L28 10 L20 16" stroke={T.gold} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// --- Scene 4 incomplete-information card (matches reference 04) ---------------
const RowIcon: React.FC<{ kind: "hours" | "location" | "phone" }> = ({ kind }) => {
  const c = T.cyan;
  if (kind === "hours")
    return (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke={c} strokeWidth="2">
        <circle cx="13" cy="13" r="9" />
        <path d="M13 8 V13 L16 15" strokeLinecap="round" />
      </svg>
    );
  if (kind === "location")
    return (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke={c} strokeWidth="2">
        <path d="M13 3 C8 3 5 6.5 5 11 C5 17 13 23 13 23 C13 23 21 17 21 11 C21 6.5 18 3 13 3 Z" />
        <circle cx="13" cy="11" r="3" />
      </svg>
    );
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke={c} strokeWidth="2">
      <path d="M6 5 C6 4 7 3 8 3 L10 3 L12 8 L9.5 10 C10.5 13 13 15.5 16 16.5 L18 14 L23 16 L23 18 C23 19 22 20 21 20 C12 20 6 14 6 5 Z" strokeLinejoin="round" />
    </svg>
  );
};

const InfoRow: React.FC<{ kind: "hours" | "location" | "phone"; label: string; value: string; delay: number }> = ({
  kind,
  label,
  value,
  delay,
}) => {
  const frame = useCurrentFrame();
  const r = reveal(frame, delay, 14);
  return (
    <div style={{ ...r, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 500, fontSize: 23, color: "#D6DDE2" }}>
        <RowIcon kind={kind} />
        {label}
      </span>
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, color: T.warning, display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ width: 18, height: 18, borderRadius: 18, border: `2px solid ${T.warning}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>!</span>
        {value}
      </span>
    </div>
  );
};

const InfoCard: React.FC = () => {
  const frame = useCurrentFrame();
  const op = envelope(frame, 410, 438, 470, 486);
  const rise = win(frame, 410, 442, 20, 0);
  return (
    <div
      style={{
        position: "absolute",
        right: 66,
        top: 1350,
        width: 400,
        opacity: op,
        transform: `translateY(${rise}px)`,
        background: "rgba(8,13,18,0.95)",
        border: "1.5px solid rgba(230,120,90,0.5)",
        borderRadius: 16,
        padding: "20px 24px",
        boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <svg width="26" height="24" viewBox="0 0 26 24" fill={T.warning}>
          <path d="M13 1 L25 22 L1 22 Z" />
          <rect x="11.6" y="8" width="2.8" height="7" fill="#0A0D12" />
          <rect x="11.6" y="17" width="2.8" height="2.6" fill="#0A0D12" />
        </svg>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, letterSpacing: 0.5, color: T.warning }}>
          INCOMPLETE INFORMATION
        </span>
      </div>
      <InfoRow kind="hours" label="Hours" value="Missing" delay={426} />
      <InfoRow kind="location" label="Location" value="Incomplete" delay={434} />
      <InfoRow kind="phone" label="Phone" value="Missing" delay={442} />
      <div style={{ ...reveal(frame, 440, 14), fontFamily: FONT, fontWeight: 400, fontSize: 19, color: T.support, marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        Customers can't reach what they can't find.
      </div>
    </div>
  );
};

// Numbered step badge (1 cyan, 2 gold, 3 gray) with heading + sub-copy.
const StepCallout: React.FC<{
  n: number;
  color: string;
  title: string;
  lines?: string[];
  delay: number;
  style?: React.CSSProperties;
}> = ({ n, color, title, lines = [], delay, style }) => {
  const frame = useCurrentFrame();
  const r = reveal(frame, delay);
  return (
    <div style={{ position: "absolute", ...style, ...r }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 34,
            border: `2px solid ${color}`,
            color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 19,
            flex: "0 0 auto",
          }}
        >
          {n}
        </span>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: 0.5, color: T.headline }}>{title}</span>
      </div>
      {lines.length ? (
        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 24, lineHeight: 1.25, color: T.support, marginTop: 8, marginLeft: 46 }}>
          {lines.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

// Search box "hardware store near me".
const SearchBox: React.FC<{ delay: number; style?: React.CSSProperties }> = ({ delay, style }) => {
  const frame = useCurrentFrame();
  const r = reveal(frame, delay);
  return (
    <div
      style={{
        position: "absolute",
        ...style,
        ...r,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 20px",
        width: 300,
        background: "rgba(10,16,22,0.92)",
        border: "1.5px solid rgba(120,140,155,0.35)",
        borderRadius: 14,
        boxShadow: "0 14px 34px rgba(0,0,0,0.45)",
      }}
    >
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke={T.cyan} strokeWidth="2.4">
        <circle cx="11" cy="11" r="7" />
        <line x1="16" y1="16" x2="23" y2="23" strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 23, color: "#DCE3E8", lineHeight: 1.15 }}>hardware store near me</span>
    </div>
  );
};

export const Hud: React.FC = () => {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <Brand />

      {/* SCENE 1 */}
      <SceneText a={6} b={40} c={108} d={120}>
        <div style={{ position: "absolute", left: LEFT, top: 200, maxWidth: 640 }}>
          <Line delay={12}><div style={HEAD}>Has your</div></Line>
          <Line delay={20}><div style={HEAD}>business</div></Line>
          <Line delay={28}><div style={HEAD}>felt <span style={g}>quieter</span></div></Line>
          <Line delay={36}><div style={HEAD}>lately?</div></Line>
          <Line delay={52}><div style={{ ...SUP, marginTop: 34 }}>People may still need<br />exactly what you sell.</div></Line>
          <Line delay={66}><div style={{ ...BODY, marginTop: 30 }}>The problem might<br />not be demand.<br />It might be where<br />customers are<br /><span style={g}>looking first.</span></div></Line>
        </div>
        <div style={{ position: "absolute", left: LEFT, top: 1600 }}>
          <Line delay={78}><div style={{ ...BODY, color: T.support }}>There is still traffic.<br />It just may <span style={g}>not</span> be reaching you.</div></Line>
        </div>
      </SceneText>

      {/* SCENE 2 */}
      <SceneText a={126} b={158} c={228} d={240}>
        <div style={{ position: "absolute", left: LEFT, top: 190, maxWidth: 720 }}>
          <Line delay={130}><div style={HEAD}>A <span style={w}>new</span></div></Line>
          <Line delay={138}><div style={{ ...HEAD, ...g }}>highway</div></Line>
          <Line delay={146}><div style={HEAD}>got built.</div></Line>
          <Line delay={158}><div style={{ ...SUP, marginTop: 30 }}>And it starts when<br />someone searches for<br />a business nearby.</div></Line>
          <div style={{ marginTop: 40 }}><Journey /></div>
          <Line delay={196}><div style={{ ...BODY, marginTop: 40 }}>That's where many<br />customers begin deciding<br />where to go.</div></Line>
        </div>
      </SceneText>

      {/* SCENE 3 */}
      <SceneText a={246} b={284} c={348} d={360}>
        <div style={{ position: "absolute", left: LEFT, top: 180, maxWidth: 620 }}>
          <Line delay={250}><div style={HEAD}>If you're</div></Line>
          <Line delay={258}><div style={HEAD}>not on</div></Line>
          <Line delay={266}><div style={HEAD}>that road,</div></Line>
          <Line delay={274}><div style={{ ...HEAD, ...g }}>they pass</div></Line>
          <Line delay={282}><div style={{ ...HEAD, ...g }}>you.</div></Line>
          <Line delay={296}><div style={{ ...SUP, marginTop: 30 }}>Often before they ever<br />compare your business.</div></Line>
          <Line delay={308}><div style={{ ...BODY, marginTop: 26 }}>No click.<br />No call.<br />No direction request.</div></Line>
          <Line delay={322}><div style={{ ...BODY, marginTop: 26 }}>They simply reach<br />an easier-to-find<br />option <span style={g}>first.</span></div></Line>
        </div>
        <div style={{ position: "absolute", left: LEFT, top: 1600 }}>
          <Line delay={332}><div style={BODY}>Visibility happens<br /><span style={g}>before comparison.</span></div></Line>
        </div>
      </SceneText>

      {/* SCENE 4 */}
      <SceneText a={366} b={404} c={470} d={482}>
        {/* headline + supporting copy, upper-left */}
        <div style={{ position: "absolute", left: LEFT, top: 130, maxWidth: 600 }}>
          <Line delay={370}><div style={{ ...HEAD, fontSize: 80 }}>If your info</div></Line>
          <Line delay={378}><div style={{ ...HEAD, fontSize: 80 }}>is <span style={g}>incomplete,</span></div></Line>
          <Line delay={386}><div style={{ ...HEAD, fontSize: 80 }}>you get bypassed<span style={g}>.</span></div></Line>
          <Line delay={400}><div style={{ ...SUP, fontSize: 32, marginTop: 28 }}>When customers search,<br />they follow the clearest path<br />to a business they can trust.</div></Line>
          <Line delay={412}><div style={{ ...SUP, fontSize: 32, marginTop: 22 }}>If your information is missing<br />or outdated, they get sent<br />somewhere else.</div></Line>
          <div style={{ width: 56, height: 3, background: T.gold, margin: "26px 0 16px", borderRadius: 2 }} />
          <Line delay={426}><div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: T.headline, lineHeight: 1.2 }}>Visibility starts with<br /><span style={g}>complete</span> information.</div></Line>
        </div>

        {/* search box near the customer */}
        <SearchBox delay={418} style={{ left: LEFT, top: 940 }} />

        {/* numbered steps */}
        <StepCallout n={1} color={T.cyan} title="CUSTOMER SEARCHES" delay={392} style={{ left: 96, top: 1330 }} />
        <StepCallout
          n={2}
          color={T.gold}
          title="YOUR COMPETITOR"
          lines={["Gets the call.", "Gets the visit.", "Gets the customer."]}
          delay={430}
          style={{ left: 636, top: 96 }}
        />
        <StepCallout
          n={3}
          color={T.grayRoute}
          title="CROWN HARDWARE"
          lines={["Missing or incomplete", "information stops", "customers from finding you."]}
          delay={438}
          style={{ left: 686, top: 1172 }}
        />
      </SceneText>
      <InfoCard />

      {/* SCENE 5 */}
      <SceneText a={490} b={528} c={999} d={1000}>
        <div style={{ position: "absolute", left: LEFT, top: 190, maxWidth: 560 }}>
          <Line delay={494}><div style={HEAD}>Get on</div></Line>
          <Line delay={502}><div style={HEAD}>the road</div></Line>
          <Line delay={510}><div style={{ ...HEAD, ...g }}>that's</div></Line>
          <Line delay={518}><div style={{ ...HEAD, ...g }}>moving.</div></Line>
          <Line delay={532}><div style={{ ...SUP, marginTop: 30 }}>You don't need more<br />traffic to exist.<br />You need the existing<br />traffic to <span style={g}>find you.</span></div></Line>
          <Line delay={548}><div style={{ ...BODY, marginTop: 26 }}>OmniFlow Digital helps<br />your business show up<br />where local customers<br />are already searching,<br />comparing and deciding.</div></Line>
        </div>
        <div style={{ position: "absolute", left: LEFT, top: 1620 }}>
          <Line delay={566}>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32 }}>
              <span style={g}>Get Found.</span> <span style={w}>Look Professional.</span> <span style={g}>Grow Online.</span>
            </div>
          </Line>
        </div>
      </SceneText>
    </div>
  );
};
