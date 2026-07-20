import React, { useEffect, useRef, useState } from "react";
import { AbsoluteFill, Sequence, continueRender, delayRender, interpolate, useCurrentFrame } from "remotion";
import { initLocalFonts } from "./fonts";
import { PersistentPulseRoute } from "./components/PersistentPulseRoute";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene6 } from "./scenes/Scene6";
import { COLORS } from "./theme";

// THE PULSE OF LOCAL SEARCH — OmniFlow Digital.
// 1080×1920 / 30fps / 450 frames. Six scenes joined by object-based
// transitions plus one persistent cyan heartbeat that travels the whole
// timeline. Scenes overlap so a transforming element from each scene hands
// off to the next (never a full-screen crossfade).
//
// Local starts: S1@0, S2@72, S3@142, S4@212, S5@282, S6@368 — each Sequence
// runs a few frames long so the outgoing transition object survives into
// the incoming scene.

const GlobalCamera: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  // Slow global push 1.00 -> 1.055 across the full film.
  const scale = interpolate(frame, [0, 450], [1, 1.055], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 46%" }}>{children}</AbsoluteFill>
  );
};

// Wraps a scene and drives its transition-out prop from the global frame.
const TransSlot: React.FC<{ from: number; dur: number; name: string; children: React.ReactNode }> = ({ from, dur, name, children }) => (
  <Sequence from={from} durationInFrames={dur} name={name} layout="none">
    {children}
  </Sequence>
);

export const LocalSearchPulseAd: React.FC = () => {
  const [ready, setReady] = useState(false);
  const handle = useRef<number | null>(null);
  useEffect(() => {
    handle.current = delayRender("local-fonts");
    initLocalFonts().then(() => {
      setReady(true);
      if (handle.current !== null) {
        continueRender(handle.current);
        handle.current = null;
      }
    });
    return () => {
      if (handle.current !== null) {
        continueRender(handle.current);
        handle.current = null;
      }
    };
  }, []);

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      {ready && (
        <>
          {/* Background vignette (deepest plane) */}
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(ellipse 120% 70% at 50% 0%, rgba(31,199,255,0.05), transparent 55%), radial-gradient(ellipse 120% 60% at 50% 100%, rgba(5,8,12,0.9), transparent 70%)",
            }}
          />

          <GlobalCamera>
            <SceneStack />
          </GlobalCamera>

          {/* The one persistent heartbeat, above the scenes */}
          <PersistentPulseRoute />
        </>
      )}
    </AbsoluteFill>
  );
};

// Reads the global frame to compute each scene's transition-out progress and
// mounts the overlapping sequences.
const SceneStack: React.FC = () => {
  const frame = useCurrentFrame();

  // Transition drivers (global frames) — each ramps over ~16 frames.
  const t = (a: number, b: number) => interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // S1->2: phone fragments as the cyan line expands (global 72–88).
  const s1Fragment = t(72, 88);
  // S2->3: selected hardware node expands, others recede (global 130–146).
  const s2Select = t(130, 146);
  // S3->4: route breaks and diverts (breakAt fixed, divert ramps 198–214).
  const s3Divert = t(198, 214);
  // S4->5: consequence cards compress (global 268–284).
  const s4Compress = t(268, 284);
  // S5->6: diagnostic spine bends into route (global 354–370).
  const s5Bend = t(354, 370);

  return (
    <>
      <TransSlot from={0} dur={88} name="S1 — Customer Search">
        <Scene1 fragment={s1Fragment} />
      </TransSlot>
      <TransSlot from={72} dur={74} name="S2 — Heartbeat">
        <Scene2 selectExpand={s2Select} />
      </TransSlot>
      <TransSlot from={142} dur={72} name="S3 — Searches Become Action">
        <Scene3 breakAt={s3Divert > 0 ? 0.55 : undefined} divert={s3Divert} />
      </TransSlot>
      <TransSlot from={212} dur={72} name="S4 — Pulse Misses You">
        <Scene4 compress={s4Compress} />
      </TransSlot>
      <TransSlot from={282} dur={88} name="S5 — What Keeps You Connected">
        <Scene5 bend={s5Bend} />
      </TransSlot>
      <TransSlot from={368} dur={82} name="S6 — Reconnect">
        <Scene6 />
      </TransSlot>
    </>
  );
};
