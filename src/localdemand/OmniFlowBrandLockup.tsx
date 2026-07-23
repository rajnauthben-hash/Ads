import React from "react";
import { COLOR, FONT } from "./theme";
import { clamp01, revealIn } from "./text/anim";

/** OmniFlow Digital brand lockup — swirl mark + wordmark + tagline. */
export const OmniFlowBrandLockup: React.FC<{ into: number }> = ({ into }) => {
  const p = clamp01(into);
  const arcs = [0, 1, 2, 3];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        ...revealIn(p, 12),
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <svg width={78} height={78} viewBox="0 0 78 78">
          <g transform="translate(39,39)">
            {arcs.map((i) => {
              const r = 12 + i * 7;
              const a0 = (i * 55 + p * 40) * (Math.PI / 180);
              const a1 = a0 + Math.PI * 1.35;
              const x0 = Math.cos(a0) * r;
              const y0 = Math.sin(a0) * r;
              const x1 = Math.cos(a1) * r;
              const y1 = Math.sin(a1) * r;
              return (
                <path
                  key={i}
                  d={`M ${x0} ${y0} A ${r} ${r} 0 1 1 ${x1} ${y1}`}
                  fill="none"
                  stroke={i % 2 === 0 ? COLOR.cyan : COLOR.cyanCore}
                  strokeWidth={3}
                  strokeLinecap="round"
                  opacity={0.85 - i * 0.12}
                  filter="url(#cyanGlow)"
                />
              );
            })}
            <circle r={4} fill={COLOR.cyanCore} />
          </g>
        </svg>
        <div
          style={{
            fontFamily: FONT.head,
            fontSize: 58,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: COLOR.white,
          }}
        >
          OmniFlow Digital
        </div>
      </div>
      <div
        style={{
          fontFamily: FONT.ui,
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "0.14em",
        }}
      >
        <span style={{ color: COLOR.gray }}>GET FOUND. LOOK PROFESSIONAL. </span>
        <span style={{ color: COLOR.cyan }}>GROW ONLINE.</span>
      </div>
    </div>
  );
};
