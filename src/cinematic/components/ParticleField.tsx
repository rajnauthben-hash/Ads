import { AbsoluteFill, useCurrentFrame } from "remotion";
import { T } from "../theme";

// Deterministic pseudo-random from index — no Math.random, render-stable.
const rnd = (i: number, salt: number) => {
  const v = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

interface LayerProps {
  count: number;
  size: [number, number];
  opacity: number;
  speed: number;      // upward px/frame
  blur?: number;
  color?: string;
}

const Layer: React.FC<LayerProps> = ({ count, size, opacity, speed, blur = 0, color = T.cyan }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = rnd(i, 1) * 1080;
        const y0 = rnd(i, 2) * 2100;
        const r = size[0] + rnd(i, 3) * (size[1] - size[0]);
        const tw = 0.55 + Math.sin(frame * 0.05 + i * 2.1) * 0.45; // twinkle
        const y = ((y0 - frame * speed) % 2100 + 2100) % 2100 - 90;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: r,
              height: r,
              borderRadius: "50%",
              background: color,
              opacity: opacity * tw,
              filter: blur ? `blur(${blur}px)` : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Three-depth particle field. Wrap each layer in <Parallax> at the call
// site if additional camera separation is desired — the built-in speeds
// already give vertical parallax.
export const ParticleField: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => (
  <>
    <Layer count={26} size={[1.5, 2.5]} opacity={0.13 * intensity} speed={0.14} />
    <Layer count={16} size={[2, 3.5]}   opacity={0.19 * intensity} speed={0.32} />
    <Layer count={9}  size={[3.5, 6]}   opacity={0.15 * intensity} speed={0.6} blur={2.5} />
  </>
);

// Brief electric sparks — for the broken-site void.
export const GlitchSparks: React.FC<{ count?: number }> = ({ count = 10 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = 100 + rnd(i, 7) * 880;
        const y = 260 + rnd(i, 8) * 900;
        const period = 46 + Math.floor(rnd(i, 9) * 70);
        const t = (frame + Math.floor(rnd(i, 10) * period)) % period;
        const on = t < 4;
        const w = 14 + rnd(i, 11) * 30;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              height: 1.6,
              background: `linear-gradient(90deg, transparent, ${T.holo}, transparent)`,
              opacity: on ? 0.7 : 0,
              boxShadow: on ? `0 0 8px ${T.cyan}` : "none",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Organized rising data streams — the "particles become data" beat.
export const DataStreams: React.FC<{ delay?: number; count?: number; opacity?: number }> = ({
  delay = 0,
  count = 9,
  opacity = 0.3,
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const globalOp = Math.min(1, f / 24);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: globalOp }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = 70 + (i * (940 / (count - 1)));
        const h = 130 + rnd(i, 21) * 170;
        const speed = 7 + rnd(i, 22) * 9;
        const span = 2100 + h;
        const y = 1950 - ((f * speed + rnd(i, 23) * span) % span);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 2,
              height: h,
              background: `linear-gradient(180deg, rgba(34,211,238,${opacity}) 0%, transparent 100%)`,
              boxShadow: `0 0 6px rgba(34,211,238,${opacity * 0.5})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Depth fog + film grade — persistent world atmosphere.
export const Atmosphere: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${T.bgDeep} 0%, ${T.bg} 30%, ${T.navy} 78%, ${T.bgDeep} 100%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse 90% 45% at 50% 118%, rgba(34,211,238,0.10) 0%, transparent 62%)",
        pointerEvents: "none",
      }}
    />
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse 70% 38% at 50% -12%, rgba(59,130,246,0.07) 0%, transparent 60%)",
        pointerEvents: "none",
      }}
    />
  </>
);

export const FilmGrade: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse 135% 100% at 50% 50%, transparent 60%, rgba(0,0,0,0.46) 100%)",
        pointerEvents: "none",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.32) 0%, transparent 10%, transparent 91%, rgba(0,0,0,0.32) 100%)",
        pointerEvents: "none",
      }}
    />
  </>
);
