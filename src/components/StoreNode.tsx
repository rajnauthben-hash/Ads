import React from "react";
import { interpolate } from "remotion";
import { COLORS } from "../config/design";
import { Icon } from "./Icons";
import { SignalRings } from "./LocationPin";

/**
 * The persistent physical storefront glyph: a small isometric shop box with
 * a location pin above it and pulsing ground-signal rings beneath.
 */
export const StoreNode: React.FC<{
  x: number;
  y: number;
  frame: number;
  strength?: number; // 0-1, drives ring brightness + window glow
  scale?: number;
  seed?: number;
  entrance?: number; // 0-1
}> = ({ x, y, frame, strength = 1, scale = 1, seed = 0, entrance = 1 }) => {
  const windowGlow = interpolate(strength, [0, 1], [0.15, 1]);
  const pop = 0.75 + 0.25 * Math.min(1, entrance);

  return (
    <>
      <SignalRings
        x={x}
        y={y}
        frame={frame}
        color={COLORS.cyan}
        strength={strength}
        seed={seed}
        maxRadius={92 * scale}
        ringCount={4}
      />
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `translate(-50%, -100%) scale(${pop * scale})`,
          transformOrigin: "50% 100%",
          opacity: entrance,
        }}
      >
        {/* pin above the building */}
        <svg
          width={56}
          height={64}
          viewBox="0 0 56 64"
          style={{
            position: "absolute",
            left: "50%",
            top: -60,
            transform: "translateX(-50%)",
            filter: `drop-shadow(0 0 ${6 * windowGlow + 2}px ${COLORS.cyan})`,
          }}
        >
          <path
            d="M28 62 C28 62 6 34 6 20 A22 22 0 1 1 50 20 C50 34 28 62 28 62 Z"
            fill={`rgba(0,210,255,${0.08 + windowGlow * 0.14})`}
            stroke={COLORS.cyan}
            strokeWidth={2}
            opacity={0.55 + windowGlow * 0.45}
          />
          <g transform="translate(28,20) translate(-11,-11)">
            <Icon name="storefront" size={22} color={COLORS.cyan} />
          </g>
        </svg>

        {/* isometric building */}
        <svg width={120} height={120} viewBox="0 0 120 120">
          <polygon points="15,45 60,25 105,45 60,58" fill="#232f36" stroke="#0f171b" strokeWidth={1} />
          <polygon points="60,58 105,45 105,95 60,110" fill="#141b1f" />
          <polygon points="15,45 60,58 60,110 15,98" fill="#1c262b" />
          {/* awning stripe */}
          <rect x="16" y="56" width="43" height="8" fill={`rgba(0,210,255,${0.25 + windowGlow * 0.35})`} />
          {/* windows */}
          <rect
            x="21"
            y="70"
            width="14"
            height="16"
            rx="1.5"
            fill={COLORS.cyan}
            opacity={0.35 + windowGlow * 0.65}
            style={{ filter: `drop-shadow(0 0 ${4 * windowGlow}px ${COLORS.cyan})` }}
          />
          <rect
            x="39"
            y="70"
            width="14"
            height="16"
            rx="1.5"
            fill={COLORS.cyan}
            opacity={0.35 + windowGlow * 0.65}
            style={{ filter: `drop-shadow(0 0 ${4 * windowGlow}px ${COLORS.cyan})` }}
          />
          {/* door */}
          <rect x="70" y="78" width="16" height="24" fill="#0d1316" opacity={0.9} />
          <rect
            x="70"
            y="78"
            width="16"
            height="24"
            fill="none"
            stroke={COLORS.cyan}
            strokeWidth={0.8}
            opacity={0.3 + windowGlow * 0.4}
          />
        </svg>
      </div>
    </>
  );
};
