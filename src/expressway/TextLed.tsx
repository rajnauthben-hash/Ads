import React, { useEffect, useRef } from "react";
import { AbsoluteFill, delayRender, continueRender, useCurrentFrame, interpolate } from "remotion";
import { initFonts } from "./fonts";
import { T, FONT, SAFE } from "./theme";
import { reveal, win, envelope } from "./anim";

// ============================================================================
// Text-led cut of the Local Search Expressway ad.
// No illustration — purely typographic. One continuous dark stage; each scene's
// copy resolves in phrase groups and drifts away as the next resolves, so it
// still reads as one continuous piece rather than a slideshow.
// ============================================================================

const LEFT = SAFE.left;
const g = { color: T.gold };
const w = { color: T.headline };

const HEAD: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 800,
  fontSize: 98,
  lineHeight: 0.98,
  letterSpacing: -1.8,
  color: T.headline,
};
const SUP: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 600,
  fontSize: 40,
  lineHeight: 1.24,
  color: T.support,
};
const BODY: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 500,
  fontSize: 34,
  lineHeight: 1.3,
  color: T.support,
};
const SMALL: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 500,
  fontSize: 27,
  lineHeight: 1.35,
  color: T.support,
};

const Line: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  return <div style={{ ...reveal(frame, delay), ...style }}>{children}</div>;
};

// Scene wrapper: overall in/out envelope + gentle vertical exit drift so copy
// lifts away as the next scene arrives (continuous, never a hard cut).
const Scene: React.FC<{ a: number; b: number; c: number; d: number; children: React.ReactNode }> = ({
  a,
  b,
  c,
  d,
  children,
}) => {
  const frame = useCurrentFrame();
  const op = envelope(frame, a, b, c, d);
  const enter = win(frame, a, b, 24, 0);
  const exit = win(frame, c, d, 0, -30);
  const blur = win(frame, c, d, 0, 6);
  return (
    <AbsoluteFill
      style={{
        opacity: op,
        transform: `translateY(${enter + exit}px)`,
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Divider: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const wpx = win(frame, delay, delay + 20, 0, 64);
  return <div style={{ width: wpx, height: 3, background: T.gold, borderRadius: 2, margin: "30px 0 20px" }} />;
};

const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [4, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: LEFT, top: 96, opacity: op }}>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, letterSpacing: 7, color: T.headline }}>
        OMNIFLOW <span style={{ color: T.support, fontWeight: 500 }}>DIGITAL</span>
      </div>
      <div style={{ width: 70, height: 3, background: T.gold, marginTop: 14, borderRadius: 2 }} />
    </div>
  );
};

// A quiet, slowly drifting background wash so the stage isn't dead-flat.
const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 600], [58, 70]);
  const y = interpolate(frame, [0, 600], [26, 40]);
  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(80% 55% at ${x}% ${y}%, rgba(34,120,180,0.14) 0%, rgba(0,0,0,0) 60%)`,
        }}
      />
      <AbsoluteFill
        style={{ background: "radial-gradient(120% 90% at 40% 45%, rgba(0,0,0,0) 55%, rgba(2,5,8,0.6) 100%)" }}
      />
    </AbsoluteFill>
  );
};

export const TextLed: React.FC = () => {
  const handle = useRef<number | null>(null);
  useEffect(() => {
    handle.current = delayRender("textled-fonts");
    initFonts().then(() => {
      if (handle.current !== null) continueRender(handle.current);
    });
  }, []);

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <Stage />
      <Brand />

      {/* SCENE 1 */}
      <Scene a={8} b={40} c={108} d={120}>
        <div style={{ position: "absolute", left: LEFT, top: 300, maxWidth: 900 }}>
          <Line delay={14}><div style={HEAD}>Has your business</div></Line>
          <Line delay={22}><div style={HEAD}>felt <span style={g}>quieter</span> lately?</div></Line>
          <Line delay={40}><div style={{ ...SUP, marginTop: 44 }}>People may still need exactly what you sell.</div></Line>
          <Line delay={54}><div style={{ ...BODY, marginTop: 30 }}>The problem might not be demand.<br />It might be where customers are <span style={g}>looking first.</span></div></Line>
          <Line delay={70}><div style={{ ...SMALL, marginTop: 40, color: T.support }}>There is still traffic. It just may <span style={g}>not</span> be reaching you.</div></Line>
        </div>
      </Scene>

      {/* SCENE 2 */}
      <Scene a={128} b={160} c={228} d={240}>
        <div style={{ position: "absolute", left: LEFT, top: 320, maxWidth: 940 }}>
          <Line delay={134}><div style={HEAD}>A new <span style={g}>highway</span></div></Line>
          <Line delay={142}><div style={HEAD}>got built.</div></Line>
          <Line delay={160}><div style={{ ...SUP, marginTop: 40 }}>And it starts when someone<br />searches for a business nearby.</div></Line>
          <Line delay={178}>
            <div style={{ ...BODY, marginTop: 40, fontWeight: 700, color: T.headline, letterSpacing: 0.5 }}>
              Search <span style={g}>→</span> Maps <span style={g}>→</span> Reviews <span style={g}>→</span> Websites
            </div>
          </Line>
          <Line delay={196}><div style={{ ...BODY, marginTop: 40 }}>That's where many customers<br />begin deciding where to go.</div></Line>
        </div>
      </Scene>

      {/* SCENE 3 */}
      <Scene a={248} b={280} c={348} d={360}>
        <div style={{ position: "absolute", left: LEFT, top: 280, maxWidth: 940 }}>
          <Line delay={254}><div style={HEAD}>If you're not on</div></Line>
          <Line delay={262}><div style={HEAD}>that road, <span style={g}>they</span></div></Line>
          <Line delay={270}><div style={{ ...HEAD, ...g }}>pass you.</div></Line>
          <Line delay={288}><div style={{ ...SUP, marginTop: 40 }}>Often before they ever compare your business.</div></Line>
          <Line delay={302}><div style={{ ...BODY, marginTop: 30 }}>No click. No call. No direction request.</div></Line>
          <Line delay={316}><div style={{ ...BODY, marginTop: 26 }}>They simply reach an easier-to-find option <span style={g}>first.</span></div></Line>
          <Line delay={330}><div style={{ ...SMALL, marginTop: 40 }}>Visibility happens <span style={g}>before comparison.</span></div></Line>
        </div>
      </Scene>

      {/* SCENE 4 */}
      <Scene a={368} b={400} c={468} d={480}>
        <div style={{ position: "absolute", left: LEFT, top: 240, maxWidth: 940 }}>
          <Line delay={374}><div style={{ ...HEAD, fontSize: 90 }}>If your info is</div></Line>
          <Line delay={382}><div style={{ ...HEAD, fontSize: 90 }}><span style={g}>incomplete,</span> you</div></Line>
          <Line delay={390}><div style={{ ...HEAD, fontSize: 90 }}>get bypassed.</div></Line>
          <Line delay={406}><div style={{ ...SUP, marginTop: 40 }}>When customers search, they follow<br />the clearest path to a business they can trust.</div></Line>
          <Line delay={420}><div style={{ ...BODY, marginTop: 26 }}>If your information is missing or outdated,<br />they get sent somewhere else.</div></Line>
          <Divider delay={434} />
          <Line delay={440}><div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: T.headline }}>Visibility starts with <span style={g}>complete</span> information.</div></Line>
          <Line delay={452}><div style={{ ...SMALL, marginTop: 26, color: T.warning }}>Hours missing · Location incomplete · Phone missing</div></Line>
        </div>
      </Scene>

      {/* SCENE 5 */}
      <Scene a={488} b={520} c={1000} d={1001}>
        <div style={{ position: "absolute", left: LEFT, top: 300, maxWidth: 940 }}>
          <Line delay={494}><div style={HEAD}>Get on the road</div></Line>
          <Line delay={502}><div style={{ ...HEAD, ...g }}>that's moving.</div></Line>
          <Line delay={520}><div style={{ ...SUP, marginTop: 44 }}>You don't need more traffic to exist.<br />You need the existing traffic to <span style={g}>find you.</span></div></Line>
          <Line delay={538}><div style={{ ...BODY, marginTop: 30 }}>OmniFlow Digital helps your business show up<br />where local customers are already searching,<br />comparing and deciding.</div></Line>
        </div>
        <div style={{ position: "absolute", left: LEFT, top: 1600 }}>
          <Line delay={556}>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36 }}>
              <span style={g}>Get Found.</span> <span style={w}>Look Professional.</span> <span style={g}>Grow Online.</span>
            </div>
          </Line>
        </div>
      </Scene>
    </AbsoluteFill>
  );
};
