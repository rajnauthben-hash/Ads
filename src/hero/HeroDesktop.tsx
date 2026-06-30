import {
  AbsoluteFill,
  Img,
  interpolate,
  Easing,
  useCurrentFrame,
  staticFile,
} from "remotion";

// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════

export const TOTAL_FRAMES = 270;
export const GLOW_COLOR   = "#00D4FF";

// Stage boundaries (frames)
export const STAGE1_END = 54;   // pin ignition
export const STAGE2_END = 135;  // threads travel
export const STAGE3_END = 216;  // elements activate
export const HOLD_END   = 252;  // loop fade starts

// Pin position (fraction of 1920×1080)
export const PIN_X = 0.65;
export const PIN_Y = 0.48;

// Element positions in the after.png (px)
export const PANEL_CX = 1190;
export const PANEL_CY = 175;
export const PANEL_W  = 460;
export const PANEL_H  = 235;

export const STORE_CX = 1110;
export const STORE_CY = 695;
export const STORE_W  = 390;
export const STORE_H  = 270;

// Thread timing
export const THREAD1_START = STAGE1_END;
export const THREAD1_END   = STAGE1_END + 52;
export const THREAD2_START = STAGE1_END + 22;
export const THREAD2_END   = STAGE1_END + 80;

// Flash timing
export const PANEL_FLASH_START = THREAD1_END - 4;
export const STORE_FLASH_START = THREAD2_END - 4;
export const FLASH_DURATION    = 22;

// Particles — 40% fewer, slightly larger/slower → reads more premium
export const PARTICLE_COUNT   = 31;
export const PARTICLE_MAX_OPQ = 0.5;

// Pulse rings
export const RING_MAX_RADIUS = 185;
export const RING_PERIOD     = 58;
export const RING_DURATION   = 52;

// ═══════════════════════════════════════════════════════════════════════

const PIN_PX = PIN_X * 1920;
const PIN_PY = PIN_Y * 1080;

// Ease-out-expo — premium snap feel
const EXPO = Easing.bezier(0.16, 1, 0.3, 1);

const THREAD_TO_PANEL = `M ${PIN_PX} ${PIN_PY} C 1290 390 1230 255 ${PANEL_CX} ${PANEL_CY}`;
const THREAD_TO_STORE = `M ${PIN_PX} ${PIN_PY} C 1310 575 1265 660 ${STORE_CX} ${STORE_CY}`;

// ─── Image crossfade ─────────────────────────────────────────────────
function getAfterOpacity(frame: number): number {
  if (frame <= STAGE1_END) return 0;
  if (frame <= STAGE2_END)
    return interpolate(frame, [STAGE1_END, STAGE2_END], [0, 0.18], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 1, 1),
    });
  if (frame <= STAGE3_END)
    return interpolate(frame, [STAGE2_END, STAGE3_END], [0.18, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: EXPO,
    });
  if (frame <= HOLD_END) return 1;
  return interpolate(frame, [HOLD_END, TOTAL_FRAMES], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 1, 1),
  });
}

// ─── Stage 1: Pin Ignition ───────────────────────────────────────────
// All glow via radial-gradient only — zero boxShadow, zero rectangular artifacts.
const PinIgnition: React.FC<{ frame: number }> = ({ frame }) => {
  const buildUp = interpolate(frame, [0, 22], [0, 1], {
    extrapolateRight: "clamp",
    easing: EXPO,
  });

  const coreScale = interpolate(frame, [0, 18, 28, 40], [0, 1.3, 0.88, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const heartbeat = frame > 22 && frame < STAGE1_END
    ? 0.85 + 0.15 * Math.sin(((frame - 22) / 14) * Math.PI)
    : 1;

  const stageOpacity =
    frame <= STAGE1_END ? buildUp * heartbeat :
    frame <= STAGE2_END ? 0.88 :
    0.55;

  const haloScale = interpolate(frame, [0, STAGE1_END], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.2, 0.64, 1),
  });

  // Dims as after-state takes over
  const glowOpacity = interpolate(
    frame,
    [0, STAGE1_END, STAGE2_END, STAGE3_END],
    [0, 1, 0.75, 0.45],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* Outermost ambient halo — 600×600 radial gradient, transparent at 65%
          so the full 35% margin before the div edge is invisible */}
      <div style={{
        position:     "absolute",
        left:         PIN_PX - 300,
        top:          PIN_PY - 300,
        width:        600,
        height:       600,
        borderRadius: "50%",
        background:   `radial-gradient(circle, rgba(0,212,255,0.20) 0%, rgba(0,212,255,0.05) 38%, transparent 65%)`,
        opacity:      glowOpacity * haloScale,
      }} />

      {/* Mid glow — 320×320, transparent at 68% */}
      <div style={{
        position:     "absolute",
        left:         PIN_PX - 160,
        top:          PIN_PY - 160,
        width:        320,
        height:       320,
        borderRadius: "50%",
        background:   `radial-gradient(circle, rgba(0,212,255,0.50) 0%, rgba(0,212,255,0.14) 38%, transparent 68%)`,
        opacity:      stageOpacity * haloScale,
      }} />

      {/* Solid core dot — no boxShadow, no hard rectangular shadow artifact */}
      <div style={{
        position:     "absolute",
        left:         PIN_PX - 8,
        top:          PIN_PY - 8,
        width:        16,
        height:       16,
        borderRadius: "50%",
        background:   GLOW_COLOR,
        opacity:      stageOpacity,
        scale:        coreScale.toString(),
      }} />
    </div>
  );
};

// ─── Stage 2: Energy Thread ──────────────────────────────────────────
// Two layers only: dim static trail + single traveling pulse with
// SVG feGaussianBlur glow. No competing stroke stacks.
interface EnergyThreadProps {
  frame:      number;
  path:       string;
  startFrame: number;
  endFrame:   number;
  filterId:   string;
}

const EnergyThread: React.FC<EnergyThreadProps> = ({
  frame, path, startFrame, endFrame, filterId,
}) => {
  const f        = frame - startFrame;
  const duration = endFrame - startFrame;
  const progress = Math.max(0, Math.min(1, f / duration));

  if (f < 0) return null;

  const PULSE_LEN = 0.12;

  const dashOffset = interpolate(progress, [0, 1], [PULSE_LEN, -(1 - PULSE_LEN)], {
    easing: EXPO,
  });

  const pulseOpacity = interpolate(
    f,
    [0, 5, duration - 5, duration + 4],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const trailOpacity = interpolate(f, [0, 10], [0, 0.18], { extrapolateRight: "clamp" });

  return (
    <svg
      viewBox="0 0 1920 1080"
      width="1920" height="1080"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        {/* Soft glow via blur merge — one single clean light source */}
        <filter id={filterId} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Dim static trail — shows the thread exists */}
      <path
        d={path} fill="none"
        stroke={GLOW_COLOR} strokeWidth={1}
        opacity={trailOpacity}
        strokeLinecap="round"
      />

      {/* Single traveling bright pulse, glow from filter not from stacked strokes */}
      <path
        d={path} fill="none"
        stroke={GLOW_COLOR} strokeWidth={2.5}
        pathLength={1}
        strokeDasharray={`${PULSE_LEN} ${1 - PULSE_LEN}`}
        strokeDashoffset={dashOffset}
        opacity={pulseOpacity}
        strokeLinecap="round"
        filter={`url(#${filterId})`}
      />
    </svg>
  );
};

// ─── Stage 3: Element Activation Flash ───────────────────────────────
// Div sized 1.6× element so the radial-gradient reaches transparent (62%)
// well before the div boundary — zero visible box edge at any opacity.
interface ElementFlashProps {
  frame:      number;
  startFrame: number;
  centerX:    number;
  centerY:    number;
  width:      number;
  height:     number;
}

const ElementFlash: React.FC<ElementFlashProps> = ({
  frame, startFrame, centerX, centerY, width, height,
}) => {
  const f   = frame - startFrame;
  const END = FLASH_DURATION + 28;
  if (f < 0 || f > END) return null;

  // Fast attack (4 frames) → slow exponential decay (breathe out)
  const opacity =
    f <= 4
      ? interpolate(f, [0, 4], [0, 1], {
          extrapolateRight: "clamp",
          easing: Easing.bezier(0, 0, 0.2, 1),
        })
      : interpolate(f, [4, END], [1, 0], {
          extrapolateLeft:  "clamp",
          extrapolateRight: "clamp",
          // ease-in on the decay = stays bright, then fades off
          easing: Easing.bezier(0.4, 0, 0.8, 0),
        });

  // Div 1.6× element so gradient's transparent stop (62%) lands at element edge
  const dw = width  * 1.6;
  const dh = height * 1.6;

  // Scan line sweeps down during the flash burst only
  const scanProgress = Math.min(1, f / FLASH_DURATION);
  const scanY = centerY - height / 2 + scanProgress * height;
  const scanOpacity = f > 0 && f <= FLASH_DURATION
    ? interpolate(f, [0, 4, FLASH_DURATION], [0, 0.55, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      })
    : 0;

  return (
    <>
      {/* Radial flash — transparent at 62%, div extends 38% further = fully invisible edge */}
      <div style={{
        position:      "absolute",
        left:          centerX - dw / 2,
        top:           centerY - dh / 2,
        width:         dw,
        height:        dh,
        background:    `radial-gradient(ellipse at 50% 50%,
          rgba(255,255,255,0.82) 0%,
          rgba(0,212,255,0.52)  18%,
          rgba(0,212,255,0.12)  42%,
          transparent           62%)`,
        opacity,
        mixBlendMode:  "screen" as const,
        pointerEvents: "none",
      }} />

      {/* Single-pixel scan line — clean activation read */}
      {scanOpacity > 0 && (
        <div style={{
          position:      "absolute",
          left:          centerX - width / 2,
          top:           scanY,
          width,
          height:        2,
          background:    `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.75) 30%, rgba(255,255,255,0.75) 70%, transparent 100%)`,
          opacity:       scanOpacity,
          mixBlendMode:  "screen" as const,
          pointerEvents: "none",
        }} />
      )}
    </>
  );
};

// ─── Stage 4: Particles ──────────────────────────────────────────────
// No boxShadow — glow built into a radial-gradient div 4× the dot size.
// Confined to right 64% of frame (xPct ≥ 36%) to keep left text zone clean.
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  xPct:       36 + ((i * 2.618) % 1) * 60,
  baseYPct:   ((i * 1.618) % 1) * 110,
  speedPct:   0.010 + (i % 7) * 0.003,    // slower = more premium
  size:       2.5 + (i % 5) * 1.3,        // slightly larger
  maxOpacity: PARTICLE_MAX_OPQ * (0.5 + (i % 5) * 0.1),
  twinkleOff: (i * 41) % 80,
}));

const Particles: React.FC<{ frame: number }> = ({ frame }) => {
  const speedMult = interpolate(
    frame,
    [STAGE1_END, STAGE2_END, STAGE3_END, HOLD_END],
    [0.3, 1.5, 1.1, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const layerOpacity = interpolate(
    frame,
    [STAGE1_END, STAGE2_END, STAGE3_END, HOLD_END, TOTAL_FRAMES],
    [0, 0.5, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (layerOpacity < 0.01) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: layerOpacity }}>
      {PARTICLES.map((p, i) => {
        const drift   = (frame * p.speedPct * speedMult) % 110;
        const yPct    = ((p.baseYPct - drift) + 110) % 110;
        const twinkle = 0.6 + 0.4 * Math.sin(((frame + p.twinkleOff) / 45) * Math.PI);
        const s       = p.size;
        const alpha   = p.maxOpacity * twinkle;

        return (
          <div
            key={i}
            style={{
              position:     "absolute",
              left:         `${p.xPct}%`,
              top:          `${yPct}%`,
              // 4× size div: visible glow dissipates at 70%, 30% invisible margin
              width:        s * 4,
              height:       s * 4,
              borderRadius: "50%",
              background:   `radial-gradient(circle, rgba(0,212,255,${alpha.toFixed(3)}) 0%, rgba(0,212,255,${(alpha * 0.25).toFixed(3)}) 35%, transparent 70%)`,
              transform:    "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Stage 4: Pulse Rings ────────────────────────────────────────────
// One clean ring per pulse — no inner halo stacking.
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
      <svg
        viewBox="0 0 1920 1080"
        width="1920" height="1080"
        style={{ position: "absolute", inset: 0 }}
      >
        {Array.from({ length: RING_COUNT }, (_, i) => {
          const localF = (elapsed - i * RING_PERIOD) % (RING_PERIOD * RING_COUNT);
          if (localF < 0 || localF > RING_DURATION) return null;

          const t       = localF / RING_DURATION;
          const r       = interpolate(t, [0, 1], [18, RING_MAX_RADIUS], { easing: EXPO });
          const opacity = interpolate(t, [0, 0.15, 1], [0, 0.72, 0]);
          const sw      = interpolate(t, [0, 1], [2.5, 0.4]);

          return (
            <circle
              key={i}
              cx={PIN_PX} cy={PIN_PY} r={r}
              fill="none"
              stroke={GLOW_COLOR}
              strokeWidth={sw}
              opacity={opacity}
            />
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

      {/* Base images — camera locked, zero transform */}
      <AbsoluteFill>
        <Img
          src={staticFile("before.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: getAfterOpacity(frame) }}>
        <Img
          src={staticFile("after.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
      </AbsoluteFill>

      {/* Stage 1: pin ignites */}
      <PinIgnition frame={frame} />

      {/* Stage 2: energy travels along threads */}
      <EnergyThread
        frame={frame} path={THREAD_TO_PANEL}
        startFrame={THREAD1_START} endFrame={THREAD1_END}
        filterId="glow-panel"
      />
      <EnergyThread
        frame={frame} path={THREAD_TO_STORE}
        startFrame={THREAD2_START} endFrame={THREAD2_END}
        filterId="glow-store"
      />

      {/* Stage 3: elements snap on */}
      <ElementFlash
        frame={frame} startFrame={PANEL_FLASH_START}
        centerX={PANEL_CX} centerY={PANEL_CY}
        width={PANEL_W}   height={PANEL_H}
      />
      <ElementFlash
        frame={frame} startFrame={STORE_FLASH_START}
        centerX={STORE_CX} centerY={STORE_CY}
        width={STORE_W}    height={STORE_H}
      />

      {/* Stage 4: ambient settled state */}
      <Particles  frame={frame} />
      <PulseRings frame={frame} />

    </AbsoluteFill>
  );
};
