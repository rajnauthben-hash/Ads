import React from "react";

// Development-only safe-zone overlay (TikTok / Reels UI). Never rendered into
// the final MP4 — only shown when explicitly enabled in the studio.
export const SafeZoneOverlay: React.FC<{ show?: boolean }> = ({ show = false }) => {
  if (!show) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 220, background: "rgba(255,0,80,0.08)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 520, background: "rgba(255,0,80,0.08)" }} />
      <div style={{ position: "absolute", right: 0, top: 300, bottom: 500, width: 160, background: "rgba(255,0,80,0.08)" }} />
      <div style={{ position: "absolute", inset: 24, border: "2px dashed rgba(255,255,255,0.3)" }} />
    </div>
  );
};
