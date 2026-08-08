import React from "react";
import { C } from "../constants";

// ---------------------------------------------------------------------------
// WetStreet — dark reflective foreground road with a perspective crosswalk and
// receding centre line. Static layer; the camera rig supplies the motion.
// ---------------------------------------------------------------------------

const HORIZON = 1548;

export const WetStreet: React.FC = () => {
  return (
    <g>
      <defs>
        <linearGradient id="wetRoad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A1116" />
          <stop offset="0.4" stopColor="#0C141A" />
          <stop offset="1" stopColor="#05090D" />
        </linearGradient>
        <linearGradient id="reflectCyan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.cyan} stopOpacity="0" />
          <stop offset="1" stopColor={C.cyan} stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id="reflectWarm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.storefront} stopOpacity="0" />
          <stop offset="1" stopColor={C.storefront} stopOpacity="0.18" />
        </linearGradient>
      </defs>

      {/* Road surface */}
      <rect x={-40} y={HORIZON} width={1160} height={1920 - HORIZON} fill="url(#wetRoad)" />

      {/* Wet reflections — soft vertical light smears */}
      <rect x={120} y={HORIZON + 40} width={90} height={300} fill="url(#reflectWarm)" opacity={0.7} />
      <rect x={250} y={HORIZON + 60} width={60} height={280} fill="url(#reflectWarm)" opacity={0.5} />
      <rect x={720} y={HORIZON + 20} width={70} height={340} fill="url(#reflectCyan)" opacity={0.8} />
      <rect x={840} y={HORIZON + 40} width={54} height={320} fill="url(#reflectCyan)" opacity={0.6} />

      {/* Perspective crosswalk — stripes widen toward the viewer */}
      {Array.from({ length: 7 }).map((_, i) => {
        const t = i / 7;
        // Near the bottom stripes are wider and more separated.
        const y = 1660 + t * 210;
        const h = 20 + t * 26;
        const x = 120 - t * 90;
        const w = 620 + t * 260;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            fill="#C7D0D6"
            opacity={0.1 + t * 0.14}
            transform={`skewX(-8)`}
          />
        );
      })}

      {/* Receding centre line toward the map road (yellow dashes) */}
      {Array.from({ length: 6 }).map((_, i) => {
        const t = i / 6;
        const y = 1900 - t * 300;
        const x = 640 + t * 150;
        const w = 46 - t * 30;
        const h = 16 - t * 9;
        return <rect key={`c${i}`} x={x} y={y} width={w} height={h} rx={2} fill="#B8922E" opacity={0.5 - t * 0.28} />;
      })}

      {/* Kerb / sidewalk edge where the storefront sits */}
      <rect x={-40} y={HORIZON} width={560} height={8} fill="#161D22" opacity={0.8} />
    </g>
  );
};
