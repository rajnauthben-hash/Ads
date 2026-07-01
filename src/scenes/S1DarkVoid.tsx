import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COL, FONT, SAFE } from "../lib/constants";
import { SceneWrapper, LineReveal, TStyle } from "../components/TextReveal";

// Tiny dim UI fragment floating in the void
const Fragment: React.FC<{
  x: number; y: number; w: number; h: number; angle: number; delay: number;
}> = ({ x, y, w, h, angle, delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  // Subtle sine drift
  const drift = Math.sin((frame * 0.018 + delay * 0.1) * Math.PI) * 6;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + drift,
        width: w,
        height: h,
        borderRadius: 6,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        rotate: `${angle}deg`,
        opacity: op * 0.7,
      }}
    />
  );
};

// Weak map pin — just a dim outline in the distance
const WeakPin: React.FC<{ x: number; y: number; delay: number }> = ({ x, y, delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 20], [0, 0.28], { extrapolateRight: "clamp" });
  const blink = 0.7 + Math.sin((frame * 0.04) * Math.PI) * 0.3;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: op * blink }}>
      <svg width="24" height="32" viewBox="0 0 28 36" fill="none">
        <path
          d="M14 1C7.1 1 1 7.1 1 14 1 23 14 35 14 35S27 23 27 14C27 7.1 20.9 1 14 1Z"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="14" cy="14" r="4" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
};

// Dim search result row
const BuriedResult: React.FC<{ y: number; rank: number; delay: number }> = ({ y, rank, delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 18], [0, 0.32], { extrapolateRight: "clamp" });
  // Slowly drifts downward
  const drift = interpolate(frame, [0, 70], [0, 8], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.h,
        top: y + drift,
        right: SAFE.h,
        opacity: op,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0" }}>
        <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: COL.muted, width: 36, opacity: 0.5 }}>
          #{rank}
        </div>
        <div>
          <div style={{ width: 220, height: 8, borderRadius: 2, background: "rgba(255,255,255,0.18)", marginBottom: 5 }} />
          <div style={{ width: 160, height: 6, borderRadius: 2, background: "rgba(255,255,255,0.09)" }} />
        </div>
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.04)" }} />
    </div>
  );
};

const TOTAL = 70;

export const S1DarkVoid: React.FC = () => {
  const frame = useCurrentFrame();

  // Cinematic push-in: camera slowly zooms in
  const scale = interpolate(frame, [0, TOTAL], [1.04, 1.0], { extrapolateRight: "clamp" });

  return (
    <SceneWrapper totalFrames={TOTAL} fadeIn={10} fadeOut={14}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, scale: scale.toString(), transformOrigin: "center center" }}>

          {/* Scattered dim UI fragments */}
          <Fragment x={80}  y={280} w={180} h={80}  angle={-2}   delay={4} />
          <Fragment x={820} y={320} w={140} h={60}  angle={1.5}  delay={8} />
          <Fragment x={120} y={680} w={220} h={50}  angle={-1}   delay={6} />
          <Fragment x={760} y={640} w={160} h={90}  angle={2}    delay={10} />
          <Fragment x={340} y={220} w={100} h={40}  angle={-1.5} delay={12} />
          <Fragment x={640} y={740} w={120} h={45}  angle={1}    delay={9} />

          {/* Thin disconnected lines — suggests broken connectivity */}
          <svg style={{ position: "absolute", inset: 0, opacity: 0.12 }} width={1080} height={1920}>
            <line x1="120" y1="380" x2="420" y2="340" stroke={COL.cyan} strokeWidth="0.8" strokeDasharray="4 6" />
            <line x1="820" y1="420" x2="600" y2="480" stroke={COL.blue} strokeWidth="0.8" strokeDasharray="4 6" />
            <line x1="200" y1="720" x2="460" y2="680" stroke={COL.cyan} strokeWidth="0.8" strokeDasharray="3 8" />
          </svg>

          {/* Weak map pin */}
          <WeakPin x={180} y={740} delay={14} />

          {/* Buried search results */}
          <BuriedResult y={1080} rank={7} delay={16} />
          <BuriedResult y={1128} rank={8} delay={20} />
          <BuriedResult y={1176} rank={9} delay={24} />

        </div>

        {/* Text block — centered */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: `0 ${SAFE.h}px`,
          }}
        >
          <LineReveal delay={18} dur={24} style={{ textAlign: "center" }}>
            <div style={{ ...TStyle.hookLg, textAlign: "center" }}>
              Your business
            </div>
          </LineReveal>
          <LineReveal delay={26} dur={24} style={{ textAlign: "center", marginTop: 6 }}>
            <div
              style={{
                ...TStyle.hookLg,
                textAlign: "center",
                color: COL.muted,
                fontStyle: "italic",
              }}
            >
              exists…
            </div>
          </LineReveal>
        </AbsoluteFill>
      </AbsoluteFill>
    </SceneWrapper>
  );
};
