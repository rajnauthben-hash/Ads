import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { ImagePlate } from "../components/ImagePlate";
import { MovingPulse, RouteGlow } from "../components/SignalRoute";
import { Atmosphere } from "../components/Atmosphere";
import { COLORS } from "../styles/tokens";
import { Pt } from "../utils/routeGeometry";

/**
 * OmniFlowInvisibleShortlist — the six approved renders are the locked visuals
 * (each scene is identical to its image). They are directed into a fluid film,
 * not a slideshow, with a premium motion language modelled on the reference cut:
 *   - one continuous, gentle cinematic dolly per scene (no punch, no jerk),
 *   - the scene's own copy develops behind a soft, feathered cyan scan (the
 *     identical baked text emerging cleanly — never a hard black wipe),
 *   - the baked signal routes light up and carry luminous travelling packets
 *     with real bloom + motion-blur streaks,
 *   - soft search-node pings, restrained drifting atmosphere,
 *   - a directional cyan light-sweep that carries the eye across each cut.
 */

interface Zone {
  x: number;
  y: number;
  w: number;
  h: number;
  in: number; // reveal start offset from scene start
  dur: number; // reveal duration
}
interface RouteCfg {
  pts: Pt[];
  draw: number; // frames after scene start when the route finishes energising
  period: number; // packet loop period (frames)
}
interface SceneCfg {
  img: string;
  start: number;
  end: number;
  from: { scale: number; x: number; y: number };
  to: { scale: number; x: number; y: number };
  reveals: Zone[]; // baked-text regions developed in
  routes: RouteCfg[];
  nodes: Pt[];
}

const SCENES: SceneCfg[] = [
  {
    img: "reference/scene1.png",
    start: 0,
    end: 119,
    from: { scale: 1.05, x: -8, y: 12 },
    to: { scale: 1.095, x: 22, y: -12 },
    reveals: [
      { x: 40, y: 150, w: 1010, h: 340, in: 6, dur: 34 },
      { x: 40, y: 470, w: 820, h: 250, in: 40, dur: 26 },
    ],
    routes: [
      {
        pts: [
          { x: 165, y: 915 }, { x: 275, y: 1010 }, { x: 250, y: 1105 }, { x: 320, y: 1185 },
          { x: 300, y: 1285 }, { x: 400, y: 1330 }, { x: 560, y: 1430 }, { x: 760, y: 1560 }, { x: 950, y: 1700 },
        ],
        draw: 46,
        period: 78,
      },
    ],
    nodes: [{ x: 160, y: 910 }, { x: 560, y: 893 }, { x: 243, y: 1290 }],
  },
  {
    img: "reference/scene2.png",
    start: 120,
    end: 249,
    from: { scale: 1.09, x: 18, y: -14 },
    to: { scale: 1.05, x: 0, y: 10 },
    reveals: [
      { x: 40, y: 150, w: 1010, h: 300, in: 6, dur: 32 },
      { x: 40, y: 470, w: 840, h: 215, in: 36, dur: 24 },
    ],
    routes: [
      { pts: [{ x: 555, y: 985 }, { x: 555, y: 1200 }, { x: 545, y: 1330 }, { x: 545, y: 1420 }], draw: 40, period: 70 },
    ],
    nodes: [{ x: 555, y: 980 }],
  },
  {
    img: "reference/scene3.png",
    start: 250,
    end: 379,
    from: { scale: 1.05, x: -22, y: 2 },
    to: { scale: 1.095, x: 20, y: -4 },
    reveals: [
      { x: 40, y: 150, w: 1010, h: 300, in: 6, dur: 34 },
      { x: 40, y: 440, w: 880, h: 215, in: 38, dur: 24 },
    ],
    routes: [{ pts: [{ x: 545, y: 1300 }, { x: 545, y: 1050 }], draw: 40, period: 66 }],
    nodes: [],
  },
  {
    img: "reference/scene4.png",
    start: 380,
    end: 504,
    from: { scale: 1.05, x: 16, y: -12 },
    to: { scale: 1.1, x: 4, y: 16 },
    reveals: [{ x: 40, y: 150, w: 660, h: 700, in: 6, dur: 66 }],
    routes: [
      {
        pts: [{ x: 150, y: 1000 }, { x: 340, y: 990 }, { x: 540, y: 1010 }, { x: 640, y: 1000 }, { x: 720, y: 970 }],
        draw: 48,
        period: 72,
      },
    ],
    nodes: [],
  },
  {
    img: "reference/scene5.png",
    start: 505,
    end: 649,
    from: { scale: 1.09, x: 0, y: -18 },
    to: { scale: 1.05, x: 0, y: 16 },
    reveals: [
      { x: 40, y: 150, w: 1010, h: 300, in: 6, dur: 32 },
      { x: 40, y: 410, w: 840, h: 235, in: 36, dur: 26 },
    ],
    routes: [{ pts: [{ x: 540, y: 1050 }, { x: 540, y: 1520 }], draw: 44, period: 74 }],
    nodes: [],
  },
  {
    img: "reference/scene6.png",
    start: 650,
    end: 779,
    from: { scale: 1.05, x: 16, y: 8 },
    to: { scale: 1.1, x: 24, y: -10 },
    reveals: [
      { x: 40, y: 150, w: 1010, h: 300, in: 6, dur: 32 },
      { x: 40, y: 420, w: 840, h: 205, in: 36, dur: 24 },
    ],
    routes: [
      {
        pts: [
          { x: 95, y: 800 }, { x: 200, y: 800 }, { x: 320, y: 900 }, { x: 400, y: 960 }, { x: 360, y: 1080 },
          { x: 320, y: 1180 }, { x: 380, y: 1290 }, { x: 560, y: 1330 }, { x: 700, y: 1230 }, { x: 770, y: 1120 },
        ],
        draw: 52,
        period: 84,
      },
    ],
    nodes: [{ x: 152, y: 642 }, { x: 578, y: 672 }, { x: 250, y: 1058 }],
  },
];

const MOUNT_LEAD = 10;

/**
 * Develop a baked-text region behind a soft, travelling cyan scan. The lower
 * (not-yet-developed) part is masked by a feathered veil — no hard black edge —
 * led by a luminous scan bar with a real bloom. Reads as the copy resolving
 * into focus, the way the reference cut reveals each block.
 */
const ScanReveal: React.FC<{ z: Zone; frame: number; start: number }> = ({ z, frame, start }) => {
  const p = interpolate(frame, [start + z.in, start + z.in + z.dur], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (p >= 1) return null; // fully developed -> nothing to draw
  const lineY = z.y + p * z.h;
  const feather = 70; // soft transparent->veil gradient so text emerges cleanly
  const barFade = interpolate(p, [0, 0.06, 0.85, 1], [0, 1, 1, 0]);
  return (
    <>
      {/* feathered leading edge — transparent at the scan, resolving to veil */}
      <div
        style={{
          position: "absolute",
          left: z.x,
          top: lineY,
          width: z.w,
          height: feather,
          background: `linear-gradient(to bottom, ${COLORS.background}00 0%, ${COLORS.background} 100%)`,
        }}
      />
      {/* solid veil over the still-hidden copy below the feather */}
      <div
        style={{
          position: "absolute",
          left: z.x,
          top: lineY + feather,
          width: z.w,
          height: Math.max(0, z.h - p * z.h - feather),
          background: COLORS.background,
        }}
      />
      {/* luminous scan bar with bloom */}
      <div
        style={{
          position: "absolute",
          left: z.x - 6,
          top: lineY - 1.5,
          width: z.w + 12,
          height: 3,
          background:
            "linear-gradient(90deg, rgba(18,211,238,0) 0%, rgba(120,236,255,0.98) 50%, rgba(18,211,238,0) 100%)",
          boxShadow: "0 0 14px rgba(34,211,238,0.85), 0 0 34px rgba(34,211,238,0.45)",
          opacity: barFade,
        }}
      />
    </>
  );
};

const NodePing: React.FC<{ at: Pt; frame: number; start: number }> = ({ at, frame, start }) => {
  const cyc = 52;
  const p = ((((frame - start) % cyc) + cyc) % cyc) / cyc;
  const r = interpolate(p, [0, 1], [8, 46], { easing: Easing.out(Easing.cubic) });
  const op = interpolate(p, [0, 0.1, 1], [0, 0.5, 0]);
  return (
    <g style={{ mixBlendMode: "screen" }}>
      <circle cx={at.x} cy={at.y} r={r} fill="none" stroke={COLORS.cyan} strokeWidth={2.4} opacity={op} />
      <circle cx={at.x} cy={at.y} r={r * 0.55} fill="none" stroke={COLORS.cyan} strokeWidth={1.5} opacity={op * 0.55} />
      <circle cx={at.x} cy={at.y} r={3.4} fill={COLORS.white} opacity={0.75} style={{ filter: "blur(0.5px)" }} />
    </g>
  );
};

/**
 * Directional cyan light-sweep that carries the cut. A wide, feathered luminous
 * band travels left→right across the seam: at the instant of the swap its core
 * fully covers the frame (masking the change), then its trailing feather wipes
 * off to reveal the incoming scene — a premium light transition, not a flat
 * flood.
 */
const LightSweep: React.FC<{ frame: number; start: number }> = ({ frame, start }) => {
  if (start === 0) return null;
  const win: [number, number] = [start - 7, start + 7];
  if (frame < win[0] || frame > win[1]) return null;
  const sp = interpolate(frame, win, [0, 1], { easing: Easing.inOut(Easing.cubic) });
  const cx = interpolate(sp, [0, 1], [-260, 1340]); // band centre travels across
  const glow = interpolate(sp, [0, 0.5, 1], [0, 0.9, 0]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: -120,
          left: cx - 620,
          width: 1240,
          height: 2160,
          transform: "rotate(11deg)",
          transformOrigin: "center center",
          background:
            "linear-gradient(90deg, rgba(10,17,24,0) 0%, rgba(24,150,190,0.65) 22%, rgba(150,240,255,1) 46%, rgba(150,240,255,1) 54%, rgba(24,150,190,0.65) 78%, rgba(10,17,24,0) 100%)",
        }}
      />
      {/* soft additive bloom lift across the seam */}
      <AbsoluteFill style={{ background: "radial-gradient(60% 42% at 50% 46%, rgba(60,210,240,0.4), rgba(0,0,0,0) 70%)", opacity: glow, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

const Scene: React.FC<{ cfg: SceneCfg }> = ({ cfg }) => {
  const frame = useCurrentFrame();
  if (frame < cfg.start - MOUNT_LEAD || frame > cfg.end + 1) return null;
  const s = cfg.start;

  // Hard cut hidden behind the sweep — snap in on the exact seam frame.
  const opacity = s === 0 ? 1 : frame >= s ? 1 : 0;

  // One continuous, gentle dolly — eased across the whole scene, no punch/pop.
  const ease = Easing.inOut(Easing.cubic);
  const base = (a: number, b: number) =>
    interpolate(frame, [s, cfg.end], [a, b], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // a whisper of settle at entry + drift into the cut, no scale pop
  const settle = interpolate(frame, [s, s + 18], [1.012, 1.0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const push = interpolate(frame, [cfg.end - 10, cfg.end + 1], [1.0, 1.022], { easing: Easing.in(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = base(cfg.from.scale, cfg.to.scale) * settle * push;
  const x = base(cfg.from.x, cfg.to.x);
  const y = base(cfg.from.y, cfg.to.y);
  const camT = `translate(${x}px, ${y}px) scale(${scale})`;

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
            {cfg.routes.map((r, i) => {
              const draw = interpolate(frame, [s + 8, s + r.draw], [0, 1], {
                easing: Easing.out(Easing.cubic),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const head1 = (((frame - s) % r.period) + r.period) % r.period / r.period;
              const head2 = ((((frame - s + r.period * 0.5) % r.period) + r.period) % r.period) / r.period;
              return (
                <g key={i}>
                  <RouteGlow points={r.pts} draw={draw} width={8} opacity={0.34} />
                  <MovingPulse points={r.pts} t={head1} size={9} maxProgress={draw} />
                  <MovingPulse points={r.pts} t={head2} size={7.5} maxProgress={draw} opacity={0.8} />
                </g>
              );
            })}
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
      <LightSweep frame={frame} start={s} />
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
        <Atmosphere count={26} opacity={0.55} />
      </div>
    </AbsoluteFill>
  );
};
