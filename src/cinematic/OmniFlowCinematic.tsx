import { AbsoluteFill, Sequence } from "remotion";
import { WorldRig, FlyThrough } from "./components/CameraRig";
import { Atmosphere, ParticleField, FilmGrade } from "./components/ParticleField";
import { InvisibleBusinessScene } from "./scenes/InvisibleBusinessScene";
import { ProblemCardsScene } from "./scenes/ProblemCardsScene";
import { TransformationScene } from "./scenes/TransformationScene";
import { PremiumWebsiteScene } from "./scenes/PremiumWebsiteScene";
import { GoogleVisibilityScene } from "./scenes/GoogleVisibilityScene";
import { FinalCTAScene } from "./scenes/FinalCTAScene";
import { SCN } from "./theme";

// OmniFlow Cinematic — one continuous flight through a digital world.
// The particle field, atmosphere, and handheld camera never cut; scenes
// hand off via fly-through moves, not slide transitions.
// Music sync markers: see BEATS in ./theme.ts.

export const OmniFlowCinematic: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#04060C" }}>

      {/* Persistent world — behind everything, never cuts */}
      <Atmosphere />

      <WorldRig>
        <ParticleField />

        {/* 1 — The invisible business */}
        <Sequence from={SCN.invisible.from} durationInFrames={SCN.invisible.dur}>
          <FlyThrough dur={SCN.invisible.dur} enterMode="none" origin="50% 44%">
            <InvisibleBusinessScene dur={SCN.invisible.dur} />
          </FlyThrough>
        </Sequence>

        {/* 2 — Floating problem field */}
        <Sequence from={SCN.problems.from} durationInFrames={SCN.problems.dur}>
          <FlyThrough dur={SCN.problems.dur} origin="50% 48%">
            <ProblemCardsScene dur={SCN.problems.dur} />
          </FlyThrough>
        </Sequence>

        {/* 3 — The OmniFlow shift (exit dives into the portal) */}
        <Sequence from={SCN.shift.from} durationInFrames={SCN.shift.dur}>
          <FlyThrough dur={SCN.shift.dur} origin="50% 70%">
            <TransformationScene dur={SCN.shift.dur} />
          </FlyThrough>
        </Sequence>

        {/* 4 — Premium website orbit */}
        <Sequence from={SCN.website.from} durationInFrames={SCN.website.dur}>
          <FlyThrough dur={SCN.website.dur} origin="50% 40%">
            <PremiumWebsiteScene dur={SCN.website.dur} />
          </FlyThrough>
        </Sequence>

        {/* 5 — Holographic map / local growth */}
        <Sequence from={SCN.visibility.from} durationInFrames={SCN.visibility.dur}>
          <FlyThrough dur={SCN.visibility.dur} origin="50% 60%">
            <GoogleVisibilityScene dur={SCN.visibility.dur} />
          </FlyThrough>
        </Sequence>

        {/* 6 — Final lockup (pull-back reveal, no exit) */}
        <Sequence from={SCN.cta.from} durationInFrames={SCN.cta.dur}>
          <FlyThrough dur={SCN.cta.dur} enterMode="pullback" exitMode="none">
            <FinalCTAScene dur={SCN.cta.dur} />
          </FlyThrough>
        </Sequence>
      </WorldRig>

      <FilmGrade />
    </AbsoluteFill>
  );
};
