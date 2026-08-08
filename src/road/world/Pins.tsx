import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import {
  ALL_PINS,
  PIN_LABELS,
  PIN_LAYOUTS,
  PinKey,
  PinState,
  C,
} from "../constants";
import { lerp } from "../helpers";

function sceneIndexAt(frame: number) {
  return Math.min(5, Math.floor(frame / 120) + 1);
}

// Interpolated pin state for the current frame — pins travel into their new
// positions across a short window at each scene boundary instead of jumping.
function pinAt(key: PinKey, frame: number): PinState {
  const sc = sceneIndexAt(frame);
  const cur = PIN_LAYOUTS[sc][key] as PinState;
  if (sc === 1) return cur;
  const prev = PIN_LAYOUTS[sc - 1][key] as PinState;
  const start = (sc - 1) * 120;
  const t = interpolate(frame, [start, start + 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.5, 0, 0.2, 1),
  });
  return {
    x: lerp(prev.x, cur.x, t),
    y: lerp(prev.y, cur.y, t),
    o: lerp(prev.o, cur.o, t),
    rating: (t > 0.5 ? cur.rating : prev.rating) ?? false,
  };
}

const Stars: React.FC<{ x: number; y: number; s: number; opacity: number }> = ({ x, y, s, opacity }) => {
  const star = (cx: number) =>
    `M ${cx} ${y - 3 * s} l ${1.1 * s} ${2.3 * s} l ${2.5 * s} ${0.3 * s} l ${-1.9 * s} ${1.7 * s} l ${0.6 * s} ${2.5 * s} l ${-2.3 * s} ${-1.3 * s} l ${-2.3 * s} ${1.3 * s} l ${0.6 * s} ${-2.5 * s} l ${-1.9 * s} ${-1.7 * s} l ${2.5 * s} ${-0.3 * s} z`;
  return (
    <g opacity={opacity}>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={star(x + i * 8 * s)} fill={C.gold} />
      ))}
    </g>
  );
};

const Pin: React.FC<{ pinKey: PinKey; frame: number; reveal: number }> = ({ pinKey, frame, reveal }) => {
  const st = pinAt(pinKey, frame);
  const opacity = st.o * reveal;
  if (opacity < 0.01) return null;

  const scale = Math.max(0.68, Math.min(1.06, lerp(0.72, 1.06, (st.y - 160) / 820)));
  const label = PIN_LABELS[pinKey];
  const px = st.x;
  const py = st.y; // tip point

  // Teardrop pin (tip at py).
  const r = 15 * scale;
  const bodyTopY = py - 40 * scale;
  const d = `M ${px} ${py} C ${px - r * 1.35} ${py - 26 * scale}, ${px - r} ${bodyTopY - r * 0.2}, ${px} ${bodyTopY - r} ` +
    `C ${px + r} ${bodyTopY - r * 0.2}, ${px + r * 1.35} ${py - 26 * scale}, ${px} ${py} Z`;

  const labelX = px + 22 * scale;
  const labelTopY = bodyTopY - 8 * scale;
  const showChip = !!st.rating;

  return (
    <g opacity={opacity}>
      {/* Soft ground glow under the pin */}
      <ellipse cx={px} cy={py + 2} rx={16 * scale} ry={5 * scale} fill={C.goldGlow} />
      {/* Chip background for rating scenes */}
      {showChip && (
        <rect
          x={labelX - 8}
          y={labelTopY - 4}
          width={132 * scale + 8}
          height={52 * scale}
          rx={7}
          fill="rgba(6,12,16,0.82)"
          stroke="rgba(243,184,75,0.18)"
          strokeWidth={1}
        />
      )}
      {/* Pin body */}
      <path d={d} fill={C.gold} stroke={C.goldDeep} strokeWidth={1} filter="url(#pinGlow)" />
      <circle cx={px} cy={bodyTopY} r={6 * scale} fill="#2A1B06" />
      {/* Label */}
      <text
        x={labelX}
        y={labelTopY + 12 * scale}
        fill="#F4F6F8"
        fontFamily="Inter, sans-serif"
        fontSize={17 * scale}
        fontWeight={700}
        letterSpacing="0.06em"
      >
        {label[0]}
      </text>
      <text
        x={labelX}
        y={labelTopY + 12 * scale + 19 * scale}
        fill="#C6CDD3"
        fontFamily="Inter, sans-serif"
        fontSize={17 * scale}
        fontWeight={600}
        letterSpacing="0.06em"
      >
        {label[1]}
      </text>
      {showChip && (
        <Stars x={labelX + 3} y={labelTopY + 12 * scale + 34 * scale} s={scale} opacity={1} />
      )}
    </g>
  );
};

export const Pins: React.FC = () => {
  const frame = useCurrentFrame();
  // Pins resolve out of the darkness during Scene 1.
  const reveal = interpolate(frame, [26, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <g>
      <defs>
        <filter id="pinGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.4" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {ALL_PINS.map((k) => (
        <Pin key={k} pinKey={k} frame={frame} reveal={reveal} />
      ))}
    </g>
  );
};
