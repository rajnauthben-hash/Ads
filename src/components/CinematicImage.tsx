import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { EO } from "../lib/constants";

// Ken Burns motion variants — subtle, cinematic, no slop.
// "settle" lands on the full uncropped poster and holds — for the final CTA,
// whose copy reaches the very bottom edge of the artwork.
export type MotionKind = "pushIn" | "pullBack" | "driftUp" | "driftDown" | "settle";

// Amplitudes are capped so the posters' bottom captions never crop out
// (transform-origin is biased upward; worst-case bottom crop ≈ 3%).
const MOTION: Record<MotionKind, { scale: [number, number]; y: [number, number] }> = {
  pushIn:    { scale: [1.025, 1.08], y: [0, 0]    },
  pullBack:  { scale: [1.09, 1.03],  y: [0, 0]    },
  driftUp:   { scale: [1.05, 1.065], y: [10, -10] },
  driftDown: { scale: [1.05, 1.065], y: [-10, 10] },
  settle:    { scale: [1.07, 1.0],   y: [0, 0]    },
};

interface Props {
  src: string;          // filename under public/images/v3/
  dur: number;          // sequence duration incl. crossfade tail
  motion?: MotionKind;
  fadeIn?: number;      // 0 for the very first scene
  fadeOut?: number;     // 0 for the last scene
  sweep?: boolean;      // diagonal light sweep early in the scene
  sweepDelay?: number;
  scanAccent?: boolean; // horizontal scan-line reveal (transformation beat)
  glowPulse?: boolean;  // breathing cyan glow overlay
  flashIn?: boolean;    // brief white flash on entry (impact beat)
}

// Diagonal light sweep — an elegant streak crossing the frame once.
const LightSweep: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const x = interpolate(f, [0, 34], [-700, 1700], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });
  const op = interpolate(f, [0, 8, 26, 34], [0, 0.14, 0.14, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -400,
          left: x,
          width: 260,
          height: 2800,
          rotate: "18deg",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(180,235,255,0.85) 50%, transparent 100%)",
          opacity: op,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};

// Horizontal scan-line sweeping down the frame — digital transformation accent.
const ScanAccent: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const y = interpolate(f, [0, 30], [-20, 1940], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.7, 1),
  });
  const op = interpolate(f, [0, 5, 25, 30], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y,
          height: 3,
          background:
            "linear-gradient(90deg, transparent 0%, #22D3EE 18%, rgba(190,245,255,0.95) 50%, #22D3EE 82%, transparent 100%)",
          boxShadow: "0 0 28px rgba(34,211,238,0.9), 0 0 70px rgba(34,211,238,0.35)",
          opacity: op,
        }}
      />
      {/* Faint afterglow above the line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y - 130,
          height: 130,
          background: "linear-gradient(180deg, transparent 0%, rgba(34,211,238,0.10) 100%)",
          opacity: op,
        }}
      />
    </AbsoluteFill>
  );
};

// Breathing cyan glow — keeps the frame alive during holds.
const GlowPulse: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + Math.sin((frame / 52) * Math.PI) * 0.5;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 75% 50% at 50% 78%, rgba(34,211,238,${0.045 + pulse * 0.035}) 0%, transparent 65%)`,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  );
};

export const CinematicImage: React.FC<Props> = ({
  src,
  dur,
  motion = "pushIn",
  fadeIn = 12,
  fadeOut = 14,
  sweep = false,
  sweepDelay = 8,
  scanAccent = false,
  glowPulse = false,
  flashIn = false,
}) => {
  const frame = useCurrentFrame();
  const m = MOTION[motion];

  // Slow, linear-ish Ken Burns across the whole scene — no easing "bounce".
  // "settle" completes its move early and holds on the full frame.
  const motionEnd = motion === "settle" ? Math.min(46, Math.round(dur * 0.6)) : dur;
  const scale = interpolate(frame, [0, motionEnd], m.scale, {
    extrapolateRight: "clamp",
    easing: motion === "settle" ? Easing.bezier(0.22, 1, 0.36, 1) : Easing.bezier(0.33, 0, 0.67, 1),
  });
  const ty = interpolate(frame, [0, motionEnd], m.y, { extrapolateRight: "clamp" });

  // Crossfade envelope
  const inOp = fadeIn > 0
    ? interpolate(frame, [0, fadeIn], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(...EO) })
    : 1;
  const outOp = fadeOut > 0
    ? interpolate(frame, [dur - fadeOut, dur], [1, 0], { extrapolateLeft: "clamp" })
    : 1;

  // Entry focus: soft blur that resolves as the scene lands
  const blur = fadeIn > 0
    ? interpolate(frame, [0, fadeIn], [3.5, 0], { extrapolateRight: "clamp" })
    : 0;

  const flashOp = flashIn
    ? interpolate(frame, [0, 3, 12], [0, 0.22, 0], { extrapolateRight: "clamp" })
    : 0;

  return (
    <AbsoluteFill style={{ opacity: Math.min(inOp, outOp), overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          scale: scale.toString(),
          translate: `0px ${ty}px`,
          transformOrigin: "50% 58%",
          filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
        }}
      >
        <Img
          src={staticFile(`images/v3/${src}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {glowPulse && <GlowPulse />}
      {sweep && <LightSweep delay={sweepDelay} />}
      {scanAccent && <ScanAccent delay={4} />}

      {flashOp > 0.01 && (
        <AbsoluteFill style={{ background: "#CFF6FF", opacity: flashOp, pointerEvents: "none" }} />
      )}
    </AbsoluteFill>
  );
};
