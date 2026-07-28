import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { ImagePlate } from "../components/ImagePlate";
import { MovingPulse } from "../components/SignalRoute";
import { COLORS } from "../styles/tokens";
import { Pt } from "../utils/routeGeometry";

/**
 * OmniFlowInvisibleShortlist — presents the six approved source renders as the
 * environment (so each scene is identical to its image), brought to life with a
 * subtle continuous camera push, travelling cyan customer-signal pulses along
 * the routes, animated search-node "pings", and smooth signal-led transitions.
 *
 * `dev` is kept for API compatibility (no dev overlays here).
 */

interface SceneCfg {
  img: string;
  start: number;
  end: number;
  routes: Pt[][]; // travelling-pulse paths (screen space)
  nodes: Pt[]; // search-node ping centres
}

// Frame ranges: s1 0–119, s2 120–249, s3 250–379, s4 380–504, s5 505–649, s6 650–779.
const SCENES: SceneCfg[] = [
  {
    img: "reference/scene1.png",
    start: 0,
    end: 119,
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

const MOUNT_LEAD = 9; // frames a scene mounts before its start (for the flash)

/**
 * A near-opaque cyan "signal flash" that peaks right at a scene start, fully
 * masking a fast image swap so transitions read as the customer-signal
 * redrawing the scene rather than a photo cross-fade.
 */
const SignalFlash: React.FC<{ frame: number; start: number }> = ({ frame, start }) => {
  if (start === 0) return null;
  const op = interpolate(frame, [start - 7, start - 1, start + 6], [0, 0.94, 0], {
    easing: Easing.inOut(Easing.ease),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (op <= 0.001) return null;
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="flash" cx="50%" cy="48%" r="85%">
            <stop offset="0%" stopColor="rgba(70,220,245,1)" />
            <stop offset="65%" stopColor="rgba(24,180,215,0.9)" />
            <stop offset="100%" stopColor="rgba(10,70,95,0.6)" />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={1080} height={1920} fill="url(#flash)" />
      </svg>
    </AbsoluteFill>
  );
};

const NodePing: React.FC<{ at: Pt; frame: number; start: number }> = ({ at, frame, start }) => {
  const local = frame - start;
  const period = 46;
  const t = ((local % period) + period) % period;
  const p = t / period;
  const r = interpolate(p, [0, 1], [10, 40]);
  const op = interpolate(p, [0, 0.15, 1], [0, 0.5, 0]);
  return (
    <circle cx={at.x} cy={at.y} r={r} fill="none" stroke={COLORS.cyan} strokeWidth={2.4} opacity={op} />
  );
};

const Scene: React.FC<{ cfg: SceneCfg }> = ({ cfg }) => {
  const frame = useCurrentFrame();
  if (frame < cfg.start - MOUNT_LEAD || frame > cfg.end + 1) return null;

  // fast swap (2 frames) fully hidden under the signal flash; stay opaque after
  const opacity = cfg.start === 0 ? 1 : interpolate(frame, [cfg.start - 2, cfg.start], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // subtle continuous push across the scene (Ken-Burns-lite, kept gentle)
  const dur = cfg.end - cfg.start;
  const zoom = interpolate(frame, [cfg.start, cfg.end], [1.0, 1.035], {
    easing: Easing.inOut(Easing.ease),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const py = interpolate(frame, [cfg.start, cfg.end], [6, -6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // pulses travel continuously along the routes
  const pulseT = ((frame - cfg.start) % 60) / 60;
  const pulseT2 = ((frame - cfg.start + 30) % 60) / 60;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity }}>
        <ImagePlate src={cfg.img} scale={zoom} y={py} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {cfg.nodes.map((n, i) => (
            <NodePing key={i} at={n} frame={frame} start={cfg.start} />
          ))}
          {cfg.routes.map((r, i) => (
            <g key={i}>
              <MovingPulse points={r} t={pulseT} size={7} />
              {dur > 40 && <MovingPulse points={r} t={pulseT2} size={6} />}
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
