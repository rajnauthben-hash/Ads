import React from "react";
import { useCurrentFrame } from "remotion";
import { getCamera, WORLD_W, WORLD_H, LAND } from "../camera";
import { win, envelope } from "../anim";
import { City } from "./City";
import { GlowRoute, FailedRoute, MAIN, COMP, CROWNFAIL, REPAIR } from "./routes";
import { WorldItem, Storefront, LocationPin, ResultLabel, CustomerMarker } from "./props";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// Business-result pins that live on the main expressway.
const PINS = [
  { x: 992, y: 2402, title: "Open Now", rating: "4.9", rev: 172 },
  { x: 1205, y: 1872, title: "Nearby", rating: "4.7", rev: 188 },
  { x: 1086, y: 1168, title: "Top Result", rating: "4.8", rev: 204 },
];

export const WorldLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = getCamera(frame);

  // --- Main highway: hints in S1, fully draws in S2, persists after ---
  const mainProg = win(frame, 10, 60, 0, 0.34) + win(frame, 150, 235, 0, 0.66);
  const mainOpacity = clamp01(
    win(frame, 0, 22, 0, 1) - win(frame, 380, 440, 0, 0.6) + win(frame, 485, 545, 0, 0.45),
  );
  // three travelling "traffic" pulses along the highway
  const trafficPulses = [0, 0.34, 0.68].map((ph) => ((frame * 0.006 + ph) % 1));

  // --- Gold pins + result labels ---
  const labelEnv = envelope(frame, 236, 258, 350, 372);
  const pinsOpacity = clamp01(1 - win(frame, 372, 412, 0, 0.9));

  // --- Scene 4: customer -> competitor active route + failed Crown route ---
  const custEnv = clamp01(win(frame, 372, 394, 0, 1) - win(frame, 585, 600, 0, 1));
  const compProg = win(frame, 385, 448, 0, 1);
  const compPulse = win(frame, 388, 470, -0.05, 1);
  const compOpacity = clamp01(win(frame, 378, 400, 0, 1) - win(frame, 488, 520, 0, 1));
  const failReveal = win(frame, 388, 448, 0, 1);
  const failRepair = win(frame, 468, 540, 0, 1);

  // competitor storefront presence + arrival brightening + S5 recede
  const compStoreOpacity = clamp01(win(frame, 360, 382, 0, 1) - win(frame, 505, 565, 0, 0.6));
  const compGlow = 0.5 + win(frame, 430, 458, 0, 0.5);
  const compLabelEnv = envelope(frame, 378, 398, 496, 520);

  // --- Scene 5: repaired hero route down to Crown ---
  const repairProg = win(frame, 490, 560, 0, 1);
  const repairPulse = win(frame, 500, 566, -0.05, 1);
  const showRepair = frame > 482;

  // --- Crown Hardware: persistent, breathing warm light, hero strengthen ---
  const crownGlow = clamp01(
    0.72 + 0.08 * Math.sin(frame * 0.12) + win(frame, 72, 106, 0, 0.12) + win(frame, 540, 582, 0, 0.24),
  );

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#04090C" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: WORLD_W,
          height: WORLD_H,
          transformOrigin: "0 0",
          transform: cam.transform,
          willChange: "transform",
        }}
      >
        <City />

        {/* Main expressway */}
        <svg
          width={WORLD_W}
          height={WORLD_H}
          viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
          style={{ position: "absolute", left: 0, top: 0, opacity: mainOpacity, overflow: "visible" }}
        >
          <GlowRoute
            segs={MAIN}
            progress={mainProg}
            arrowTs={[]}
            width={7}
          />
          {trafficPulses.map((t, i) =>
            t <= mainProg ? (
              <GlowRoute key={i} segs={MAIN} progress={mainProg} pulseT={t} width={0.01} glow={0} />
            ) : null,
          )}
        </svg>

        {/* Scene 4 routes */}
        <svg
          width={WORLD_W}
          height={WORLD_H}
          viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
        >
          {compOpacity > 0.01 ? (
            <g opacity={compOpacity}>
              <GlowRoute segs={COMP} progress={compProg} pulseT={compPulse} arrowTs={[0.22, 0.45, 0.68, 0.88]} width={7} />
            </g>
          ) : null}
          {failReveal > 0.01 ? (
            <FailedRoute segs={CROWNFAIL} reveal={failReveal} repair={failRepair} breakAt={{ x: 707, y: 2762 }} />
          ) : null}
          {showRepair ? <GlowRoute segs={REPAIR} progress={repairProg} pulseT={repairPulse} width={6.5} /> : null}
        </svg>

        {/* Gold pins + result labels */}
        {PINS.map((p, i) => {
          const s = clamp01(win(frame, p.rev, p.rev + 18, 0, 1));
          if (s <= 0.01) return null;
          return (
            <WorldItem key={i} x={p.x} y={p.y} anchor="bottom" z={20}>
              <div style={{ opacity: pinsOpacity * s, transform: `scale(${0.7 + s * 0.3})`, transformOrigin: "50% 100%" }}>
                <div style={{ position: "relative" }}>
                  {labelEnv > 0.01 ? (
                    <div style={{ position: "absolute", left: 30, top: -6, opacity: labelEnv }}>
                      <ResultLabel title={p.title} rating={p.rating} />
                    </div>
                  ) : null}
                  <LocationPin size={44} />
                </div>
              </div>
            </WorldItem>
          );
        })}

        {/* Customer search marker */}
        {custEnv > 0.01 ? (
          <WorldItem x={LAND.customer.x} y={LAND.customer.y} anchor="center" z={15}>
            <div style={{ opacity: custEnv, transform: `scale(${0.6 + custEnv * 0.4})` }}>
              <CustomerMarker size={78} />
            </div>
          </WorldItem>
        ) : null}

        {/* Competitor storefront */}
        {compStoreOpacity > 0.01 ? (
          <WorldItem x={LAND.competitor.x} y={LAND.competitor.y} anchor="bottom" z={25}>
            <div style={{ opacity: compStoreOpacity }}>
              {compLabelEnv > 0.01 ? (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: -84,
                    transform: "translateX(-50%)",
                    opacity: compLabelEnv,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    whiteSpace: "nowrap",
                  }}
                >
                  <LocationPin size={40} />
                </div>
              ) : null}
              <Storefront name="YOUR COMPETITOR" w={300} warm={false} glow={compGlow} />
            </div>
          </WorldItem>
        ) : null}

        {/* Crown Hardware — persistent hero */}
        <WorldItem x={LAND.crown.x} y={LAND.crown.y} anchor="bottom" z={30}>
          <Storefront name="CROWN HARDWARE" w={400} warm glow={crownGlow} />
        </WorldItem>
      </div>
    </div>
  );
};
