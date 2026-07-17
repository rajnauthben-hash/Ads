/** Small stroke-based icon set shared across scenes. */

type IconProps = { size?: number; color?: string; strokeWidth?: number };

const base = (size: number) =>
  ({ width: size, height: size, display: "block" }) as const;

export const IconMagnifier: React.FC<IconProps> = ({ size = 28, color = "#C7CDD3", strokeWidth = 2.4 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
    <circle cx="10.5" cy="10.5" r="6.2" />
    <path d="M15.2 15.2 L20 20" />
  </svg>
);

export const IconStar: React.FC<IconProps & { fill?: string }> = ({ size = 28, color = "#C7CDD3", strokeWidth = 2, fill = "none" }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round">
    <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3L2.8 9.5l6.4-.8z" />
  </svg>
);

export const IconPin: React.FC<IconProps> = ({ size = 28, color = "#C7CDD3", strokeWidth = 2.2 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21.5c4.2-4.6 6.5-8 6.5-11A6.5 6.5 0 0 0 5.5 10.5c0 3 2.3 6.4 6.5 11z" />
    <circle cx="12" cy="10.3" r="2.4" />
  </svg>
);

export const IconClock: React.FC<IconProps> = ({ size = 28, color = "#C7CDD3", strokeWidth = 2.2 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 7.2V12l3.4 2.2" />
  </svg>
);

export const IconChat: React.FC<IconProps> = ({ size = 28, color = "#C7CDD3", strokeWidth = 2.2 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5.5h16v11H10l-4.5 3.6V16.5H4z" />
    <path d="M8.2 11h.01M12 11h.01M15.8 11h.01" strokeWidth={2.8} />
  </svg>
);

export const IconPhone: React.FC<IconProps & { fill?: string }> = ({ size = 28, color = "#fff", strokeWidth = 0, fill = "#fff" }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill={fill} stroke={color} strokeWidth={strokeWidth}>
    <path d="M6.8 3.2c.7-.4 1.6-.2 2.1.5l1.7 2.5c.4.6.4 1.5-.1 2l-1.2 1.3c.5 1.2 2.4 3.6 4.4 4.7l1.5-1c.6-.4 1.4-.4 1.9.1l2.2 2c.6.6.7 1.5.2 2.2l-1 1.4c-.5.7-1.4 1-2.2.8-6.4-1.8-10.8-7.2-11.8-12.6-.2-.9.2-1.8 1-2.3z" />
  </svg>
);

export const IconCheck: React.FC<IconProps & { progress?: number }> = ({ size = 28, color = "#fff", strokeWidth = 3, progress = 1 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path
      d="M4.5 12.5l5 5 10-11"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
    />
  </svg>
);

export const IconX: React.FC<IconProps> = ({ size = 28, color = "#B9C0C7", strokeWidth = 2.8 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconWarn: React.FC<IconProps> = ({ size = 28, color = "#D8A24A", strokeWidth = 2.2 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3.6 21.4 20H2.6z" />
    <path d="M12 9.5v5" />
    <path d="M12 17.4h.01" strokeWidth={3} />
  </svg>
);

export const IconTrophy: React.FC<IconProps> = ({ size = 28, color = "#F4F6F8", strokeWidth = 2 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
    <path d="M8 5H4.5c0 3 1.5 4.6 3.5 5M16 5h3.5c0 3-1.5 4.6-3.5 5" />
    <path d="M12 13v3.5M8.5 20h7M10 16.5h4" />
  </svg>
);

export const IconBlocked: React.FC<IconProps> = ({ size = 28, color = "#FF5A4F", strokeWidth = 2.4 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
    <circle cx="12" cy="12" r="8.6" />
    <path d="M5.9 5.9l12.2 12.2" />
  </svg>
);

export const IconPerson: React.FC<IconProps & { fill?: string }> = ({ size = 28, fill = "#11D9F7" }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill={fill}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20.5c.6-4 3.6-6 7.5-6s6.9 2 7.5 6z" />
  </svg>
);

export const IconBulb: React.FC<IconProps & { progress?: number }> = ({ size = 28, color = "#11D9F7", strokeWidth = 2, progress = 1 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <g pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress}>
      <path d="M12 4.2a5.4 5.4 0 0 1 3.2 9.8c-.7.5-1 1.2-1 2v.6h-4.4V16c0-.8-.3-1.5-1-2A5.4 5.4 0 0 1 12 4.2z" />
      <path d="M10.2 19.4h3.6M10.8 21.6h2.4" />
      <path d="M12 1.2v1M4.6 4.8l.8.8M19.4 4.8l-.8.8M2.8 11h1.1M20.1 11h1.1" />
    </g>
  </svg>
);

export const IconDoor: React.FC<IconProps & { progress?: number }> = ({ size = 28, color = "#11D9F7", strokeWidth = 2, progress = 1 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <g pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress}>
      <path d="M5 21V4.5h9.5V21" />
      <path d="M14.5 6.5 19 4.6V21" />
      <path d="M5 21h14" />
      <path d="M11.8 12.2v1.6" />
    </g>
  </svg>
);

export const IconInfo: React.FC<IconProps> = ({ size = 28, color = "#11D9F7", strokeWidth = 2 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5" />
    <path d="M12 7.4h.01" strokeWidth={3} />
  </svg>
);

export const IconArrowLeft: React.FC<IconProps> = ({ size = 28, color = "#C7CDD3", strokeWidth = 2.2 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 5.5 8 12l6.5 6.5" />
  </svg>
);

export const IconPhoneMini: React.FC<IconProps> = ({ size = 28, color = "#11D9F7", strokeWidth = 2 }) => (
  <svg viewBox="0 0 24 24" style={base(size)} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="2.8" width="10" height="18.4" rx="2.4" />
    <path d="M10.5 18.6h3" />
  </svg>
);
