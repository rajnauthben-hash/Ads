import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PAL } from "../theme";
import { S2 } from "../copy";
import { fadeOut, iv, prog } from "../ui/anim";
import { Lines, SceneNumber } from "../ui/text";
import { PhoneMockup, PhoneOutline } from "../ui/PhoneMockup";
import { Bokeh, Rain, WetGround } from "../ui/Atmos";

/**
 * SCENE 02 — how people shop now. The storefront's warm glow has defocused
 * into bokeh; a phone floats in from the right with a live search UI.
 */
export const Scene02PhoneSearch: React.FC = () => {
  const frame = useCurrentFrame();

  // Phone settles in from below-right, then floats gently
  const enter = prog(frame, 4, 34);
  const float = Math.sin(frame / 26) * 7;
  const floatR = Math.sin(frame / 33 + 1.2) * 0.7;

  // Exit hand-off to the map world: phone lifts and dissolves upward
  const exitT = prog(frame, 140, 22);

  const drift = iv(frame, [0, 162], [0, -14]);

  return (
    <AbsoluteFill>
      {/* the storefront's light, now out of focus */}
      <Bokeh seed={23} count={20} frame={frame} opacity={0.85 * (1 - prog(frame, 140, 16))} region={{ left: 30, top: 8, width: 68, height: 70 }} cyanRatio={0.14} />
      <Bokeh seed={5} count={8} frame={frame} opacity={0.5 * (1 - prog(frame, 140, 16))} region={{ left: 0, top: 55, width: 40, height: 40 }} cyanRatio={0.4} />
      <WetGround frame={frame} top={1560} opacity={0.7 * (1 - prog(frame, 140, 16))} />

      <AbsoluteFill style={{ transform: `translateY(${drift}px)` }}>
        {/* text column (fades ahead of the boundary) */}
        <AbsoluteFill style={{ ...fadeOut(frame, 140, 14) }}>
        <div style={{ position: "absolute", left: 76, top: 300 }}>
          <Lines
            lines={[S2.headline[0], S2.headline[1], [{ t: S2.headline[2], c: PAL.gold, d: 5 }]]}
            delay={6}
            stagger={7}
            size={84}
            weight={700}
            lineHeight={1.14}
            color={PAL.white}
            track={-1.5}
          />
        </div>
        <div style={{ position: "absolute", left: 76, top: 640 }}>
          <Lines
            lines={[
              S2.body[0],
              S2.body[1],
              S2.body[2],
              [{ t: "right now,", c: PAL.cyan, w: 500 }, { t: " close to them." }],
            ]}
            delay={30}
            stagger={5}
            size={30}
            color={PAL.gray}
            lineHeight={1.5}
          />
        </div>

        {/* callout box */}
        <div
          style={{
            position: "absolute",
            left: 68,
            top: 1030,
            width: 410,
            borderRadius: 24,
            border: `2px solid ${PAL.cyanOutline}`,
            background: "rgba(9,13,17,0.55)",
            padding: "36px 34px",
            display: "flex",
            gap: 30,
            alignItems: "center",
            boxShadow: `0 0 70px ${PAL.cyanGlow}`,
            opacity: prog(frame, 56, 24),
            transform: `translateY(${(1 - prog(frame, 56, 24)) * 24}px)`,
          }}
        >
          <div style={{ flexShrink: 0, opacity: prog(frame, 64, 18) }}>
            <PhoneOutline size={120} color={PAL.cyan} />
          </div>
          <div>
            <Lines lines={S2.callout} delay={64} stagger={5} size={36} weight={600} color={PAL.white} lineHeight={1.32} />
            <div style={{ height: 14 }} />
            <Lines lines={[S2.calloutSub]} delay={82} size={26} color={PAL.gray} />
          </div>
        </div>
        <SceneNumber num={S2.num} color={PAL.cyan} lineColor={PAL.gold} />
        </AbsoluteFill>

        {/* phone */}
        <div
          style={{
            position: "absolute",
            left: 500,
            top: 380,
            opacity: Math.min(enter * 1.4, 1) * (1 - exitT),
            transform: [
              `translateY(${(1 - enter) * 190 + float - exitT * 160}px)`,
              `translateX(${(1 - enter) * 60}px)`,
              `rotate(${7 + (1 - enter) * 5 + floatR}deg)`,
              `scale(${1 + exitT * 0.16})`,
            ].join(" "),
            transformOrigin: "50% 80%",
            filter: exitT > 0 ? `blur(${exitT * 18}px)` : undefined,
          }}
        >
          <PhoneMockup delay={16} />
        </div>
      </AbsoluteFill>

      <Rain frame={frame} opacity={0.04} />
    </AbsoluteFill>
  );
};
