import React from "react";

/**
 * Global cinematic grade — edge vignette + subtle cool top bloom + a faint
 * warm floor lift. Transparent through the centre so text stays crisp.
 */
export const GlobalGrade: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(130% 100% at 50% 42%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)" }} />
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(70% 40% at 55% 8%, rgba(40,90,130,0.10) 0%, rgba(0,0,0,0) 70%)", mixBlendMode: "screen" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 480, pointerEvents: "none", background: "linear-gradient(0deg, rgba(10,16,26,0.55) 0%, rgba(10,16,26,0) 100%)" }} />
  </>
);
