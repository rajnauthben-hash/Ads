import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../constants";
import { kf } from "../../road/helpers";

// Scene 5 — the repaired active route: existing foreground traffic curves up to
// the Crown Hardware entrance, landing a pulse and arrowhead at the door.
const RT =
  "M 20 1596 C 250 1536 430 1486 566 1410 C 668 1352 716 1300 744 1250";
const PL = 1000;
const END = { x: 744, y: 1250, a: -58 };

export const Scene5Route: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 480) return null;
  const draw = kf(frame, [486, 548], [PL, 0]);
  const o = kf(frame, [482, 512], [0, 1]);
  const pulse = (((frame - 512) / 60) % 1 + 1) % 1;
  const arrowO = kf(frame, [540, 560], [0, 1]);

  const rad = (END.a * Math.PI) / 180;
  const s = 15;
  const tip = [END.x + s * Math.cos(rad), END.y + s * Math.sin(rad)];
  const l = [END.x - s * Math.cos(rad - 0.7), END.y - s * Math.sin(rad - 0.7)];
  const r = [END.x - s * Math.cos(rad + 0.7), END.y - s * Math.sin(rad + 0.7)];

  return (
    <g opacity={o}>
      <path d={RT} pathLength={PL} fill="none" stroke={C.cyanGlow} strokeWidth={28} strokeLinecap="round" strokeDasharray={`${PL} ${PL}`} strokeDashoffset={draw} filter="url(#exRouteGlow)" />
      <path d={RT} pathLength={PL} fill="none" stroke={C.cyanDim} strokeWidth={10} strokeLinecap="round" strokeDasharray={`${PL} ${PL}`} strokeDashoffset={draw} />
      <path d={RT} pathLength={PL} fill="none" stroke={C.cyanBright} strokeWidth={3.4} strokeLinecap="round" strokeDasharray={`${PL} ${PL}`} strokeDashoffset={draw} />
      {frame > 512 && (
        <path d={RT} pathLength={PL} fill="none" stroke={C.cyanCore} strokeWidth={6} strokeLinecap="round" strokeDasharray={`26 ${PL}`} strokeDashoffset={PL - pulse * PL} opacity={0.95} filter="url(#exRouteGlow)" />
      )}
      <path d={`M ${tip[0]} ${tip[1]} L ${l[0]} ${l[1]} L ${r[0]} ${r[1]} Z`} fill={C.cyanBright} opacity={arrowO} filter="url(#exRouteGlow)" />
    </g>
  );
};
