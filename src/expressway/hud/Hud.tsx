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

// --- Scene 4 incomplete-information card -------------------------------------
const InfoRow: React.FC<{ label: string; value: string; delay: number }> = ({ label, value, delay }) => {
  const frame = useCurrentFrame();
  const r = reveal(frame, delay, 14);
  return (
    <div style={{ ...r, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <span style={{ fontFamily: FONT, fontWeight: 500, fontSize: 22, color: T.support }}>{label}</span>
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, color: T.warning, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: 8, background: T.warning, display: "inline-block" }} />
        {value}
      </span>
    </div>
  );
};

const InfoCard: React.FC = () => {
  const frame = useCurrentFrame();
  const op = envelope(frame, 414, 440, 486, 512);
  const rise = win(frame, 414, 444, 20, 0);
  return (
    <div
      style={{
        position: "absolute",
        right: 90,
        top: 1210,
        width: 360,
        opacity: op,
        transform: `translateY(${rise}px)`,
        background: "rgba(9,15,20,0.94)",
        border: `1.5px solid ${T.warning}`,
        borderRadius: 14,
        padding: "18px 20px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 22 }}>⚠️</span>
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 21, letterSpacing: 0.5, color: T.warning }}>
          INCOMPLETE INFORMATION
        </span>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: T.headline, margin: "8px 0 4px" }}>
        Crown Hardware
      </div>
      <InfoRow label="Hours" value="Not available" delay={430} />
      <InfoRow label="Location" value="Incomplete" delay={438} />
      <InfoRow label="Phone" value="Missing" delay={446} />
      <InfoRow label="Website" value="Not added" delay={454} />
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
        <div style={{ position: "absolute", left: LEFT, top: 180, maxWidth: 600 }}>
          <Line delay={370}><div style={HEAD}>The traffic</div></Line>
          <Line delay={378}><div style={HEAD}>didn't</div></Line>
          <Line delay={386}><div style={HEAD}>disappear.</div></Line>
          <Line delay={394}><div style={{ ...HEAD, ...g }}>It relocated.</div></Line>
          <Line delay={408}><div style={{ ...SUP, marginTop: 30 }}>Your customers can<br />still be out there.</div></Line>
          <Line delay={420}><div style={{ ...BODY, marginTop: 26 }}>But if the route they<br />now use doesn't<br />lead to you, another<br />business gets the<br />attention first.</div></Line>
        </div>
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
