import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";

// ---------------------------------------------------------------------------
// OmniFlow Digital — "The Local Search Expressway" (image-plate edition)
// The five approved photoreal renders as full-frame plates, brought to life
// with a clean cinematic settle-in, glowing pulses flowing along each route,
// and smooth dissolve transitions. 1080x1920 / 30fps / 600 frames.
// ---------------------------------------------------------------------------

const W = 1080;
const H = 1920;
const SCENE = 120;
const DISS = 18; // dissolve length between scenes

// Scene -> reference plate.
const PLATE: Record<number, string> = {
  1: "refs/d.png", // Has your business felt quieter lately?
  2: "refs/b.png", // A new highway got built.
  3: "refs/a.png", // If you're not on that road, they pass you.
  4: "refs/e.png", // If your info is incomplete, you get bypassed.
  5: "refs/c.png", // Get on the road that's moving.
};

// Route geometry traced over each plate (screen space, 1080x1920). A bright
// pulse travels along each in the customer-flow direction.
type RouteDef = { d: string; period: number; dir: 1 | -1; from: number };
const ROUTES: Record<number, RouteDef[]> = {
  1: [{ d: "M 1090 812 C 950 706 830 690 712 706 C 648 715 604 726 556 742", period: 66, dir: -1, from: 26 }],
  2: [{ d: "M 14 1548 C 226 1470 384 1306 432 1120 C 470 980 544 902 624 802 C 684 722 704 642 762 586", period: 96, dir: 1, from: 26 }],
  3: [{ d: "M 1086 1770 C 946 1500 862 1240 822 1040 C 802 900 824 800 902 720 C 962 664 1012 640 1064 620", period: 84, dir: 1, from: 26 }],
  4: [
    { d: "M 190 1432 C 150 1252 252 1120 362 1050 C 470 982 520 930 560 880 C 640 800 690 690 760 600 C 800 548 822 528 844 520", period: 92, dir: 1, from: 30 },
  ],
  5: [{ d: "M 30 1586 C 258 1524 424 1470 544 1420 C 606 1394 636 1360 626 1332", period: 78, dir: 1, from: 26 }],
};

const PL = 1000;

const Pulse: React.FC<{ d: string; period: number; dir: 1 | -1; localFrom: number; local: number }> = ({
  d,
  period,
  dir,
  localFrom,
  local,
}) => {
  const on = interpolate(local, [localFrom, localFrom + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (on <= 0) return null;
  const f = local - localFrom;
  const prog = ((f / period) * dir % 1 + 1) % 1;
  const off = PL - prog * PL;
  const head = (len: number, color: string, width: number, opacity: number, lead = 0) => (
    <path
      d={d}
      pathLength={PL}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={`${len} ${PL - len}`}
      strokeDashoffset={off + lead}
      opacity={opacity * on}
      filter="url(#realGlow)"
    />
  );
  return (
    <g>
      {head(40, "#DFF6FF", 12, 0.28)}
      {head(24, "#8FEBFF", 7, 0.6)}
      {head(14, "#FFFFFF", 3.5, 0.95)}
    </g>
  );
};

const Scene: React.FC<{ idx: number; start: number }> = ({ idx, start }) => {
  const frame = useCurrentFrame();
  const local = frame - start;

  // Dissolve in (scene 1 starts opaque). Later scenes render above, so no
  // explicit fade-out is needed.
  const opacity = idx === 1 ? 1 : interpolate(local, [-DISS, 0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Clean cinematic settle: start slightly pushed in, ease to the exact plate
  // (scale 1.0) during the reading hold so the held frame equals the reference.
  const scale = interpolate(local, [-DISS, 96], [1.05, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const routes = ROUTES[idx] ?? [];

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 46%" }}>
        <Img src={staticFile(PLATE[idx])} style={{ width: W, height: H, objectFit: "cover" }} />
        <AbsoluteFill>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <defs>
              <filter id="realGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
            </defs>
            {routes.map((r, i) => (
              <Pulse key={i} d={r.d} period={r.period} dir={r.dir} localFrom={r.from} local={local} />
            ))}
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const OmniFlowExpresswayReal: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#04070C" }}>
      {[1, 2, 3, 4, 5].map((idx) => {
        const start = (idx - 1) * SCENE;
        const mountStart = start - DISS;
        const mountEnd = idx === 5 ? 600 : idx * SCENE;
        if (frame < mountStart || frame >= mountEnd) return null;
        return <Scene key={idx} idx={idx} start={start} />;
      })}
    </AbsoluteFill>
  );
};
