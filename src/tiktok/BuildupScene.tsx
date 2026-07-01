import { useCurrentFrame, spring, interpolate, Easing } from "remotion";
import { COLORS, FONT, W, H, SPRING } from "./config";

// Centre of composition
const CX = W / 2;  // 540
const CY = H / 2;  // 960

// ── Deterministic particle generation (golden-ratio spread) ──────────
const PARTICLE_COUNT = 180;

interface Particle {
  sx: number; sy: number;   // start (on edge)
  ex: number; ey: number;   // end (near center)
  delay: number;             // frame offset 0-28
  size: number;              // px
  brightness: number;        // max opacity
}

const PARTICLES: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const phi   = (i * 2.618033988) % 1;
  const theta = (i * 1.618033988) % 1;
  const psi   = (i * 0.381966011) % 1;

  // Spread across all 4 edges proportionally
  const edge = i % 4;
  let sx: number, sy: number;
  if      (edge === 0) { sx = phi   * W;      sy = -25; }
  else if (edge === 1) { sx = W + 25;          sy = phi * H; }
  else if (edge === 2) { sx = theta * W;        sy = H + 25; }
  else                 { sx = -25;              sy = theta * H; }

  // Land near center with spread (±220 × ±340 px)
  const ex = CX + (phi   - 0.5) * 440;
  const ey = CY + (theta - 0.5) * 680;

  return {
    sx, sy, ex, ey,
    delay:      Math.floor(phi * 28),
    size:       1.4 + psi * 3.6,
    brightness: 0.35 + theta * 0.65,
  };
});

// ── Pseudo-random camera shake ────────────────────────────────────────
function shakeOffset(frame: number, amp: number): { x: number; y: number } {
  const t = frame * 0.35;
  return {
    x: (Math.sin(t * 2.7) * 0.6 + Math.sin(t * 5.3) * 0.4) * amp,
    y: (Math.cos(t * 3.1) * 0.6 + Math.cos(t * 7.2) * 0.4) * amp,
  };
}

export const BuildupScene: React.FC = () => {
  const frame = useCurrentFrame(); // local: 0-89

  // ── Centre ignition — spring burst on frame 0 ────────────────────
  const igniteSc = spring({ frame, fps: 30, config: SPRING.bouncy, durationInFrames: 25 });
  // Pulse heartbeat after spring settles
  const heartbeat = 1 + 0.12 * Math.sin((frame / 18) * Math.PI);
  const coreScale = frame < 20 ? igniteSc : heartbeat;

  // ── Glow layers ───────────────────────────────────────────────────
  // Outermost halo fades in and expands
  const haloOpacity = interpolate(frame, [0, 20, 80], [0, 0.55, 0.38], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const haloScale = spring({ frame, fps: 30, config: { damping: 12, mass: 1.2, stiffness: 80 }, durationInFrames: 75 });

  // ── Camera shake ramps up across buildup ─────────────────────────
  const shakeAmp = interpolate(frame, [0, 68, 89], [0, 4, 7], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const { x: sx, y: sy } = shakeOffset(frame, shakeAmp);

  // ── Vignette builds from edges as tension grows ───────────────────
  const vigOpacity = interpolate(frame, [0, 45, 89], [0, 0.35, 0.65], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div style={{
      width: W, height: H,
      position: "relative", overflow: "hidden",
      fontFamily: FONT,
    }}>
      {/* ── Camera shake wrapper ─────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${sx}px, ${sy}px)` }}>

        {/* Outermost ambient halo — 900×900, pure radial-gradient */}
        <div style={{
          position:     "absolute",
          left:         CX - 450,
          top:          CY - 450,
          width:        900,
          height:       900,
          borderRadius: "50%",
          background:   `radial-gradient(circle, rgba(0,229,255,0.18) 0%, rgba(0,229,255,0.05) 40%, transparent 68%)`,
          opacity:      haloOpacity,
          scale:        haloScale.toString(),
        }} />

        {/* Mid glow — 400×400 */}
        <div style={{
          position:     "absolute",
          left:         CX - 200,
          top:          CY - 200,
          width:        400,
          height:       400,
          borderRadius: "50%",
          background:   `radial-gradient(circle, rgba(0,229,255,0.55) 0%, rgba(0,229,255,0.18) 38%, transparent 68%)`,
          opacity:      igniteSc * heartbeat,
          transform:    `scale(${coreScale})`,
          transformOrigin: "center",
        }} />

        {/* Inner bright core dot */}
        <div style={{
          position:     "absolute",
          left:         CX - 14,
          top:          CY - 14,
          width:        28,
          height:       28,
          borderRadius: "50%",
          background:   COLORS.energy,
          opacity:      Math.min(1, igniteSc),
          transform:    `scale(${coreScale})`,
          transformOrigin: "center",
        }} />

        {/* ── Particles ─────────────────────────────────────────── */}
        {PARTICLES.map((p, i) => {
          const localF = frame - p.delay;
          if (localF < 0) return null;

          const travelFrames = 89 - p.delay;
          const progress = interpolate(
            localF,
            [0, Math.max(1, travelFrames)],
            [0, 1],
            {
              extrapolateLeft:  "clamp",
              extrapolateRight: "clamp",
              easing:           Easing.bezier(0.65, 0, 1, 1), // ease-in-expo: accelerate into center
            }
          );

          const px    = p.sx + (p.ex - p.sx) * progress;
          const py    = p.sy + (p.ey - p.sy) * progress;
          const sz    = p.size * (1 - progress * 0.55);  // shrink as approaching
          const alpha = p.brightness * (0.2 + progress * 0.8); // brighten
          const divSz = Math.max(1, sz) * 4;

          return (
            <div
              key={i}
              style={{
                position:     "absolute",
                left:         px,
                top:          py,
                width:        divSz,
                height:       divSz,
                borderRadius: "50%",
                background:   `radial-gradient(circle, rgba(0,229,255,${alpha.toFixed(3)}) 0%, rgba(0,229,255,${(alpha * 0.2).toFixed(3)}) 40%, transparent 70%)`,
                transform:    "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            />
          );
        })}
      </div>

      {/* ── Vignette overlay (not shake-affected) ─────────────────── */}
      <div style={{
        position:   "absolute",
        inset:      0,
        background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.92) 100%)",
        opacity:    vigOpacity,
        pointerEvents: "none",
      }} />
    </div>
  );
};
