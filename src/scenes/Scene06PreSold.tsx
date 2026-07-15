import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COPY, SCENES } from "../config/timing";
import { sceneFadeOpacity } from "../components/sceneFade";
import { SceneHeader } from "../components/SceneHeader";
import { KineticHeadline } from "../components/KineticHeadline";
import { BodyCopy } from "../components/BodyCopy";
import { ComparisonRow } from "../components/ComparisonRow";
import { LocationPin } from "../components/LocationPin";
import { RoutePath } from "../components/RoutePath";

const SCENE = SCENES[5];
const DURATION = SCENE.end - SCENE.start + 1;

const ROWS = [
  { rating: 4, distance: "0.4 mi", hours: "9AM–9PM", selected: true },
  { rating: 5, distance: "1.1 mi", hours: "8AM–10PM", selected: false },
  { rating: 3, distance: "2.3 mi", hours: "10AM–8PM", selected: false },
  { rating: 4, distance: "3.7 mi", hours: "9AM–6PM", selected: false },
];
const ROW_X = 64;
const ROW_Y0 = 900;
const ROW_W = 680;
const ROW_H = 110;
const ROW_GAP = 26;
const DEST = { x: 830, y: 800 };

export const Scene06PreSold: React.FC = () => {
  const frame = useCurrentFrame();
  const copy = COPY[6];
  const fade = sceneFadeOpacity(frame, DURATION, 6, 10);

  const pulseSelect = interpolate(frame, [70, 86], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <RoutePath
        points={[
          { x: ROW_X + ROW_W - 4, y: ROW_Y0 + ROW_H / 2 },
          { x: 855, y: 940 },
          DEST,
        ]}
        frame={frame}
        progress={interpolate(frame, [62, 82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        color="gold"
        particleCount={1}
      />
      <RoutePath
        points={[
          { x: 855, y: 940 },
          { x: 855, y: 1100 },
          { x: 855, y: 1300 },
        ]}
        frame={frame}
        progress={interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        opacity={0.4}
        strokeWidth={1.4}
        arrow={false}
        particleCount={0}
      />

      {ROWS.map((r, i) => (
        <ComparisonRow
          key={i}
          frame={frame}
          start={14 + i * 9}
          x={ROW_X}
          y={ROW_Y0 + i * (ROW_H + ROW_GAP)}
          width={ROW_W}
          height={ROW_H}
          rating={r.rating}
          distance={r.distance}
          hours={r.hours}
          selected={r.selected && pulseSelect > 0}
        />
      ))}

      <LocationPin
        x={DEST.x}
        y={DEST.y}
        icon="storefront"
        tone="gold"
        frame={frame}
        seed={1}
        entrance={interpolate(frame, [56, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />

      <SceneHeader frame={frame} sceneNumber={6} />
      {copy.headline.map((block, i) => (
        <KineticHeadline key={i} frame={frame} start={14} block={block} />
      ))}
      <BodyCopy frame={frame} start={36} block={copy.body} />
    </AbsoluteFill>
  );
};
