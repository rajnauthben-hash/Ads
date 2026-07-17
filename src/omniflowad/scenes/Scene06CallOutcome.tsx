import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PAL } from "../theme";
import { S6 } from "../copy";
import { fadeOut, iv, prog } from "../ui/anim";
import { Lines, SceneNumber } from "../ui/text";
import { Storefront } from "../ui/Storefront";
import { Bokeh, Rain, WetGround } from "../ui/Atmos";
import { CallCard } from "../ui/Panels";

/**
 * SCENE 06 — the competitor gets the call. The rainy storefront world
 * returns; the top search result condenses into an incoming-call card.
 */
export const Scene06CallOutcome: React.FC = () => {
  const frame = useCurrentFrame();

  // storefront brightens slightly through the scene
  const glow = iv(frame, [0, 120], [0.88, 1]);
  const enterT = prog(frame, 0, 18);

  // ghost of the winning result card traveling into the call card
  const ghostT = prog(frame, 0, 22);

  // exit: the storefront pulls back toward its distant scene-07 position
  const exitT = prog(frame, 110, 22);
  const textExit = fadeOut(frame, 110, 14);

  return (
    <AbsoluteFill>
      <Bokeh seed={31} count={12} frame={frame} opacity={0.5 * (1 - exitT)} region={{ left: 0, top: 45, width: 40, height: 45 }} cyanRatio={0.3} />

      {/* storefront right */}
      <div
        style={{
          position: "absolute",
          left: 558 + exitT * 152,
          top: 472 - exitT * 277,
          width: 600 - exitT * 275,
          opacity: enterT * (1 - exitT),
          transform: `perspective(1700px) rotateY(${6 - exitT * 6}deg)`,
          transformOrigin: "20% 50%",
          filter: `blur(${(1 - enterT) * 10}px)`,
        }}
      >
        <Storefront lightsOn={glow} frame={frame} />
        <div
          style={{
            transform: "scaleY(-1) translateY(118px)",
            opacity: 0.26 * glow,
            filter: "blur(9px)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 8%, rgba(0,0,0,0.85) 45%, black 100%)",
            maskImage: "linear-gradient(180deg, transparent 8%, rgba(0,0,0,0.85) 45%, black 100%)",
          }}
        >
          <Storefront lightsOn={glow} frame={frame} />
        </div>
      </div>

      <WetGround frame={frame} top={1180} opacity={0.85 * (1 - exitT)} />

      <AbsoluteFill style={{ ...textExit }}>
        {/* headline */}
        <div style={{ position: "absolute", left: 76, top: 318 }}>
          <Lines
            lines={[S6.headline[0], S6.headline[1], [{ t: S6.headline[2], c: PAL.cyan, d: 5 }]]}
            delay={4}
            stagger={7}
            size={78}
            weight={700}
            lineHeight={1.15}
            color={PAL.white}
            track={-1.2}
          />
        </div>
        <div style={{ position: "absolute", left: 76, top: 652 }}>
          <Lines lines={S6.body} delay={28} stagger={5} size={30} color={PAL.gray} lineHeight={1.5} />
        </div>

        {/* the winning result card condensing into the call card */}
        <div
          style={{
            position: "absolute",
            left: 560 - ghostT * 480,
            top: 358 + ghostT * 596,
            width: 468,
            height: 150,
            borderRadius: 24,
            background: PAL.card,
            border: `1.5px solid ${PAL.cardBorder}`,
            opacity: ghostT < 1 ? 0.55 * (1 - ghostT) : 0,
            transform: `scale(${1 - ghostT * 0.12})`,
            filter: `blur(${ghostT * 10}px)`,
          }}
        />

        {/* incoming call */}
        <div style={{ position: "absolute", left: 80, top: 952 }}>
          <CallCard delay={22} width={508} />
        </div>

        {/* bottom line */}
        <div style={{ position: "absolute", left: 82, top: 1208 }}>
          <Lines lines={S6.bottom} delay={52} stagger={5} size={30} color={PAL.gray} lineHeight={1.5} />
        </div>
        <SceneNumber num={S6.num} color={PAL.gold} />
      </AbsoluteFill>

      <Rain frame={frame} opacity={0.045 * (1 - exitT)} />
    </AbsoluteFill>
  );
};
