import React, { useEffect, useRef } from "react";
import { AbsoluteFill, Sequence, continueRender, delayRender, useCurrentFrame } from "remotion";
import { C, SCENES } from "./theme";
import { initPulseFonts } from "./fonts";
import { buildRoute, clamp01, ezInOut, Route } from "./util";
import { Scene01Hook } from "./scenes/Scene01Hook";
import { Scene02Search } from "./scenes/Scene02Search";
import { Scene03Ranking } from "./scenes/Scene03Ranking";
import { Scene04PassedOver } from "./scenes/Scene04PassedOver";
import { Scene05Signals } from "./scenes/Scene05Signals";
import { Scene06Resolution } from "./scenes/Scene06Resolution";
import { ReferenceOverlay } from "./components/ReferenceOverlay";

/**
 * THE PULSE OF LOCAL SEARCH — 1080×1920, 30fps, 450 frames.
 *
 * One living cyan pulse connects all six scenes. During each object-based
 * transition a root-level comet carries the pulse's energy from the
 * outgoing scene's route into the incoming scene's route, so the signal
 * never restarts from zero.
 */

interface Bridge {
  f0: number;
  f1: number;
  route: Route;
}

// Each bridge starts where the previous scene's route ends and lands
// where the next scene's route begins (screen coordinates).
const BRIDGES: Bridge[] = [
  // 01 → 02: route accelerates upward, becomes the search-interface cable
  {
    f0: 84,
    f1: 102,
    route: buildRoute(
      [
        { x: 822, y: 775 },
        { x: 730, y: 470 },
        { x: 430, y: 190 },
        { x: 140, y: 130 },
        { x: 246, y: 308 },
      ],
      80,
    ),
  },
  // 02 → 03: results compress into ranked positions
  {
    f0: 156,
    f1: 172,
    route: buildRoute(
      [
        { x: 320, y: 780 },
        { x: 300, y: 1120 },
        { x: 175, y: 1470 },
      ],
      80,
    ),
  },
  // 03 → 04: ranking routes extend into bypassing traffic
  {
    f0: 216,
    f1: 232,
    route: buildRoute(
      [
        { x: 658, y: 1268 },
        { x: 700, y: 1560 },
        { x: 660, y: 1800 },
        { x: 690, y: 1960 },
      ],
      70,
    ),
  },
  // 04 → 05: bypassing routes collapse toward the storefront / signal hub
  {
    f0: 288,
    f1: 304,
    route: buildRoute(
      [
        { x: 800, y: 300 },
        { x: 640, y: 560 },
        { x: 430, y: 760 },
        { x: 520, y: 600 },
        { x: 556, y: 520 },
      ],
      90,
    ),
  },
  // 05 → 06: five branches merge into one completed customer route
  {
    f0: 366,
    f1: 384,
    route: buildRoute(
      [
        { x: 556, y: 520 },
        { x: 430, y: 900 },
        { x: 300, y: 1280 },
        { x: 305, y: 1700 },
      ],
      90,
    ),
  },
];

const ContinuityPulse: React.FC = () => {
  const frame = useCurrentFrame();
  const active = BRIDGES.find((b) => frame >= b.f0 && frame <= b.f1 + 4);
  if (!active) return null;
  const { f0, f1, route } = active;
  const t = ezInOut(clamp01((frame - f0) / (f1 - f0)));
  const head = route.pointAt(t);
  const L = route.length;
  const trail = 0.3;
  const trailStart = Math.max(0, t - trail);
  const fade = clamp01((frame - f0) / 3) * clamp01((f1 + 4 - frame) / 4);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
      <defs>
        <filter id="bridge-blur" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation={7} />
        </filter>
      </defs>
      {/* trailing energy */}
      <path
        d={route.d}
        fill="none"
        stroke={C.cyan}
        strokeWidth={13}
        strokeLinecap="round"
        opacity={0.22 * fade}
        filter="url(#bridge-blur)"
        strokeDasharray={`${((t - trailStart) * L).toFixed(1)} ${L.toFixed(1)}`}
        strokeDashoffset={(-trailStart * L).toFixed(1)}
      />
      <path
        d={route.d}
        fill="none"
        stroke={C.cyan}
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.85 * fade}
        strokeDasharray={`${((t - trailStart) * L).toFixed(1)} ${L.toFixed(1)}`}
        strokeDashoffset={(-trailStart * L).toFixed(1)}
      />
      {/* comet head */}
      <circle cx={head.x} cy={head.y} r={22} fill={C.cyan} opacity={0.18 * fade} filter="url(#bridge-blur)" />
      <circle cx={head.x} cy={head.y} r={9} fill={C.cyan} opacity={0.55 * fade} />
      <circle cx={head.x} cy={head.y} r={4.5} fill="#EAFBFF" opacity={0.98 * fade} />
    </svg>
  );
};

export const PulseOfLocalSearch15: React.FC = () => {
  const fontHandle = useRef<number | null>(null);
  useEffect(() => {
    fontHandle.current = delayRender("pulse-fonts");
    initPulseFonts().then(() => {
      if (fontHandle.current !== null) continueRender(fontHandle.current);
    });
  }, []);

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      {/* PLANE 1 — matte background with a faint atmosphere, never black-out */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 120% 70% at 60% 30%, rgba(0,210,255,0.045), transparent 60%),
            radial-gradient(ellipse 100% 60% at 30% 85%, rgba(221,174,74,0.035), transparent 65%),
            ${C.bg}`,
        }}
      />

      <Sequence from={SCENES.s1.from} durationInFrames={SCENES.s1.dur}>
        <Scene01Hook />
      </Sequence>
      <Sequence from={SCENES.s2.from} durationInFrames={SCENES.s2.dur}>
        <Scene02Search />
      </Sequence>
      <Sequence from={SCENES.s3.from} durationInFrames={SCENES.s3.dur}>
        <Scene03Ranking />
      </Sequence>
      <Sequence from={SCENES.s4.from} durationInFrames={SCENES.s4.dur}>
        <Scene04PassedOver />
      </Sequence>
      <Sequence from={SCENES.s5.from} durationInFrames={SCENES.s5.dur}>
        <Scene05Signals />
      </Sequence>
      <Sequence from={SCENES.s6.from} durationInFrames={SCENES.s6.dur}>
        <Scene06Resolution />
      </Sequence>

      {/* the pulse that never restarts */}
      <ContinuityPulse />

      {/* subtle constant edge vignette */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(ellipse 105% 85% at 50% 46%, transparent 62%, rgba(4,5,7,0.5) 100%)",
        }}
      />

      {/* DEV ONLY — disabled for the final render */}
      <ReferenceOverlay />
    </AbsoluteFill>
  );
};
