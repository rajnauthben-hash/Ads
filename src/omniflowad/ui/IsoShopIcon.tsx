import { PAL } from "../theme";

/**
 * Small dimensional shop for the scene 04 diagram.
 * Variants: competitor (striped awning), crown (blue sign), customer (yellow sign).
 * The glow ring under each shop is drawn separately so scenes control its color.
 */
export const IsoShopIcon: React.FC<{
  variant: "competitor" | "crown" | "customer";
  label: string;
  ring?: string;
  ringOpacity?: number;
  lit?: number;
  frame?: number;
}> = ({ variant, label, ring = PAL.cyan, ringOpacity = 0.8, lit = 1, frame = 0 }) => {
  const signFill = variant === "crown" ? "#1E3F8A" : variant === "customer" ? "#E8C23A" : "#101215";
  const signText = variant === "customer" ? "#171207" : "#F2F4F6";
  const ringPulse = 0.75 + 0.25 * Math.sin(frame / 11);

  return (
    <svg viewBox="0 0 300 260" style={{ display: "block", width: "100%", overflow: "visible" }}>
      <defs>
        <radialGradient id={`ring-${variant}`}>
          <stop offset="0" stopColor={ring} stopOpacity="0.22" />
          <stop offset="0.75" stopColor={ring} stopOpacity="0.05" />
          <stop offset="1" stopColor={ring} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`glass-${variant}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A3614" />
          <stop offset="1" stopColor="#241304" />
        </linearGradient>
      </defs>

      {/* ground glow ring */}
      <ellipse cx={150} cy={222} rx={118} ry={30} fill={`url(#ring-${variant})`} opacity={ringOpacity * ringPulse} />
      <ellipse cx={150} cy={222} rx={100} ry={24} fill="none" stroke={ring} strokeWidth={3} opacity={ringOpacity * 0.85} />
      <ellipse cx={150} cy={222} rx={118} ry={30} fill="none" stroke={ring} strokeWidth={1.6} opacity={ringOpacity * 0.4} />

      {/* building */}
      <g>
        {/* side face */}
        <polygon points="228,96 262,74 262,176 228,208" fill="#0A0908" stroke="rgba(255,255,255,0.05)" strokeWidth={1.5} />
        {/* roof */}
        <polygon points="64,96 98,66 262,74 228,96" fill="#12100D" stroke="rgba(255,255,255,0.06)" strokeWidth={1.5} />
        {/* front face */}
        <rect x={64} y={96} width={164} height={112} fill="#16130F" stroke="rgba(255,255,255,0.07)" strokeWidth={1.5} />

        {/* sign band */}
        <rect x={72} y={102} width={148} height={30} rx={4} fill={signFill} stroke="rgba(255,255,255,0.12)" strokeWidth={1.4} />
        <text
          x={146}
          y={123}
          textAnchor="middle"
          fontFamily="Inter Tight, Inter, sans-serif"
          fontWeight={800}
          fontSize={variant === "crown" ? 15 : 16}
          letterSpacing={0.6}
          fill={signText}
        >
          {label}
        </text>

        {/* competitor's striped awning */}
        {variant === "competitor" && (
          <g>
            {Array.from({ length: 8 }, (_, i) => (
              <polygon
                key={i}
                points={`${74 + i * 18},136 ${92 + i * 18},136 ${96 + i * 18},152 ${78 + i * 18},152`}
                fill={i % 2 === 0 ? "#C0392B" : "#E8E2D8"}
              />
            ))}
            <rect x={74} y={150} width={148} height={4} fill="#0D0B09" />
          </g>
        )}

        {/* windows + door */}
        <rect x={78} y={variant === "competitor" ? 158 : 142} width={58} height={variant === "competitor" ? 44 : 60} rx={3} fill={`url(#glass-${variant})`} opacity={0.5 + 0.5 * lit} />
        <rect x={144} y={variant === "competitor" ? 158 : 142} width={30} height={variant === "competitor" ? 44 : 60} rx={3} fill={`url(#glass-${variant})`} opacity={0.4 + 0.5 * lit} />
        <rect x={182} y={variant === "competitor" ? 158 : 142} width={34} height={variant === "competitor" ? 44 : 60} rx={3} fill="#2E1B08" opacity={0.6 + 0.4 * lit} />
        {/* warm light spill */}
        <rect x={72} y={140} width={150} height={64} fill="#F2C87F" opacity={0.1 * lit} />
      </g>

      {/* doorstep */}
      <rect x={116} y={208} width={68} height={7} rx={2} fill="#0D0B09" />
    </svg>
  );
};
