import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { CinematicImage } from "../components/CinematicImage";
import { V3SEQ, seqDur, TOTAL } from "../lib/v3timing";

// OmniFlowV3 — 20s premium vertical ad built from 10 designed stills.
// Story: invisible online → weak presence → costs customers → we change that
//        → premium websites → maps visibility → more actions → real growth
//        → one partner → final CTA.
//
// Sound design cue sheet lives in src/lib/v3timing.ts (SOUND_CUES).

// Persistent film-grade vignette so cuts share one cinematic container.
const Vignette: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse 140% 105% at 50% 50%, transparent 62%, rgba(0,0,0,0.42) 100%)",
        pointerEvents: "none",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 12%, transparent 90%, rgba(0,0,0,0.30) 100%)",
        pointerEvents: "none",
      }}
    />
  </>
);

// Final-seconds ease: a slow global settle into the CTA hold.
const EndGlow: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [V3SEQ.s10.from + 20, TOTAL - 10], [0, 0.10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 55% at 50% 62%, rgba(34,211,238,${op}) 0%, transparent 70%)`,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  );
};

export const OmniFlowV3: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#04060C" }}>

      {/* 1 — Your business exists online… but customers can't find it. */}
      <Sequence from={V3SEQ.s1.from} durationInFrames={seqDur("s1")}>
        <CinematicImage src="s01-invisible.png" dur={seqDur("s1")}
          motion="pushIn" fadeIn={0} glowPulse />
      </Sequence>

      {/* 2 — THE PROBLEM: a weak digital presence costs attention. */}
      <Sequence from={V3SEQ.s2.from} durationInFrames={seqDur("s2")}>
        <CinematicImage src="s02-weak-presence.png" dur={seqDur("s2")}
          motion="driftUp" />
      </Sequence>

      {/* 3 — Every day costs real customers. */}
      <Sequence from={V3SEQ.s3.from} durationInFrames={seqDur("s3")}>
        <CinematicImage src="s03-costs-customers.png" dur={seqDur("s3")}
          motion="driftDown" />
      </Sequence>

      {/* 4 — We change that. (turn point: scan-line + impact flash) */}
      <Sequence from={V3SEQ.s4.from} durationInFrames={seqDur("s4")}>
        <CinematicImage src="s04-we-change-that.png" dur={seqDur("s4")}
          motion="pushIn" scanAccent flashIn glowPulse />
      </Sequence>

      {/* 5 — Premium Websites. Built to convert. */}
      <Sequence from={V3SEQ.s5.from} durationInFrames={seqDur("s5")}>
        <CinematicImage src="s05-premium-websites.png" dur={seqDur("s5")}
          motion="pullBack" sweep sweepDelay={12} glowPulse />
      </Sequence>

      {/* 6 — Google Maps: show up where customers are searching. */}
      <Sequence from={V3SEQ.s6.from} durationInFrames={seqDur("s6")}>
        <CinematicImage src="s06-google-maps.png" dur={seqDur("s6")}
          motion="driftUp" sweep sweepDelay={20} glowPulse />
      </Sequence>

      {/* 7 — More actions. More customers. */}
      <Sequence from={V3SEQ.s7.from} durationInFrames={seqDur("s7")}>
        <CinematicImage src="s07-more-actions.png" dur={seqDur("s7")}
          motion="pushIn" />
      </Sequence>

      {/* 8 — Real growth. Real impact. */}
      <Sequence from={V3SEQ.s8.from} durationInFrames={seqDur("s8")}>
        <CinematicImage src="s08-real-growth.png" dur={seqDur("s8")}
          motion="driftUp" sweep sweepDelay={14} />
      </Sequence>

      {/* 9 — One partner. Everything you need. */}
      <Sequence from={V3SEQ.s9.from} durationInFrames={seqDur("s9")}>
        <CinematicImage src="s09-one-partner.png" dur={seqDur("s9")}
          motion="driftDown" />
      </Sequence>

      {/* 10 — Get Found. Look Professional. Grow Online. DM 'FLOW' TO START */}
      <Sequence from={V3SEQ.s10.from} durationInFrames={seqDur("s10")}>
        <CinematicImage src="s10-final-cta.png" dur={seqDur("s10")}
          motion="settle" flashIn glowPulse fadeOut={0} />
      </Sequence>

      <EndGlow />
      <Vignette />
    </AbsoluteFill>
  );
};
