// ============================================================================
// VirtualCamera, AtmosphericBackground, SafeAreaOverlay
// ============================================================================
import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, WIDTH, HEIGHT, SAFE, RESERVED } from "../tokens";
import { clampInterp } from "../framePlan";

// Subtle deterministic camera drift; near-zero during reading holds.
export const VirtualCamera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  // gentle sine drift, amplitude within spec (<=18px H, <=14px V, tiny rotation)
  const t = frame / 30;
  const tx = Math.sin(t * 0.5) * 6;
  const ty = Math.cos(t * 0.42) * 4;
  const rz = Math.sin(t * 0.33) * 0.18;
  const ry = Math.sin(t * 0.28) * 1.1;
  const scale = 1 + Math.sin(t * 0.22) * 0.008;
  return (
    <div style={{ position: "absolute", inset: 0, perspective: 1400 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          // Flat compositing (DOM order) so tilted layers never 3D-sort behind
          // flat siblings; the gentle camera rotateY still reads via perspective.
          transform: `scale(${scale}) translate(${tx}px, ${ty}px) rotateY(${ry}deg) rotateZ(${rz}deg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const AtmosphericBackground: React.FC = () => {
  const frame = useCurrentFrame();
  // slow cyan atmospheric drift, never full-screen glow
  const drift = clampInterp(frame, [0, 720], [0, 40]);
  return (
    <div style={{ position: "absolute", inset: 0, background: COLORS.canvasBlack, overflow: "hidden" }}>
      {/* night sky gradient (top reserve) */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0a1018 0%,#050a10 30%,#02060a 70%,#02060a 100%)" }} />
      {/* distant cool haze */}
      <div style={{ position: "absolute", left: -100 + drift * 0.3, top: 120, width: 900, height: 700, background: "radial-gradient(ellipse, rgba(20,45,65,0.35) 0%, transparent 65%)", filter: "blur(30px)" }} />
      {/* faint warm street pool bottom */}
      <div style={{ position: "absolute", left: 100, bottom: -120, width: 900, height: 500, background: "radial-gradient(ellipse, rgba(60,42,22,0.30) 0%, transparent 65%)", filter: "blur(30px)" }} />
      {/* vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
    </div>
  );
};

// Development-only overlay. Never mounted in the final render.
export const SafeAreaOverlay: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
    {/* protected content rectangle */}
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top,
        width: SAFE.right - SAFE.left,
        height: SAFE.bottom - SAFE.top,
        border: "2px dashed rgba(67,209,122,0.9)",
      }}
    />
    {/* platform reserves */}
    <div style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: RESERVED.top, background: "rgba(242,100,90,0.18)" }} />
    <div style={{ position: "absolute", left: RESERVED.rightX, top: 0, width: WIDTH - RESERVED.rightX, height: HEIGHT, background: "rgba(242,100,90,0.18)" }} />
    <div style={{ position: "absolute", left: 0, top: RESERVED.bottom, width: WIDTH, height: HEIGHT - RESERVED.bottom, background: "rgba(242,100,90,0.18)" }} />
    <div style={{ position: "absolute", left: SAFE.left + 6, top: SAFE.top + 6, fontFamily: "monospace", fontSize: 20, color: "rgba(67,209,122,0.95)" }}>
      SAFE 80–825 × 190–1460
    </div>
  </div>
);
