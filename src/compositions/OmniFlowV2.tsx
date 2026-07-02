import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { V2S1Problem } from "../scenes/V2S1Problem";
import { V2S2PainPoints } from "../scenes/V2S2PainPoints";
import { V2S3Transform } from "../scenes/V2S3Transform";
import { V2S4Growth } from "../scenes/V2S4Growth";
import { V2S5CTA } from "../scenes/V2S5CTA";

// 20 seconds @ 30fps = 600 frames
// 18-frame crossfade overlaps between scenes
//
// Scene layout:
//  S1: 0   – 90    (90 frames)
//  S2: 72  – 182   (110 frames)
//  S3: 164 – 304   (140 frames)
//  S4: 286 – 406   (120 frames)
//  S5: 388 – 498   (110 frames)
//
// Final frame: ~498, pad to 510 for safe end
const SEQ = {
  s1: { from: 0,   dur: 90  },
  s2: { from: 72,  dur: 110 },
  s3: { from: 164, dur: 140 },
  s4: { from: 286, dur: 120 },
  s5: { from: 388, dur: 110 },
};

export const OmniFlowV2: React.FC = () => {
  const frame = useCurrentFrame();

  // Background activates after transform scene starts
  const bgActivation = interpolate(frame, [164, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#05070D" }}>
      <AnimatedBackground activation={bgActivation} />

      <Sequence from={SEQ.s1.from} durationInFrames={SEQ.s1.dur}>
        <V2S1Problem />
      </Sequence>

      <Sequence from={SEQ.s2.from} durationInFrames={SEQ.s2.dur}>
        <V2S2PainPoints />
      </Sequence>

      <Sequence from={SEQ.s3.from} durationInFrames={SEQ.s3.dur}>
        <V2S3Transform />
      </Sequence>

      <Sequence from={SEQ.s4.from} durationInFrames={SEQ.s4.dur}>
        <V2S4Growth />
      </Sequence>

      <Sequence from={SEQ.s5.from} durationInFrames={SEQ.s5.dur}>
        <V2S5CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
