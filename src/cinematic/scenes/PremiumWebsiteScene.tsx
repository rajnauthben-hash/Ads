import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Parallax } from "../components/CameraRig";
import { CinematicText, Kicker } from "../components/CinematicText";
import { WebsiteMockup } from "../../components/WebsiteMockup";
import { T, FONT, EO } from "../theme";

// Floating satellite: phone mockup with mini UI.
const PhoneMockup: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const tx = interpolate(f, [0, 30], [90, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const bob = Math.sin(frame * 0.028 + 1) * 6;

  return (
    <div
      style={{
        opacity: op,
        translate: `${tx}px ${bob}px`,
        width: 172,
        height: 348,
        borderRadius: 28,
        border: "1px solid rgba(148,197,255,0.28)",
        background: "#060D20",
        boxShadow: "0 32px 70px rgba(0,0,0,0.65), 0 0 46px rgba(34,211,238,0.14), inset 0 1px 0 rgba(255,255,255,0.08)",
        padding: 10,
        rotate: "4deg",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 19,
          background: "linear-gradient(170deg, #0A1734 0%, #070E22 100%)",
          overflow: "hidden",
          padding: "16px 12px",
        }}
      >
        <div style={{ width: 44, height: 5, borderRadius: 2, background: "rgba(255,255,255,0.5)", marginBottom: 12 }} />
        <div style={{ width: "88%", height: 9, borderRadius: 3, background: "rgba(255,255,255,0.85)", marginBottom: 6 }} />
        <div style={{ width: "66%", height: 9, borderRadius: 3, background: "rgba(255,255,255,0.75)", marginBottom: 10 }} />
        <div style={{ width: "50%", height: 6, borderRadius: 2, background: "rgba(255,255,255,0.25)", marginBottom: 14 }} />
        <div
          style={{
            width: 86,
            height: 26,
            borderRadius: 7,
            background: T.cyan,
            boxShadow: "0 0 18px rgba(34,211,238,0.5)",
            marginBottom: 16,
          }}
        />
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              height: 44,
              borderRadius: 9,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              marginBottom: 8,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Performance gauge card.
const SpeedCard: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const tx = interpolate(f, [0, 28], [-70, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const score = Math.round(interpolate(f, [6, 52], [40, 98], { extrapolateRight: "clamp" }));
  const sweep = interpolate(f, [6, 52], [0, 0.98], { extrapolateRight: "clamp" });
  const bob = Math.sin(frame * 0.026 + 3) * 5;

  const R = 30;
  const C = 2 * Math.PI * R;

  return (
    <div
      style={{
        opacity: op,
        translate: `${tx}px ${bob}px`,
        width: 235,
        borderRadius: 18,
        border: "1px solid rgba(148,197,255,0.2)",
        background: T.panel,
        backdropFilter: "blur(16px)",
        boxShadow: "0 26px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        rotate: "-3deg",
        fontFamily: FONT,
      }}
    >
      <svg width={72} height={72} viewBox="0 0 72 72">
        <circle cx={36} cy={36} r={R} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth={6} />
        <circle
          cx={36} cy={36} r={R} fill="none"
          stroke={T.cyan} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={`${C * sweep} ${C}`}
          style={{ transform: "rotate(-90deg)", transformOrigin: "36px 36px" }}
        />
        <text x={36} y={42} textAnchor="middle" fontFamily={FONT} fontSize={20} fontWeight={800} fill={T.white}>
          {score}
        </text>
      </svg>
      <div>
        <div style={{ fontSize: 19, fontWeight: 700, color: T.white, marginBottom: 3 }}>Performance</div>
        <div style={{ fontSize: 15, color: T.muted }}>Loads instantly</div>
      </div>
    </div>
  );
};

// Analytics mini card.
const AnalyticsCard: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const ty = interpolate(f, [0, 28], [50, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const bob = Math.sin(frame * 0.03 + 5) * 5;
  const bars = [0.35, 0.5, 0.42, 0.66, 0.78, 0.95];

  return (
    <div
      style={{
        opacity: op,
        translate: `0px ${ty + bob}px`,
        width: 245,
        borderRadius: 18,
        border: "1px solid rgba(148,197,255,0.2)",
        background: T.panel,
        backdropFilter: "blur(16px)",
        boxShadow: "0 26px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
        padding: "18px 20px",
        rotate: "2.5deg",
        fontFamily: FONT,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: T.white }}>Leads</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.cyan }}>↑ growing</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 7, height: 62 }}>
        {bars.map((b, i) => {
          const grow = interpolate(f, [10 + i * 5, 30 + i * 5], [0, b], { extrapolateRight: "clamp" });
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${grow * 100}%`,
                borderRadius: 4,
                background: i >= 4 ? `linear-gradient(180deg, ${T.cyan}, ${T.teal})` : "rgba(148,197,255,0.28)",
                boxShadow: i >= 4 ? "0 0 12px rgba(34,211,238,0.4)" : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// Data lines from the site down to customer dots.
const ConnectionLines: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const p = interpolate(f, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const op = interpolate(f, [0, 16], [0, 0.5], { extrapolateRight: "clamp" });

  const paths = [
    "M 540 0 C 540 90, 350 110, 330 190",
    "M 540 0 C 540 100, 540 140, 540 195",
    "M 540 0 C 540 90, 730 110, 750 190",
  ];

  return (
    <svg width={1080} height={230} style={{ opacity: op, display: "block" }}>
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={T.cyan}
          strokeWidth={1.5}
          strokeDasharray="340"
          strokeDashoffset={340 * (1 - p)}
        />
      ))}
      {[330, 540, 750].map((x, i) => (
        <g key={i} opacity={p}>
          <circle cx={x} cy={205} r={13} fill="rgba(34,211,238,0.12)" stroke="rgba(34,211,238,0.5)" strokeWidth={1} />
          <circle cx={x} cy={201} r={4} fill="rgba(190,235,255,0.9)" />
          <path d={`M ${x - 6} 212 c0 -4 3 -6 6 -6 s6 2 6 6`} fill="rgba(190,235,255,0.7)" />
        </g>
      ))}
    </svg>
  );
};

// SCENE 4 — the premium website forms in 3D and the camera orbits it.
export const PremiumWebsiteScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();

  // Fake orbit: rotateY swings across the scene with slight rotateX shift
  const yaw = interpolate(frame, [0, dur], [-7, 6], { extrapolateRight: "clamp" });
  const pitch = interpolate(frame, [0, dur], [3.5, -1.5], { extrapolateRight: "clamp" });
  const push = interpolate(frame, [0, dur], [0.98, 1.06], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>

      {/* Orbit group */}
      <AbsoluteFill
        style={{
          transform: `perspective(1500px) rotateY(${yaw}deg) rotateX(${pitch}deg) scale(${push})`,
          transformOrigin: "50% 42%",
        }}
      >
        {/* Main site */}
        <Parallax depth={0.4} phase={2}>
          <div style={{ position: "absolute", top: 330, left: "50%", translate: "-50% 0" }}>
            <WebsiteMockup delay={8} width={760} />
          </div>
        </Parallax>

        {/* Connection lines below site */}
        <Parallax depth={0.4} phase={2}>
          <div style={{ position: "absolute", top: 830, left: "50%", translate: "-50% 0", width: 1080 }}>
            <ConnectionLines delay={96} />
          </div>
        </Parallax>

        {/* Satellites — nearer depth, float over edges */}
        <Parallax depth={0.85} phase={4}>
          <div style={{ position: "absolute", top: 560, left: "50%", translate: "calc(-50% + 355px) 0" }}>
            <PhoneMockup delay={56} />
          </div>
        </Parallax>
        <Parallax depth={0.8} phase={6}>
          <div style={{ position: "absolute", top: 268, left: "50%", translate: "calc(-50% - 328px) 0" }}>
            <SpeedCard delay={74} />
          </div>
        </Parallax>
        <Parallax depth={0.9} phase={8}>
          <div style={{ position: "absolute", top: 812, left: "50%", translate: "calc(-50% - 320px) 0" }}>
            <AnalyticsCard delay={88} />
          </div>
        </Parallax>
      </AbsoluteFill>

      {/* Copy */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 258,
          gap: 6,
        }}
      >
        <Kicker delay={100} style={{ marginBottom: 8 }}>What we build</Kicker>
        <CinematicText delay={108} size={84}>
          Premium Websites.
        </CinematicText>
        <CinematicText delay={122} size={84} gradient glow tracking>
          Built to convert.
        </CinematicText>
        <CinematicText delay={140} size={30} weight={500} color={T.muted} style={{ marginTop: 10 }}>
          Modern design. Powerful performance. Real results.
        </CinematicText>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
