import { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../styles";

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const PLANE = 3200;
const CELL = 168;

/**
 * The persistent digital map floor. Rendered once (memoized) and tilted into
 * 2.5D via CSS perspective. Contains the grid, dim extruded building blocks
 * and sparse glowing markers. Mounted for all 480 frames; the camera drifts
 * over it while scene content composites on top.
 */
const MapFloor: React.FC = () => {
  const svg = useMemo(() => {
    const rnd = mulberry32(20260808);
    const lines: React.ReactNode[] = [];
    const blocks: React.ReactNode[] = [];
    const dots: React.ReactNode[] = [];
    const n = Math.floor(PLANE / CELL);

    // grid
    for (let i = 0; i <= n; i++) {
      const q = i * CELL;
      lines.push(
        <line key={`v${i}`} x1={q} y1={0} x2={q} y2={PLANE} stroke={C.grid} strokeWidth={2} opacity={0.45} />,
        <line key={`h${i}`} x1={0} y1={q} x2={PLANE} y2={q} stroke={C.grid} strokeWidth={2} opacity={0.45} />,
      );
    }
    // sparse brighter gold seams
    for (let i = 0; i < 40; i++) {
      const horiz = rnd() > 0.5;
      const a = Math.floor(rnd() * n) * CELL;
      const b = Math.floor(rnd() * n) * CELL;
      const l = CELL * (1 + Math.floor(rnd() * 3));
      lines.push(
        <line
          key={`g${i}`}
          x1={horiz ? a : b}
          y1={horiz ? b : a}
          x2={horiz ? a + l : b}
          y2={horiz ? b : a + l}
          stroke={`rgba(226,167,70,${0.1 + rnd() * 0.14})`}
          strokeWidth={2.6}
        />,
      );
    }

    // extruded blocks (drawn as top face + a short right/bottom edge for depth)
    for (let cy = 0; cy < n; cy++) {
      for (let cx = 0; cx < n; cx++) {
        if (rnd() < 0.55) continue;
        const x = cx * CELL + 22;
        const y = cy * CELL + 22;
        const w = CELL - 44;
        const h = CELL - 44;
        const ext = 10 + rnd() * 22;
        // right/front extrusion edges (toward viewer = down/right after tilt)
        blocks.push(
          <polygon key={`e${cx}-${cy}`} points={`${x + w},${y} ${x + w + ext},${y + ext} ${x + w + ext},${y + h + ext} ${x + w},${y + h}`} fill="#05080B" opacity={0.85} />,
          <polygon key={`f${cx}-${cy}`} points={`${x},${y + h} ${x + w},${y + h} ${x + w + ext},${y + h + ext} ${x + ext},${y + h + ext}`} fill="#04070A" opacity={0.9} />,
          <rect key={`t${cx}-${cy}`} x={x} y={y} width={w} height={h} rx={4} fill={C.surface} stroke="rgba(255,255,255,0.03)" strokeWidth={1.2} opacity={0.9} />,
        );
        if (rnd() < 0.3) {
          blocks.push(<circle key={`w${cx}-${cy}`} cx={x + rnd() * w} cy={y + rnd() * h} r={1.8} fill={C.gold} opacity={0.4 + rnd() * 0.4} />);
        }
      }
    }

    // glowing intersection markers
    for (let i = 0; i < 120; i++) {
      const x = Math.floor(rnd() * n) * CELL;
      const y = Math.floor(rnd() * n) * CELL;
      const cyan = rnd() < 0.28;
      const col = cyan ? C.cyan : C.gold;
      const o = 0.3 + rnd() * 0.6;
      dots.push(
        <g key={`d${i}`}>
          <circle cx={x} cy={y} r={6} fill={col} opacity={o * 0.22} style={{ filter: "blur(4px)" }} />
          <circle cx={x} cy={y} r={2.2} fill={col} opacity={o} />
        </g>,
      );
    }

    return (
      <svg width={PLANE} height={PLANE} viewBox={`0 0 ${PLANE} ${PLANE}`} style={{ display: "block" }}>
        {lines}
        {blocks}
        {dots}
      </svg>
    );
  }, []);

  return <>{svg}</>;
};

/**
 * The tilted map plane. `camX/camY/camScale` come from the master camera and
 * are pre-scaled by this layer's parallax depth by the caller.
 */
export const MapWorld: React.FC<{
  camX: number;
  camY: number;
  camScale: number;
}> = ({ camX, camY, camScale }) => {
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.bg }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "58%",
          width: PLANE,
          height: PLANE,
          marginLeft: -PLANE / 2,
          marginTop: -PLANE / 2,
          transform: `perspective(1400px) rotateX(54deg) rotateZ(-5deg) translate3d(${camX}px, ${camY}px, 0) scale(${1.05 * camScale})`,
          transformStyle: "preserve-3d",
        }}
      >
        <MapFloor />
      </div>

      {/* depth falloff so the plane melts into night at the horizon */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 92% 60% at 50% 44%, transparent 30%, rgba(5,9,13,0.9) 100%)," +
            "linear-gradient(180deg, rgba(5,9,13,0.92) 0%, rgba(5,9,13,0.2) 24%, rgba(5,9,13,0.02) 52%, rgba(5,9,13,0.5) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
