import {
  AbsoluteFill,
  Img,
  interpolate,
  Easing,
  useCurrentFrame,
  staticFile,
} from "remotion";

// ═══════════════════════════════════════════════════════════════
// TUNEABLE CONSTANTS — edit these to adjust timing and visuals
// ═══════════════════════════════════════════════════════════════
export const TOTAL_FRAMES    = 270;       // total duration (9 s × 30 fps)
export const HOLD_BEFORE     = 20;        // frames to hold before.png at start
export const FADE_TO_AFTER   = 150;       // frames for before → after crossfade
export const HOLD_AFTER      = 60;        // frames to hold after.png
export const FADE_TO_BEFORE  = 40;        // frames for after → before (loop seam)
export const GLOW_COLOR      = "#00D4FF"; // cyan accent used by all effects
export const PARTICLE_COUNT  = 30;        // ambient glowing dots
export const PIN_X           = 0.65;      // map pin X position (fraction of width)
export const PIN_Y           = 0.48;      // map pin Y position (fraction of height)
// ═══════════════════════════════════════════════════════════════

// ─── Derived keyframe positions ───────────────────────────────
const F1 = HOLD_BEFORE;                   // crossfade starts
const F2 = F1 + FADE_TO_AFTER;            // crossfade ends / hold-after starts
const F3 = F2 + HOLD_AFTER;               // loop-fade starts
const F4 = F3 + FADE_TO_BEFORE;           // = TOTAL_FRAMES

const EASE = Easing.bezier(0.76, 0, 0.24, 1); // smooth ease-in-out

/** Opacity of the after.png layer across the full timeline */
function getAfterOpacity(frame: number): number {
  if (frame <= F1) return 0;
  if (frame <= F2)
    return interpolate(frame, [F1, F2], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE,
    });
  if (frame <= F3) return 1;
  return interpolate(frame, [F3, F4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
}

// ─── Phase 2: Glow Sweep ──────────────────────────────────────
// A soft radial glow that travels left→right across the right ⅔
// of the frame as the scene activates. Left ⅓ is never touched.
const GlowSweep: React.FC<{ frame: number }> = ({ frame }) => {
  // Active during the forward transformation only
  const layerOpacity = interpolate(
    frame,
    [F1, F1 + 18, F2 - 18, F2 + 8],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (layerOpacity <= 0.01) return null;

  const sweepProgress = interpolate(frame, [F1, F2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  // X moves from ~40% to ~90% of frame width during the fade
  const sweepXPct = interpolate(sweepProgress, [0, 1], [40, 90]);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        // Hard clip — left ⅓ (0–33.33%) is always untouched
        clipPath: "inset(0 0 0 33.33%)",
        opacity: layerOpacity,
        background: `radial-gradient(ellipse 500px 760px at ${sweepXPct}% 48%, rgba(0,212,255,0.16) 0%, rgba(0,212,255,0.05) 45%, transparent 70%)`,
      }}
    />
  );
};

// ─── Phase 2: Particles ───────────────────────────────────────
// Small glowing dots that slowly drift upward in the right ⅔.
// Positions are fully deterministic (golden-ratio spread) — no Math.random().
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  xPct:       33 + ((i * 2.618) % 1) * 64,          // % of width, right ⅔ only
  baseYPct:   ((i * 1.618) % 1) * 110,               // % of height (can start off-screen)
  speedPct:   0.012 + (i % 7) * 0.004,               // upward drift per frame (% height)
  size:       1.5 + (i % 3) * 1,                     // px
  maxOpacity: 0.15 + (i % 5) * 0.06,                 // individual max opacity
  twinkleOff: (i * 37) % 60,                          // sine phase offset for twinkle
}));

const Particles: React.FC<{ frame: number }> = ({ frame }) => {
  // Fades in during transformation, holds through after-state, fades on loop-back
  const layerOpacity = interpolate(
    frame,
    [F1 + 30, F2, F2 + 10, F3, F4],
    [0, 0.8, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (layerOpacity <= 0.01) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: layerOpacity }}>
      {PARTICLES.map((p, i) => {
        const drift  = (frame * p.speedPct) % 110;
        const yPct   = ((p.baseYPct - drift) + 110) % 110;
        const twinkle = 0.65 + 0.35 * Math.sin(((frame + p.twinkleOff) / 40) * Math.PI);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left:     `${p.xPct}%`,
              top:      `${yPct}%`,
              width:    p.size,
              height:   p.size,
              borderRadius: "50%",
              background:   GLOW_COLOR,
              opacity:      p.maxOpacity * twinkle,
              boxShadow:    `0 0 ${p.size * 4}px ${p.size}px ${GLOW_COLOR}40`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Phase 2: Pulse Ring ──────────────────────────────────────
// One expanding cyan ring fired at the map-pin position,
// timed to ~35% through the main crossfade.
const PULSE_START  = F1 + Math.round(FADE_TO_AFTER * 0.35); // ≈ frame 72
const PULSE_FRAMES = 52;

const PulseRing: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame - PULSE_START;
  if (f < 0 || f > PULSE_FRAMES) return null;

  const progress = f / PULSE_FRAMES;
  const radius   = interpolate(progress, [0, 1],        [14, 140], {
    easing: Easing.bezier(0, 0, 0.35, 1),
  });
  const opacity  = interpolate(progress, [0, 0.2, 1],   [0, 0.8, 0]);
  const strokeW  = interpolate(progress, [0, 1],        [2.5, 0.6]);

  const cx = PIN_X * 1920;
  const cy = PIN_Y * 1080;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        viewBox="0 0 1920 1080"
        width="1920"
        height="1080"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={radius}
          fill="none" stroke={GLOW_COLOR}
          strokeWidth={strokeW} opacity={opacity}
        />
        {/* Soft inner halo */}
        <circle cx={cx} cy={cy} r={radius * 0.65}
          fill="none" stroke={GLOW_COLOR}
          strokeWidth={strokeW * 4} opacity={opacity * 0.18}
        />
      </svg>
    </AbsoluteFill>
  );
};

// ─── Main Composition ─────────────────────────────────────────
export const HeroDesktop: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: "#020B14" }}>

      {/* ── PHASE 1: Crossfade ─────────────────────────────── */}

      {/* before.png — always underneath at full opacity */}
      <AbsoluteFill>
        <Img
          src={staticFile("before.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </AbsoluteFill>

      {/* after.png — fades in over before.png */}
      <AbsoluteFill style={{ opacity: getAfterOpacity(frame) }}>
        <Img
          src={staticFile("after.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </AbsoluteFill>

      {/* ── PHASE 2: Effects (layered above images) ──────────── */}
      <GlowSweep  frame={frame} />
      <Particles  frame={frame} />
      <PulseRing  frame={frame} />

    </AbsoluteFill>
  );
};
