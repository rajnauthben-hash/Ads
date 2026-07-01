import { AbsoluteFill, Sequence } from "remotion";
import { AnimatedBackground } from "./AnimatedBackground";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Solution } from "./scenes/Scene3Solution";
import { Scene4Outcome } from "./scenes/Scene4Outcome";
import { Scene5CTA } from "./scenes/Scene5CTA";

/**
 * OmniFlow Digital — 15s premium short-form ad
 *
 * Scene timing (30fps):
 *   Scene 1 (Hook)      — frames   0–95
 *   Scene 2 (Problem)   — frames  85–185
 *   Scene 3 (Solution)  — frames 175–305
 *   Scene 4 (Outcome)   — frames 295–395
 *   Scene 5 (CTA)       — frames 385–450
 *
 * 5-frame crossfade overlap between every scene pair.
 */
export const OmniFlowPremiumAd: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Persistent animated background — runs for full 450 frames */}
      <AnimatedBackground />

      {/* Scene 1: Hook — 0:00–0:03 */}
      <Sequence from={0} durationInFrames={95}>
        <Scene1Hook />
      </Sequence>

      {/* Scene 2: Problem — 0:03–0:06 (overlaps 10 frames with Scene 1) */}
      <Sequence from={85} durationInFrames={100}>
        <Scene2Problem />
      </Sequence>

      {/* Scene 3: Solution — 0:06–0:10 (overlaps 10 frames with Scene 2) */}
      <Sequence from={175} durationInFrames={130}>
        <Scene3Solution />
      </Sequence>

      {/* Scene 4: Outcome — 0:10–0:13 (overlaps 10 frames with Scene 3) */}
      <Sequence from={295} durationInFrames={100}>
        <Scene4Outcome />
      </Sequence>

      {/* Scene 5: CTA — 0:13–0:15 (overlaps 10 frames with Scene 4) */}
      <Sequence from={385} durationInFrames={65}>
        <Scene5CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
