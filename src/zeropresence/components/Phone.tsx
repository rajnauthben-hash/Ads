// ============================================================================
// PhoneShell / PhoneScreen / PhoneStatusBar — the single persistent phone.
// Same shell, radii and perspective in every scene; only the screen content
// (passed as children) changes. Rendered into a bounding box.
// ============================================================================
import React from "react";
import { COLORS } from "../tokens";

const SignalGlyphs: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 * s }}>
    {/* bars */}
    <svg width={17 * s} height={12 * s} viewBox="0 0 17 12" fill={COLORS.softWhite}>
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="4.6" y="5.5" width="3" height="6.5" rx="1" />
      <rect x="9.2" y="3" width="3" height="9" rx="1" />
      <rect x="13.8" y="0.5" width="3" height="11.5" rx="1" />
    </svg>
    {/* wifi */}
    <svg width={16 * s} height={12 * s} viewBox="0 0 16 12" fill="none" stroke={COLORS.softWhite} strokeWidth={1.4}>
      <path d="M1.5 4.2a10 10 0 0 1 13 0" strokeLinecap="round" />
      <path d="M4 6.7a6 6 0 0 1 8 0" strokeLinecap="round" />
      <circle cx="8" cy="9.6" r="1.1" fill={COLORS.softWhite} stroke="none" />
    </svg>
    {/* battery */}
    <svg width={24 * s} height={12 * s} viewBox="0 0 24 12" fill="none">
      <rect x="0.7" y="0.7" width="20" height="10.6" rx="2.6" stroke={COLORS.softWhite} strokeWidth={1.2} opacity={0.7} />
      <rect x="2.3" y="2.3" width="15.5" height="7.4" rx="1.4" fill={COLORS.softWhite} />
      <rect x="21.6" y="4" width="1.8" height="4" rx="0.9" fill={COLORS.softWhite} opacity={0.7} />
    </svg>
  </div>
);

export const PhoneStatusBar: React.FC<{ s: number }> = ({ s }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: `${10 * s}px ${26 * s}px ${4 * s}px`,
      height: 44 * s,
    }}
  >
    <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 17 * s, color: COLORS.softWhite, letterSpacing: 0.3 }}>8:47</div>
    <SignalGlyphs s={s} />
  </div>
);

export const PhoneShell: React.FC<{
  box: { x: number; y: number; w: number; h: number };
  blur?: number;
  rotateY?: number;
  rotateZ?: number;
  children?: React.ReactNode;
}> = ({ box, blur = 0, rotateY = -4, rotateZ = 1.2, children }) => {
  const s = box.w / 500; // internal scale factor
  const radius = 58 * s;
  const inset = 18 * s;
  const screenRadius = 46 * s;

  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        // Flat 2D tilt only. rotateZ gives the angle; a tiny scaleX fakes the
        // -4deg rotateY foreshortening without any 3D compositing (which caused
        // the shell to z-sort behind the flat storefront plane).
        transform: `rotateZ(${rotateZ}deg) scaleX(${Math.cos((rotateY * Math.PI) / 180)})`,
        filter: blur > 0.01 ? `blur(${blur}px)` : undefined,
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
      {/* metallic shell */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          background: "linear-gradient(135deg,#2a3038 0%,#141a20 38%,#0a0e13 100%)",
          boxShadow: `0 ${40 * s}px ${90 * s}px rgba(0,0,0,0.7), 0 0 0 1.5px rgba(120,140,160,0.18), inset 0 0 2px rgba(255,255,255,0.12)`,
        }}
      />
      {/* left cool highlight */}
      <div style={{ position: "absolute", left: 0, top: "12%", bottom: "12%", width: 3 * s, borderRadius: 3, background: "linear-gradient(180deg, rgba(150,180,200,0.0), rgba(150,180,200,0.55), rgba(150,180,200,0.0))" }} />
      {/* right warm rim */}
      <div style={{ position: "absolute", right: 0, top: "18%", bottom: "22%", width: 3 * s, borderRadius: 3, background: "linear-gradient(180deg, rgba(215,160,90,0.0), rgba(215,160,90,0.35), rgba(215,160,90,0.0))" }} />

      {/* screen */}
      <div
        style={{
          position: "absolute",
          left: inset,
          top: inset,
          right: inset,
          bottom: inset,
          borderRadius: screenRadius,
          background: `linear-gradient(180deg,#0b131c 0%,#0a1017 100%)`,
          boxShadow: "inset 0 0 0 1px rgba(140,160,180,0.06)",
          overflow: "hidden",
        }}
      >
        {/* dynamic island */}
        <div style={{ position: "absolute", top: 12 * s, left: "50%", transform: "translateX(-50%)", width: 108 * s, height: 30 * s, background: "#000", borderRadius: 20 * s, zIndex: 5 }}>
          <div style={{ position: "absolute", right: 14 * s, top: "50%", transform: "translateY(-50%)", width: 9 * s, height: 9 * s, borderRadius: "50%", background: "#0c1418", border: "1px solid rgba(80,90,100,0.5)" }} />
        </div>
        <PhoneStatusBar s={s} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 44 * s, bottom: 0 }}>{children}</div>
      </div>
      </div>
    </div>
  );
};

// Reusable search field shown at the top of each phone state.
export const SearchField: React.FC<{ s: number; caret?: boolean }> = ({ s, caret = false }) => (
  <div
    style={{
      margin: `${14 * s}px ${20 * s}px ${8 * s}px`,
      height: 52 * s,
      borderRadius: 14 * s,
      background: COLORS.secondaryDark,
      display: "flex",
      alignItems: "center",
      padding: `0 ${18 * s}px`,
      justifyContent: "space-between",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", fontFamily: "Inter, sans-serif", fontSize: 20 * s, color: COLORS.softWhite, fontWeight: 400 }}>
      <span>Crown Hardware</span>
      {caret && <span style={{ display: "inline-block", width: 2 * s, height: 24 * s, background: COLORS.cyanBright, marginLeft: 3 * s }} />}
    </div>
    <svg width={22 * s} height={22 * s} viewBox="0 0 24 24" fill="none">
      <circle cx="10.5" cy="10.5" r="6.5" stroke={COLORS.supportGrey} strokeWidth={1.8} />
      <line x1="15.4" y1="15.4" x2="20.5" y2="20.5" stroke={COLORS.supportGrey} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  </div>
);
