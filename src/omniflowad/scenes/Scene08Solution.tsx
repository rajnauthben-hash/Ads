import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EASE, PAL } from "../theme";
import { S8 } from "../copy";
import { iv, prog } from "../ui/anim";
import { Lines, SceneNumber } from "../ui/text";
import { CyanRoute } from "../ui/CyanRoute";
import { Storefront } from "../ui/Storefront";
import { BrandLockup, Checklist, CustomerMarker } from "../ui/Panels";

/** The resolved route: a clean, confident curve from customer to store. */
const ROUTE_08 =
  "M320,1452 C430,1392 402,1302 470,1246 C538,1190 502,1120 562,1074 C622,1028 592,958 642,914 C692,870 662,798 706,758 C750,718 732,690 758,652 C778,624 790,606 798,584";

/** Quiet neighbourhood pins — other places on the map, unlit. */
const PINS = [{ x: 428, y: 758 }, { x: 792, y: 906 }, { x: 438, y: 1082 }];

/**
 * SCENE 08 — resolution. The failing route becomes a clean connection,
 * the checklist fills in, and OmniFlow Digital signs the film.
 */
export const Scene08Solution: React.FC = () => {
  const frame = useCurrentFrame();

  const routeP = prog(frame, 14, 52, EASE.inOut);
  const arriveT = prog(frame, 62, 18);
  const storeGlow = iv(frame, [0, 70], [0.9, 1.05]);

  return (
    <AbsoluteFill>
      {/* the storefront, finally reachable */}
      <div style={{ position: "absolute", left: 700, top: 196, width: 330 }}>
        <div
          style={{
            position: "absolute",
            left: -40,
            top: 300,
            width: 420,
            height: 190,
            background: `radial-gradient(ellipse, rgba(242,200,127,${0.12 + 0.1 * arriveT}), transparent 70%)`,
          }}
        />
        <Storefront lightsOn={storeGlow} frame={frame} showBoard={false} />
      </div>

      {/* unlit neighbourhood pins */}
      {PINS.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x - 34,
            top: p.y - 44,
            opacity: 0.75 * prog(frame, 20 + i * 8, 20),
          }}
        >
          <svg width={68} height={88} viewBox="0 0 68 88">
            <path
              d="M34 4 C50 4 64 17 64 34 C64 52 48 62 34 84 C20 62 4 52 4 34 C4 17 18 4 34 4 Z"
              fill="rgba(24,28,34,0.92)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={2}
            />
            <circle cx={34} cy={34} r={11} fill="rgba(255,255,255,0.2)" />
          </svg>
        </div>
      ))}

      {/* clean route + arrival glow */}
      <CyanRoute d={ROUTE_08} progress={routeP} width={11} travelPulse />
      <div
        style={{
          position: "absolute",
          left: 798 - 90,
          top: 584 - 40,
          width: 180,
          height: 80,
          borderRadius: "50%",
          border: `3px solid rgba(17,217,247,${0.7 * arriveT * (1 - (frame % 50) / 50)})`,
          transform: `scale(${0.4 + ((frame % 50) / 50) * 1.1})`,
          opacity: arriveT,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 798 - 34,
          top: 584 - 17,
          width: 68,
          height: 34,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(17,217,247,0.75), rgba(17,217,247,0) 70%)",
          opacity: arriveT,
        }}
      />

      {/* customer marker */}
      <div style={{ position: "absolute", left: 116, top: 1358 }}>
        <CustomerMarker size={240} delay={2} />
      </div>

      {/* headline */}
      <div style={{ position: "absolute", left: 76, top: 200 }}>
        <Lines
          lines={[[{ t: "We " }, { t: "fix that.", c: PAL.gold, d: 4 }]]}
          delay={2}
          size={88}
          weight={700}
          lineHeight={1.1}
          color={PAL.white}
          track={-1.4}
        />
      </div>

      {/* body */}
      <div style={{ position: "absolute", left: 76, top: 342 }}>
        <Lines
          lines={[
            S8.body[0],
            S8.body[1],
            S8.body[2],
            [{ t: "so the map can finally " }, { t: "see you,", c: PAL.cyan }],
            [{ t: "trust you,", c: PAL.cyan }, { t: " and " }, { t: "show you", c: PAL.cyan }],
            S8.body[5],
            S8.body[6],
          ]}
          delay={14}
          stagger={4}
          size={30}
          color={PAL.gray}
          lineHeight={1.5}
        />
      </div>

      {/* checklist */}
      <div style={{ position: "absolute", left: 76, top: 716 }}>
        <Checklist items={S8.checklist} delay={34} stagger={7} />
      </div>

      {/* conclusion */}
      <div style={{ position: "absolute", left: 76, top: 1178 }}>
        <Lines
          lines={[
            S8.conclusion[0],
            S8.conclusion[1],
            [{ t: S8.conclusion[2], c: PAL.gold, w: 700, d: 3 }],
            [{ t: S8.conclusion[3], c: PAL.gold, w: 700, d: 3 }],
          ]}
          delay={78}
          stagger={5}
          size={33}
          weight={500}
          color={PAL.white}
          lineHeight={1.46}
        />
      </div>

      {/* brand lockup */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1596 }}>
        <BrandLockup delay={86} taglineDelay={98} brand={S8.brand} tagline={S8.tagline} />
      </div>

      <SceneNumber num={S8.num} color={PAL.gold} />
    </AbsoluteFill>
  );
};
