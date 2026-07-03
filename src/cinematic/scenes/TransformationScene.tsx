import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Parallax } from "../components/CameraRig";
import { EnergyRing } from "../components/EnergyRing";
import { DataStreams } from "../components/ParticleField";
import { CinematicText } from "../components/CinematicText";
import { DualStateWebsite } from "../../components/DualStateWebsite";
import { LogoLockup } from "../../components/LogoLockup";
import { T } from "../theme";

// The horizontal energy reset line — cuts across, then everything heals.
const ResetLine: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const y = interpolate(f, [0, 34], [-40, 1980], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.7, 1),
  });
  const op = interpolate(f, [0, 5, 29, 34], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 10 }}>
      <div
        style={{
          position: "absolute",
          left: -40,
          right: -40,
          top: y,
          height: 4,
          background: `linear-gradient(90deg, transparent 0%, ${T.cyan} 15%, #D9F6FF 50%, ${T.cyan} 85%, transparent 100%)`,
          boxShadow: [
            "0 0 30px rgba(34,211,238,0.95)",
            "0 0 90px rgba(34,211,238,0.45)",
            "0 0 180px rgba(34,211,238,0.2)",
          ].join(", "),
          opacity: op,
        }}
      />
      {/* Wake — brightened band behind the line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y - 220,
          height: 220,
          background: "linear-gradient(180deg, transparent 0%, rgba(34,211,238,0.10) 100%)",
          opacity: op,
        }}
      />
    </AbsoluteFill>
  );
};

// SCENE 3 — the OmniFlow shift: reset line, repair, portal opens.
export const TransformationScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();

  // Repair follows the reset line's passage over the site (line hits it ~f20)
  const repair = interpolate(frame, [26, 84], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Logo sharpens as the world heals
  const logoOp = interpolate(frame, [0, 70], [0.6, 1], { extrapolateRight: "clamp" });
  const logoBlur = interpolate(frame, [0, 70], [2.2, 0], { extrapolateRight: "clamp" });

  // Dolly toward the portal in the closing frames (FlyThrough adds the final punch)
  const dolly = interpolate(frame, [dur - 50, dur], [1, 1.12], {
    extrapolateLeft: "clamp",
    easing: Easing.in(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ scale: dolly.toString(), transformOrigin: "50% 68%" }}>

      <ResetLine delay={8} />

      {/* Particles reorganize into rising data streams after the reset */}
      <DataStreams delay={44} count={9} opacity={0.26} />

      {/* Portal opens beneath, light rises */}
      <Parallax depth={0.3} phase={3}>
        <EnergyRing delay={30} beam intensity={interpolate(frame, [30, 90], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} y={1500} />
      </Parallax>

      {/* Brand — sharpening */}
      <Parallax depth={0.2} phase={1}>
        <div
          style={{
            position: "absolute",
            top: 158,
            left: "50%",
            translate: "-50% 0",
            scale: "0.9",
            opacity: logoOp,
            filter: logoBlur > 0.2 ? `blur(${logoBlur}px)` : undefined,
          }}
        >
          <LogoLockup delay={0} size="md" />
        </div>
      </Parallax>

      {/* The website repairing itself — panels realign, color returns */}
      <Parallax depth={0.55} phase={2}>
        <div
          style={{
            position: "absolute",
            top: 415,
            left: "50%",
            translate: "-50% 0",
          }}
        >
          <DualStateWebsite repairProgress={repair} delay={0} width={730} withText />
        </div>
      </Parallax>

      {/* Copy */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 320,
          gap: 14,
        }}
      >
        <CinematicText delay={88} size={104} glow tracking color="rgba(240,247,255,0.97)">
          We change <span style={{ color: T.cyan }}>that.</span>
        </CinematicText>
        <CinematicText delay={108} size={33} weight={500} color="rgba(226,240,255,0.75)">
          OmniFlow Digital transforms your online presence.
        </CinematicText>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
