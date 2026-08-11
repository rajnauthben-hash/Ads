import React from "react";

// Line icons (48x48, stroke = color). Drawn to echo the reference set.
type P = { size?: number; color?: string; sw?: number };
const S: React.FC<P & { children: React.ReactNode }> = ({ size = 48, color = "#D89B34", sw = 2.4, children }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const IcBuilding: React.FC<P> = (p) => (
  <S {...p}>
    <rect x="12" y="8" width="17" height="32" />
    <rect x="29" y="18" width="9" height="22" />
    <path d="M16 14h3M22 14h3M16 20h3M22 20h3M16 26h3M22 26h3M33 24h2M33 30h2" />
  </S>
);
export const IcPeople: React.FC<P> = (p) => (
  <S {...p}>
    <circle cx="18" cy="17" r="5" />
    <circle cx="31" cy="19" r="4" />
    <path d="M9 38c0-6 4-9 9-9s9 3 9 9M28 34c.5-4 3-6 7-6s6 2 6.5 6" />
  </S>
);
export const IcBox: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M24 8l14 7-14 7-14-7 14-7Z" />
    <path d="M10 15v18l14 7 14-7V15M24 22v18" />
  </S>
);
export const IcBolt: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M26 6 12 26h9l-2 16 16-22h-9l4-14Z" />
  </S>
);
export const IcMegaphone: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M10 20v8l4 1 3 9h4l-2-8 17 6V13L19 21h-5l-4-1Z" />
    <path d="M38 20c3 1 4 6 0 8" />
  </S>
);
export const IcPhone: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M14 10c-2 0-4 2-4 4 0 13 11 24 24 24 2 0 4-2 4-4v-5l-8-3-3 4c-4-2-8-6-10-10l4-3-3-8h-4Z" />
  </S>
);
export const IcPin: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M24 6c-7 0-12 5-12 12 0 9 12 24 12 24s12-15 12-24c0-7-5-12-12-12Z" />
    <circle cx="24" cy="18" r="4.5" />
  </S>
);
export const IcDoor: React.FC<P> = (p) => (
  <S {...p}>
    <rect x="15" y="8" width="18" height="32" />
    <path d="M20 24v2" />
  </S>
);
export const IcSearch: React.FC<P> = (p) => (
  <S {...p}>
    <circle cx="21" cy="21" r="11" />
    <path d="M30 30l9 9" />
  </S>
);
export const IcClock: React.FC<P> = (p) => (
  <S {...p}>
    <circle cx="24" cy="24" r="15" />
    <path d="M24 14v10l7 5" />
  </S>
);
export const IcStarChat: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M8 12h32v20H24l-9 7 1-7H8V12Z" />
    <path d="M24 17l2.2 4.5 5 .6-3.7 3.4 1 4.9L24 27.9 19.5 30.4l1-4.9-3.7-3.4 5-.6L24 17Z" />
  </S>
);
export const IcInfo: React.FC<P> = (p) => (
  <S {...p}>
    <circle cx="24" cy="24" r="15" />
    <path d="M24 21v10M24 16.5v.2" />
  </S>
);
export const IcWalk: React.FC<P> = (p) => (
  <S {...p}>
    <circle cx="26" cy="10" r="3.5" />
    <path d="M24 17l-5 8 4 4 1 9M24 20l7 3M19 25l-5 3M27 29l4 7" />
  </S>
);
export const IcSwap: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M12 19h24l-6-6M36 29H12l6 6" />
  </S>
);
export const IcArrow: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M10 24h26M28 15l9 9-9 9" />
  </S>
);
