// Scene 4 — Same Silence, Different Room (frames 420-551)
import React from "react";
import { COLORS } from "../tokens";
import { reveal } from "../framePlan";
import { HeadlineBlock, SupportingCopy, TakeawayStrip } from "../components/text";
import { DoorwayIcon } from "../components/icons";

export const Scene4Copy: React.FC<{ frame: number }> = ({ frame }) => {
  const out = 530;
  const h1 = reveal(frame, 427, out);
  const em = reveal(frame, 440, out);
  const sup1 = reveal(frame, 460, out);
  const sup2 = reveal(frame, 469, out);
  const take = reveal(frame, 490, out);
  const divOpacity = reveal(frame, 448, out).opacity;

  return (
    <>
      <HeadlineBlock
        lines={[{ text: "The blank result page" }, { text: "is the empty shop." }]}
        x={80}
        y={215}
        width={520}
        fontSize={63}
        lineHeight={1.02}
        weight={620}
        anim={h1}
      />
      <HeadlineBlock
        lines={[{ text: "Same silence.", color: COLORS.cyan }, { text: "Different room.", color: COLORS.cyan }]}
        x={80}
        y={378}
        width={470}
        fontSize={70}
        lineHeight={0.96}
        weight={600}
        anim={em}
      />

      {/* broken divider with small X */}
      <svg width={410} height={30} viewBox="0 0 410 30" style={{ position: "absolute", left: 80, top: 545, opacity: divOpacity, overflow: "visible" }}>
        <line x1="0" y1="15" x2="175" y2="15" stroke={COLORS.cyan} strokeWidth={1.6} opacity={0.7} />
        <line x1="235" y1="15" x2="395" y2="15" stroke={COLORS.cyan} strokeWidth={1.6} opacity={0.7} />
        <line x1="197" y1="6" x2="213" y2="24" stroke={COLORS.cyanBright} strokeWidth={2} strokeLinecap="round" />
        <line x1="213" y1="6" x2="197" y2="24" stroke={COLORS.cyanBright} strokeWidth={2} strokeLinecap="round" />
      </svg>

      <SupportingCopy
        lines={["One happens on the customer’s", "phone first."]}
        x={80}
        y={588}
        width={445}
        fontSize={29}
        lineHeight={1.42}
        color={COLORS.softWhite}
        anim={sup1}
      />
      <SupportingCopy
        lines={[
          "The other may appear later as",
          "fewer enquiries, fewer direction",
          "requests and fewer people",
          "walking through the door.",
        ]}
        x={80}
        y={690}
        width={445}
        fontSize={29}
        lineHeight={1.42}
        anim={sup2}
      />

      <TakeawayStrip
        x={80}
        y={1325}
        width={700}
        icon={<DoorwayIcon size={44} />}
        lines={["What feels like a slow week", "may begin as a digital silence."]}
        anim={take}
        fontSize={30}
      />
    </>
  );
};
