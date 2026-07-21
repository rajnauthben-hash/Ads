import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

type Variant = "glass" | "wood";

const TEX: Record<Variant, { src: string; aspect: number }> = {
  // Photographic Brightview Hardware facades isolated from the approved
  // storyboards (building only — routes/cards/nodes cropped out). Used as a
  // texture layer; routes, cards and pins stay separate live layers.
  glass: { src: "storefront-glass.png", aspect: 405 / 420 },
  wood: { src: "storefront-wood.png", aspect: 298 / 440 },
};

type Props = {
  x: number;
  y: number;
  width: number;
  appear: number;
  // 0..1 — interior/edge warmth that rises as the store "illuminates".
  warmth: number;
  variant: Variant;
  // Extra native pavement below the facade (scene 3's tall panel).
  pavement?: number;
  // Floating gold destination pin above the roof.
  pin?: boolean;
  pinAppear?: number;
};

// Cinematic storefront: a photographic facade composited into a rounded
// panel, revealed with a soft upward mask (never a black frame), lit by an
// animated warm glow, optionally extended by native pavement and topped by a
// live gold pin.
export const Storefront: React.FC<Props> = ({
  x,
  y,
  width: w,
  appear,
  warmth,
  variant,
  pavement = 0,
  pin = false,
  pinAppear = 0,
}) => {
  const frame = useCurrentFrame();
  const build = interpolate(frame, [appear, appear + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (build <= 0) {
    return null;
  }
  const tex = TEX[variant];
  const photoH = w * tex.aspect;
  const totalH = photoH + pavement;
  const warm = Math.max(0, warmth) * (0.92 + 0.08 * Math.sin(frame * 0.08));
  // Reveal wipes up from the base; a dark lift fades so it emerges from shadow.
  const wipe = (1 - build) * 100;
  const shade = 0.55 * (1 - build);
  const pinT = interpolate(frame, [pinAppear, pinAppear + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", left: x, top: y - (pin ? 74 : 0), width: w }}>
      {/* Floating gold pin */}
      {pin && pinT > 0 && (
        <svg
          width={70}
          height={90}
          viewBox="0 0 70 90"
          style={{ position: "absolute", left: w / 2 - 35, top: -6 + (1 - pinT) * -18, opacity: pinT, filter: "drop-shadow(0 0 12px rgba(241,185,76,0.6))" }}
        >
          <circle cx={35} cy={35} r={30} fill={COLORS.gold} opacity={0.16} />
          <path d="M 35 78 C 18 52 14 44 14 32 A 21 21 0 1 1 56 32 C 56 44 52 52 35 78 Z" fill={COLORS.gold} stroke="#C98D24" strokeWidth={1.4} />
          <circle cx={35} cy={31} r={8} fill="#02060B" />
        </svg>
      )}

      {/* Facade + pavement, revealed together */}
      <div
        style={{
          position: "absolute",
          top: pin ? 74 : 0,
          width: w,
          height: totalH,
          borderRadius: 26,
          overflow: "hidden",
          border: "1.5px solid rgba(85,188,235,0.24)",
          boxShadow: "0 30px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(245,245,242,0.05)",
          opacity: build,
          clipPath: `inset(0 0 ${wipe}% 0 round 26px)`,
        }}
      >
        {/* Photographic facade */}
        <div style={{ position: "relative", width: w, height: photoH }}>
          <Img src={staticFile(tex.src)} style={{ width: w, height: photoH, objectFit: "cover", display: "block" }} />
          {/* Emerge-from-shadow lift */}
          <div style={{ position: "absolute", inset: 0, background: "#02060B", opacity: shade }} />
          {/* Warm interior bloom rising with warmth */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                variant === "wood"
                  ? "radial-gradient(ellipse 80% 55% at 50% 62%, rgba(255,196,96,0.28), transparent 70%)"
                  : "radial-gradient(ellipse 70% 60% at 52% 70%, rgba(255,196,96,0.22), transparent 72%)",
              opacity: warm,
              mixBlendMode: "screen",
            }}
          />
          {/* Blend the facade base into the pavement below (no hard seam) */}
          {pavement > 0 && (
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 90, background: "linear-gradient(180deg, transparent, #0a0d12)" }} />
          )}
        </div>

        {/* Native pavement continuation */}
        {pavement > 0 && (
          <div style={{ position: "relative", width: w, height: pavement, background: "linear-gradient(180deg, #0a0d12 0%, #070b10 55%, #05080c 100%)" }}>
            {/* Warm spill from the doorway onto the pavement */}
            <div style={{ position: "absolute", left: "38%", right: "34%", top: 0, height: pavement * 0.7, background: "linear-gradient(180deg, rgba(255,196,96,0.14), transparent 80%)", opacity: warm, filter: "blur(6px)" }} />
            {/* Subtle paving lines for depth */}
            <svg width={w} height={pavement} style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
              {[0.25, 0.5, 0.75].map((p, i) => (
                <line key={i} x1={0} y1={pavement * p} x2={w} y2={pavement * p + 8} stroke="rgba(85,188,235,0.05)" strokeWidth={1} />
              ))}
              <line x1={w * 0.5} y1={0} x2={w * 0.5} y2={pavement} stroke="rgba(85,188,235,0.04)" strokeWidth={1} />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
