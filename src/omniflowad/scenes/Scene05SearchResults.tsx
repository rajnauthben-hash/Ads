import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EASE, PAL } from "../theme";
import { S5 } from "../copy";
import { fadeOut, prog } from "../ui/anim";
import { Lines, SceneNumber } from "../ui/text";
import { CyanRoute } from "../ui/CyanRoute";
import { ResultCard, WarningBox } from "../ui/Panels";

/** Background route — supporting visual only, entering from the bottom. */
const ROUTE_05 = "M532,1852 L532,1568 L362,1424 L620,1298 L582,1160 L732,1082 L712,986";

/**
 * SCENE 05 — passed over. Result cards stack in from the top right;
 * Crown Hardware enters in a red negative state.
 */
export const Scene05SearchResults: React.FC = () => {
  const frame = useCurrentFrame();

  const routeP = prog(frame, 6, 56, EASE.inOut);
  const exit = fadeOut(frame, 110, 14);

  const hues = [30, 210, 0, 16];

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ ...exit }}>
        {/* supporting route beneath the content */}
        <div style={{ opacity: 0.55 }}>
          <CyanRoute d={ROUTE_05} progress={routeP} width={9} startDot />
        </div>

        {/* headline + body */}
        <div style={{ position: "absolute", left: 72, top: 356 }}>
          <Lines
            lines={[
              [{ t: S5.headline[0] }],
              [{ t: "gets " }, { t: "passed over.", c: PAL.gold, d: 4 }],
            ]}
            delay={2}
            stagger={7}
            size={58}
            weight={700}
            lineHeight={1.18}
            color={PAL.white}
            track={-1}
          />
        </div>
        <div style={{ position: "absolute", left: 72, top: 545 }}>
          <Lines lines={S5.body1} delay={22} stagger={5} size={30} color={PAL.gray} lineHeight={1.48} />
        </div>
        <div style={{ position: "absolute", left: 72, top: 706 }}>
          <Lines lines={S5.body2} delay={40} stagger={5} size={30} color={PAL.gray} lineHeight={1.48} />
        </div>
        <div style={{ position: "absolute", left: 72, top: 818 }}>
          <Lines
            lines={[[{ t: "But online, " }, { t: "it’s invisible.", c: PAL.cyan, w: 600, d: 4 }]]}
            delay={54}
            size={30}
            color={PAL.gray}
            lineHeight={1.48}
          />
        </div>

        {/* warning box */}
        <div style={{ position: "absolute", left: 72, top: 920 }}>
          <WarningBox delay={62} width={420} />
        </div>

        {/* result stack */}
        {S5.results.map((item, i) => (
          <div key={item.name} style={{ position: "absolute", left: 560, top: 358 + i * 192 }}>
            <ResultCard item={item} delay={10 + i * 12} width={468} hue={hues[i]} />
          </div>
        ))}
        <SceneNumber num={S5.num} color={PAL.gold} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
