import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from "remotion";
import { Parallax } from "../components/CameraRig";
import { CinematicText, Kicker } from "../components/CinematicText";
import { T, FONT, EO } from "../theme";

// Holographic ground map — perspective-tilted glowing grid.
const MapPlane: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const pulse = 0.6 + Math.sin(f * 0.05) * 0.4;

  const W = 1240;
  const H = 860;
  const cols = 11;
  const rows = 8;

  return (
    <div
      style={{
        width: W,
        height: H,
        opacity: op,
        transform: "perspective(1100px) rotateX(56deg)",
        transformOrigin: "50% 100%",
      }}
    >
      <svg width={W} height={H}>
        {/* Grid */}
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <line key={`v${i}`} x1={(W / cols) * i} y1={0} x2={(W / cols) * i} y2={H}
            stroke={T.line} strokeWidth={1} />
        ))}
        {Array.from({ length: rows + 1 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={(H / rows) * i} x2={W} y2={(H / rows) * i}
            stroke={T.line} strokeWidth={1} />
        ))}
        {/* Roads */}
        <path d={`M 0 ${H * 0.62} L ${W} ${H * 0.44}`} stroke="rgba(120,210,255,0.35)" strokeWidth={2.5} />
        <path d={`M ${W * 0.38} 0 L ${W * 0.55} ${H}`} stroke="rgba(120,210,255,0.28)" strokeWidth={2} />
        {/* Pulsing coverage rings around center */}
        {[0.14, 0.24, 0.35].map((r, i) => (
          <ellipse
            key={i}
            cx={W * 0.5}
            cy={H * 0.52}
            rx={W * r * (0.9 + pulse * 0.1)}
            ry={W * r * 0.52 * (0.9 + pulse * 0.1)}
            fill="none"
            stroke={`rgba(34,211,238,${(0.3 - i * 0.08) * pulse})`}
            strokeWidth={1.5}
          />
        ))}
        <ellipse cx={W * 0.5} cy={H * 0.52} rx={W * 0.12} ry={W * 0.062}
          fill={`rgba(34,211,238,${0.10 * pulse})`} />
      </svg>
    </div>
  );
};

// The big pin — springs down, lands with a flare.
const DropPin: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = Math.max(0, frame - delay);

  const drop = spring({ frame: f, fps, config: { damping: 13, stiffness: 120, mass: 0.9 } });
  const y = interpolate(drop, [0, 1], [-620, 0]);
  const op = interpolate(f, [0, 6], [0, 1], { extrapolateRight: "clamp" });

  // Landing flare + ripple (land ≈ f 12)
  const flare = interpolate(f, [11, 14, 30], [0, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rip = interpolate(f, [12, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glowPulse = 0.7 + Math.sin(frame * 0.07) * 0.3;

  return (
    <div style={{ position: "relative", width: 220, height: 260, opacity: op }}>
      {/* Ripples on the ground */}
      {rip > 0 && rip < 1 && (
        <>
          {[0, 0.3].map((off, i) => {
            const p = Math.max(0, Math.min(1, rip - off));
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: 6,
                  translate: "-50% 50%",
                  width: 60 + p * 340,
                  height: (60 + p * 340) * 0.32,
                  borderRadius: "50%",
                  border: `1.5px solid rgba(34,211,238,${0.55 * (1 - p)})`,
                }}
              />
            );
          })}
        </>
      )}

      {/* Landing flash */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -8,
          translate: "-50% 50%",
          width: 260,
          height: 90,
          borderRadius: "50%",
          background: `radial-gradient(ellipse at center, rgba(180,240,255,${flare}) 0%, transparent 65%)`,
        }}
      />

      {/* Pin */}
      <svg
        width={124}
        height={150}
        viewBox="0 0 124 150"
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          translate: `-50% ${y}px`,
          filter: `drop-shadow(0 0 26px rgba(34,211,238,${0.6 * glowPulse}))`,
        }}
      >
        <path
          d="M62 6 C34 6 14 27 14 52 C14 86 62 142 62 142 C62 142 110 86 110 52 C110 27 90 6 62 6 Z"
          fill={T.cyan}
        />
        <circle cx={62} cy={52} r={21} fill="#04121E" />
        <circle cx={62} cy={52} r={9} fill="#CFF6FF" />
      </svg>
    </div>
  );
};

// Search result card rising from the map floor.
const SearchCard: React.FC<{
  delay: number; x: number; y: number; top?: boolean; name: string; rating?: string;
}> = ({ delay, x, y, top = false, name, rating }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const ty = interpolate(f, [0, 26], [80, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const bob = Math.sin(frame * 0.03 + delay) * 4;

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        translate: `-50% ${ty + bob}px`,
        opacity: op * (top ? 1 : 0.65),
        width: top ? 400 : 330,
        borderRadius: 16,
        border: `1px solid ${top ? "rgba(34,211,238,0.45)" : "rgba(148,197,255,0.16)"}`,
        background: top ? "rgba(10,26,40,0.92)" : T.panel,
        backdropFilter: "blur(14px)",
        boxShadow: top
          ? "0 0 44px rgba(34,211,238,0.2), 0 26px 60px rgba(0,0,0,0.55)"
          : "0 20px 46px rgba(0,0,0,0.5)",
        padding: top ? "18px 22px" : "14px 18px",
        fontFamily: FONT,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: top ? 42 : 34,
          height: top ? 42 : 34,
          borderRadius: 11,
          background: top ? T.cyan : "rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: top ? 19 : 15,
          fontWeight: 800,
          color: top ? "#04121E" : T.muted,
          flexShrink: 0,
          boxShadow: top ? "0 0 20px rgba(34,211,238,0.5)" : "none",
        }}
      >
        {top ? "1" : "·"}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: top ? 22 : 18, fontWeight: 700, color: top ? T.white : "rgba(226,240,255,0.6)", whiteSpace: "nowrap" }}>
          {name}
        </div>
        {rating && (
          <div style={{ fontSize: 16, color: top ? "#F5B942" : T.muted, marginTop: 3 }}>
            {rating}
          </div>
        )}
      </div>
      {top && (
        <div
          style={{
            marginLeft: "auto",
            padding: "6px 14px",
            borderRadius: 20,
            background: "rgba(34,211,238,0.15)",
            border: "1px solid rgba(34,211,238,0.4)",
            fontSize: 14,
            fontWeight: 700,
            color: T.cyan,
            whiteSpace: "nowrap",
          }}
        >
          Top Result
        </div>
      )}
    </div>
  );
};

// Customers converging toward the pin along curved paths.
const ConvergingCustomer: React.FC<{ delay: number; fromX: number; fromY: number }> = ({
  delay, fromX, fromY,
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const p = interpolate(f, [0, 70], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });
  const op = interpolate(p, [0, 0.15, 0.85, 1], [0, 0.85, 0.7, 0]);

  // Quadratic path toward center-lower (pin base ~ (0, 210))
  const cx = fromX * 0.4;
  const cy = fromY * 0.15 - 60;
  const x = (1 - p) * (1 - p) * fromX + 2 * (1 - p) * p * cx + p * p * 0;
  const y = (1 - p) * (1 - p) * fromY + 2 * (1 - p) * p * cy + p * p * 210;

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        translate: "-50% -50%",
        opacity: op,
      }}
    >
      <svg width={26} height={26} viewBox="0 0 24 24">
        <circle cx={12} cy={8} r={4} fill="rgba(190,240,255,0.9)" />
        <path d="M4 21 c0 -4.5 3.5 -7 8 -7 s8 2.5 8 7" fill="rgba(190,240,255,0.75)" />
      </svg>
    </div>
  );
};

const LabelChip: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const sc = interpolate(f, [0, 22], [0.9, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  return (
    <div
      style={{
        opacity: op,
        scale: sc.toString(),
        padding: "11px 22px",
        borderRadius: 40,
        border: "1px solid rgba(34,211,238,0.3)",
        background: "rgba(34,211,238,0.08)",
        fontFamily: FONT,
        fontSize: 20,
        fontWeight: 600,
        color: T.white,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

// SCENE 5 — holographic map, pin drop, customers converge.
export const GoogleVisibilityScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, dur], [1.0, 1.09], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ scale: push.toString(), transformOrigin: "50% 55%" }}>

      {/* Ground map */}
      <Parallax depth={0.3} phase={2}>
        <div style={{ position: "absolute", top: 555, left: "50%", translate: "-50% 0" }}>
          <MapPlane delay={0} />
        </div>
      </Parallax>

      {/* Pin — lands at map center */}
      <Parallax depth={0.55} phase={4}>
        <div style={{ position: "absolute", top: 664, left: "50%", translate: "-50% 0" }}>
          <DropPin delay={10} />
        </div>
      </Parallax>

      {/* Converging customers */}
      <Parallax depth={0.6} phase={5}>
        <AbsoluteFill style={{ translate: "0px -300px" }}>
          <ConvergingCustomer delay={40} fromX={-430} fromY={-120} />
          <ConvergingCustomer delay={52} fromX={440}  fromY={-60} />
          <ConvergingCustomer delay={64} fromX={-380} fromY={300} />
          <ConvergingCustomer delay={74} fromX={400}  fromY={330} />
          <ConvergingCustomer delay={86} fromX={60}   fromY={-380} />
        </AbsoluteFill>
      </Parallax>

      {/* Search results rising from the floor */}
      <Parallax depth={0.8} phase={6}>
        <SearchCard delay={34} x={-6}   y={-8}  top name="Your Business" rating="★★★★★ 4.9 · Open" />
        <SearchCard delay={48} x={-215} y={196} name="Competitor A" />
        <SearchCard delay={58} x={225}  y={228} name="Competitor B" />
      </Parallax>

      {/* Copy — top area (map owns the lower half) */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 208 }}>
        <Kicker delay={16} style={{ marginBottom: 14 }}>Google Maps Optimization</Kicker>
        <CinematicText delay={24} size={66} maxWidth={860}>
          Show up where
        </CinematicText>
        <CinematicText delay={34} size={66} gradient glow>
          customers are searching.
        </CinematicText>
      </AbsoluteFill>

      {/* Label chips — bottom */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 12,
          paddingBottom: 200,
        }}
      >
        <LabelChip delay={70}>Google visibility</LabelChip>
        <LabelChip delay={78}>Lead generation</LabelChip>
        <LabelChip delay={86}>Local search growth</LabelChip>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
