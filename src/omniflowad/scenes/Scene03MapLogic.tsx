import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EASE, PAL } from "../theme";
import { S3 } from "../copy";
import { fadeOut, iv, prog, revealX, pop } from "../ui/anim";
import { Lines, SceneNumber } from "../ui/text";
import { CyanRoute } from "../ui/CyanRoute";
import { IconChat, IconClock, IconMagnifier, IconPin, IconStar } from "../ui/icons";

/** Route for scene 03: bottom-left signal dot up to the search pin. */
export const ROUTE_03 =
  "M215,1560 L342,1372 L305,1215 L520,1012 L558,864 L700,762 L662,612 L788,478";

const CRITERIA_ICONS = [IconPin, IconClock, IconStar, IconChat];

/**
 * SCENE 03 — the map listens. The phone's search energy has expanded into
 * the city grid; a cyan route traces to a pulsing search pin while the
 * ranking criteria stack in.
 */
export const Scene03MapLogic: React.FC = () => {
  const frame = useCurrentFrame();

  const routeP = prog(frame, 12, 62, EASE.inOut);
  const pinT = prog(frame, 62, 20);
  const pinPulse = (frame % 44) / 44;

  // one scan shimmer sweeping the grid
  const scanT = prog(frame, 26, 60, EASE.inOut);

  const drift = iv(frame, [0, 132], [8, -18]);

  return (
    <AbsoluteFill style={{ ...fadeOut(frame, 110, 14, 0) }}>
      <AbsoluteFill style={{ transform: `translateY(${drift}px)` }}>
        {/* scan shimmer */}
        <div
          style={{
            position: "absolute",
            left: -300,
            top: scanT * 2300 - 500,
            width: 1700,
            height: 300,
            background: "linear-gradient(180deg, transparent, rgba(17,217,247,0.05) 40%, rgba(17,217,247,0.08) 55%, transparent)",
            transform: "rotate(-14deg)",
            opacity: scanT > 0.02 && scanT < 0.98 ? 1 : 0,
            pointerEvents: "none",
          }}
        />

        {/* the connective route */}
        <CyanRoute d={ROUTE_03} progress={routeP} width={11} startDot />

        {/* search pin */}
        <div
          style={{
            position: "absolute",
            left: 788 - 110,
            top: 478 - 130,
            width: 220,
            height: 220,
            opacity: pinT,
            transform: `scale(${0.7 + 0.3 * pinT})`,
          }}
        >
          {/* concentric radar rings */}
          {[0, 1].map((i) => {
            const r = ((pinPulse + i * 0.5) % 1);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 96,
                  width: 60 + r * 190,
                  height: (60 + r * 190) * 0.42,
                  marginLeft: -(60 + r * 190) / 2,
                  marginTop: -(60 + r * 190) * 0.21,
                  borderRadius: "50%",
                  border: `2px solid ${PAL.cyan}`,
                  opacity: 0.5 * (1 - r),
                }}
              />
            );
          })}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              marginLeft: -62,
              width: 124,
              height: 124,
              borderRadius: "50% 50% 50% 50%",
              background: "radial-gradient(circle at 50% 42%, rgba(17,217,247,0.28), rgba(17,217,247,0.08) 70%)",
              border: `3px solid rgba(17,217,247,0.85)`,
              boxShadow: "0 0 60px rgba(17,217,247,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconMagnifier size={58} color="#DFFBFF" strokeWidth={2.4} />
          </div>
          {/* pin tail */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 118,
              marginLeft: -12,
              width: 0,
              height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderTop: `26px solid rgba(17,217,247,0.85)`,
              filter: "drop-shadow(0 0 10px rgba(17,217,247,0.5))",
            }}
          />
        </div>

        {/* headline */}
        <div style={{ position: "absolute", left: 76, top: 214 }}>
          <Lines
            lines={[S3.headline[0], [{ t: S3.headline[1], c: PAL.cyan, d: 4 }]]}
            delay={4}
            stagger={8}
            size={78}
            weight={700}
            lineHeight={1.16}
            color={PAL.white}
            track={-1.2}
          />
        </div>
        <div style={{ position: "absolute", left: 76, top: 428 }}>
          <Lines lines={S3.body} delay={24} stagger={5} size={30} color={PAL.gray} lineHeight={1.5} />
        </div>

        {/* criteria boxes */}
        <div style={{ position: "absolute", left: 74, top: 610, display: "flex", flexDirection: "column", gap: 16 }}>
          {S3.criteria.map((c, i) => {
            const Icon = CRITERIA_ICONS[i];
            return (
              <div
                key={c}
                style={{
                  width: 348,
                  height: 84,
                  borderRadius: 16,
                  background: "rgba(10,14,18,0.68)",
                  border: "1.5px solid rgba(255,255,255,0.14)",
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  padding: "0 26px",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                  ...revealX(frame, 42 + i * 9, 20, -36),
                }}
              >
                <div style={{ ...pop(frame, 48 + i * 9) }}>
                  <Icon size={36} color="#E7ECEF" strokeWidth={2} />
                </div>
                <div style={{ fontSize: 33, fontWeight: 500, color: PAL.white }}>{c}</div>
              </div>
            );
          })}
        </div>

        {/* bottom paragraph */}
        <div style={{ position: "absolute", left: 76, top: 1042 }}>
          <Lines lines={S3.bottom} delay={80} stagger={5} size={32} color={PAL.gray} lineHeight={1.48} />
        </div>
        <SceneNumber num={S3.num} color={PAL.gold} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
