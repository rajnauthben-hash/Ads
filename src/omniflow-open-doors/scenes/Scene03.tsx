import React from "react";
import { ease } from "../anim";
import { EditorialHeadline, SupportingCopy, GoldLanding } from "../components/Typography";
import { GoldDivider } from "../components/GoldDivider";
import { RouteDraw, RoutePulse, CustomerMarker, DestinationRing } from "../components/Routes";
import { MapStore, MapPin, DestinationLabel, NodeLabel, SpeechBubble } from "../components/MapElements";

const COPY = {
  headline: ["THE DEMAND EXISTED.", "IT JUST WENT", "SOMEWHERE ELSE."],
  s1: ["People nearby were already", "searching for a hardware store,", "a place that was open, close,", "and easy to trust."],
  s2: ["The need was real.", "The customer was ready."],
  s3: ["But when they searched,", "a clearer competitor got the call,", "the directions, and the visit."],
  gold: ["Every missed search can become", "someone else’s sale."],
};

// Screen-space routes tuned to weave along the visible street gaps.
const CUSTOMER = { x: 420, y: 1225 };
export const SOLID_ROUTE_D =
  "M420,1225 L520,1120 L470,1000 L600,880 L560,740 L690,640 L660,520 L800,430 L860,362 L902,320";
export const DOTTED_ROUTE_D =
  "M420,1225 L472,1320 L560,1352 L620,1462 L720,1500 L820,1560 L900,1602";

/** Scene 3 — The demand went somewhere else (frames 360-539). */
export const Scene03: React.FC<{ frame: number }> = ({ frame }) => {
  if (frame < 352 || frame > 556) return null;
  const f = frame - 360;

  // Fade out as Scene 4 establishes (the dotted Crown route + bubble hand off
  // to Scene 4's repaired route and info card).
  const inOpacity = ease(frame, [356, 370], [0, 1]) * ease(frame, [536, 556], [1, 0]);
  const storeIn = ease(f, [0, 44], [0, 1]);
  const nodeIn = ease(f, [26, 46], [0, 1]);
  const bubbleIn = ease(f, [48, 78], [0, 1]);

  const solidProgress = ease(frame, [424, 486], [0, 1]);
  const dottedProgress = ease(frame, [430, 492], [0, 1]);

  // Travelling cyan pulse once the solid route is mostly drawn.
  const pulseHead = frame >= 470 ? ((frame - 470) % 40) / 40 : 0;
  const showPulse = solidProgress > 0.55;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: inOpacity }}>
      {/* Map destinations (arrived from the Scene 2 cards). */}
      <MapStore x={770} y={165} width={270} height={255} opacity={storeIn} bright />
      <MapPin x={905} y={318} opacity={storeIn} />
      <DestinationLabel x={702} y={182} line1="MAPLEWOOD" line2="HARDWARE" opacity={storeIn} />
      <MapStore x={795} y={1535} width={250} height={240} opacity={storeIn} bright={false} />
      <MapPin x={922} y={1600} opacity={storeIn} dim />
      <DestinationLabel x={730} y={1400} line1="CROWN" line2="HARDWARE" opacity={storeIn} />

      {/* Routes drawn from the shared Customer origin. */}
      <RouteDraw id="s3-solid" d={SOLID_ROUTE_D} progress={solidProgress} variant="solid" />
      <RouteDraw id="s3-dotted" d={DOTTED_ROUTE_D} progress={dottedProgress} variant="dotted" />
      {showPulse && <RoutePulse d={SOLID_ROUTE_D} head={pulseHead} />}
      <DestinationRing x={900} y={1602} diameter={22} active={false} progress={dottedProgress} />

      {/* Shared Customer node + label. */}
      <CustomerMarker x={CUSTOMER.x} y={CUSTOMER.y} variant="node" opacity={nodeIn} />
      <NodeLabel x={245} y={1178} text="Customer" opacity={nodeIn} />

      {/* Weak digital presence bubble above the dotted route. */}
      <SpeechBubble x={635} y={1310} width={230} height={118} text={"Weak digital\npresence"} opacity={bubbleIn} />

      {/* Copy column (left). */}
      <div style={{ position: "absolute", left: 55, top: 118 }}>
        <EditorialHeadline lines={COPY.headline} frame={frame} start={366} stagger={6} fontSize={73} width={440} />
      </div>
      <GoldDivider x={55} y={490} width={110} frame={frame} start={392} />
      <div style={{ position: "absolute", left: 55, top: 535 }}>
        <SupportingCopy lines={COPY.s1} frame={frame} start={396} fontSize={24} width={390} />
      </div>
      <div style={{ position: "absolute", left: 55, top: 745 }}>
        <SupportingCopy lines={COPY.s2} frame={frame} start={410} fontSize={24} width={370} />
      </div>
      <div style={{ position: "absolute", left: 55, top: 865 }}>
        <SupportingCopy lines={COPY.s3} frame={frame} start={424} fontSize={24} width={400} />
      </div>
      <GoldDivider x={55} y={1035} width={110} frame={frame} start={488} />
      <div style={{ position: "absolute", left: 55, top: 1080 }}>
        <GoldLanding lines={COPY.gold} frame={frame} start={492} fontSize={29} width={400} />
      </div>
    </div>
  );
};
