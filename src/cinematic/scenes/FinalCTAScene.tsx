import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Parallax } from "../components/CameraRig";
import { EnergyRing } from "../components/EnergyRing";
import { CinematicText } from "../components/CinematicText";
import { LogoLockup } from "../../components/LogoLockup";
import { T, FONT, EO } from "../theme";

// Ghost artifacts from the journey, orbiting slowly behind the lockup.
const OrbitingEcho: React.FC<{
  radius: number; speed: number; phase: number; children: React.ReactNode;
}> = ({ radius, speed, phase, children }) => {
  const frame = useCurrentFrame();
  const a = phase + frame * speed;
  const x = Math.cos(a) * radius;
  const y = Math.sin(a) * radius * 0.34;
  const behind = Math.sin(a) < 0; // top of ellipse = farther away
  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        translate: "-50% -50%",
        opacity: behind ? 0.16 : 0.3,
        scale: behind ? "0.82" : "1",
        filter: "blur(1px)",
        zIndex: behind ? 0 : 2,
      }}
    >
      {children}
    </div>
  );
};

const MiniSite: React.FC = () => (
  <div
    style={{
      width: 150,
      height: 96,
      borderRadius: 10,
      border: "1px solid rgba(120,210,255,0.4)",
      background: "rgba(10,20,40,0.5)",
      padding: 10,
    }}
  >
    <div style={{ width: "58%", height: 6, borderRadius: 2, background: "rgba(226,240,255,0.6)", marginBottom: 5 }} />
    <div style={{ width: "40%", height: 4, borderRadius: 2, background: "rgba(148,197,255,0.4)", marginBottom: 8 }} />
    <div style={{ width: 42, height: 13, borderRadius: 4, background: "rgba(34,211,238,0.75)" }} />
  </div>
);

const MiniPin: React.FC = () => (
  <svg width={46} height={56} viewBox="0 0 124 150">
    <path
      d="M62 6 C34 6 14 27 14 52 C14 86 62 142 62 142 C62 142 110 86 110 52 C110 27 90 6 62 6 Z"
      fill="rgba(34,211,238,0.8)"
    />
    <circle cx={62} cy={52} r={21} fill="#04121E" />
  </svg>
);

const MiniPhone: React.FC = () => (
  <div
    style={{
      width: 54,
      height: 106,
      borderRadius: 12,
      border: "1px solid rgba(120,210,255,0.45)",
      background: "rgba(10,20,40,0.5)",
      padding: 6,
    }}
  >
    <div style={{ width: "80%", height: 4, borderRadius: 2, background: "rgba(226,240,255,0.5)", marginBottom: 4 }} />
    <div style={{ width: "55%", height: 4, borderRadius: 2, background: "rgba(148,197,255,0.35)", marginBottom: 7 }} />
    <div style={{ width: 24, height: 9, borderRadius: 3, background: "rgba(34,211,238,0.7)" }} />
  </div>
);

// SCENE 6 — pull-back reveal: brand above the portal, journey orbiting behind.
export const FinalCTAScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();

  const ctaPulse = 0.65 + Math.sin(frame * 0.055) * 0.2;
  const settle = interpolate(frame, [0, dur], [1.0, 1.025], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ scale: settle.toString(), transformOrigin: "50% 45%" }}>

      {/* Portal — fully open, calm */}
      <Parallax depth={0.25} phase={2}>
        <EnergyRing delay={0} beam intensity={1} y={1545} scale={1.12} />
      </Parallax>

      {/* Orbiting echoes of the journey */}
      <Parallax depth={0.5} phase={3}>
        <AbsoluteFill style={{ translate: "0px -215px" }}>
          <OrbitingEcho radius={385} speed={0.0075} phase={0.6}><MiniSite /></OrbitingEcho>
          <OrbitingEcho radius={420} speed={0.006}  phase={2.7}><MiniPin /></OrbitingEcho>
          <OrbitingEcho radius={355} speed={0.009}  phase={4.6}><MiniPhone /></OrbitingEcho>
        </AbsoluteFill>
      </Parallax>

      {/* Lockup + copy + CTA — verbatim from the original final frame */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 250,
        }}
      >
        <div style={{ marginBottom: 48 }}>
          <LogoLockup delay={4} size="lg" />
        </div>

        <CinematicText delay={14} size={72} weight={800} color="rgba(240,247,255,0.97)">
          Get Found.
        </CinematicText>
        <CinematicText delay={22} size={72} weight={800} color="rgba(240,247,255,0.97)">
          Look Professional.
        </CinematicText>
        <CinematicText delay={30} size={84} gradient glow tracking>
          Grow Online.
        </CinematicText>

        <CinematicText delay={44} size={29} weight={500} color={T.muted} style={{ marginTop: 20 }}>
          Premium Websites  •  Google Maps  •  Local Visibility
        </CinematicText>

        {/* CTA pill */}
        <CTAButton delay={56} pulse={ctaPulse} />

        <CinematicText delay={70} size={22} weight={600} color={T.muted} style={{ marginTop: 26, letterSpacing: "0.3em" }}>
          OMNIFLOW DIGITAL
        </CinematicText>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

const CTAButton: React.FC<{ delay: number; pulse: number }> = ({ delay, pulse }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const ty = interpolate(f, [0, 26], [36, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  return (
    <div
      style={{
        opacity: op,
        translate: `0px ${ty}px`,
        marginTop: 58,
        padding: "24px 58px",
        borderRadius: 60,
        background: `linear-gradient(180deg, #3FE0F5 0%, ${T.cyan} 100%)`,
        fontFamily: FONT,
        fontSize: 40,
        fontWeight: 800,
        letterSpacing: "-0.01em",
        color: "#03121C",
        whiteSpace: "nowrap",
        boxShadow: [
          `0 0 ${70 * pulse}px rgba(34,211,238,${0.6 * pulse})`,
          "0 20px 54px rgba(0,0,0,0.45)",
          "inset 0 1px 0 rgba(255,255,255,0.5)",
        ].join(", "),
      }}
    >
      DM ‘FLOW’ TO START
    </div>
  );
};
