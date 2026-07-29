import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { ImagePlate } from "../components/ImagePlate";
import { MovingPulse } from "../components/SignalRoute";
import { Atmosphere } from "../components/Atmosphere";
import { COLORS } from "../styles/tokens";
import { Pt } from "../utils/routeGeometry";

/**
 * OmniFlowInvisibleShortlist — the six approved renders are the locked visuals
 * (each scene is identical to its image). They are directed into a fluid film,
 * not a slideshow:
 *   - a distinct cinematic camera move per scene (push / pull / drift) with a
 *     punch-in reveal and a push-through at the end,
 *   - the scene's own copy materialises behind a travelling cyan SCAN line
 *     (the identical baked text, revealed — never a static hold),
 *   - comet-tail customer-signal pulses flowing along the routes,
 *   - search-node pings, drifting atmosphere,
 *   - a cyan signal-flash that swaps scenes inside the light.
 */

interface Zone {
  x: number;
  y: number;
  w: number;
  h: number;
  in: number; // reveal start offset from scene start
  dur: number; // reveal duration
}
interface SceneCfg {
  img: string;
  start: number;
  end: number;
  from: { scale: number; x: number; y: number };
  to: { scale: number; x: number; y: number };
  reveals: Zone[]; // baked-text regions scanned in
  routes: Pt[][];
  nodes: Pt[];
}

const SCENES: SceneCfg[] = [
  {
    img: "reference/scene1.png",
    start: 0,
    end: 119,
    from: { scale: 1.04, x: -12, y: 18 },
    to: { scale: 1.11, x: 30, y: -16 },
    reveals: [
      { x: 40, y: 150, w: 1010, h: 340, in: 4, dur: 30 },
      { x: 40, y: 470, w: 820, h: 250, in: 34, dur: 22 },
    ],
    routes: [[
      { x: 165, y: 915 }, { x: 275, y: 1010 }, { x: 250, y: 1105 }, { x: 320, y: 1185 },
      { x: 300, y: 1285 }, { x: 400, y: 1330 }, { x: 560, y: 1430 }, { x: 760, y: 1560 }, { x: 950, y: 1700 },
    ]],
    nodes: [{ x: 160, y: 910 }, { x: 560, y: 893 }, { x: 243, y: 1290 }],
  },
  {
    img: "reference/scene2.png",
    start: 120,
    end: 249,
    from: { scale: 1.12, x: 26, y: -22 },
    to: { scale: 1.05, x: 0, y: 14 },
    reveals: [
      { x: 40, y: 150, w: 1010, h: 300, in: 4, dur: 28 },
      { x: 40, y: 470, w: 840, h: 215, in: 30, dur: 20 },
    ],
    routes: [[{ x: 555, y: 985 }, { x: 555, y: 1200 }, { x: 545, y: 1330 }, { x: 545, y: 1420 }]],
    nodes: [{ x: 555, y: 980 }],
  },
  {
    img: "reference/scene3.png",
    start: 250,
    end: 379,
    from: { scale: 1.06, x: -30, y: 4 },
    to: { scale: 1.11, x: 26, y: -6 },
    reveals: [
      { x: 40, y: 150, w: 1010, h: 300, in: 4, dur: 30 },
      { x: 40, y: 440, w: 880, h: 215, in: 32, dur: 20 },
    ],
    routes: [[{ x: 545, y: 1300 }, { x: 545, y: 1050 }]],
    nodes: [],
  },
  {
    img: "reference/scene4.png",
    start: 380,
    end: 504,
    from: { scale: 1.05, x: 22, y: -18 },
    to: { scale: 1.12, x: 6, y: 20 },
    reveals: [{ x: 40, y: 150, w: 660, h: 700, in: 4, dur: 60 }],
    routes: [[{ x: 150, y: 1000 }, { x: 340, y: 990 }, { x: 540, y: 1010 }, { x: 640, y: 1000 }, { x: 720, y: 970 }]],
    nodes: [],
  },
  {
    img: "reference/scene5.png",
    start: 505,
    end: 649,
    from: { scale: 1.12, x: 0, y: -26 },
    to: { scale: 1.05, x: 0, y: 20 },
    reveals: [
      { x: 40, y: 150, w: 1010, h: 300, in: 4, dur: 28 },
      { x: 40, y: 410, w: 840, h: 235, in: 30, dur: 22 },
    ],
    routes: [[{ x: 540, y: 1050 }, { x: 540, y: 1520 }]],
    nodes: [],
  },
  {
    img: "reference/scene6.png",
    start: 650,
    end: 779,
    from: { scale: 1.05, x: 20, y: 12 },
    to: { scale: 1.12, x: 30, y: -12 },
    reveals: [
      { x: 40, y: 150, w: 1010, h: 300, in: 4, dur: 28 },
      { x: 40, y: 420, w: 840, h: 205, in: 30, dur: 20 },
    ],
    routes: [[
      { x: 95, y: 800 }, { x: 200, y: 800 }, { x: 320, y: 900 }, { x: 400, y: 960 }, { x: 360, y: 1080 },
      { x: 320, y: 1180 }, { x: 380, y: 1290 }, { x: 560, y: 1330 }, { x: 700, y: 1230 }, { x: 770, y: 1120 },
    ]],
    nodes: [{ x: 152, y: 642 }, { x: 578, y: 672 }, { x: 250, y: 1058 }],
  },
];

const MOUNT_LEAD = 10;

/** Reveal a baked-text region behind a travelling cyan scan line. */
const ScanReveal: React.FC<{ z: Zone; frame: number; start: number }> = ({ z, frame, start }) => {
  const p = interpolate(frame, [start + z.in, start + z.in + z.dur], [0, 1], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (p >= 1) return null; // fully revealed -> nothing to draw
  const lineY = z.y + p * z.h;
  return (
    <>
      {/* black cover over the not-yet-revealed lower part (baked text hidden) */}
      <div style={{ position: "absolute", left: z.x, top: lineY, width: z.w, height: z.h - p * z.h, background: COLORS.background }} />
      {/* cyan scan line at the reveal edge */}
      <div
        style={{
          position: "absolute", left: z.x, top: lineY - 1.5, width: z.w, height: 3,
          background: "linear-gradient(90deg, rgba(18,211,238,0) 0%, rgba(34,211,238,0.95) 50%, rgba(18,211,238,0) 100%)",
          boxShadow: "0 0 18px rgba(18,211,238,0.75)",
          opacity: p > 0 ? 1 : 0,
        }}
      />
    </>
  );
};

const NodePing: React.FC<{ at: Pt; frame: number; start: number }> = ({ at, frame, start }) => {
  const p = ((((frame - start) % 44) + 44) % 44) / 44;
  const r = interpolate(p, [0, 1], [9, 42]);
  const op = interpolate(p, [0, 0.12, 1], [0, 0.55, 0]);
  return (
    <>
      <circle cx={at.x} cy={at.y} r={r} fill="none" stroke={COLORS.cyan} strokeWidth={2.6} opacity={op} />
      <circle cx={at.x} cy={at.y} r={r * 0.58} fill="none" stroke={COLORS.cyan} strokeWidth={1.6} opacity={op * 0.6} />
    </>
  );
};

const SignalFlash: React.FC<{ frame: number; start: number }> = ({ frame, start }) => {
  if (start === 0) return null;
  const op = interpolate(frame, [start - 7, start - 1, start + 6], [0, 0.95, 0], { easing: Easing.inOut(Easing.ease), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (op <= 0.001) return null;
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="flash" cx="50%" cy="46%" r="85%">
            <stop offset="0%" stopColor="rgba(80,225,248,1)" />
            <stop offset="60%" stopColor="rgba(24,180,215,0.92)" />
            <stop offset="100%" stopColor="rgba(9,60,85,0.55)" />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={1080} height={1920} fill="url(#flash)" />
      </svg>
    </AbsoluteFill>
  );
};

const Scene: React.FC<{ cfg: SceneCfg }> = ({ cfg }) => {
  const frame = useCurrentFrame();
  if (frame < cfg.start - MOUNT_LEAD || frame > cfg.end + 1) return null;
  const s = cfg.start;

  const opacity = s === 0 ? 1 : interpolate(frame, [s - 2, s], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const ease = Easing.inOut(Easing.cubic);
  const base = (a: number, b: number) => interpolate(frame, [s, cfg.end], [a, b], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const intro = interpolate(frame, [s, s + 14], [1.06, 1.0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outro = interpolate(frame, [cfg.end - 9, cfg.end + 1], [1.0, 1.05], { easing: Easing.in(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = base(cfg.from.scale, cfg.to.scale) * intro * outro;
  const x = base(cfg.from.x, cfg.to.x);
  const y = base(cfg.from.y, cfg.to.y);
  const camT = `translate(${x}px, ${y}px) scale(${scale})`;

  const dur = cfg.end - s;
  const pulseT = ((frame - s) % 66) / 66;
  const pulseT2 = ((frame - s + 33) % 66) / 66;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity }}>
        <ImagePlate src={cfg.img} scale={scale} x={x} y={y} />
        <AbsoluteFill style={{ transform: camT, transformOrigin: "center center" }}>
          {cfg.reveals.map((z, i) => (
            <ScanReveal key={i} z={z} frame={frame} start={s} />
          ))}
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            {cfg.nodes.map((n, i) => (
              <NodePing key={i} at={n} frame={frame} start={s} />
            ))}
            {cfg.routes.map((r, i) => (
              <g key={i}>
                <MovingPulse points={r} t={pulseT} size={8} />
                {dur > 40 && <MovingPulse points={r} t={pulseT2} size={7} />}
              </g>
            ))}
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
      <SignalFlash frame={frame} start={s} />
    </AbsoluteFill>
  );
};

export const OmniFlowInvisibleShortlist: React.FC<{ dev?: boolean }> = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      {SCENES.map((cfg) => (
        <Scene key={cfg.img} cfg={cfg} />
      ))}
      <div style={{ position: "absolute", inset: 0, zIndex: 40, pointerEvents: "none" }}>
        <Atmosphere count={40} opacity={0.85} />
      </div>
    </AbsoluteFill>
  );
};
