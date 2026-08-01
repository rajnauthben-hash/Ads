// ============================================================================
// Editable SVG icon components. All share stroke construction so they read as
// one system (round caps, 2px base stroke, no fills unless noted).
// ============================================================================
import React from "react";
import { COLORS } from "../tokens";

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
};

const base = (size: number): React.CSSProperties => ({
  width: size,
  height: size,
  display: "block",
  overflow: "visible",
});

export const MagnifierIcon: React.FC<IconProps> = ({ size = 40, color = COLORS.cyan, strokeWidth = 2 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none">
    <circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth={strokeWidth} />
    <line x1="15.4" y1="15.4" x2="20.5" y2="20.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.supportGrey, strokeWidth = 1.7 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none">
    <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={strokeWidth} />
    <path d="M12 7.5V12L15 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PinIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.supportGrey, strokeWidth = 1.7 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none">
    <path d="M12 21c4.5-4.4 6.5-7.6 6.5-10.6A6.5 6.5 0 0 0 5.5 10.4C5.5 13.4 7.5 16.6 12 21Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    <circle cx="12" cy="10.2" r="2.4" stroke={color} strokeWidth={strokeWidth} />
  </svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.supportGrey, strokeWidth = 1.7 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none">
    <path
      d="M6.5 4h2.2l1.3 3.3-1.7 1.3a11 11 0 0 0 5.1 5.1l1.3-1.7 3.3 1.3v2.2c0 1-.8 1.8-1.8 1.7C11.6 19.9 4.1 12.4 4.8 5.8 4.9 4.8 5.6 4 6.5 4Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </svg>
);

export const DirectionsIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.supportGrey, strokeWidth = 1.7 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none">
    <path d="M21 11 12.5 3.2c-.3-.3-.7-.3-1 0L4 11c-.3.3-.3.7 0 1l7.5 7.8c.3.3.7.3 1 0L21 12c.3-.3.3-.7 0-1Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    <path d="M9.5 13.5v-2.2c0-.9.7-1.6 1.6-1.6h3.4m0 0-1.8-1.8m1.8 1.8-1.8 1.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SendIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.supportGrey, strokeWidth = 1.7 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none">
    <path d="M20.5 3.5 3.8 10.2c-.6.24-.55 1.1.06 1.28l6.3 1.86 1.86 6.3c.18.61 1.04.66 1.28.06L20.5 3.5Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    <path d="M20.5 3.5 10.2 13.3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const BookIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.cyan, strokeWidth = 2 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none">
    <path d="M12 6.5C10.5 5.2 8.5 4.7 4.5 4.7v12.6c4 0 6 .5 7.5 1.8 1.5-1.3 3.5-1.8 7.5-1.8V4.7c-4 0-6 .5-7.5 1.8Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    <path d="M12 6.5v12.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const ShieldIcon: React.FC<IconProps & { star?: boolean }> = ({ size = 24, color = COLORS.cyan, strokeWidth = 2, star = false }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none">
    <path d="M12 3.2 5 5.8v5.1c0 4.3 2.9 7.4 7 9.9 4.1-2.5 7-5.6 7-9.9V5.8L12 3.2Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    {star && (
      <path d="m12 8.4 1.1 2.2 2.4.35-1.75 1.7.42 2.4L12 15.9l-2.15 1.15.42-2.4-1.75-1.7 2.4-.35L12 8.4Z" stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    )}
  </svg>
);

export const DoorwayIcon: React.FC<IconProps> = ({ size = 40, color = COLORS.cyan, strokeWidth = 2 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none">
    <path d="M5 21V4.6c0-.4.3-.7.7-.8L14 2v19" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    <path d="M14 21h4.3V5.5L14 4.2" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    <circle cx="11.6" cy="12" r="0.9" fill={color} />
    <path d="M3.5 21h17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const PersonIcon: React.FC<IconProps> = ({ size = 40, color = COLORS.cyan, strokeWidth = 2 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none">
    <circle cx="12" cy="8.2" r="3.6" stroke={color} strokeWidth={strokeWidth} />
    <path d="M5.5 19.5c0-3.4 2.9-5.8 6.5-5.8s6.5 2.4 6.5 5.8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const ListIcon: React.FC<IconProps> = ({ size = 40, color = COLORS.cyan, strokeWidth = 2 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none">
    <circle cx="5" cy="7" r="1.2" fill={color} />
    <circle cx="5" cy="12" r="1.2" fill={color} />
    <circle cx="5" cy="17" r="1.2" fill={color} />
    <line x1="9" y1="7" x2="19" y2="7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="9" y1="12" x2="19" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="9" y1="17" x2="19" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const RefreshIcon: React.FC<IconProps> = ({ size = 40, color = COLORS.cyan, strokeWidth = 2 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none">
    <path d="M19 12a7 7 0 1 1-2.05-4.95" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M19 3.5V8h-4.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const GlobeIcon: React.FC<IconProps> = ({ size = 24, color = COLORS.cyan, strokeWidth = 1.7 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none">
    <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={strokeWidth} />
    <path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.3 3.8 8.5S14.5 18.2 12 20.5C9.5 18.2 8.2 15.2 8.2 12S9.5 5.8 12 3.5Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps & { progress?: number }> = ({ size = 30, color = COLORS.cyan, progress = 1 }) => {
  const R = 10.5;
  return (
    <svg viewBox="0 0 24 24" style={base(size)} fill="none">
      <circle cx="12" cy="12" r={R} fill={color} opacity={0.16 * progress} />
      <circle cx="12" cy="12" r={R} stroke={color} strokeWidth={1.8} />
      <path
        d="M7.5 12.3 10.6 15.3 16.6 8.9"
        stroke={color}
        strokeWidth={2.1}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={16}
        strokeDashoffset={16 * (1 - progress)}
      />
    </svg>
  );
};

export const StarRow: React.FC<{ size?: number; color?: string; count?: number }> = ({ size = 18, color = COLORS.warmGoldBright, count = 5 }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" style={{ width: size, height: size }} fill={color}>
        <path d="m12 3 2.6 5.3 5.9.86-4.25 4.15 1 5.85L12 16.9 6.75 19.6l1-5.85L3.5 9.16l5.9-.86L12 3Z" />
      </svg>
    ))}
  </div>
);
