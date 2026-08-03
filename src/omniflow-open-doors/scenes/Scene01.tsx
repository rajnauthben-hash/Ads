import React from "react";
import { COLORS } from "../constants";
import { ease } from "../anim";
import { StorefrontPlate } from "../components/StorefrontPlate";
import { GoldDivider } from "../components/GoldDivider";
import { EditorialHeadline, SupportingCopy, GoldLanding } from "../components/Typography";

const COPY = {
  headline: ["YOU OPENED", "ON TIME.", "EVERYTHING", "WAS READY."],
  s1: ["The lights were on.", "The shelves were full.", "Your team was ready to help."],
  s2: ["You stocked the store,", "opened the doors, and", "prepared for another day", "of business."],
  s3: ["But a prepared business", "still feels invisible when", "nobody walks through", "the door."],
  gold: ["It wasn’t a lack of effort.", "It was a lack of visibility."],
};

// Hero storefront rect for Scene 1 (leaves the left column fully on dark).
const HERO = { x: 400, y: 0, w: 680, h: 1920 };
// Scene 2 "Your Business" card rect the storefront morphs toward.
const CARD = { x: 60, y: 845, w: 430, h: 680 };

/** Scene 1 — Prepared, but invisible (frames 0-179). */
export const Scene01: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame > 205) return null; // short outro overlap into Scene 2

  const out = ease(frame, [145, 179], [0, 1]);
  const plate = {
    x: HERO.x + (CARD.x - HERO.x) * out,
    y: HERO.y + (CARD.y - HERO.y) * out,
    w: HERO.w + (CARD.w - HERO.w) * out,
    h: HERO.h + (CARD.h - HERO.h) * out,
  };
  const lightLevel = ease(frame, [0, 20], [0, 1]);
  const panelOut = ease(frame, [150, 176], [0, 1]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Persistent storefront hero -> morphs toward the Scene 2 card. */}
      <StorefrontPlate
        x={plate.x}
        y={plate.y}
        width={plate.w}
        height={plate.h}
        radius={out * 16}
        lightLevel={lightLevel}
        opacity={1 - ease(frame, [172, 190], [0, 1])}
      />

      {/* Solid dark copy panel (like the reference) with a soft right edge. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 470,
          height: 1920,
          background: `linear-gradient(90deg, ${COLORS.bgBase} 0%, ${COLORS.bgBase} 78%, rgba(6,9,13,0) 100%)`,
          opacity: 1 - panelOut,
          transform: `translateX(${-panelOut * 40}px)`,
        }}
      />

      <div style={{ opacity: 1 - panelOut, transform: `translateX(${-panelOut * 30}px)` }}>
        <GoldDivider x={50} y={315} width={88} frame={frame} start={10} />
        <div style={{ position: "absolute", left: 48, top: 352 }}>
          <EditorialHeadline lines={COPY.headline} frame={frame} start={14} stagger={5} fontSize={64} condense={0.82} width={380} />
        </div>

        <GoldDivider x={50} y={815} width={92} frame={frame} start={36} />
        <div style={{ position: "absolute", left: 48, top: 865 }}>
          <SupportingCopy lines={COPY.s1} frame={frame} start={40} fontSize={23} width={360} />
        </div>
        <div style={{ position: "absolute", left: 48, top: 1055 }}>
          <SupportingCopy lines={COPY.s2} frame={frame} start={62} fontSize={23} width={360} />
        </div>
        <div style={{ position: "absolute", left: 48, top: 1280 }}>
          <SupportingCopy lines={COPY.s3} frame={frame} start={86} fontSize={23} width={360} />
        </div>

        <GoldDivider x={48} y={1510} width={94} frame={frame} start={106} />
        <div style={{ position: "absolute", left: 48, top: 1555 }}>
          <GoldLanding lines={COPY.gold} frame={frame} start={110} fontSize={26} width={380} />
        </div>
      </div>
    </div>
  );
};
