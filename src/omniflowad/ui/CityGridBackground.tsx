import { useMemo } from "react";
import { AbsoluteFill } from "remotion";

/** Deterministic PRNG so every render frame sees the same city. */
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const PLANE = 3000;
const CELL = 214;

/**
 * Dim aerial city: dark building blocks on a warm-lit street grid, tilted
 * into perspective. Rendered once (memoized SVG) and shared by scenes 03–08
 * so scene cuts never reveal a different city.
 */
export const CityGridBackground: React.FC<{
  opacity: number;
  /** global frame — drives an extremely slow continuous drift */
  frame: number;
}> = ({ opacity, frame }) => {
  const svg = useMemo(() => {
    const rnd = mulberry32(20260717);
    const streets: React.ReactNode[] = [];
    const blocks: React.ReactNode[] = [];
    const dots: React.ReactNode[] = [];

    const n = Math.floor(PLANE / CELL);
    for (let i = 0; i <= n; i++) {
      const p = i * CELL;
      streets.push(
        <line key={`v${i}`} x1={p} y1={0} x2={p} y2={PLANE} stroke="rgba(216,162,74,0.10)" strokeWidth={2.6} />,
        <line key={`h${i}`} x1={0} y1={p} x2={PLANE} y2={p} stroke="rgba(216,162,74,0.10)" strokeWidth={2.6} />,
      );
    }

    // Brighter lit street segments
    for (let i = 0; i < 46; i++) {
      const horiz = rnd() > 0.5;
      const a = Math.floor(rnd() * n) * CELL;
      const b = Math.floor(rnd() * n) * CELL;
      const l = CELL * (1 + Math.floor(rnd() * 3));
      streets.push(
        <line
          key={`s${i}`}
          x1={horiz ? a : b}
          y1={horiz ? b : a}
          x2={horiz ? a + l : b}
          y2={horiz ? b : a + l}
          stroke={`rgba(240,180,90,${0.16 + rnd() * 0.2})`}
          strokeWidth={3.4}
          style={{ filter: "blur(1px)" }}
        />,
      );
    }

    // City blocks with faint window lights
    for (let cy = 0; cy < n; cy++) {
      for (let cx = 0; cx < n; cx++) {
        if (rnd() < 0.28) continue;
        const x = cx * CELL + 20;
        const y = cy * CELL + 20;
        const w = CELL - 40;
        const h = CELL - 40;
        blocks.push(
          <rect key={`b${cx}-${cy}`} x={x} y={y} width={w} height={h} rx={7} fill="#0A0E13" stroke="rgba(255,255,255,0.028)" strokeWidth={1.5} />,
        );
        const sub = 1 + Math.floor(rnd() * 2);
        for (let s = 0; s < sub; s++) {
          const sw = 30 + rnd() * (w - 60);
          const sh = 30 + rnd() * (h - 60);
          blocks.push(
            <rect
              key={`b${cx}-${cy}-${s}`}
              x={x + rnd() * (w - sw)}
              y={y + rnd() * (h - sh)}
              width={sw}
              height={sh}
              rx={5}
              fill="#0D1218"
              stroke="rgba(255,255,255,0.02)"
            />,
          );
        }
        if (rnd() < 0.4) {
          const wx = x + rnd() * w;
          const wy = y + rnd() * h;
          for (let d2 = 0; d2 < 3; d2++) {
            blocks.push(
              <circle key={`w${cx}-${cy}-${d2}`} cx={wx + rnd() * 26} cy={wy + rnd() * 26} r={1.6} fill="#E8B25E" opacity={0.25 + rnd() * 0.4} />,
            );
          }
        }
      }
    }

    // Street lights at intersections
    for (let i = 0; i < 150; i++) {
      const x = Math.floor(rnd() * n) * CELL + (rnd() < 0.5 ? 0 : CELL);
      const y = Math.floor(rnd() * n) * CELL;
      const o = 0.35 + rnd() * 0.6;
      dots.push(
        <g key={`d${i}`}>
          <circle cx={x} cy={y} r={6.5} fill="#E8B25E" opacity={o * 0.25} style={{ filter: "blur(4px)" }} />
          <circle cx={x} cy={y} r={2.6} fill="#F5CE8B" opacity={o} />
        </g>,
      );
    }

    return (
      <svg width={PLANE} height={PLANE} viewBox={`0 0 ${PLANE} ${PLANE}`} style={{ display: "block" }}>
        {streets}
        {blocks}
        {dots}
      </svg>
    );
  }, []);

  const drift = frame * 0.055;

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "52%",
          width: PLANE,
          height: PLANE,
          marginLeft: -PLANE / 2,
          marginTop: -PLANE / 2,
          transform: `perspective(1500px) rotateX(53deg) rotateZ(-16deg) translate3d(${-drift * 0.4}px, ${-drift}px, 0) scale(1.18)`,
        }}
      >
        {svg}
      </div>
      {/* depth falloff so the plane melts into the night */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 62% at 50% 46%, transparent 32%, rgba(5,7,10,0.88) 100%), linear-gradient(180deg, rgba(5,7,10,0.85) 0%, rgba(5,7,10,0.18) 26%, rgba(5,7,10,0.05) 55%, rgba(5,7,10,0.42) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
