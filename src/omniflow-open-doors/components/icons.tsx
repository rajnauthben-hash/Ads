import React from "react";

const wrap = (path: React.ReactNode, size: number, color: string) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

export const IconClock = (s = 20, c = "#8E949C") =>
  wrap(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, s, c);

export const IconCamera = (s = 20, c = "#8E949C") =>
  wrap(<><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.2" /></>, s, c);

export const IconGlobe = (s = 20, c = "#8E949C") =>
  wrap(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>, s, c);

export const IconChat = (s = 20, c = "#8E949C") =>
  wrap(<path d="M4 5h16v11H9l-4 4z" />, s, c);

export const IconPin = (s = 20, c = "#8E949C") =>
  wrap(<><path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>, s, c);

export const IconPhone = (s = 20, c = "#8E949C") =>
  wrap(<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l1 4v2a2 2 0 0 1-2 2A16 16 0 0 1 3 7a2 2 0 0 1 2-3z" />, s, c);

export const IconShield = (s = 20, c = "#34C978") =>
  wrap(<><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></>, s, c);

export const Star: React.FC<{ size?: number; fill: string; empty?: boolean; half?: boolean }> = ({
  size = 18,
  fill,
  empty = false,
  half = false,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <defs>
      <linearGradient id={`half-${fill.replace(/[^a-z0-9]/gi, "")}`}>
        <stop offset="50%" stopColor={fill} />
        <stop offset="50%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <path
      d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"
      fill={half ? `url(#half-${fill.replace(/[^a-z0-9]/gi, "")})` : empty ? "none" : fill}
      stroke={fill}
      strokeWidth={empty ? 1.2 : 0}
      opacity={empty ? 0.5 : 1}
    />
  </svg>
);

export const StarRow: React.FC<{ rating: number; color: string; size?: number }> = ({
  rating,
  color,
  size = 18,
}) => (
  <div style={{ display: "flex", gap: 2 }}>
    {Array.from({ length: 5 }).map((_, i) => {
      const full = i + 1 <= Math.round(rating);
      const half = !full && i + 0.5 <= rating + 0.001 && i < rating;
      return <Star key={i} size={size} fill={color} empty={!full && !half} half={half} />;
    })}
  </div>
);
