import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "./theme";
import { Line, Gold, GoldTick, HEAD, SUP } from "./ui";
import { win } from "./anim";

const LEFT = 96;

// Native "door ajar with warm light" — no photo, built from gradients + shapes.
const Doorway: React.FC<{ glow: number }> = ({ glow }) => {
  return (
    <svg width={520} height={900} viewBox="0 0 520 900" style={{ position: "absolute", right: 40, top: 850, overflow: "visible" }}>
      <defs>
        <linearGradient id="dwSlit" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,210,140,0)" />
          <stop offset="45%" stopColor={`rgba(255,225,170,${0.95 * glow})`} />
          <stop offset="55%" stopColor={`rgba(255,236,200,${glow})`} />
          <stop offset="100%" stopColor="rgba(255,210,140,0)" />
        </linearGradient>
        <linearGradient id="dwFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`rgba(255,220,150,${0.5 * glow})`} />
          <stop offset="100%" stopColor="rgba(255,220,150,0)" />
        </linearGradient>
        <linearGradient id="dwPanel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2A2521" />
          <stop offset="100%" stopColor="#100D0A" />
        </linearGradient>
        <radialGradient id="dwHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`rgba(255,210,150,${0.35 * glow})`} />
          <stop offset="100%" stopColor="rgba(255,210,150,0)" />
        </radialGradient>
        <filter id="dwBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* wall frame around the doorway */}
      <path d="M150 40 L360 70 L360 800 L150 840 Z" fill="#0C0A08" stroke="rgba(120,100,70,0.18)" strokeWidth={2} />
      {/* floor light spill */}
      <path d="M150 820 L360 792 L520 900 L120 900 Z" fill="url(#dwFloor)" filter="url(#dwBlur)" />
      {/* halo */}
      <ellipse cx="228" cy="430" rx="150" ry="360" fill="url(#dwHalo)" />
      {/* the bright light slit */}
      <rect x="196" y="70" width="46" height="726" fill="url(#dwSlit)" filter="url(#dwBlur)" />
      <rect x="212" y="78" width="12" height="710" fill={`rgba(255,244,222,${glow})`} />
      {/* the door panel, opened toward viewer (parallelogram) */}
      <path d="M242 74 L360 40 L360 806 L242 792 Z" fill="url(#dwPanel)" stroke="rgba(150,120,80,0.25)" strokeWidth={2} />
      {/* handle */}
      <circle cx="270" cy="440" r="4" fill="rgba(210,180,120,0.7)" />
    </svg>
  );
};

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = win(frame, 6, 46, 0, 1);

  return (
    <>
      <div style={{ position: "absolute", left: LEFT, top: 150 }}>
        <GoldTick delay={2} />
      </div>
      <div style={{ position: "absolute", left: LEFT, top: 196 }}>
        <Line delay={6}><div style={{ ...SUP, color: C.support }}>Some lost business<br />never looks like a loss.</div></Line>
      </div>
      <div style={{ position: "absolute", left: LEFT, top: 340 }}>
        <GoldTick delay={12} />
      </div>

      <div style={{ position: "absolute", left: LEFT, top: 400, width: 960 }}>
        <Line delay={16}><div style={{ ...HEAD, fontSize: 74, whiteSpace: "nowrap" }}>A customer can need</div></Line>
        <Line delay={22}><div style={{ ...HEAD, fontSize: 74, whiteSpace: "nowrap" }}>Exactly what you offer—</div></Line>
        <Line delay={28}><div style={{ ...HEAD, fontSize: 74, whiteSpace: "nowrap" }}><Gold>And never reach you.</Gold></div></Line>
      </div>

      <div style={{ position: "absolute", left: LEFT, top: 720 }}>
        <GoldTick delay={34} />
      </div>
      <div style={{ position: "absolute", left: LEFT, top: 792, maxWidth: 560 }}>
        <Line delay={40}><div style={SUP}>They search nearby.</div></Line>
        <Line delay={46}><div style={SUP}>They compare what appears.</div></Line>
        <Line delay={52}><div style={SUP}>And if your business isn't</div></Line>
        <Line delay={58}><div style={SUP}>easy to find or understand,</div></Line>
        <Line delay={64}><div style={SUP}>they move on.</div></Line>
      </div>
      <div style={{ position: "absolute", left: LEFT, top: 1130, maxWidth: 560 }}>
        <Line delay={74}><div style={{ ...SUP, color: C.gold }}>Often without ever<br />contacting you.</div></Line>
      </div>

      <Doorway glow={glow} />
    </>
  );
};
