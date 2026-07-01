import { AbsoluteFill, Sequence } from "remotion";
import { AnimatedBackground } from "./AnimatedBackground";
import { InvisibleScene1 } from "./scenes/InvisibleScene1";
import { InvisibleScene2 } from "./scenes/InvisibleScene2";
import { InvisibleScene3 } from "./scenes/InvisibleScene3";
import { InvisibleScene4 } from "./scenes/InvisibleScene4";
import { InvisibleScene5 } from "./scenes/InvisibleScene5";
import { InvisibleScene6 } from "./scenes/InvisibleScene6";

/**
 * OmniFlow Digital — "From Invisible to Unmissable" — 18s ad
 *
 * Scene timing (30fps, 540 total frames):
 *   S1 Hook/Void      frames   0–100   (0.0s–3.3s)
 *   S2 Search Buried  frames  88–203   (2.9s–6.8s) — 12-frame overlap
 *   S3 Transform      frames 191–306   (6.4s–10.2s) — 12-frame overlap
 *   S4 Services       frames 294–409   (9.8s–13.6s) — 12-frame overlap
 *   S5 Ecosystem      frames 397–497   (13.2s–16.6s) — 12-frame overlap
 *   S6 End Card       frames 485–540   (16.2s–18.0s) — 12-frame overlap
 */
export const OmniFlowInvisibleAd: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Persistent ambient background — subtle grid and streaks */}
      <AnimatedBackground />

      {/* S1: Dark void, old website card */}
      <Sequence from={0} durationInFrames={100}>
        <InvisibleScene1 />
      </Sequence>

      {/* S2: Search results, buried listing */}
      <Sequence from={88} durationInFrames={115}>
        <InvisibleScene2 />
      </Sequence>

      {/* S3: Cyan light streak, card transforms */}
      <Sequence from={191} durationInFrames={115}>
        <InvisibleScene3 />
      </Sequence>

      {/* S4: Service cards, map pin, rank counter */}
      <Sequence from={294} durationInFrames={115}>
        <InvisibleScene4 />
      </Sequence>

      {/* S5: Connected ecosystem, orbit nodes */}
      <Sequence from={397} durationInFrames={100}>
        <InvisibleScene5 />
      </Sequence>

      {/* S6: End card, logo, CTA */}
      <Sequence from={485} durationInFrames={55}>
        <InvisibleScene6 />
      </Sequence>
    </AbsoluteFill>
  );
};
