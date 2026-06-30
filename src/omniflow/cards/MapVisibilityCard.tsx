import { useCurrentFrame, interpolate, Easing } from "remotion";
import { C, E } from "../constants";
import { fontFamily } from "../fonts";

const MapGrid: React.FC = () => (
  <svg width="100%" height="100%" style={{ borderRadius: 10 }}>
    <defs>
      <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(107,142,255,0.18)" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="rgba(5,15,40,0.6)" />
    <rect width="100%" height="100%" fill="url(#map-grid)" />
    {/* Abstract road lines */}
    <line x1="30%" y1="0%" x2="30%" y2="100%" stroke="rgba(107,142,255,0.12)" strokeWidth="1.5" />
    <line x1="65%" y1="0%" x2="65%" y2="100%" stroke="rgba(107,142,255,0.09)" strokeWidth="1" />
    <line x1="0%" y1="45%" x2="100%" y2="45%" stroke="rgba(107,142,255,0.12)" strokeWidth="1.5" />
    <line x1="0%" y1="72%" x2="100%" y2="72%" stroke="rgba(107,142,255,0.09)" strokeWidth="1" />
  </svg>
);

export const MapVisibilityCard: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const opacity = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const slideX = interpolate(f, [0, 24], [-40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });

  const pinPulse = interpolate(
    Math.sin(((Math.max(0, frame - delay - 20)) / 30) * Math.PI),
    [-1, 1],
    [0.7, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        fontFamily,
        opacity,
        translate: `${slideX}px 0px`,
        background: C.cardBg,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 20,
        overflow: "hidden",
        width: 320,
        backdropFilter: "blur(20px)",
        boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Map area */}
      <div style={{ height: 110, position: "relative" }}>
        <MapGrid />
        {/* Pin */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            translate: "-50% -50%",
            scale: pinPulse.toString(),
          }}
        >
          <svg width="28" height="36" viewBox="0 0 28 36">
            <path
              d="M14 0C6.27 0 0 6.27 0 14c0 9.75 14 22 14 22S28 23.75 28 14C28 6.27 21.73 0 14 0z"
              fill={C.cyan}
              opacity="0.9"
            />
            <circle cx="14" cy="14" r="5" fill="#050A14" />
          </svg>
          {/* Glow ring */}
          <div
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${C.cyanGlow} 0%, transparent 70%)`,
              opacity: pinPulse,
            }}
          />
        </div>
      </div>
      {/* Label */}
      <div style={{ padding: "16px 20px" }}>
        <div style={{ color: C.white, fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          Local visibility
        </div>
        <div style={{ color: C.cyan, fontSize: 18, fontWeight: 500 }}>
          Google Maps optimized
        </div>
      </div>
    </div>
  );
};
