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

// The business listing card — copy verbatim from the original ad.
const BusinessCard: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const ty = interpolate(f, [0, 26], [80, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const bob = Math.sin(frame * 0.03 + 1) * 4;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        translate: `-50% ${ty + bob}px`,
        opacity: op,
        width: 430,
        borderRadius: 18,
        border: "1px solid rgba(34,211,238,0.42)",
        background: "rgba(10,26,40,0.93)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 0 44px rgba(34,211,238,0.18), 0 26px 60px rgba(0,0,0,0.55)",
        padding: "20px 24px 16px",
        fontFamily: FONT,
      }}
    >
      <div style={{ fontSize: 25, fontWeight: 800, color: T.white, letterSpacing: "-0.01em", marginBottom: 7 }}>
        Your Business
      </div>
      <div style={{ fontSize: 18, marginBottom: 5 }}>
        <span style={{ color: T.white, fontWeight: 600 }}>4.9 </span>
        <span style={{ color: "#F5B942" }}>★★★★★</span>
        <span style={{ color: T.muted }}> (128)</span>
      </div>
      <div style={{ fontSize: 17, marginBottom: 3 }}>
        <span style={{ color: "#34D399", fontWeight: 600 }}>Open</span>
        <span style={{ color: T.muted }}> · Closes 8 PM</span>
      </div>
      <div style={{ fontSize: 17, color: T.muted, marginBottom: 14 }}>Marketing Agency</div>

      {/* Action row */}
      <div
        style={{
          display: "flex",
          gap: 10,
          borderTop: "1px solid rgba(148,197,255,0.14)",
          paddingTop: 13,
        }}
      >
        {["Call", "Directions", "Website"].map((a) => (
          <div
            key={a}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "9px 0",
              borderRadius: 22,
              background: "rgba(34,211,238,0.10)",
              border: "1px solid rgba(34,211,238,0.3)",
              fontSize: 16.5,
              fontWeight: 600,
              color: T.cyan,
            }}
          >
            {a}
          </div>
        ))}
      </div>
    </div>
  );
};

// Nearby-competitor skeletons — text-free props on the map floor.
const CompetitorGhost: React.FC<{ delay: number; x: number; y: number }> = ({ delay, x, y }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 16], [0, 0.4], { extrapolateRight: "clamp" });
  const ty = interpolate(f, [0, 26], [60, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        translate: `-50% ${ty}px`,
        opacity: op,
        width: 300,
        borderRadius: 14,
        border: "1px solid rgba(148,197,255,0.14)",
        background: T.panel,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 13,
      }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ width: "70%", height: 9, borderRadius: 3, background: "rgba(148,197,255,0.25)", marginBottom: 7 }} />
        <div style={{ width: "45%", height: 7, borderRadius: 3, background: "rgba(148,197,255,0.14)" }} />
      </div>
    </div>
  );
};

// Local search growth stat — copy verbatim from the original ad.
const GrowthStatCard: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const tx = interpolate(f, [0, 28], [70, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const pct = Math.round(interpolate(f, [4, 24], [0, 127], { extrapolateRight: "clamp" }));
  const bob = Math.sin(frame * 0.028 + 4) * 4;

  return (
    <div
      style={{
        opacity: op,
        translate: `${tx}px ${bob}px`,
        width: 270,
        borderRadius: 16,
        border: "1px solid rgba(148,197,255,0.22)",
        background: T.panel,
        backdropFilter: "blur(14px)",
        boxShadow: "0 22px 52px rgba(0,0,0,0.5)",
        padding: "18px 22px",
        fontFamily: FONT,
      }}
    >
      <div style={{ fontSize: 17, fontWeight: 600, color: T.muted, marginBottom: 6 }}>
        Local Search Growth
      </div>
      <div style={{ fontSize: 42, fontWeight: 800, color: T.cyan, letterSpacing: "-0.02em", marginBottom: 4, textShadow: "0 0 24px rgba(34,211,238,0.4)" }}>
        +{pct}%
      </div>
      <div style={{ fontSize: 15.5, color: T.muted, lineHeight: 1.35 }}>
        increase in local search visibility
      </div>
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
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span style={{ color: T.cyan, fontSize: 17 }}>✓</span>
      {children}
    </div>
  );
};

// SCENE 5 — holographic map, pin drop, business card, growth stat.
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

      {/* The business listing rising below the pin */}
      <Parallax depth={0.8} phase={6}>
        <AbsoluteFill style={{ translate: "0px 10px" }}>
          <BusinessCard delay={34} />
        </AbsoluteFill>
      </Parallax>

      {/* Growth stat — floats beside the pin */}
      <Parallax depth={0.7} phase={7}>
        <div style={{ position: "absolute", top: 620, left: "50%", translate: "calc(-50% + 330px) 0" }}>
          <GrowthStatCard delay={56} />
        </div>
      </Parallax>

      {/* Competitor skeleton props on the floor */}
      <Parallax depth={0.5} phase={8}>
        <CompetitorGhost delay={48} x={-235} y={256} />
        <CompetitorGhost delay={58} x={245}  y={296} />
      </Parallax>

      {/* Copy — top area (map owns the lower half) */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 208 }}>
        <Kicker delay={16} pill style={{ marginBottom: 16 }}>Google Maps Optimization</Kicker>
        <CinematicText delay={24} size={66} maxWidth={860}>
          Show up where
        </CinematicText>
        <CinematicText delay={34} size={66} gradient glow>
          customers are searching.
        </CinematicText>
      </AbsoluteFill>

      {/* Trust chips — bottom (verbatim from the original card) */}
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
        <LabelChip delay={58}>Top Rated</LabelChip>
        <LabelChip delay={66}>Locally Trusted</LabelChip>
        <LabelChip delay={74}>Easily Found</LabelChip>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
