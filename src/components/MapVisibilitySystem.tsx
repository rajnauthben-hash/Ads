import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COL, FONT, EO } from "../lib/constants";

// Expanding signal ring from pin center
const SignalRing: React.FC<{ delay: number; color: string; maxR?: number }> = ({
  delay, color, maxR = 110,
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const p = interpolate(f, [0, 55], [0, 1], { extrapolateRight: "clamp" });
  const r  = interpolate(p, [0, 1], [12, maxR]);
  const op = interpolate(p, [0, 0.25, 1], [0, 0.5, 0]);
  return <circle cx={0} cy={0} r={r} fill="none" stroke={color} strokeWidth="1.2" opacity={op} />;
};

// Custom location pin SVG
const MapPin: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const ty = interpolate(f, [0, 30], [50, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const op = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const pulse = 0.8 + Math.sin((frame / 38) * Math.PI) * 0.2;

  return (
    <g opacity={op} transform={`translate(0, ${ty})`}>
      {/* Shadow glow */}
      <ellipse cx={0} cy={26} rx={24} ry={7} fill={COL.cyan} opacity={0.15 * pulse} />
      {/* Pin body */}
      <path
        d="M0 -38 C-17 -38 -28 -24 -28 -12 C-28 7 0 34 0 34 C0 34 28 7 28 -12 C28 -24 17 -38 0 -38Z"
        fill={COL.cyan}
        opacity={0.88}
      />
      {/* Inner ring */}
      <circle cx={0} cy={-12} r={10} fill={COL.bgBlack} opacity="0.85" />
      <circle cx={0} cy={-12} r={4}  fill={COL.cyan} />
      {/* Signal rings (SVG group) */}
      <SignalRing delay={delay + 18} color={COL.cyan}  maxR={90}  />
      <SignalRing delay={delay + 34} color={COL.teal}  maxR={110} />
      <SignalRing delay={delay + 50} color={COL.cyan}  maxR={90}  />
    </g>
  );
};

// Abstract map plane with dot grid and route lines
const MapPlane: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
    {/* Dot grid */}
    {Array.from({ length: 7 }).map((_, row) =>
      Array.from({ length: 16 }).map((_, col) => (
        <circle
          key={`${row}-${col}`}
          cx={col * (w / 15) + 20}
          cy={row * (h / 6) + 18}
          r={1.8}
          fill={COL.cyan}
          opacity="0.18"
        />
      ))
    )}
    {/* Route lines */}
    <path d={`M 60 ${h*0.4} Q ${w*0.3} ${h*0.3} ${w*0.55} ${h*0.45}`}
      stroke={COL.blue} strokeWidth="1" opacity="0.22" fill="none" />
    <path d={`M ${w*0.2} ${h*0.65} Q ${w*0.45} ${h*0.55} ${w*0.7} ${h*0.6}`}
      stroke={COL.teal} strokeWidth="1" opacity="0.18" fill="none" />
    {/* Coverage area circles */}
    <ellipse cx={w*0.5} cy={h*0.5} rx={w*0.22} ry={h*0.26} fill={COL.cyan} opacity="0.04" />
    <ellipse cx={w*0.5} cy={h*0.5} rx={w*0.15} ry={h*0.18} fill={COL.cyan} opacity="0.055" />
    <ellipse cx={w*0.5} cy={h*0.5} rx={w*0.08} ry={h*0.1}  fill={COL.cyan} opacity="0.07" />
  </svg>
);

// Single rank card row
const RankRow: React.FC<{
  rank: number;
  label: string;
  delay: number;
  isTop?: boolean;
}> = ({ rank, label, delay, isTop = false }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const op = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const ty = interpolate(f, [0, 22], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  // Bar fill
  const barPct = isTop ? 96 : rank === 3 ? 52 : 20;

  return (
    <div
      style={{
        opacity: op,
        translate: `0px ${ty}px`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 20px",
        borderRadius: 14,
        background: isTop ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isTop ? "rgba(34,211,238,0.32)" : "rgba(255,255,255,0.07)"}`,
        marginBottom: 10,
        boxShadow: isTop ? `0 0 28px rgba(34,211,238,0.12)` : "none",
      }}
    >
      {/* Rank number */}
      <div
        style={{
          fontFamily: FONT,
          fontSize: 26,
          fontWeight: 800,
          color: isTop ? COL.cyan : COL.muted,
          width: 44,
          flexShrink: 0,
          letterSpacing: "-0.02em",
        }}
      >
        #{rank}
      </div>

      {/* Progress bar */}
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${barPct}%`,
            borderRadius: 3,
            background: isTop
              ? `linear-gradient(90deg, ${COL.teal}, ${COL.cyan})`
              : "rgba(255,255,255,0.2)",
          }}
        />
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: FONT,
          fontSize: 18,
          fontWeight: 600,
          color: isTop ? COL.white : COL.muted,
          opacity: isTop ? 1 : 0.6,
          whiteSpace: "nowrap" as const,
          width: 120,
          flexShrink: 0,
        }}
      >
        {isTop ? "▲ Top Result" : label}
      </div>
    </div>
  );
};

export const MapVisibilitySystem: React.FC<{ delay?: number; width?: number }> = ({
  delay = 0,
  width = 880,
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const op = interpolate(f, [0, 16], [0, 1],  { extrapolateRight: "clamp" });
  const sc = interpolate(f, [0, 36], [0.92, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  const mapH = 280;

  return (
    <div style={{ opacity: op, scale: sc.toString(), width }}>
      {/* Map plane card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: mapH,
          borderRadius: 22,
          overflow: "hidden",
          background: "rgba(5,10,28,0.92)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 28px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
          marginBottom: 20,
        }}
      >
        <MapPlane w={width} h={mapH} />

        {/* Pin — centered in map */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
          }}
        >
          <svg
            width={80}
            height={120}
            viewBox="-40 -60 80 90"
            style={{ overflow: "visible" }}
          >
            <MapPin delay={delay + 14} />
          </svg>
        </div>

        {/* Map label */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 18,
            fontFamily: FONT,
            fontSize: 17,
            fontWeight: 600,
            color: COL.muted,
            letterSpacing: "0.03em",
          }}
        >
          Local Coverage Area
        </div>
      </div>

      {/* Search rank rows — stacked below map */}
      <RankRow rank={7} label="Buried result" delay={delay + 20} />
      <RankRow rank={3} label="Moving up"     delay={delay + 34} />
      <RankRow rank={1} label="Your Business" delay={delay + 50} isTop />
    </div>
  );
};
