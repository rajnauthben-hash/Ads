// ============================================================================
// CrownHardwareEnvironment — the single persistent storefront used in every
// scene. Rendered into a bounding box; shows the exterior facade and, when
// interiorMix > 0, the warm interior room (Scene 4). All lettering is live
// React text; all geometry is CSS/SVG so it scales with the box.
// ============================================================================
import React from "react";
import { COLORS } from "../tokens";

// Deterministic pseudo-value for shelf item variation (no Math.random).
const pseudo = (i: number) => (Math.sin(i * 12.9898) * 43758.5453) % 1;

const CrownSymbol: React.FC<{ w: number; color: string }> = ({ w, color }) => (
  <svg viewBox="0 0 100 62" style={{ width: w, height: w * 0.62, display: "block" }}>
    <path
      d="M8 54 L4 20 L27 38 L50 8 L73 38 L96 20 L92 54 Z"
      fill={color}
    />
    <circle cx="4" cy="16" r="4.5" fill={color} />
    <circle cx="50" cy="5" r="5" fill={color} />
    <circle cx="96" cy="16" r="4.5" fill={color} />
    <rect x="8" y="54" width="84" height="5" fill={color} />
  </svg>
);

// Warm-lit shelf wall (rows of small glowing items)
const ShelfWall: React.FC<{ rows: number; cols: number; warm: number; seed: number }> = ({ rows, cols, warm, seed }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-evenly", padding: "6% 8%" }}>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} style={{ position: "relative", height: `${70 / rows}%` }}>
        {/* shelf plank */}
        <div style={{ position: "absolute", bottom: 0, left: "-4%", right: "-4%", height: 3, background: `rgba(120,80,40,${0.5 * warm})`, boxShadow: `0 1px 3px rgba(0,0,0,0.6)` }} />
        <div style={{ position: "absolute", bottom: 3, left: 0, right: 0, top: 0, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "3%" }}>
          {Array.from({ length: cols }).map((__, c) => {
            const p = Math.abs(pseudo(seed + r * 7 + c * 3));
            const h = 46 + p * 46;
            return (
              <div
                key={c}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  borderRadius: 2,
                  background: `linear-gradient(180deg, rgba(${210},${150 + p * 40},${90},${0.30 * warm}) 0%, rgba(150,95,45,${0.18 * warm}) 100%)`,
                  boxShadow: `inset 0 0 4px rgba(255,200,120,${0.25 * warm})`,
                }}
              />
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

export const CrownHardwareEnvironment: React.FC<{
  box: { x: number; y: number; w: number; h: number };
  lighting?: number; // 0.9 - 1.12
  interiorMix?: number; // 0 exterior -> 1 interior
  active?: boolean; // scene 5: figures visible
}> = ({ box, lighting = 1, interiorMix = 0, active = false }) => {
  const warm = lighting;
  const goldGlow = `rgba(255,196,120,${0.5 * warm})`;

  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        overflow: "hidden",
        // Composite as one isolated layer so the interior's 3D/blur children
        // never escape to sort above the phone (which sits at a higher zIndex).
        isolation: "isolate",
      }}
    >
      {/* ===================== EXTERIOR ===================== */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - interiorMix }}>
        {/* Facade wall */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg,#0a0d11 0%,#0b0e12 55%,#070a0e 100%)",
          }}
        />
        {/* brick texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.35,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 26px), repeating-linear-gradient(90deg, rgba(0,0,0,0.25) 0 1px, transparent 1px 52px)",
          }}
        />

        {/* Wall lamps + warm cones over the sign */}
        {[0.3, 0.7].map((lx, i) => (
          <div key={i} style={{ position: "absolute", left: `${lx * 100}%`, top: "4%", transform: "translateX(-50%)" }}>
            <div style={{ width: 26, height: 8, background: "#1a1d20", borderRadius: 3 }} />
            <div
              style={{
                position: "absolute",
                top: 6,
                left: "50%",
                width: box.w * 0.34,
                height: box.h * 0.32,
                transform: "translateX(-50%)",
                background: `radial-gradient(ellipse at 50% 0%, ${goldGlow} 0%, transparent 62%)`,
                filter: "blur(6px)",
                opacity: 0.7 * warm,
                pointerEvents: "none",
              }}
            />
          </div>
        ))}

        {/* Crown sign */}
        <div style={{ position: "absolute", top: "9%", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CrownSymbol w={box.w * 0.14} color={COLORS.warmGoldBright} />
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 700,
              fontSize: box.w * 0.15,
              lineHeight: 1,
              letterSpacing: box.w * 0.004,
              color: COLORS.warmGoldBright,
              textShadow: `0 0 ${18 * warm}px rgba(215,160,77,${0.45 * warm})`,
              marginTop: box.h * 0.008,
            }}
          >
            CROWN
          </div>
          <div
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 500,
              fontSize: box.w * 0.058,
              letterSpacing: box.w * 0.028,
              color: COLORS.warmGold,
              marginTop: box.h * 0.004,
            }}
          >
            HARDWARE
          </div>
        </div>

        {/* Awning */}
        <div
          style={{
            position: "absolute",
            top: "34%",
            left: "-2%",
            width: "104%",
            height: "6%",
            background: "linear-gradient(180deg,#15100b 0%,#0b0805 100%)",
            boxShadow: "0 6px 14px rgba(0,0,0,0.6)",
            borderBottom: "2px solid rgba(60,40,20,0.6)",
          }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: 0.4, backgroundImage: "repeating-linear-gradient(90deg, rgba(90,60,30,0.5) 0 2px, transparent 2px 30px)" }} />
        </div>

        {/* Storefront windows / glass */}
        <div style={{ position: "absolute", top: "41%", left: "4%", width: "92%", bottom: "10%", display: "flex", gap: "2%" }}>
          {/* left window */}
          <div style={{ position: "relative", flex: 1.1, borderRadius: 2, overflow: "hidden", background: "#0a0805", border: "3px solid #16120c", boxShadow: `inset 0 0 40px rgba(255,180,90,${0.25 * warm})` }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, rgba(255,185,95,${0.30 * warm}) 0%, rgba(120,70,30,${0.12 * warm}) 55%, rgba(10,8,6,0.6) 100%)` }} />
            <ShelfWall rows={5} cols={4} warm={warm} seed={11} />
            {/* OPEN sign */}
            <div style={{ position: "absolute", left: "8%", bottom: "14%", width: "38%", padding: "4% 2%", background: `rgba(20,14,8,0.82)`, border: `1px solid rgba(215,160,77,${0.7 * warm})`, borderRadius: 3, textAlign: "center" }}>
              <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: box.w * 0.05, color: COLORS.warmGoldBright, lineHeight: 1 }}>OPEN</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: box.w * 0.017, color: COLORS.warmGold, letterSpacing: 0.5, marginTop: 2 }}>WE'RE HERE TO HELP</div>
            </div>
          </div>
          {/* center door (slightly open) */}
          <div style={{ position: "relative", flex: 1.3, borderRadius: 2, overflow: "hidden", background: "#0a0805", border: "3px solid #16120c" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 55%, rgba(255,190,100,${0.34 * warm}) 0%, rgba(120,70,30,${0.14 * warm}) 55%, rgba(10,8,6,0.7) 100%)` }} />
            <ShelfWall rows={6} cols={3} warm={warm} seed={41} />
            {/* door split line */}
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 2, background: "rgba(30,22,12,0.9)" }} />
            {/* warm floor spill */}
            <div style={{ position: "absolute", left: "20%", right: "20%", bottom: 0, height: "16%", background: `radial-gradient(ellipse at 50% 100%, rgba(255,190,100,${0.5 * warm}) 0%, transparent 70%)`, filter: "blur(4px)" }} />
          </div>
          {/* right window */}
          <div style={{ position: "relative", flex: 1.1, borderRadius: 2, overflow: "hidden", background: "#0a0805", border: "3px solid #16120c", boxShadow: `inset 0 0 40px rgba(255,180,90,${0.25 * warm})` }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, rgba(255,185,95,${0.30 * warm}) 0%, rgba(120,70,30,${0.12 * warm}) 55%, rgba(10,8,6,0.6) 100%)` }} />
            <ShelfWall rows={5} cols={4} warm={warm} seed={71} />
          </div>
        </div>

        {/* Potted plant bottom-left */}
        <div style={{ position: "absolute", left: "1%", bottom: "6%", width: "12%", height: "18%" }}>
          <div style={{ position: "absolute", bottom: 0, left: "22%", width: "56%", height: "38%", background: "linear-gradient(180deg,#20262b,#10151a)", borderRadius: "6px 6px 10px 10px" }} />
          <svg viewBox="0 0 60 80" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            {[...Array(9)].map((_, i) => {
              const a = -60 + i * 15;
              return <path key={i} d={`M30 52 Q${30 + Math.cos((a * Math.PI) / 180) * 22} ${52 - 24 - Math.abs(a) * 0.1} ${30 + Math.cos((a * Math.PI) / 180) * 30} ${52 - 30}`} stroke="#1c3a2a" strokeWidth={3} fill="none" strokeLinecap="round" />;
            })}
          </svg>
        </div>

        {/* Pavement + wet reflection */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "10%", background: "linear-gradient(180deg,#070a0d 0%,#04070a 100%)" }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(255,180,90,${0.14 * warm}) 0%, transparent 60%)`, filter: "blur(5px)" }} />
        </div>
      </div>

      {/* ===================== INTERIOR ===================== */}
      {interiorMix > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: interiorMix }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0a0906 0%,#080705 100%)" }} />
          {/* back wall */}
          <div style={{ position: "absolute", left: "28%", right: "28%", top: "6%", height: "60%", background: `radial-gradient(ellipse at 50% 30%, rgba(120,78,38,${0.5 * warm}) 0%, rgba(30,20,12,0.9) 75%)` }} />
          {/* side shelf walls in perspective */}
          <div style={{ position: "absolute", left: 0, top: "4%", width: "30%", bottom: "16%", transform: "perspective(600px) rotateY(28deg)", transformOrigin: "left center", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, rgba(90,58,28,${0.5 * warm}), rgba(20,14,8,0.9))` }} />
            <ShelfWall rows={7} cols={3} warm={warm} seed={5} />
          </div>
          <div style={{ position: "absolute", right: 0, top: "4%", width: "30%", bottom: "16%", transform: "perspective(600px) rotateY(-28deg)", transformOrigin: "right center", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(-90deg, rgba(90,58,28,${0.5 * warm}), rgba(20,14,8,0.9))` }} />
            <ShelfWall rows={7} cols={3} warm={warm} seed={9} />
          </div>
          {/* hanging pendant lights */}
          {[0.34, 0.5, 0.66].map((lx, i) => (
            <div key={i} style={{ position: "absolute", left: `${lx * 100}%`, top: "6%", transform: "translateX(-50%)", textAlign: "center" }}>
              <div style={{ width: 2, height: box.h * 0.06, background: "#2a2420", margin: "0 auto" }} />
              <div style={{ width: box.w * 0.05, height: box.w * 0.03, background: "#14100c", borderRadius: "50% 50% 4px 4px" }} />
              <div style={{ position: "absolute", top: box.h * 0.06, left: "50%", width: box.w * 0.16, height: box.h * 0.22, transform: "translateX(-50%)", background: `radial-gradient(ellipse at 50% 0%, rgba(255,196,120,${0.6 * warm}) 0%, transparent 66%)`, filter: "blur(5px)" }} />
            </div>
          ))}
          {/* central counter */}
          <div style={{ position: "absolute", left: "36%", right: "36%", top: "46%", height: "16%", background: "linear-gradient(180deg,#20160d,#100a06)", borderRadius: 3, boxShadow: `0 0 30px rgba(255,180,90,${0.2 * warm})` }} />
          {/* wood floor */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "36%", background: "linear-gradient(180deg, rgba(60,40,22,0.6) 0%, rgba(20,13,8,0.95) 100%)" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0.35) 0 2px, transparent 2px 60px)" }} />
            {/* ladder hint */}
            <div style={{ position: "absolute", right: "16%", top: "-40%", width: 4, height: "70%", background: "rgba(90,60,30,0.6)", transform: "rotate(6deg)" }} />
          </div>
          {/* small static figures (scene 5 active only) */}
          {active && (
            <>
              {[0.42, 0.58, 0.72].map((fx, i) => (
                <div key={i} style={{ position: "absolute", left: `${fx * 100}%`, bottom: "12%", width: box.w * 0.03, height: box.h * 0.14, background: "rgba(10,8,6,0.85)", borderRadius: "40% 40% 20% 20%", transform: "translateX(-50%)" }} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
