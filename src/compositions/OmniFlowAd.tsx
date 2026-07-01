import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { FONT } from "../lib/constants";
import { SEQ } from "../lib/timing";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { S1DarkVoid }        from "../scenes/S1DarkVoid";
import { S2BrokenPresence }  from "../scenes/S2BrokenPresence";
import { S3Activation }      from "../scenes/S3Activation";
import { S4PremiumWebsite }  from "../scenes/S4PremiumWebsite";
import { S5MapVisibility }   from "../scenes/S5MapVisibility";
import { S6LeadFlow }        from "../scenes/S6LeadFlow";
import { S7FinalReveal }     from "../scenes/S7FinalReveal";

export const OmniFlowDigitalAd: React.FC = () => {
  const frame = useCurrentFrame();

  // Background activation: 0 before scene 3 fires, 1 after beam passes
  // Composition frame ~120-155 is when S3 beam runs (SEQ.s3.from=110, beam at +4→30)
  const bgActivation = interpolate(frame, [110, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* Persistent animated background — activation brightens after scene 3 */}
      <AnimatedBackground activation={bgActivation} />

      {/* Scene 1: Dark Void — 0:00–0:02 */}
      <Sequence from={SEQ.s1.from} durationInFrames={SEQ.s1.dur}>
        <S1DarkVoid />
      </Sequence>

      {/* Scene 2: Broken Presence — 0:02–0:04 */}
      <Sequence from={SEQ.s2.from} durationInFrames={SEQ.s2.dur}>
        <S2BrokenPresence />
      </Sequence>

      {/* Scene 3: Activation — 0:04–0:06 */}
      <Sequence from={SEQ.s3.from} durationInFrames={SEQ.s3.dur}>
        <S3Activation />
      </Sequence>

      {/* Scene 4: Premium Website — 0:06–0:09 */}
      <Sequence from={SEQ.s4.from} durationInFrames={SEQ.s4.dur}>
        <S4PremiumWebsite />
      </Sequence>

      {/* Scene 5: Map Visibility — 0:09–0:12 */}
      <Sequence from={SEQ.s5.from} durationInFrames={SEQ.s5.dur}>
        <S5MapVisibility />
      </Sequence>

      {/* Scene 6: Lead Flow — 0:12–0:15 */}
      <Sequence from={SEQ.s6.from} durationInFrames={SEQ.s6.dur}>
        <S6LeadFlow />
      </Sequence>

      {/* Scene 7: Final Reveal — 0:15–0:18 */}
      <Sequence from={SEQ.s7.from} durationInFrames={SEQ.s7.dur}>
        <S7FinalReveal />
      </Sequence>
    </AbsoluteFill>
  );
};
