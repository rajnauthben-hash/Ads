import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EASE, PAL } from "../theme";
import { S7 } from "../copy";
import { fadeOut, pop, prog, reveal } from "../ui/anim";
import { Lines, SceneNumber } from "../ui/text";
import { CyanRoute } from "../ui/CyanRoute";
import { Storefront } from "../ui/Storefront";
import { CustomerMarker } from "../ui/Panels";
import { IconX } from "../ui/icons";

/** Failing route from the searching customer toward the unreachable store. */
const ROUTE_07 =
  "M240,1478 L380,1340 L352,1208 L560,1078 L520,950 L668,878 L640,742 L782,644 L800,588";

const MARKS: { x: number; y: number; label: { x: number; y: number; align: "left" | "right" } }[] = [
  { x: 631, y: 719, label: { x: 400, y: 622, align: "left" } },
  { x: 664, y: 1100, label: { x: 748, y: 1028, align: "left" } },
  { x: 610, y: 1290, label: { x: 700, y: 1320, align: "left" } },
];

/**
 * SCENE 07 — missed customers. The route reaches for the storefront but the
 * journey is studded with failure markers; the store sits present yet
 * unreachable at the top right.
 */
export const Scene07MissedCustomers: React.FC = () => {
  const frame = useCurrentFrame();

  const routeP = prog(frame, 14, 62, EASE.inOut);
  const storeT = prog(frame, 2, 18);
  const exit = fadeOut(frame, 110, 14);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ ...exit }}>
        {/* the distant storefront, present but missed */}
        <div
          style={{
            position: "absolute",
            left: 700,
            top: 196,
            width: 330,
            opacity: storeT,
            filter: `blur(${(1 - storeT) * 8}px)`,
          }}
        >
          {/* plaza glow under the store */}
          <div
            style={{
              position: "absolute",
              left: -40,
              top: 300,
              width: 420,
              height: 190,
              background: "radial-gradient(ellipse, rgba(242,200,127,0.14), transparent 70%)",
            }}
          />
          <Storefront lightsOn={1} frame={frame} showBoard={false} />
        </div>

        {/* failing route */}
        <CyanRoute d={ROUTE_07} progress={routeP} width={10} arrow flicker={0.55} />

        {/* customer marker */}
        <div style={{ position: "absolute", left: 130, top: 1368 }}>
          <CustomerMarker size={220} label={S7.customer} labelDelay={30} delay={4} />
        </div>

        {/* failure markers */}
        {MARKS.map((m, i) => {
          const d = 58 + i * 14;
          const labelLines = S7.marks[i];
          return (
            <div key={i}>
              <div
                style={{
                  position: "absolute",
                  left: m.x - 38,
                  top: m.y - 38,
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  background: "rgba(28,32,38,0.92)",
                  border: "2px solid rgba(255,255,255,0.16)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...pop(frame, d),
                }}
              >
                <IconX size={36} color="#B9C0C7" strokeWidth={2.6} />
              </div>
              {/* dotted leader to the label */}
              <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <line
                  x1={m.x + (m.label.x > m.x ? 40 : -40)}
                  y1={m.y - 20}
                  x2={m.label.x + (m.label.x > m.x ? 0 : 190)}
                  y2={m.label.y + 34}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth={2}
                  strokeDasharray="3 7"
                  opacity={prog(frame, d + 8, 12)}
                />
              </svg>
              <div style={{ position: "absolute", left: m.label.x, top: m.label.y, ...reveal(frame, d + 10, 16, 10) }}>
                {labelLines.map((line) => (
                  <div key={line} style={{ fontSize: 29, color: PAL.gray, lineHeight: 1.42, whiteSpace: "pre" }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* headline */}
        <div style={{ position: "absolute", left: 72, top: 162 }}>
          <Lines
            lines={[
              [{ t: "That means " }, { t: "missed", c: PAL.cyan, d: 4 }],
              [{ t: "customers", c: PAL.cyan, d: 4 }, { t: " you" }],
              [{ t: S7.headline[2] }],
              [{ t: S7.headline[3] }],
            ]}
            delay={2}
            stagger={7}
            size={64}
            weight={700}
            lineHeight={1.17}
            color={PAL.white}
            track={-1}
          />
        </div>
        <div style={{ position: "absolute", left: 72, top: 508 }}>
          <Lines lines={S7.support1} delay={26} stagger={5} size={30} color={PAL.gray} lineHeight={1.48} />
        </div>
        <div style={{ position: "absolute", left: 72, top: 672 }}>
          <Lines
            lines={[
              [{ t: "Because the map " }, { t: "didn’t", c: PAL.cyan }],
              [{ t: S7.support2[1], c: PAL.cyan }],
              [{ t: S7.support2[2], c: PAL.cyan }],
              [{ t: S7.support2[3], c: PAL.cyan }],
            ]}
            delay={42}
            stagger={5}
            size={30}
            color={PAL.gray}
            lineHeight={1.48}
          />
        </div>
        <SceneNumber num={S7.num} color={PAL.gold} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
