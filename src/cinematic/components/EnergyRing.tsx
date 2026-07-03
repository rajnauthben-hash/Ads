import { useCurrentFrame, interpolate, Easing } from "remotion";
import { T, EO } from "../theme";

// Glowing floor portal — two elliptical rings + optional upward light beam.
export const EnergyRing: React.FC<{
  delay?: number;
  intensity?: number;   // 0..1 master brightness
  beam?: boolean;
  y?: number;           // top offset of the portal center
  scale?: number;
}> = ({ delay = 0, intensity = 1, beam = false, y = 1560, scale = 1 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const open = interpolate(f, [0, 34], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const pulse = 0.75 + Math.sin(f * 0.06) * 0.25;
  const I = intensity * open;

  const ringW = 660 * scale * (0.6 + open * 0.4);
  const ringH = ringW * 0.26;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: y,
        translate: "-50% -50%",
        width: ringW,
        height: ringH,
        pointerEvents: "none",
      }}
    >
      {/* Upward light beam */}
      {beam && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: ringH * 0.5,
            translate: "-50% 0",
            width: ringW * 0.62,
            height: 1150,
            background: `linear-gradient(0deg, rgba(34,211,238,${0.20 * I * pulse}) 0%, rgba(34,211,238,${0.05 * I}) 45%, transparent 85%)`,
            clipPath: "polygon(18% 100%, 82% 100%, 98% 0%, 2% 0%)",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* Outer ring */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `2px solid rgba(34,211,238,${0.75 * I})`,
          boxShadow: [
            `0 0 24px rgba(34,211,238,${0.55 * I * pulse})`,
            `0 0 90px rgba(34,211,238,${0.28 * I})`,
            `inset 0 0 40px rgba(34,211,238,${0.18 * I})`,
          ].join(", "),
        }}
      />
      {/* Inner ring */}
      <div
        style={{
          position: "absolute",
          inset: `${ringH * 0.18}px ${ringW * 0.09}px`,
          borderRadius: "50%",
          border: `1px solid rgba(160,235,255,${0.6 * I * pulse})`,
          boxShadow: `0 0 30px rgba(34,211,238,${0.3 * I})`,
        }}
      />
      {/* Core glow pool */}
      <div
        style={{
          position: "absolute",
          inset: `${ringH * 0.3}px ${ringW * 0.2}px`,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, rgba(34,211,238,${0.30 * I * pulse}) 0%, transparent 70%)`,
        }}
      />
      {/* Floor reflection wash */}
      <div
        style={{
          position: "absolute",
          left: "-30%",
          right: "-30%",
          top: "40%",
          height: ringH * 2.4,
          background: `radial-gradient(ellipse at 50% 30%, rgba(34,211,238,${0.14 * I}) 0%, transparent 65%)`,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
};

export const RingAccentColor = T.cyan;
