import React from "react";
import { COLORS } from "../styles/tokens";

// Line-icon set. Every icon supports a stroke-draw `progress` (0..1) via
// normalized pathLength, so entrances can draw the outline deterministically.
export interface IconProps {
  size?: number;
  color?: string;
  progress?: number;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

const Svg: React.FC<
  IconProps & { children: React.ReactNode; viewBox?: string }
> = ({ size = 48, color = COLORS.cyan, strokeWidth = 2, style, children, viewBox = "0 0 24 24" }) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {children}
  </svg>
);

// helper for drawable paths
const draw = (progress = 1) =>
  progress >= 1
    ? {}
    : { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - progress };

export const GlobeIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" {...draw(p.progress)} />
    <path d="M3 12h18" {...draw(p.progress)} />
    <path d="M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" {...draw(p.progress)} />
  </Svg>
);

export const TargetIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" {...draw(p.progress)} />
    <circle cx="12" cy="12" r="5.4" {...draw(p.progress)} />
    <circle cx="12" cy="12" r="1.8" {...draw(p.progress)} />
    <path d="M12 1v3M12 20v3M1 12h3M20 12h3" {...draw(p.progress)} />
  </Svg>
);

export const SearchIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" {...draw(p.progress)} />
    <path d="M15.5 15.5L21 21" {...draw(p.progress)} />
  </Svg>
);

export const MicIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" {...draw(p.progress)} />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" {...draw(p.progress)} />
  </Svg>
);

export const DocumentIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M6 3h8l4 4v14H6z" {...draw(p.progress)} />
    <path d="M14 3v4h4M9 12h6M9 16h6" {...draw(p.progress)} />
  </Svg>
);

export const StorefrontIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4 9l1.5-4h13L20 9M4 9v11h16V9M4 9h16" {...draw(p.progress)} />
    <path d="M9 20v-6h6v6" {...draw(p.progress)} />
  </Svg>
);

export const PinIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 21c4-5 7-8 7-12a7 7 0 0 0-14 0c0 4 3 7 7 12z" {...draw(p.progress)} />
    <circle cx="12" cy="9" r="2.6" {...draw(p.progress)} />
  </Svg>
);

export const PhoneIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="7" y="2" width="10" height="20" rx="2.5" {...draw(p.progress)} />
    <path d="M11 18.5h2" {...draw(p.progress)} />
  </Svg>
);

// business profile: storefront with small G motif
export const ProfileStorefrontIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M4 9l1.5-4h13L20 9M4 9v11h16V9M4 9h16" {...draw(p.progress)} />
    <circle cx="12" cy="15" r="2.6" {...draw(p.progress)} />
    <path d="M12 15h2v0.6" {...draw(p.progress)} />
  </Svg>
);

export const HeartbeatIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" {...draw(p.progress)} />
    <path d="M6 12h2l2-4 3 8 2-4h3" {...draw(p.progress)} />
  </Svg>
);

export const DecliningChartIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" {...draw(p.progress)} />
    <path d="M7 9l3 3 2-2 5 5" {...draw(p.progress)} />
    <path d="M17 15v-3h-3" {...draw(p.progress)} />
    <path d="M8 16v-2M11 16v-4M14 16v-1" strokeWidth={(p.strokeWidth ?? 2) * 0.8} {...draw(p.progress)} />
  </Svg>
);

export const RisingChartIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" {...draw(p.progress)} />
    <path d="M7 15l3-3 2 2 5-5" {...draw(p.progress)} />
    <path d="M17 9v3h-3" {...draw(p.progress)} />
    <path d="M8 16v-1M11 16v-3M14 16v-2" strokeWidth={(p.strokeWidth ?? 2) * 0.8} {...draw(p.progress)} />
  </Svg>
);

export const InfoIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" {...draw(p.progress)} />
    <path d="M12 11v5" {...draw(p.progress)} />
    <circle cx="12" cy="8" r="0.6" fill={p.color ?? COLORS.cyan} stroke="none" />
  </Svg>
);

export const RerouteIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M5 8a7 7 0 0 1 12-2" {...draw(p.progress)} />
    <path d="M17 3v3.5h-3.5" {...draw(p.progress)} />
    <path d="M19 16a7 7 0 0 1-12 2" {...draw(p.progress)} />
    <path d="M7 21v-3.5h3.5" {...draw(p.progress)} />
  </Svg>
);

export const WarningIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 3l9 16H3z" {...draw(p.progress)} />
    <path d="M12 9v5" {...draw(p.progress)} />
    <circle cx="12" cy="16.5" r="0.5" fill={p.color ?? COLORS.amber} stroke="none" />
  </Svg>
);

export const CheckCircleIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" {...draw(p.progress)} />
    <path d="M8 12.5l2.5 2.5 5-5" {...draw(p.progress)} />
  </Svg>
);

export const MinusCircleIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" {...draw(p.progress)} />
    <path d="M8 12h8" {...draw(p.progress)} />
  </Svg>
);

export const CustomerIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8.5" r="3.4" {...draw(p.progress)} />
    <path d="M5.5 20a6.5 6.5 0 0 1 13 0" {...draw(p.progress)} />
  </Svg>
);

export const CustomersIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3" {...draw(p.progress)} />
    <path d="M3.5 19a5.5 5.5 0 0 1 11 0" {...draw(p.progress)} />
    <circle cx="17" cy="8.5" r="2.4" {...draw(p.progress)} />
    <path d="M15 14.5a5 5 0 0 1 5.5 4" {...draw(p.progress)} />
  </Svg>
);

export const SitemapIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="9.5" y="3" width="5" height="4" rx="1" {...draw(p.progress)} />
    <rect x="3" y="16" width="5" height="4" rx="1" {...draw(p.progress)} />
    <rect x="9.5" y="16" width="5" height="4" rx="1" {...draw(p.progress)} />
    <rect x="16" y="16" width="5" height="4" rx="1" {...draw(p.progress)} />
    <path d="M12 7v4M5.5 16v-3h13v3M12 13v3" {...draw(p.progress)} />
  </Svg>
);

export const ShieldIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" {...draw(p.progress)} />
    <path d="M9 12l2 2 4-4" {...draw(p.progress)} />
  </Svg>
);

export const CodeIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" {...draw(p.progress)} />
    <path d="M9 10l-2 2 2 2M15 10l2 2-2 2" {...draw(p.progress)} />
  </Svg>
);

export const PulseCircleIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" {...draw(p.progress)} />
    <path d="M6 12h3l1.5-3 2.5 6 1.5-3H18" {...draw(p.progress)} />
  </Svg>
);

export const MonitorIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="12" rx="2" {...draw(p.progress)} />
    <path d="M8 20h8M12 16v4" {...draw(p.progress)} />
    <path d="M7 8h6M7 11h4" strokeWidth={(p.strokeWidth ?? 2) * 0.8} {...draw(p.progress)} />
  </Svg>
);

export const RankBarsIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M8 21c4-5 7-8 7-12a7 7 0 0 0-14 0c0 4 3 7 7 12z" transform="translate(-1 -2) scale(0.75)" {...draw(p.progress)} />
    <path d="M14 20v-6M17 20v-9M20 20v-4" {...draw(p.progress)} />
  </Svg>
);
