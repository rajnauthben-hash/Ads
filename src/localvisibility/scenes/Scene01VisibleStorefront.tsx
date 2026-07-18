import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../styles/tokens";
import { EASE } from "../../omniflowad/theme";
import { fadeOut, iv, prog } from "../../omniflowad/ui/anim";
import { AnimatedHeadline, BodyCopy, SceneNumber } from "../components/text";
import { PhoneSearchUI } from "../components/PhoneSearchUI";
import { CyanRoute } from "../../omniflowad/ui/CyanRoute";
import { Storefront } from "../../omniflowad/ui/Storefront";
import { Bokeh, Rain, WetGround } from "../../omniflowad/ui/Atmos";
import { IconMagnifier } from "../../omniflowad/ui/icons";
import { ReferenceOverlay } from "../components/ReferenceOverlay";

/** Search signal: from the magnifier dot below the phone, along the wet
 * street, to Crown Hardware's doorway. */
const ROUTE_01 =
  "M281,1630 C400,1596 424,1560 470,1540 S548,1498 560,1450 S522,1392 574,1352 S656,1330 664,1282 S624,1252 686,1232 S816,1224 843,1204";

/**
 * SCENE 01 — the storefront looks visible; customers search on phones.
 */
export const Scene01VisibleStorefront: React.FC = () => {
  const frame = useCurrentFrame();

  // 0–18: darkness lifts, warm lights rise. No cyan yet.
  const lightsOn = prog(frame, 2, 20);
  // 76–119: the search signal draws toward the store.
  const routeP = prog(frame, 76, 40, EASE.inOut);
  const pinPulse = prog(frame, 76, 14);

  const phoneT = prog(frame, 30, 30);
  const push = iv(frame, [0, 132], [1, 1.035]);

  // Exit: the phone's outline stretches toward the scene 02 profile panel.
  const exitT = prog(frame, 112, 20, EASE.inOut);
  const textExit = fadeOut(frame, 110, 14);

  return (
    <AbsoluteFill>
      <Bokeh seed={41} count={12} frame={frame} opacity={0.45 * lightsOn * (1 - exitT)} region={{ left: 0, top: 30, width: 40, height: 45 }} cyanRatio={0.15} />

      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "58% 60%" }}>
        {/* storefront right */}
        <div
          style={{
            position: "absolute",
            left: 500,
            top: 389,
            width: 600,
            transform: "perspective(1900px) rotateY(7deg) rotateX(1deg)",
            transformOrigin: "0% 50%",
            opacity: 1 - exitT * 0.55,
          }}
        >
          <Storefront lightsOn={lightsOn} frame={frame} />
          <div
            style={{
              transform: "scaleY(-1) translateY(118px)",
              opacity: 0.28 * lightsOn,
              filter: "blur(9px)",
              WebkitMaskImage: "linear-gradient(180deg, transparent 8%, rgba(0,0,0,0.85) 45%, black 100%)",
              maskImage: "linear-gradient(180deg, transparent 8%, rgba(0,0,0,0.85) 45%, black 100%)",
            }}
          >
            <Storefront lightsOn={lightsOn} frame={frame} />
          </div>
        </div>

        <WetGround frame={frame} top={1085} opacity={(0.5 + 0.5 * lightsOn) * (1 - exitT)} />

        {/* the route + magnifier origin (cyan enters only after f76) */}
        <div style={{ opacity: 1 - exitT }}>
          <CyanRoute d={ROUTE_01} progress={routeP} width={9} />
          <div style={{ position: "absolute", left: 281 - 60, top: 1630 - 60, width: 120, height: 120, opacity: pinPulse }}>
            {[0, 1].map((i) => {
              const r = ((frame / 46 + i * 0.5) % 1);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: 70 + r * 120,
                    height: (70 + r * 120) * 0.4,
                    marginLeft: -(70 + r * 120) / 2,
                    marginTop: -(70 + r * 120) * 0.2,
                    borderRadius: "50%",
                    border: `2px solid ${C.cyan}`,
                    opacity: 0.5 * (1 - r) * pinPulse,
                  }}
                />
              );
            })}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                marginLeft: -34,
                marginTop: -34,
                transform: `scale(${0.8 + 0.2 * pinPulse})`,
                filter: "drop-shadow(0 0 14px rgba(0,216,242,0.6))",
              }}
            >
              <IconMagnifier size={68} color={C.cyan} strokeWidth={2.6} />
            </div>
          </div>
        </div>

        {/* text column */}
        <AbsoluteFill style={{ ...textExit }}>
          <div style={{ position: "absolute", left: 76, top: 196 }}>
            <AnimatedHeadline
              lines={[
                ["Your storefront"],
                [{ t: "looks " }, { t: "visible.", c: C.gold, d: 4 }],
              ]}
              delay={12}
              stagger={8}
              size={94}
              lineHeight={1.12}
            />
          </div>
          <div style={{ position: "absolute", left: 76, top: 470 }}>
            <BodyCopy
              lines={["But nearby customers are not driving around", "looking for your sign."]}
              delay={30}
              size={30}
            />
          </div>
          <div style={{ position: "absolute", left: 76, top: 590 }}>
            <BodyCopy lines={[[{ t: "They’re searching on their phone.", c: C.cyan }]]} delay={48} size={31} weight={500} />
          </div>
          <SceneNumber num="01" delay={12} />
        </AbsoluteFill>

        {/* phone rises from lower-left with shallow perspective */}
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 742,
            opacity: Math.min(1, phoneT * 1.5) * (1 - exitT),
            transform: [
              `translateY(${(1 - phoneT) * 150}px)`,
              `perspective(1500px) rotateY(${5 - phoneT * 3}deg) rotateX(${(1 - phoneT) * 6}deg)`,
              // exit: the search UI stretches toward the profile-panel frame
              `scaleX(${1 + exitT * 0.14}) scaleY(${1 - exitT * 0.06})`,
            ].join(" "),
            transformOrigin: "50% 30%",
            filter: exitT > 0 ? `blur(${exitT * 14}px)` : undefined,
          }}
        >
          <PhoneSearchUI delay={44} />
        </div>

        {/* the phone's cyan edge expanding into the scene 02 panel frame */}
        {exitT > 0.02 && exitT < 1 && (
          <div
            style={{
              position: "absolute",
              left: iv(frame, [112, 132], [72, 55], EASE.inOut),
              top: iv(frame, [112, 132], [742, 580], EASE.inOut),
              width: iv(frame, [112, 132], [424, 476], EASE.inOut),
              height: iv(frame, [112, 132], [820, 640], EASE.inOut),
              borderRadius: iv(frame, [112, 132], [62, 26], EASE.inOut),
              border: `2.5px solid ${C.cyan}`,
              boxShadow: `0 0 60px ${C.cyanGlow}`,
              opacity: Math.sin(exitT * Math.PI) * 0.9,
            }}
          />
        )}
      </AbsoluteFill>

      <Rain frame={frame} opacity={0.045} />
      <ReferenceOverlay scene={1} />
    </AbsoluteFill>
  );
};
