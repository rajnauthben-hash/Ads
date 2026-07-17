import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT_MONO } from "../theme";
import { buildRoute, makeCamera, prog } from "../util";
import { MaterializedText } from "../components/MaterializedText";
import { PerspectiveMap } from "../components/PerspectiveMap";
import { PersistentPulseRoute } from "../components/PersistentPulseRoute";
import { StorefrontNode } from "../components/StorefrontNode";
import { DestinationPin } from "../components/DestinationPin";
import { DataParticle } from "../components/DataParticle";
import { TechnicalTelemetry } from "../components/TechnicalTelemetry";
import { SignalRing } from "../components/SignalRing";
import { Glyph } from "../components/icons";

// Sequence: global 372–449 (local 0–77). The film holds complete — and
// alive — from ~local 44 to the end. No fade to black.

const STORE = { x: 225, y: 1630 };

// The completed route: customers actually arriving.
const ROUTE = buildRoute(
  [
    { x: 305, y: 1748 },
    { x: 470, y: 1560 },
    { x: 432, y: 1372 },
    { x: 580, y: 1220 },
    { x: 556, y: 1058 },
    { x: 700, y: 986 },
    { x: 782, y: 942 },
  ],
  50,
);

// Incoming energy from scene 05 completes into the storefront.
const INLET = buildRoute(
  [
    { x: 620, y: 560 },
    { x: 430, y: 900 },
    { x: 300, y: 1260 },
    { x: 285, y: 1560 },
    { x: 305, y: 1748 },
  ],
  70,
);

const CUSTOMER_NODES = [
  { t: 0.22, appear: 26 },
  { t: 0.52, appear: 34 },
  { t: 0.8, appear: 42 },
];

const TELEMETRY = [
  { x: 470, y: 1258, rows: ["0.3 MI", "2 MIN"], icon: "walk" as const, appear: 30 },
  { x: 610, y: 1002, rows: ["0.7 MI", "3 MIN"], icon: "walk" as const, appear: 40 },
];

const AMBIENT_PINS = [
  { x: 878, y: 700, icon: "fork" as const, appear: 30 },
  { x: 836, y: 1210, icon: "coffee" as const, appear: 36 },
  { x: 470, y: 1010, icon: "bag" as const, appear: 42 },
  { x: 660, y: 1420, icon: "dumbbell" as const, appear: 46 },
];

export const Scene06Resolution: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = makeCamera(frame, 78, { zoom: 0.028, dx: -10, dy: -6, rot: 0.4, originX: 48, originY: 58 });

  // The storefront illuminates fully as the incoming route lands.
  const glow = interpolate(frame, [0, 8, 16], [0.5, 0.85, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // travelling pulse that completes the connection
  const pulseT = interpolate(frame, [28, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulsePos = ROUTE.pointAt(pulseT);
  const arriveFlash = interpolate(frame, [44, 48, 58], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelP = prog(frame, 4, 12);

  return (
    <AbsoluteFill>
      {/* PLANE 2 — complete neighborhood system, cleaner lighting */}
      <div style={cam(0.55)}>
        <PerspectiveMap
          frame={frame + 640}
          seed={79}
          x={620}
          y={1290}
          tilt={54}
          rotate={-6}
          scale={1.05}
          opacity={prog(frame, 0, 12)}
          accents={48}
          driftX={-0.05}
          driftY={0.02}
        />
      </div>

      {/* PLANE 3 — the resolved system */}
      <div style={cam(1)}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* incoming energy from scene 05 resolving into the store */}
          <PersistentPulseRoute
            route={INLET}
            frame={frame}
            idPrefix="s6in"
            draw={{ start: 0, dur: 10 }}
            retract={{ start: 8, dur: 14 }}
            coreWidth={3.4}
            glowWidth={15}
            highlightSpeed={16}
          />

          {/* stable, bright completed route */}
          <PersistentPulseRoute
            route={ROUTE}
            frame={frame}
            idPrefix="s6m"
            draw={{ start: 6, dur: 28 }}
            coreWidth={3.2}
            glowWidth={14}
            highlightSpeed={7}
            pulses={{ count: 2, speed: 0.007, size: 4 }}
            arrows={[0.34, 0.68]}
          />
          {frame > 30 ? (
            <>
              <DataParticle route={ROUTE} frame={frame} seed={5} speed={0.009} size={3} />
              <DataParticle route={ROUTE} frame={frame} seed={12} speed={0.007} size={2.4} opacity={0.65} />
            </>
          ) : null}

          {/* the travelling pulse that completes the connection */}
          {pulseT > 0.005 && pulseT < 0.999 ? (
            <g>
              <circle cx={pulsePos.x} cy={pulsePos.y} r={16} fill={C.cyan} opacity={0.2} />
              <circle cx={pulsePos.x} cy={pulsePos.y} r={7} fill="#E8FAFF" opacity={0.95} />
            </g>
          ) : null}

          {/* customer-intent nodes along the path */}
          {CUSTOMER_NODES.map((n, i) => {
            const p = ROUTE.pointAt(n.t);
            const ap = prog(frame, n.appear, 10);
            if (ap <= 0) return null;
            const lit = pulseT >= n.t;
            return (
              <g key={i} opacity={ap}>
                <circle cx={p.x} cy={p.y} r={11} fill="rgba(10,12,14,0.9)" stroke={C.cyan} strokeWidth={1.6} opacity={lit ? 1 : 0.5} />
                <circle cx={p.x} cy={p.y} r={4} fill={lit ? "#DFF8FF" : C.cyan} opacity={lit ? 1 : 0.5} />
                {lit ? <circle cx={p.x} cy={p.y} r={16 + ((frame * 1.4 + i * 12) % 22)} fill="none" stroke={C.cyan} strokeWidth={1} opacity={0.3} /> : null}
              </g>
            );
          })}

          {/* walking-time telemetry along the route */}
          {TELEMETRY.map((t, i) => {
            const ap = prog(frame, t.appear, 10);
            if (ap <= 0) return null;
            return (
              <g key={i} opacity={ap * 0.95} transform={`translate(${t.x} ${t.y})`}>
                <g transform="translate(-26 4)">
                  <Glyph name={t.icon} color={C.cyan2} scale={1} strokeWidth={1.8} />
                </g>
                <text x={0} y={-2} fill={C.cyan2} style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: 24, letterSpacing: 2 }}>
                  {t.rows[0]}
                </text>
                <text x={0} y={26} fill={C.text2} style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: 22, letterSpacing: 2 }}>
                  {t.rows[1]}
                </text>
              </g>
            );
          })}

          {/* ambient neighborhood pins — quiet, complete system */}
          {AMBIENT_PINS.map((p, i) => (
            <DestinationPin key={i} x={p.x} y={p.y} frame={frame} appear={p.appear} size={0.62} icon={p.icon} color="#7C8891" dim={0.55} idPrefix={`s6a${i}`} bob={false} />
          ))}

          {/* the premium gold destination — one restrained premium pulse */}
          <DestinationPin x={790} y={932} frame={frame} appear={40} size={1.45} icon="star" idPrefix="s6g" />
          {frame > 46 ? (
            <g>
              {[0, 1].map((i) => {
                const q = (((frame - 46) * 0.016 + i / 2) % 1 + 1) % 1;
                return (
                  <ellipse key={i} cx={790} cy={936} rx={40 + q * 150} ry={16 + q * 58} fill="none" stroke={C.goldWarm} strokeWidth={1.6} opacity={(1 - q) * 0.45} />
                );
              })}
              <ellipse cx={790} cy={936} rx={34} ry={13.5} fill="none" stroke={C.gold} strokeWidth={1.4} opacity={0.5} />
            </g>
          ) : null}
          {arriveFlash > 0.01 ? (
            <circle cx={790} cy={870} r={30 + arriveFlash * 26} fill={C.gold} opacity={arriveFlash * 0.25} />
          ) : null}

          {/* cyan landing pool at the store entrance */}
          <SignalRing frame={frame} cx={305} cy={1752} rx={130} level={glow} start={4} speed={0.011} />
          <ellipse cx={305} cy={1752} rx={34} ry={13} fill={C.cyan} opacity={0.3 * glow} />
          <ellipse cx={305} cy={1752} rx={16} ry={6.5} fill="#CFF4FF" opacity={0.7 * glow} />
        </svg>

        {/* the premium storefront, fully illuminated */}
        <StorefrontNode
          x={STORE.x}
          y={STORE.y}
          frame={frame}
          width={430}
          glow={glow}
          pinColor={C.cyan}
          pinOpacity={0.9}
          ringLevel={0}
          idPrefix="s6sf"
          premium
        />
      </div>

      {/* PLANE 4 — typography */}
      <div style={cam(1.1)}>
        {/* scene index 06 / 06 with gold rule */}
        <div style={{ position: "absolute", left: 92, top: 130, opacity: labelP }}>
          <div style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: 28, letterSpacing: 6, color: C.goldWarm }}>
            06 <span style={{ opacity: 0.5 }}>/ 06</span>
          </div>
          <div style={{ position: "relative", marginTop: 12, width: 210 * labelP, height: 2, background: "rgba(221,174,74,0.55)" }}>
            <div
              style={{
                position: "absolute",
                right: -3,
                top: -2.2,
                width: 6.5,
                height: 6.5,
                borderRadius: "50%",
                background: C.gold,
                boxShadow: `0 0 8px ${C.gold}`,
                opacity: 0.6 + 0.4 * Math.sin(frame * 0.15),
              }}
            />
          </div>
        </div>

        {/* main statement — materializes from gold and white fragments */}
        <MaterializedText
          frame={frame}
          start={8}
          lines={[
            "If your business",
            "looks premium",
            "in person,",
            <span key="d" style={{ color: C.goldWarm }}>it should look</span>,
            <span key="e" style={{ color: C.goldWarm }}>premium online too.</span>,
          ]}
          fontSize={76}
          weight={600}
          lineHeight={1.13}
          letterSpacing={-0.022}
          fragments="gold"
          seed={81}
          revealDur={16}
          lineStagger={5}
          style={{ position: "absolute", left: 92, top: 232 }}
        />

        {/* supporting copy resolves cleanly */}
        <MaterializedText
          frame={frame}
          start={30}
          lines={["Show up better, and turn more", "nearby searches into real visits."]}
          fontSize={40}
          weight={400}
          font="Inter"
          color={C.text2}
          lineHeight={1.4}
          letterSpacing={-0.005}
          fragments="none"
          quiet
          seed={83}
          style={{ position: "absolute", left: 92, top: 736 }}
        />

        <TechnicalTelemetry frame={frame} x={992} y={96} appear={8} rows={["ROUTE COMPLETE", "VISITS / LIVE"]} />
      </div>
    </AbsoluteFill>
  );
};
