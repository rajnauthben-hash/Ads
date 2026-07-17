import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EASE, PAL } from "../theme";
import { S4 } from "../copy";
import { fadeOut, prog, reveal } from "../ui/anim";
import { Lines, SceneNumber } from "../ui/text";
import { CyanRoute } from "../ui/CyanRoute";
import { IsoShopIcon } from "../ui/IsoShopIcon";
import { Bubble, InfoCallout, ProfileTable } from "../ui/Panels";

/**
 * Route: YOUR CUSTOMER → COMPETITOR only. Crown Hardware stays unconnected —
 * this is the critical visual rule of the scene.
 */
const ROUTE_04 = "M540,1660 C490,1580 420,1565 390,1510 S330,1470 305,1440 S268,1425 254,1400";

/**
 * SCENE 04 — the map reads the profile, not the sign. Profile panel builds
 * line by line, missing values light up red, and the bottom diagram resolves
 * with the route leading the customer to the competitor.
 */
export const Scene04ProfileVsMap: React.FC = () => {
  const frame = useCurrentFrame();

  const routeP = prog(frame, 64, 30, EASE.inOut);
  const exit = fadeOut(frame, 110, 14);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ ...exit }}>
        {/* headline */}
        <div style={{ position: "absolute", left: 76, top: 168 }}>
          <Lines
            lines={[
              [{ t: "The map " }, { t: "can’t read", c: PAL.cyan, d: 4 }],
              [{ t: "your storefront sign." }],
            ]}
            delay={2}
            stagger={7}
            size={64}
            weight={700}
            lineHeight={1.18}
            color={PAL.white}
            track={-1}
          />
        </div>
        <div style={{ position: "absolute", left: 76, top: 352 }}>
          <Lines lines={S4.support} delay={16} stagger={5} size={30} color={PAL.gray} lineHeight={1.5} />
        </div>

        {/* profile panel */}
        <div style={{ position: "absolute", left: 58, top: 508 }}>
          <ProfileTable delay={22} width={500} />
        </div>

        {/* dotted connector to the info callout */}
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <line
            x1={562}
            y1={820}
            x2={634}
            y2={820}
            stroke={PAL.cyanOutline}
            strokeWidth={2.5}
            strokeDasharray="5 9"
            opacity={prog(frame, 56, 14)}
          />
        </svg>

        {/* info callout */}
        <div style={{ position: "absolute", left: 636, top: 592 }}>
          <InfoCallout delay={50} width={382} />
        </div>

        {/* ---- bottom diagram ---- */}
        {/* competitor (left) */}
        <div style={{ position: "absolute", left: 100, top: 1225, width: 290, ...reveal(frame, 62, 22, 26) }}>
          <IsoShopIcon variant="competitor" label={S4.labels.competitor} ring={PAL.cyan} frame={frame} />
        </div>
        {/* crown hardware (right) — present but unconnected */}
        <div style={{ position: "absolute", left: 668, top: 1232, width: 290, ...reveal(frame, 66, 22, 26), opacity: 0.92 * prog(frame, 66, 22) }}>
          <IsoShopIcon variant="crown" label={S4.labels.crown} ring={PAL.cyan} ringOpacity={0.3} lit={0.8} frame={frame} />
        </div>
        {/* your customer (bottom center) */}
        <div style={{ position: "absolute", left: 396, top: 1585, width: 290, ...reveal(frame, 58, 22, 26) }}>
          <IsoShopIcon variant="customer" label={S4.labels.customer} ring="#E8C23A" frame={frame} />
        </div>

        {/* the route: customer → competitor ONLY */}
        <CyanRoute d={ROUTE_04} progress={routeP} width={10} arrow />

        {/* diagram callouts */}
        <div style={{ position: "absolute", left: 92, top: 1102 }}>
          <Bubble lines={S4.calloutCompetitor} icon="trophy" delay={80} width={296} />
        </div>
        <div style={{ position: "absolute", left: 622, top: 1108 }}>
          <Bubble lines={S4.calloutCrown} icon="blocked" delay={85} width={368} />
        </div>
        <div style={{ position: "absolute", left: 392, top: 1420 }}>
          <Bubble
            lines={[
              S4.calloutCenter[0],
              S4.calloutCenter[1],
              [{ t: "to the " }, { t: "competitor.", c: PAL.cyan }],
            ]}
            delay={90}
            width={300}
            pointer="down"
          />
        </div>
        <SceneNumber num={S4.num} color={PAL.cyan} lineColor={PAL.gold} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

