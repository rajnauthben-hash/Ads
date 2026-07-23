import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COLOR } from "./theme";

/**
 * An approved reference frame used as a cinematic environment plate.
 * A restrained camera push (scale + drift) brings it alive without changing
 * the approved composition. objectFit: cover — plates are 9:16 like the comp,
 * so nothing is cropped.
 */
export const ScenePlate: React.FC<{
  src: string;
  scale?: number;
  x?: number;
  y?: number;
  opacity?: number;
  brightness?: number;
}> = ({ src, scale = 1, x = 0, y = 0, opacity = 1, brightness = 1 }) => (
  <AbsoluteFill style={{ opacity, overflow: "hidden" }}>
    <Img
      src={staticFile(src)}
      style={{
        width: 1080,
        height: 1920,
        objectFit: "cover",
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        transformOrigin: "center center",
        filter: brightness !== 1 ? `brightness(${brightness})` : undefined,
      }}
    />
  </AbsoluteFill>
);

/**
 * Feathered dark scrim over the left editorial column. The reference plates
 * are near-black there, so this hides the rasterized copy invisibly and gives
 * clean negative space for the live React text placed on top.
 */
export const LeftScrim: React.FC<{
  width?: number;
  feather?: number;
  top?: number;
  height?: number;
  featherTB?: number;
}> = ({ width = 560, feather = 130, top = 0, height = 1920, featherTB = 48 }) => {
  const wPct = (width / (width + feather)) * 100;
  const vmask = `linear-gradient(180deg, transparent 0, #000 ${featherTB}px, #000 calc(100% - ${featherTB}px), transparent 100%)`;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top,
        width: width + feather,
        height,
        background: `linear-gradient(90deg, ${COLOR.black} 0%, ${COLOR.black} ${wPct}%, rgba(5,8,12,0) 100%)`,
        WebkitMaskImage: vmask,
        maskImage: vmask,
        pointerEvents: "none",
      }}
    />
  );
};

/** Feathered cover for the plate's top-left reference number (01/02/04/05). */
export const RefNumberCover: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: -40,
      top: -40,
      width: 210,
      height: 150,
      background: COLOR.black,
      borderRadius: 30,
      filter: "blur(22px)",
      pointerEvents: "none",
    }}
  />
);

/**
 * A soft feathered matte to cover a small baked element (e.g. a reference
 * label) before the live version is drawn. Heavily blurred so no hard edge.
 */
export const SoftMatte: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  opacity?: number;
}> = ({ x, y, w, h, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: COLOR.black,
      borderRadius: 34,
      filter: "blur(17px)",
      opacity,
      pointerEvents: "none",
    }}
  />
);

/**
 * Directional masked reveal for scene handoffs — feathered, led by the route /
 * camera / phone, never a full-screen opacity crossfade. The outgoing scene
 * stays fully rendered beneath while the incoming scene wipes in.
 */
export const WipeReveal: React.FC<{
  progress: number; // 0..1
  from: "right" | "left" | "bottom" | "top";
  feather?: number;
  children: React.ReactNode;
}> = ({ progress, from, feather = 14, children }) => {
  const p = Math.max(0, Math.min(1, progress));
  if (p >= 1) return <>{children}</>;
  const P = p * (100 + feather);
  const dir = { right: "to left", left: "to right", bottom: "to top", top: "to bottom" }[from];
  const mask = `linear-gradient(${dir}, black ${P}%, transparent ${P + feather}%)`;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    >
      {children}
    </div>
  );
};

/** Subtle edge vignette for depth/atmosphere. */
export const Vignette: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background:
        "radial-gradient(120% 90% at 50% 42%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.55) 100%)",
    }}
  />
);
