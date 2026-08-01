// ============================================================================
// PhoneContent — routes the correct screen state into the persistent phone
// shell for the current frame, with short motion-hidden crossfades at scene
// boundaries. Same shell; only the inner screen changes.
// ============================================================================
import React from "react";
import { clampInterp } from "../framePlan";
import {
  NoResultScreen,
  MissingInfoScreen,
  CompletedProfileScreen,
  buildRows,
} from "./PhoneScreens";

const fade = (frame: number, inA: number, inB: number, outA: number, outB: number) =>
  Math.min(
    clampInterp(frame, [inA, inB], [0, 1]),
    clampInterp(frame, [outA, outB], [1, 0]),
  );

export const PhoneContent: React.FC<{ frame: number; s: number }> = ({ frame, s }) => {
  const layers: React.ReactNode[] = [];

  // Scene 1 — no result with blinking caret
  const o1 = fade(frame, -1, 0, 116, 123);
  if (o1 > 0.001) {
    const caret = Math.sin(frame * 0.35) > -0.2;
    const t = clampInterp(frame, [0, 16], [0.55, 1]);
    layers.push(
      <div key="s1" style={{ position: "absolute", inset: 0, opacity: o1 }}>
        <NoResultScreen s={s} t={t} caret={caret} />
      </div>,
    );
  }

  // Scene 2 — missing-info rows form under a no-result header
  const o2 = fade(frame, 116, 123, 248, 255);
  if (o2 > 0.001) {
    const t = clampInterp(frame, [158, 205], [0, 1]);
    layers.push(
      <div key="s2" style={{ position: "absolute", inset: 0, opacity: o2 }}>
        <MissingInfoScreen s={s} t={t} rows={buildRows(s, "scene2")} showNoResultHeader />
      </div>,
    );
  }

  // Scene 3 — rows persist + profile stub grows
  const o3 = fade(frame, 248, 255, 403, 410);
  if (o3 > 0.001) {
    const t = clampInterp(frame, [264, 306], [0.5, 1]);
    layers.push(
      <div key="s3" style={{ position: "absolute", inset: 0, opacity: o3 }}>
        <MissingInfoScreen s={s} t={t} rows={buildRows(s, "scene3")} showProfileStub />
      </div>,
    );
  }

  // Scene 4 — back to no result, sharpening
  const o4 = fade(frame, 403, 410, 536, 543);
  if (o4 > 0.001) {
    const t = clampInterp(frame, [450, 478], [0.5, 1]);
    layers.push(
      <div key="s4" style={{ position: "absolute", inset: 0, opacity: o4 }}>
        <NoResultScreen s={s} t={t} />
      </div>,
    );
  }

  // Scene 5 — completed business profile
  const o5 = fade(frame, 536, 543, 999, 1000);
  if (o5 > 0.001) {
    const g1 = clampInterp(frame, [575, 600], [0, 1]);
    const g2 = clampInterp(frame, [596, 625], [0, 1]);
    layers.push(
      <div key="s5" style={{ position: "absolute", inset: 0, opacity: o5 }}>
        <CompletedProfileScreen s={s} t={g1} t2={g2} />
      </div>,
    );
  }

  return <>{layers}</>;
};
