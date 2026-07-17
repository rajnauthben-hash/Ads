import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PAL } from "../theme";
import { S1 } from "../copy";
import { fadeOut, iv, prog, reveal } from "../ui/anim";
import { Lines, SceneNumber } from "../ui/text";
import { Storefront } from "../ui/Storefront";
import { Bokeh, Rain, WetGround } from "../ui/Atmos";
import { IconBulb, IconDoor } from "../ui/icons";

/**
 * SCENE 01 — the physical storefront and the false feeling of visibility.
 * Rainy night ambience; storefront lights rise; copy reveals in groups;
 * LIGHTS ON / DOORS OPEN icons trace in; slow push toward the storefront.
 */
export const Scene01Storefront: React.FC = () => {
  const frame = useCurrentFrame();

  // Lights wake up over the first ~1.5s
  const lightsOn = prog(frame, 8, 38);

  // Slow push toward the storefront across the whole scene
  const push = iv(frame, [0, 162], [1, 1.045]);

  // Exit: storefront defocuses into the bokeh field of scene 02
  const exitT = prog(frame, 142, 20);

  return (
    <AbsoluteFill>
      {/* ambient rainy street */}
      <Bokeh seed={11} count={14} frame={frame} opacity={0.5 + 0.3 * lightsOn} region={{ left: 0, top: 40, width: 42, height: 55 }} />

      {/* camera */}
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "62% 55%" }}>
        {/* storefront, right half */}
        <div
          style={{
            position: "absolute",
            left: 412,
            top: 468,
            width: 724,
            transform: `perspective(1900px) rotateY(8deg) rotateX(1deg) translateY(${(1 - lightsOn) * 6}px)`,
            transformOrigin: "0% 50%",
            opacity: 1 - exitT,
            filter: exitT > 0 ? `blur(${exitT * 26}px)` : undefined,
          }}
        >
          <Storefront lightsOn={lightsOn} frame={frame} />
          {/* reflection on wet pavement */}
          <div
            style={{
              transform: "scaleY(-1) translateY(118px)",
              opacity: 0.3 * lightsOn,
              filter: "blur(9px)",
              WebkitMaskImage: "linear-gradient(180deg, transparent 8%, rgba(0,0,0,0.85) 45%, black 100%)",
              maskImage: "linear-gradient(180deg, transparent 8%, rgba(0,0,0,0.85) 45%, black 100%)",
            }}
          >
            <Storefront lightsOn={lightsOn} frame={frame} />
          </div>
        </div>

        <WetGround frame={frame} top={1470} opacity={0.55 + 0.45 * lightsOn} />

        {/* text column (fades ahead of the scene boundary) */}
        <AbsoluteFill style={{ ...fadeOut(frame, 140, 14) }}>
        <div style={{ position: "absolute", left: 76, top: 236 }}>
          <Lines
            lines={[
              S1.headline[0],
              S1.headline[1],
              [{ t: S1.headline[2], c: PAL.gold, d: 5 }],
              [{ t: S1.headline[3], c: PAL.gold, d: 5 }],
            ]}
            delay={10}
            stagger={7}
            size={82}
            weight={700}
            lineHeight={1.13}
            color={PAL.white}
            track={-1.5}
          />
        </div>
        <div style={{ position: "absolute", left: 76, top: 668 }}>
          <Lines lines={S1.body1} delay={38} stagger={5} size={29} color={PAL.gray} lineHeight={1.48} />
        </div>
        <div style={{ position: "absolute", left: 76, top: 830 }}>
          <Lines lines={S1.body2} delay={56} stagger={5} size={29} color={PAL.cyan} lineHeight={1.48} />
        </div>
        <div style={{ position: "absolute", left: 76, top: 992 }}>
          <Lines lines={S1.body3} delay={72} stagger={5} size={29} color={PAL.gray} lineHeight={1.48} />
        </div>

        {/* bottom feature icons — LIGHTS ON / DOORS OPEN only */}
        <div
          style={{
            position: "absolute",
            left: 200,
            top: 1560,
            display: "flex",
            alignItems: "center",
            gap: 56,
            ...reveal(frame, 74, 24, 18),
          }}
        >
          {[0, 1].map((i) => {
            const trace = prog(frame, 78 + i * 10, 26);
            const Icon = i === 0 ? IconBulb : IconDoor;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 56 }}>
                {i === 1 && <div style={{ width: 2, height: 120, background: "rgba(17,217,247,0.35)", transform: `scaleY(${trace})` }} />}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
                  <Icon size={78} color={PAL.cyan} strokeWidth={1.7} progress={trace} />
                  <div style={{ fontSize: 27, fontWeight: 600, letterSpacing: 2.5, color: PAL.white, opacity: prog(frame, 86 + i * 10, 18) }}>
                    {S1.icons[i]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <SceneNumber num={S1.num} color={PAL.gold} />
        </AbsoluteFill>
      </AbsoluteFill>

      <Rain frame={frame} opacity={0.045} />
    </AbsoluteFill>
  );
};
