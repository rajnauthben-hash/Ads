import { useCurrentFrame, interpolate, Easing } from "remotion";
import { EO } from "../lib/constants";

// Represents the "before" state — dim, outdated, misaligned.
export const OldWebsiteMockup: React.FC<{
  delay?: number;
  width?: number;
  glitchFrame?: number;
}> = ({ delay = 0, width = 820, glitchFrame = -1 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const op = interpolate(f, [0, 20], [0, 0.72], { extrapolateRight: "clamp" });
  const sc = interpolate(f, [0, 28], [0.97, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  // Subtle tilt — card looks unstable
  const tilt = interpolate(f, [0, 60], [0, -1.5], {
    extrapolateRight: "clamp",
  });

  // Flicker effect: very slight opacity jitter every ~18 frames
  const flickPhase = Math.sin((frame * 0.34) * Math.PI);
  const flicker = interpolate(flickPhase, [-1, 1], [-0.04, 0.04], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const height = Math.round(width * 0.56);

  return (
    <div
      style={{
        opacity: Math.max(0, op + flicker),
        scale: sc.toString(),
        rotate: `${tilt}deg`,
        filter: "grayscale(0.85) brightness(0.52) saturate(0.3)",
        width,
        height,
        borderRadius: 18,
        border: "1.5px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        background: "#090D1C",
        boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
      }}
    >
      {/* Browser chrome — dull */}
      <div
        style={{
          height: 46,
          background: "#0A0F1E",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 7,
        }}
      >
        {[0.1, 0.07, 0.05].map((op, i) => (
          <div
            key={i}
            style={{ width: 11, height: 11, borderRadius: "50%", background: `rgba(255,255,255,${op})` }}
          />
        ))}
        <div
          style={{
            flex: 1,
            marginLeft: 14,
            height: 22,
            background: "rgba(255,255,255,0.03)",
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        />
      </div>

      {/* Nav — barely there */}
      <div
        style={{
          padding: "18px 22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.03)",
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 20, height: 20, borderRadius: 5, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ width: 74, height: 8, borderRadius: 2, background: "rgba(255,255,255,0.14)" }} />
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {[40, 34, 44, 38].map((w, i) => (
            <div key={i} style={{ width: w, height: 6, borderRadius: 2, background: "rgba(255,255,255,0.08)" }} />
          ))}
        </div>
      </div>

      {/* Hero section — flat, weak */}
      <div
        style={{
          padding: "28px 22px",
          background: "rgba(255,255,255,0.015)",
          borderBottom: "1px solid rgba(255,255,255,0.03)",
        }}
      >
        <div style={{ width: "60%", height: 16, borderRadius: 4, background: "rgba(255,255,255,0.28)", marginBottom: 10 }} />
        <div style={{ width: "42%", height: 10, borderRadius: 3, background: "rgba(255,255,255,0.13)", marginBottom: 7 }} />
        <div style={{ width: "34%", height: 9, borderRadius: 3, background: "rgba(255,255,255,0.09)", marginBottom: 22 }} />
        {/* Weak CTA */}
        <div
          style={{
            display: "inline-flex",
            background: "rgba(255,255,255,0.07)",
            borderRadius: 6,
            padding: "10px 20px",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <div style={{ width: 62, height: 7, borderRadius: 2, background: "rgba(255,255,255,0.14)" }} />
        </div>
      </div>

      {/* Content blocks — misaligned */}
      <div style={{ display: "flex", gap: 10, padding: "18px 18px" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              borderRadius: 8,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
              padding: "12px 10px",
              marginTop: i === 1 ? 6 : 0, // slight misalignment
            }}
          >
            <div style={{ width: 18, height: 18, borderRadius: 4, background: "rgba(255,255,255,0.06)", marginBottom: 8 }} />
            <div style={{ width: "75%", height: 6, borderRadius: 2, background: "rgba(255,255,255,0.1)", marginBottom: 5 }} />
            <div style={{ width: "55%", height: 5, borderRadius: 2, background: "rgba(255,255,255,0.06)" }} />
          </div>
        ))}
      </div>
    </div>
  );
};
