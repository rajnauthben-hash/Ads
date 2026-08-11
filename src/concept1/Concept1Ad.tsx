import React, { useEffect, useRef } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, delayRender, continueRender } from "remotion";
import { initFonts } from "./fonts";
import { Background } from "./Background";
import { ReferenceOverlay } from "./ReferenceOverlay";
import { win } from "./anim";
import { Scene1 } from "./Scene1";
import { Scene2 } from "./Scene2";
import { Scene3 } from "./Scene3";
import { Scene4 } from "./Scene4";
import { Scene5 } from "./Scene5";
import { Scene6 } from "./Scene6";

// Continuous handoff: each scene rises in from below and lifts away upward as
// the next rises in beneath it. Combined with the persistent background this
// reads as one moving system rather than a set of cuts/crossfades.
const SceneWrap: React.FC<{ len: number; last?: boolean; children: React.ReactNode }> = ({ len, last, children }) => {
  const f = useCurrentFrame();
  const inY = win(f, 0, 14, 44, 0);
  const inOp = win(f, 0, 14, 0, 1);
  const outStart = len - 2;
  const outY = last ? 0 : win(f, outStart, outStart + 16, 0, -50);
  const outOp = last ? 1 : win(f, outStart, outStart + 16, 1, 0);
  return (
    <AbsoluteFill style={{ opacity: inOp * outOp, transform: `translateY(${inY + outY}px)`, willChange: "transform" }}>
      {children}
    </AbsoluteFill>
  );
};

// Lengths lengthened (was 95/95/100/100/100/110 = 600) to add hold time so each
// scene breathes and reads without rushing. Reveal timings are unchanged, so
// the punchy entrances stay; only the settled hold gets longer.
const SCENES = [
  { start: 0, len: 128, C: Scene1 },
  { start: 128, len: 128, C: Scene2 },
  { start: 256, len: 135, C: Scene3 },
  { start: 391, len: 135, C: Scene4 },
  { start: 526, len: 135, C: Scene5 },
  { start: 661, len: 150, C: Scene6 },
];
const OVERLAP = 20;

export const Concept1Ad: React.FC = () => {
  const handle = useRef<number | null>(null);
  useEffect(() => {
    handle.current = delayRender("concept1-fonts");
    initFonts().then(() => {
      if (handle.current !== null) continueRender(handle.current);
    });
  }, []);

  return (
    <AbsoluteFill>
      <Background />
      {SCENES.map((s, i) => {
        const last = i === SCENES.length - 1;
        return (
          <Sequence key={i} from={s.start} durationInFrames={s.len + (last ? 0 : OVERLAP)}>
            <SceneWrap len={s.len} last={last}>
              <s.C />
            </SceneWrap>
          </Sequence>
        );
      })}
      <ReferenceOverlay />
    </AbsoluteFill>
  );
};
