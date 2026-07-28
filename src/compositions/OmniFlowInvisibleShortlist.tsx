import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { ImagePlate } from "../components/ImagePlate";
import { COLORS } from "../styles/tokens";
import { Pt, pointAtLength } from "../utils/routeGeometry";

/**
 * OmniFlowInvisibleShortlist — the six approved source renders are the locked
 * visuals (each scene is identical to its image). Motion is layered on top to
 * make it a fully fluid, high-end film rather than a slideshow:
 *   - a distinct cinematic camera move per scene (push / pull / drift),
 *   - a punch-in reveal at every scene start and a push-through at every end,
 *   - comet-tail customer-signal pulses flowing along the routes,
 *   - animated search-node pings,
 *   - a cyan signal-flash that swaps scenes inside the light.
 */

interface Cam {
  scale: number;
  x: number;
  y: number;
}
interface SceneCfg {
  img: string;
  start: number;
  end: number;
  from: Cam; // camera at scene start
  to: Cam; // camera at scene end
  routes: Pt[][];
  nodes: Pt[];
}

// Frame ranges: s1 0–119, s2 120–249, s3 250–379, s4 380–504, s5 505–649, s6 650–779.
const SCENES: SceneCfg[] = [
  {
    img: "reference/scene1.png",
    start: 0,
    end: 119,
    from: { scale: 1.05, x: -14, y: 20 },
    to: { scale: 1.12, x: 34, y: -18 },
    routes: [
      [
        { x: 165, y: 915 },
        { x: 275, y: 1010 },
        { x: 250, y: 1105 },
        { x: 320, y: 1185 },
        { x: 300, y: 1285 },
        { x: 400, y: 1330 },
        { x: 560, y: 1430 },
        { x: 760, y: 1560 },
        { x: 950, y: 1700 },
      ],
    ],
    nodes: [
      { x: 160, y: 910 },
      { x: 560, y: 893 },
      { x: 243, y: 1290 },
    ],
  },
  {
    img: "reference/scene2.png",
    start: 120,
    end: 249,
    from: { scale: 1.13, x: 30, y: -26 },
    to: { scale: 1.05, x: 0, y: 16 },
    routes: [
      [
        { x: 555, y: 985 },
        { x: 555, y: 1200 },
        { x: 545, y: 1330 },
        { x: 545, y: 1420 },
      ],
    ],
    nodes: [{ x: 555, y: 980 }],
  },
  {
    img: "reference/scene3.png",
    start: 250,
    end: 379,
    from: { scale: 1.07, x: -34, y: 6 },
    to: { scale: 1.12, x: 30, y: -8 },
    routes: [
      [
        { x: 360, y: 1420 },
        { x: 430, y: 1480 },
        { x: 520, y: 1430 },
        { x: 545, y: 1300 },
        { x: 545, y: 1000 },
      ],
    ],
    nodes: [],
  },
  {
    img: "reference/scene4.png",
    start: 380,
    end: 504,
    from: { scale: 1.06, x: 24, y: -20 },
    to: { scale: 1.13, x: 6, y: 22 },
    routes: [
      [
        { x: 150, y: 1000 },
        { x: 340, y: 990 },
        { x: 540, y: 1010 },
        { x: 640, y: 1000 },
        { x: 720, y: 970 },
      ],
    ],
    nodes: [],
  },
  {
    img: "reference/scene5.png",
    start: 505,
    end: 649,
    from: { scale: 1.13, x: 0, y: -30 },
    to: { scale: 1.05, x: 0, y: 22 },
    routes: [
      [
        { x: 540, y: 1050 },
        { x: 540, y: 1520 },
      ],
    ],
    nodes: [],
  },
  {
    img: "reference/scene6.png",
    start: 650,
    end: 779,
    from: { scale: 1.05, x: 20, y: 14 },
    to: { scale: 1.14, x: 34, y: -14 },
    routes: [
      [
        { x: 95, y: 800 },
        { x: 200, y: 800 },
        { x: 320, y: 900 },
        { x: 400, y: 960 },
        { x: 360, y: 1080 },
        { x: 320, y: 1180 },
        { x: 380, y: 1290 },
        { x: 560, y: 1330 },
        { x: 700, y: 1230 },
        { x: 770, y: 1120 },
      ],
    ],
    nodes: [
      { x: 152, y: 642 },
      { x: 578, y: 672 },
      { x: 250, y: 1058 },
    ],
  },
];

const MOUNT_LEAD = 10;

// ---- comet-tail signal pulse -------------------------------------------------
const Comet: React.FC<{ points: Pt[]; t: number; hue?: string; size?: number }> = ({
  points,
  t,
  hue = COLORS.cyan,
  size = 8,
}) => {
  const tail = 7;
  const step = 0.02;
  const dots = [];
  for (let i = tail; i >= 0; i--) {
    const tt = t - i * step;
    if (tt < 0 || tt > 1) continue;
    const p = pointAtLength(points, tt);
    const f = 1 - i / (tail + 1);
    dots.push(
      <circle key={`t${i}`} cx={p.x} cy={p.y} r={size * (0.35 + f * 0.65)} fill={hue} opacity={0.06 + f * 0.22} />,
    );
  }
  const head = pointAtLength(points, Math.max(0, Math.min(1, t)));
  return (
    <g>
      {dots}
      <circle cx={head.x} cy={head.y} r={size * 1.9} fill={hue} opacity={0.22} style={{ filter: "blur(5px)" }} />
      <circle cx={head.x} cy={head.y} r={size} fill="#ffffff" opacity={0.95} />
      <circle cx={head.x} cy={head.y} r={size * 0.55} fill={hue} />
    </g>
  );
};

const NodePing: React.FC<{ at: Pt; frame: number; start: number }> = ({ at, frame, start }) => {
  const local = frame - start;
  const period = 44;
  const p = (((local % period) + period) % period) / period;
  const r = interpolate(p, [0, 1], [9, 42]);
  const op = interpolate(p, [0, 0.12, 1], [0, 0.55, 0]);
  return (
    <>
      <circle cx={at.x} cy={at.y} r={r} fill="none" stroke={COLORS.cyan} strokeWidth={2.6} opacity={op} />
      <circle cx={at.x} cy={at.y} r={r * 0.6} fill="none" stroke={COLORS.cyan} strokeWidth={1.6} opacity={op * 0.6} />
    </>
  );
};

const SignalFlash: React.FC<{ frame: number; start: number }> = ({ frame, start }) => {
  if (start === 0) return null;
  const op = interpolate(frame, [start - 7, start - 1, start + 6], [0, 0.95, 0], {
    easing: Easing.inOut(Easing.ease),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
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

  const opacity = cfg.start === 0 ? 1 : interpolate(frame, [cfg.start - 2, cfg.start], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // cinematic base move across the scene
  const ease = Easing.inOut(Easing.cubic);
  const base = (a: number, b: number) => interpolate(frame, [cfg.start, cfg.end], [a, b], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  let scale = base(cfg.from.scale, cfg.to.scale);
  const x = base(cfg.from.x, cfg.to.x);
  const y = base(cfg.from.y, cfg.to.y);

  // punch-in reveal at start, push-through at end
  const intro = interpolate(frame, [cfg.start, cfg.start + 14], [1.07, 1.0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outro = interpolate(frame, [cfg.end - 9, cfg.end + 1], [1.0, 1.06], { easing: Easing.in(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  scale = scale * intro * outro;

  const dur = cfg.end - cfg.start;
  const pulseT = ((frame - cfg.start) % 66) / 66;
  const pulseT2 = ((frame - cfg.start + 33) % 66) / 66;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity }}>
        <ImagePlate src={cfg.img} scale={scale} x={x} y={y} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, transform: `translate(${x}px, ${y}px) scale(${scale})`, transformOrigin: "center center" }}>
          {cfg.nodes.map((n, i) => (
            <NodePing key={i} at={n} frame={frame} start={cfg.start} />
          ))}
          {cfg.routes.map((r, i) => (
            <g key={i}>
              <Comet points={r} t={pulseT} />
              {dur > 40 && <Comet points={r} t={pulseT2} size={7} />}
            </g>
          ))}
        </svg>
      </AbsoluteFill>
      <SignalFlash frame={frame} start={cfg.start} />
    </AbsoluteFill>
  );
};

export const OmniFlowInvisibleShortlist: React.FC<{ dev?: boolean }> = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      {SCENES.map((cfg) => (
        <Scene key={cfg.img} cfg={cfg} />
      ))}
    </AbsoluteFill>
  );
};
