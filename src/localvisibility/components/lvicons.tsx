/** Extra row icons for the Business Profile panel (per reference keyframe 02). */

type P = { size?: number; color?: string; strokeWidth?: number };
const base = (size: number) => ({ width: size, height: size, display: "block" }) as const;

export const IconShopSmall: React.FC<P> = ({ size = 26, color = "#C6CBD0", strokeWidth = 1.8 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 9.5 5.2 4.5h13.6L20 9.5" />
    <path d="M4 9.5a2.6 2.6 0 0 0 5.3 0 2.65 2.65 0 0 0 5.4 0 2.6 2.6 0 0 0 5.3 0" />
    <path d="M5.5 12v7.5h13V12" />
    <path d="M9.5 19.5v-5h5v5" />
  </svg>
);

export const IconTag: React.FC<P> = ({ size = 26, color = "#C6CBD0", strokeWidth = 1.8 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.5 11V3.5H11l9.5 9.5-7.5 7.5z" />
    <circle cx="7.6" cy="7.6" r="1.4" />
  </svg>
);

export const IconWrench: React.FC<P> = ({ size = 26, color = "#C6CBD0", strokeWidth = 1.8 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 6.5a4.2 4.2 0 0 1 5.6-4l-3 3 .9 2.5 2.5.9 3-3a4.2 4.2 0 0 1-5.9 5.4L8.4 20.5a2 2 0 0 1-2.9-2.9l9.2-9.2a4.2 4.2 0 0 1-.2-1.9z" transform="scale(0.86) translate(1.5,1.5)" />
  </svg>
);

export const IconImage: React.FC<P> = ({ size = 26, color = "#C6CBD0", strokeWidth = 1.8 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <circle cx="9" cy="9.6" r="1.7" />
    <path d="M4.5 17.5 10 12.5l3.4 3 3-2.6 3.1 3" />
  </svg>
);

export const IconGlobe: React.FC<P> = ({ size = 26, color = "#C6CBD0", strokeWidth = 1.8 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
    <circle cx="12" cy="12" r="8.6" />
    <path d="M3.4 12h17.2M12 3.4c-4.8 4.8-4.8 12.4 0 17.2 4.8-4.8 4.8-12.4 0-17.2z" />
  </svg>
);
