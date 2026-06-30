import {
  AbsoluteFill,
  Img,
  interpolate,
  Easing,
  useCurrentFrame,
  staticFile,
} from "remotion";

// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS — everything tunable from here
// ═══════════════════════════════════════════════════════════════════════

// Composition
export const TOTAL_FRAMES = 270;        // 9 s × 30 fps
export const GLOW_COLOR   = "#00D4FF";  // primary cyan

// Stage end frames (stages are sequential, percentages shown)
export const STAGE1_END = 54;   // 0 –  54  (0–20%):  pin ignition
export const STAGE2_END = 135;  // 54 – 135 (20–50%): threads travel
export const STAGE3_END = 216;  // 135–216  (50–80%): elements activate
export const HOLD_END   = 252;  // 216–252  (80–93%): settled after-state
// 252–270 loop fade back to before.png

// Map pin position (fraction of 1920×1080)
export const PIN_X = 0.65;
export const PIN_Y = 0.48;

// Thread endpoint coordinates (px — tune to match your image's thread paths)
export const PANEL_CX = 1190; // website panel centre X
export const PANEL_CY = 175;  // website panel centre Y
export const PANEL_W  = 460;  // website panel flash width
export const PANEL_H  = 235;  // website panel flash height

export const STORE_CX = 1110; // storefront centre X
export const STORE_CY = 695;  // storefront centre Y
export const STORE_W  = 390;  // storefront flash width
export const STORE_H  = 270;  // storefront flash height

// Thread timing
export const THREAD1_START = STAGE1_END;          // panel thread starts
export const THREAD1_END   = STAGE1_END + 52;     // panel thread arrives
export const THREAD2_START = STAGE1_END + 22;     // storefront thread (staggered)
export const THREAD2_END   = STAGE1_END + 80;     // storefront thread arrives

// Element flash timing (fires as thread arrives)
export const PANEL_FLASH_START = THREAD1_END - 4;
export const STORE_FLASH_START = THREAD2_END - 4;
export const FLASH_DURATION    = 22;              // frames for snap-on flash

// Particles
export const PARTICLE_COUNT   = 52;
export const PARTICLE_MAX_OPQ = 0.45;

// Pulse rings
export const RING_MAX_RADIUS = 185; // px
export const RING_PERIOD     = 58;  // frames between ring launches
export const RING_DURATION   = 52;  // frames each ring lives

// ═══════════════════════════════════════════════════════════════════════

// Derived constants
const PIN_PX = PIN_X * 1920;
const PIN_PY = PIN_Y * 1080;

// SVG cubic-bezier paths approximating the thread routes in the image.
// Control points curve from the pin outward along each visible light thread.
const THREAD_TO_PANEL = `M ${PIN_PX} ${PIN_PY} C 1290 390 1230 255 ${PANEL_CX} ${PANEL_CY}`;
const THREAD_TO_STORE = `M ${PIN_PX} ${PIN_PY} C 1310 575 1265 660 ${STORE_CX} ${STORE_CY}`;

// ─── Image crossfade ─────────────────────────────────────────────────
// Held on before.png through Stage 1 and Stage 2, then transitions
// quickly through Stage 3 as each element "snaps on."
function getAfterOpacity(frame: number): number {
  if (frame <= STAGE1_END) return 0;
  if (frame <= STAGE2_END)
    // Very slow creep — before.png still dominant while threads travel
    return interpolate(frame, [STAGE1_END, STAGE2_END], [0, 0.2], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 1, 1),
    });
  if (frame <= STAGE3_END)
    // Fast push to fully activated as elements flash on
    return interpolate(frame, [STAGE2_END, STAGE3_END], [0.2, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.bezier(0, 0, 0.4, 1),
    });
  if (frame <= HOLD_END) return 1;
  // Loop fade — faster reset, not the showcase moment
  return interpolate(frame, [HOLD_END, TOTAL_FRAMES], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 1, 1),
  });
}

// ─── Stage 1: Pin Ignition ───────────────────────────────────────────
const PinIgnition: React.FC<{ frame: number }> = ({ frame }) => {
  // Build from 0 → full in first 22 frames
  const buildUp = interpolate(frame, [0, 22], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0, 0, 0.4, 1),
  });

  // Overshoot pop: scale slightly past 1 then settle back
  const coreScale = interpolate(frame, [0, 18, 28, 40], [0, 1.35, 0.9, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Charging heartbeat during Stage 1 (frames 22–54)
  const heartbeat = frame > 22 && frame < STAGE1_END
    ? 0.82 + 0.18 * Math.sin(((frame - 22) / 14) * Math.PI)
    : 1;

  // After Stage 2 begins, pin settles to a steady ambient glow
  const stageOpacity =
    frame <= STAGE1_END ? buildUp * heartbeat :
    frame <= STAGE2_END ? 0.9 :
    0.65;

  // Outer halo: grows from nothing to a large soft disc
  const haloScale = interpolate(frame, [0, STAGE1_END], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.2, 0.64, 1),
  });

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: stageOpacity }}>
      {/* Outer soft halo */}
      <div style={{
        position: "absolute",
        left:         PIN_PX - 120,
        top:          PIN_PY - 120,
        width:        240,
        height:       240,
        borderRadius: "50%",
        background:   `radial-gradient(circle, rgba(0,212,255,0.28) 0%, rgba(0,212,255,0.08) 45%, transparent 70%)`,
        scale:        haloScale.toString(),
      }} />
      {/* Inner bright core */}
      <div style={{
        position:     "absolute",
        left:         PIN_PX - 10,
        top:          PIN_PY - 10,
        width:        20,
        height:       20,
        borderRadius: "50%",
        background:   GLOW_COLOR,
        opacity:      0.95,
        boxShadow:    `0 0 16px 6px rgba(0,212,255,0.65), 0 0 36px 14px rgba(0,212,255,0.3)`,
        scale:        coreScale.toString(),
      }} />
    </div>
  );
};

// ─── Stage 2: Energy Threads ─────────────────────────────────────────
interface EnergyThreadProps {
  frame: number;
  path: string;
  startFrame: number;
  endFrame: number;
}

const EnergyThread: React.FC<EnergyThreadProps> = ({ frame, path, startFrame, endFrame }) => {
  const f        = frame - startFrame;
  const duration = endFrame - startFrame;
  const progress = Math.max(0, Math.min(1, f / duration));

  if (f < 0) return null;

  const PULSE_LEN = 0.1; // segment length as fraction of path

  // dashOffset: moves bright segment from path-start to path-end
  const dashOffset = interpolate(progress, [0, 1], [PULSE_LEN, -(1 - PULSE_LEN)], {
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });

  const pulseOpacity = interpolate(f, [0, 6, duration - 6, duration + 4], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Dim static trail shows the thread exists before/after the pulse
  const trailOpacity = interpolate(f, [0, 10], [0, 0.2], { extrapolateRight: "clamp" });

  return (
    <svg
      viewBox="0 0 1920 1080"
      width="1920" height="1080"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* Static dim thread trail */}
      <path d={path} fill="none"
        stroke={GLOW_COLOR} strokeWidth={1}
        opacity={trailOpacity * pulseOpacity}
        strokeLinecap="round"
      />
      {/* Moving glow halo — wide, soft */}
      <path d={path} fill="none"
        stroke={GLOW_COLOR} strokeWidth={14}
        pathLength={1}
        strokeDasharray={`${PULSE_LEN} ${1 - PULSE_LEN}`}
        strokeDashoffset={dashOffset}
        opacity={pulseOpacity * 0.2}
        strokeLinecap="round"
      />
      {/* Moving bright core */}
      <path d={path} fill="none"
        stroke={GLOW_COLOR} strokeWidth={2.5}
        pathLength={1}
        strokeDasharray={`${PULSE_LEN} ${1 - PULSE_LEN}`}
        strokeDashoffset={dashOffset}
        opacity={pulseOpacity * 0.95}
        strokeLinecap="round"
      />
      {/* Moving white-hot centre */}
      <path d={path} fill="none"
        stroke="rgba(255,255,255,0.9)" strokeWidth={1}
        pathLength={1}
        strokeDasharray={`${PULSE_LEN * 0.5} ${1 - PULSE_LEN * 0.5}`}
        strokeDashoffset={dashOffset}
        opacity={pulseOpacity * 0.8}
        strokeLinecap="round"
      />
    </svg>
  );
};

// ─── Stage 3: Element Activation Flash ───────────────────────────────
interface ElementFlashProps {
  frame: number;
  startFrame: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

const ElementFlash: React.FC<ElementFlashProps> = ({
  frame, startFrame, centerX, centerY, width, height,
}) => {
  const f = frame - startFrame;
  const END = FLASH_DURATION + 30;
  if (f < 0 || f > END) return null;

  // Sharp asymmetric curve: instant bright snap, slow decay
  const opacity =
    f <= 5
      ? interpolate(f, [0, 5], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0, 0, 0.2, 1) })
      : interpolate(f, [5, END], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0, 1, 1) });

  // Scan line: a bright horizontal bar that sweeps down the element
  const scanY = interpolate(f, [0, FLASH_DURATION], [centerY - height / 2, centerY + height / 2], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const scanOpacity = f <= FLASH_DURATION
    ? interpolate(f, [0, 5, FLASH_DURATION], [0, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <>
      {/* Additive radial glow over element */}
      <div style={{
        position:      "absolute",
        left:          centerX - width / 2,
        top:           centerY - height / 2,
        width,
        height,
        borderRadius:  14,
        background:    `radial-gradient(ellipse 90% 80% at 50% 50%,
          rgba(255,255,255,0.88) 0%,
          rgba(0,212,255,0.65)  30%,
          rgba(0,212,255,0.2)   60%,
          transparent           80%)`,
        opacity,
        mixBlendMode: "screen" as const,
        pointerEvents: "none",
      }} />
      {/* Horizontal scan line sweeping through element */}
      <div style={{
        position:      "absolute",
        left:          centerX - width / 2,
        top:           scanY - 1,
        width,
        height:        3,
        background:    `linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)`,
        opacity:       scanOpacity,
        mixBlendMode:  "screen" as const,
        pointerEvents: "none",
      }} />
    </>
  );
};

// ─── Stage 4: Particles ──────────────────────────────────────────────
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  xPct:       33 + ((i * 2.618) % 1) * 63,
  baseYPct:   ((i * 1.618) % 1) * 110,
  speedPct:   0.016 + (i % 7) * 0.005,
  size:       1.5 + (i % 4) * 1.1,
  maxOpacity: PARTICLE_MAX_OPQ * (0.45 + (i % 5) * 0.11),
  twinkleOff: (i * 41) % 80,
}));

const Particles: React.FC<{ frame: number }> = ({ frame }) => {
  // Accelerate during activation, settle into slow ambient drift
  const speedMult = interpolate(
    frame,
    [STAGE1_END, STAGE2_END, STAGE3_END, HOLD_END],
    [0.4, 1.8, 1.2, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const layerOpacity = interpolate(
    frame,
    [STAGE1_END, STAGE2_END, STAGE3_END, HOLD_END, TOTAL_FRAMES],
    [0, 0.55, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (layerOpacity < 0.01) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: layerOpacity }}>
      {PARTICLES.map((p, i) => {
        const drift   = (frame * p.speedPct * speedMult) % 110;
        const yPct    = ((p.baseYPct - drift) + 110) % 110;
        const twinkle = 0.55 + 0.45 * Math.sin(((frame + p.twinkleOff) / 38) * Math.PI);
        return (
          <div key={i} style={{
            position:     "absolute",
            left:         `${p.xPct}%`,
            top:          `${yPct}%`,
            width:        p.size,
            height:       p.size,
            borderRadius: "50%",
            background:   GLOW_COLOR,
            opacity:      p.maxOpacity * twinkle,
            boxShadow:    `0 0 ${p.size * 4}px ${p.size * 1.5}px rgba(0,212,255,0.4)`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Stage 4: Pulse Rings ────────────────────────────────────────────
const RING_COUNT = 3;

const PulseRings: React.FC<{ frame: number }> = ({ frame }) => {
  const layerOpacity = interpolate(
    frame,
    [STAGE2_END, STAGE2_END + 18, HOLD_END, TOTAL_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (layerOpacity < 0.01 || frame < STAGE2_END) return null;

  const elapsed = frame - STAGE2_END;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: layerOpacity }}>
      <svg viewBox="0 0 1920 1080" width="1920" height="1080"
        style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: RING_COUNT }, (_, i) => {
          // Each ring starts RING_PERIOD frames after the previous
          const localF = (elapsed - i * RING_PERIOD) % (RING_PERIOD * RING_COUNT);
          if (localF < 0 || localF > RING_DURATION) return null;

          const t       = localF / RING_DURATION;
          const r       = interpolate(t, [0, 1], [18, RING_MAX_RADIUS],
            { easing: Easing.bezier(0, 0, 0.35, 1) });
          const opacity = interpolate(t, [0, 0.18, 1], [0, 0.88, 0]);
          const sw      = interpolate(t, [0, 1], [2.8, 0.5]);

          return (
            <g key={i}>
              {/* Main ring */}
              <circle cx={PIN_PX} cy={PIN_PY} r={r}
                fill="none" stroke={GLOW_COLOR}
                strokeWidth={sw} opacity={opacity} />
              {/* Soft inner halo */}
              <circle cx={PIN_PX} cy={PIN_PY} r={r * 0.72}
                fill="none" stroke={GLOW_COLOR}
                strokeWidth={sw * 5} opacity={opacity * 0.14} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ─── Main Composition ────────────────────────────────────────────────
export const HeroDesktop: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: "#020B14" }}>

      {/* ── Base images: camera locked, zero transform ─── */}
      <AbsoluteFill>
        <Img src={staticFile("before.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: getAfterOpacity(frame) }}>
        <Img src={staticFile("after.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
      </AbsoluteFill>

      {/* ── Stage 1: Pin ignites ──────────────────────── */}
      <PinIgnition frame={frame} />

      {/* ── Stage 2: Energy travels along threads ──────── */}
      <EnergyThread frame={frame} path={THREAD_TO_PANEL}
        startFrame={THREAD1_START} endFrame={THREAD1_END} />
      <EnergyThread frame={frame} path={THREAD_TO_STORE}
        startFrame={THREAD2_START} endFrame={THREAD2_END} />

      {/* ── Stage 3: Elements snap on ──────────────────── */}
      <ElementFlash frame={frame} startFrame={PANEL_FLASH_START}
        centerX={PANEL_CX} centerY={PANEL_CY} width={PANEL_W} height={PANEL_H} />
      <ElementFlash frame={frame} startFrame={STORE_FLASH_START}
        centerX={STORE_CX} centerY={STORE_CY} width={STORE_W} height={STORE_H} />

      {/* ── Stage 4: Ambient settled state ─────────────── */}
      <Particles  frame={frame} />
      <PulseRings frame={frame} />

    </AbsoluteFill>
  );
};
