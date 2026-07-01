import { useCurrentFrame, spring, interpolate } from "remotion";
import { COLORS, COPY, FONT, W, H, SPRING } from "../config";

const DRIFTERS = Array.from({ length: 16 }, (_, i) => {
  const phi   = (i * 0.618033988) % 1;
  const theta = (i * 0.381966011) % 1;
  return {
    x:     70 + phi * (W - 140),
    y:     70 + theta * (H - 140),
    r:     1.2 + phi * 2.2,
    phase: phi * Math.PI * 2,
  };
});

export const LockupScene: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-44

  const logoScale = spring({ frame,           fps: 30, config: SPRING.calm,   durationInFrames: 38 });
  const nameIn    = spring({ frame: frame - 8,  fps: 30, config: SPRING.snappy, durationInFrames: 24 });
  const taglineIn = spring({ frame: frame - 18, fps: 30, config: SPRING.snappy, durationInFrames: 24 });
  const handleIn  = spring({ frame: frame - 28, fps: 30, config: SPRING.snappy, durationInFrames: 24 });

  const logoGlow  = 0.5 + 0.5 * Math.sin(frame * 0.13);
  const vigOpacity = interpolate(frame, [0, 22], [0, 0.5], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div style={{
      width: W, height: H,
      position: "relative", overflow: "hidden", fontFamily: FONT,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>

      {/* ── Ambient drifters ──────────────────────────────────────────── */}
      {DRIFTERS.map((d, i) => (
        <div key={i} style={{
          position:     "absolute",
          left:         d.x + Math.sin(frame * 0.028 + d.phase) * 14,
          top:          d.y + Math.cos(frame * 0.021 + d.phase) * 10,
          width:        d.r * 4,
          height:       d.r * 4,
          borderRadius: "50%",
          background:   "radial-gradient(circle, rgba(0,229,255,0.17) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
      ))}

      {/* ── Logo SVG ──────────────────────────────────────────────────── */}
      <div style={{
        transform:       `scale(${logoScale})`,
        transformOrigin: "center",
        marginBottom:    52,
        filter:          `drop-shadow(0 0 ${16 + logoGlow * 24}px rgba(249,158,11,${0.28 + logoGlow * 0.26}))`,
      }}>
        <svg width="180" height="180" viewBox="0 0 200 200" fill="none">
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#FCD34D" />
              <stop offset="50%"  stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          {/* Outer ring */}
          <circle cx="100" cy="100" r="92" stroke="url(#goldGrad)" strokeWidth="3" />
          {/* Inner ring */}
          <circle cx="100" cy="100" r="82" stroke="url(#goldGrad)" strokeWidth="1" opacity="0.35" />
          {/* Infinity — left loop */}
          <path
            d="M 100,100 C 100,78 80,64 62,74 C 44,84 44,116 62,126 C 80,136 100,122 100,100"
            stroke="url(#goldGrad)" strokeWidth="9"
            strokeLinecap="round" fill="none"
          />
          {/* Infinity — right loop */}
          <path
            d="M 100,100 C 100,78 120,64 138,74 C 156,84 156,116 138,126 C 120,136 100,122 100,100"
            stroke="url(#goldGrad)" strokeWidth="9"
            strokeLinecap="round" fill="none"
          />
          {/* Centre dot */}
          <circle cx="100" cy="100" r="5" fill="url(#goldGrad)" />
        </svg>
      </div>

      {/* ── Brand name ────────────────────────────────────────────────── */}
      <div style={{
        transform:    `translateY(${(1 - nameIn) * 28}px)`,
        opacity:      nameIn,
        textAlign:    "center",
        marginBottom: 22,
      }}>
        <div style={{
          fontSize:      54,
          fontWeight:    700,
          color:         "#FFFFFF",
          letterSpacing: 1,
        }}>
          {COPY.tagline}
        </div>
      </div>

      {/* ── Tagline ───────────────────────────────────────────────────── */}
      <div style={{
        transform:    `translateY(${(1 - taglineIn) * 24}px)`,
        opacity:      taglineIn,
        textAlign:    "center",
        marginBottom: 32,
        padding:      "0 64px",
      }}>
        <div style={{
          fontSize:      30,
          fontWeight:    500,
          color:         "rgba(255,255,255,0.5)",
          letterSpacing: 0.4,
          lineHeight:    1.5,
        }}>
          {COPY.cta}
        </div>
      </div>

      {/* ── Handle ────────────────────────────────────────────────────── */}
      <div style={{
        transform: `translateY(${(1 - handleIn) * 20}px)`,
        opacity:   handleIn,
      }}>
        <div style={{
          fontSize:      30,
          fontWeight:    600,
          color:         COLORS.energy,
          letterSpacing: 1,
        }}>
          {COPY.handle}
        </div>
      </div>

      {/* ── Vignette ──────────────────────────────────────────────────── */}
      <div style={{
        position:   "absolute",
        inset:      0,
        background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 28%, rgba(0,0,0,0.45) 68%, rgba(0,0,0,0.88) 100%)",
        opacity:    vigOpacity,
        pointerEvents: "none",
      }} />
    </div>
  );
};
