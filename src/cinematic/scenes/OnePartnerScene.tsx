import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Parallax } from "../components/CameraRig";
import { CinematicText } from "../components/CinematicText";
import { FooterCaps } from "./GrowthActionsScene";
import { T, FONT, EO } from "../theme";

// SCENE — beat 9: "One partner. Everything you need." Service rows are
// verbatim from the original ad.

type ServiceIcon = "browser" | "pin" | "chart" | "headset";

const Icon: React.FC<{ kind: ServiceIcon }> = ({ kind }) => {
  const s = { stroke: T.cyan, strokeWidth: 1.8, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "browser":
      return (
        <svg width={30} height={30} viewBox="0 0 24 24">
          <rect x={2.5} y={4} width={19} height={16} rx={2.5} {...s} />
          <line x1={2.5} y1={9} x2={21.5} y2={9} {...s} />
          <circle cx={6} cy={6.5} r={0.7} fill={T.cyan} />
          <circle cx={8.6} cy={6.5} r={0.7} fill={T.cyan} />
        </svg>
      );
    case "pin":
      return (
        <svg width={30} height={30} viewBox="0 0 24 24">
          <path d="M12 2.5 C8 2.5 5 5.5 5 9 C5 14 12 21.5 12 21.5 C12 21.5 19 14 19 9 C19 5.5 16 2.5 12 2.5 Z" {...s} />
          <circle cx={12} cy={9} r={2.6} {...s} />
        </svg>
      );
    case "chart":
      return (
        <svg width={30} height={30} viewBox="0 0 24 24">
          <path d="M4 19 L9.5 13 L13.5 15.5 L20 7" {...s} />
          <path d="M15.5 7 H20 V11.5" {...s} />
        </svg>
      );
    case "headset":
      return (
        <svg width={30} height={30} viewBox="0 0 24 24">
          <path d="M4 14 v-2 a8 8 0 0 1 16 0 v2" {...s} />
          <rect x={3} y={13.5} width={4} height={6} rx={2} {...s} />
          <rect x={17} y={13.5} width={4} height={6} rx={2} {...s} />
          <path d="M19 19.5 c0 1.5 -2 2.5 -5 2.5" {...s} />
        </svg>
      );
  }
};

interface ServiceSpec {
  icon: ServiceIcon;
  title: string;
  desc: string;
  delay: number;
}

const SERVICES: ServiceSpec[] = [
  { icon: "browser", title: "Web Design & Development",  desc: "Modern sites that build trust and convert.",             delay: 26 },
  { icon: "pin",     title: "Google Maps Optimization",  desc: "Get found where customers are already searching.",       delay: 38 },
  { icon: "chart",   title: "Local SEO & Visibility",    desc: "Improve rankings and attract ready-to-buy customers.",   delay: 50 },
  { icon: "headset", title: "Ongoing Growth & Support",  desc: "Continuous optimization for long-term results.",         delay: 62 },
];

const ServiceRow: React.FC<ServiceSpec & { index: number }> = ({ icon, title, desc, delay, index }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const tx = interpolate(f, [0, 28], [index % 2 === 0 ? -70 : 70, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const bob = Math.sin(frame * 0.024 + index * 1.7) * 3;

  return (
    <div
      style={{
        opacity: op,
        translate: `${tx}px ${bob}px`,
        width: 700,
        borderRadius: 20,
        border: "1px solid rgba(34,211,238,0.22)",
        background: T.panel,
        backdropFilter: "blur(16px)",
        boxShadow: "0 24px 56px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        padding: "22px 28px",
        display: "flex",
        alignItems: "center",
        gap: 22,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 16,
          background: "rgba(34,211,238,0.09)",
          border: "1px solid rgba(34,211,238,0.28)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon kind={icon} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 27, fontWeight: 700, color: T.white, letterSpacing: "-0.01em", marginBottom: 5 }}>
          {title}
        </div>
        <div style={{ fontSize: 19, color: T.muted, lineHeight: 1.35 }}>
          {desc}
        </div>
      </div>
    </div>
  );
};

export const OnePartnerScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, dur], [1, 1.06], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ scale: push.toString(), transformOrigin: "50% 50%" }}>

      {/* Headline — top */}
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 216 }}>
        <CinematicText delay={8} size={74}>
          One partner.
        </CinematicText>
        <CinematicText delay={18} size={74} gradient glow tracking>
          Everything you need.
        </CinematicText>
      </AbsoluteFill>

      {/* Service stack — center */}
      <Parallax depth={0.6} phase={3}>
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            paddingTop: 120,
            paddingBottom: 140,
          }}
        >
          {SERVICES.map((sv, i) => (
            <ServiceRow key={sv.title} {...sv} index={i} />
          ))}
        </AbsoluteFill>
      </Parallax>

      {/* Footer tagline — verbatim */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 218,
        }}
      >
        <FooterCaps delay={84} color="rgba(226,240,255,0.8)">Strategy. Design. Visibility. Growth.</FooterCaps>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
