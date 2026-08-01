// Scene 1 — Recognition (frames 0-131)
import React from "react";
import { COLORS } from "../tokens";
import { reveal, clampInterp } from "../framePlan";
import { HeadlineBlock, SupportingCopy, TakeawayStrip } from "../components/text";
import { DoorwayIcon } from "../components/icons";

export const Scene1Copy: React.FC<{ frame: number }> = ({ frame }) => {
  const outStart = 109; // transition
  const h1 = reveal(frame, 8, outStart);
  const h2 = reveal(frame, 20, outStart);
  const sup = reveal(frame, 30, 104);
  const take = reveal(frame, 54, 104);

  // strip lift during transition (y 1340 -> 1055) + divider stretch
  const stripY = clampInterp(frame, [109, 131], [1340, 1055]);
  const stripDivScale = clampInterp(frame, [109, 131], [1, 1.28]);
  const iconScale = clampInterp(frame, [109, 131], [1, 0.42]);

  return (
    <>
      <HeadlineBlock
        lines={[{ text: "Before you blame" }, { text: "the quiet week..." }]}
        x={80}
        y={830}
        width={560}
        fontSize={72}
        lineHeight={0.96}
        weight={600}
        anim={h1}
      />
      <HeadlineBlock
        lines={[{ text: "Search your own", color: COLORS.cyan }, { text: "business name.", color: COLORS.cyan }]}
        x={80}
        y={1015}
        width={570}
        fontSize={78}
        lineHeight={0.93}
        weight={600}
        anim={h2}
      />
      <SupportingCopy
        lines={[
          "Look at the screen the way a customer would.",
          "What appears—or fails to appear—may",
          "explain why fewer people are reaching your door.",
        ]}
        x={80}
        y={1190}
        width={720}
        fontSize={30}
        lineHeight={1.35}
        anim={sup}
      />
      <TakeawayStrip
        x={80}
        y={stripY}
        width={700}
        icon={<DoorwayIcon size={44 * iconScale} />}
        lines={["What customers see first", "may decide whether they ever reach you."]}
        anim={take}
        fontSize={30}
        dividerScaleX={stripDivScale}
        iconScale={iconScale}
      />
    </>
  );
};
