import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Parallax } from "../components/CameraRig";
import { HologramPanel, GhostMapCard } from "../components/HologramPanel";
import { GlitchSparks } from "../components/ParticleField";
import { CinematicText } from "../components/CinematicText";
import { LogoLockup } from "../../components/LogoLockup";

// SCENE 1 — the invisible business. Dark void, ghost site, failing listing.
export const InvisibleBusinessScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();

  // Slow cinematic push-in across the whole scene
  const push = interpolate(frame, [0, dur], [1, 1.13], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ scale: push.toString(), transformOrigin: "50% 46%" }}>

      <GlitchSparks count={12} />

      {/* Far layer — brand mark, top (clearly legible like the reference) */}
      <Parallax depth={0.18} phase={1}>
        <div
          style={{
            position: "absolute",
            top: 128,
            left: "50%",
            translate: "-50% 0",
            opacity: 0.92,
            scale: "0.95",
          }}
        >
          <LogoLockup delay={4} size="md" />
        </div>
      </Parallax>

      {/* Mid layer — the ghost website */}
      <Parallax depth={0.5} phase={2.5}>
        <div
          style={{
            position: "absolute",
            top: 430,
            left: "50%",
            translate: "-50% 0",
            rotate: "-1.4deg",
          }}
        >
          <HologramPanel delay={10} width={700} />
        </div>
      </Parallax>

      {/* Near layer — the failing Maps card, floats beside/over */}
      <Parallax depth={0.85} phase={4}>
        <div
          style={{
            position: "absolute",
            top: 880,
            left: "50%",
            translate: "calc(-50% + 195px) 0",
            rotate: "2deg",
          }}
        >
          <GhostMapCard delay={34} width={335} />
        </div>
      </Parallax>

      {/* Copy — lower third, centered */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 300,
          gap: 8,
        }}
      >
        <CinematicText delay={40} size={72} weight={700} color="rgba(240,247,255,0.96)">
          Your business
        </CinematicText>
        <CinematicText delay={48} size={72} weight={700} color="rgba(240,247,255,0.96)">
          exists online…
        </CinematicText>
        <CinematicText delay={72} size={68} gradient glow tracking>
          but customers can’t find it.
        </CinematicText>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
