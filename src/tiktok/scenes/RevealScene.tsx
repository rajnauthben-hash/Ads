import { useCurrentFrame, spring, interpolate, Easing } from "remotion";
import { COLORS, FONT, W, H, SPRING } from "../config";

const CX = W / 2;
const EXPO = Easing.bezier(0.16, 1, 0.3, 1);

// Layout
const STORE_TOP  = 340;
const MAP_TOP    = 840;
const PIN_CY     = MAP_TOP + 130; // 970
const PANEL_TOP  = 1140;

export const RevealScene: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-134

  // ── Flash recession (white → void in 8 frames) ───────────────────
  const flashRecede = interpolate(frame, [0, 8], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Section label ────────────────────────────────────────────────
  const labelIn = spring({ frame: frame - 4, fps: 30, config: SPRING.snappy, durationInFrames: 22 });

  // ── Storefront draw-in — each path staggered ──────────────────────
  const buildP = interpolate(frame, [2,  32], [0, 1], { extrapolateRight: "clamp", easing: EXPO });
  const roofP  = interpolate(frame, [8,  34], [0, 1], { extrapolateRight: "clamp", easing: EXPO });
  const winLP  = interpolate(frame, [16, 36], [0, 1], { extrapolateRight: "clamp", easing: EXPO });
  const winRP  = interpolate(frame, [20, 38], [0, 1], { extrapolateRight: "clamp", easing: EXPO });
  const doorP  = interpolate(frame, [24, 42], [0, 1], { extrapolateRight: "clamp", easing: EXPO });

  // Heartbeat glow once fully drawn
  const storeGlow = frame > 36 ? 0.5 + 0.5 * Math.sin(frame * 0.11) : 0;

  // ── Map grid materializes ─────────────────────────────────────────
  const gridOp = interpolate(frame, [40, 60], [0, 0.25], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Pin drops ────────────────────────────────────────────────────
  const pinSp = spring({ frame: frame - 58, fps: 30, config: SPRING.bouncy, durationInFrames: 28 });
  const pinY  = interpolate(pinSp, [0, 1], [-280, 0]);

  // Impact ring
  const ringP  = interpolate(frame, [70, 88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EXPO });
  const ringOp = interpolate(frame, [70, 74, 92], [0, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Website panel slides up ───────────────────────────────────────
  const panelSp = spring({ frame: frame - 72, fps: 30, config: SPRING.snappy, durationInFrames: 34 });
  const panelY  = interpolate(panelSp, [0, 1], [380, 0]);

  const row1 = spring({ frame: frame - 84,  fps: 30, config: SPRING.snappy, durationInFrames: 22 });
  const row2 = spring({ frame: frame - 93,  fps: 30, config: SPRING.snappy, durationInFrames: 22 });
  const row3 = spring({ frame: frame - 102, fps: 30, config: SPRING.snappy, durationInFrames: 22 });

  return (
    <div style={{ width: W, height: H, position: "relative", overflow: "hidden", fontFamily: FONT }}>

      {/* ── Full-screen map grid (background atmosphere) ───────────── */}
      <div style={{ position: "absolute", inset: 0, opacity: gridOp }}>
        {Array.from({ length: 14 }, (_, i) => (
          <div key={`h${i}`} style={{
            position: "absolute", left: 0, top: (i / 13) * H, width: W, height: 1,
            background: "rgba(0,229,255,0.18)",
          }} />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <div key={`v${i}`} style={{
            position: "absolute", left: (i / 8) * W, top: 0, width: 1, height: H,
            background: "rgba(0,229,255,0.12)",
          }} />
        ))}
      </div>

      {/* ── Section label ─────────────────────────────────────────────── */}
      <div style={{
        position:  "absolute",
        top:       188,
        left:      0,
        width:     W,
        textAlign: "center",
        transform: `translateY(${(1 - labelIn) * 20}px)`,
        opacity:   labelIn,
      }}>
        <div style={{
          color:         "rgba(255,255,255,0.32)",
          fontSize:      26,
          fontWeight:    600,
          letterSpacing: 5,
          textTransform: "uppercase",
        }}>
          Now Visible
        </div>
      </div>

      {/* ── Storefront SVG ────────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        left:     CX - 230,
        top:      STORE_TOP,
        width:    460,
        height:   440,
        filter:   `drop-shadow(0 0 ${8 + storeGlow * 20}px rgba(0,229,255,${0.22 + storeGlow * 0.28}))`,
      }}>
        <svg width="460" height="440" viewBox="0 0 300 280" fill="none">
          {/* Building body */}
          <path
            d="M 20,280 L 20,90 L 280,90 L 280,280"
            stroke={COLORS.energy} strokeWidth="2.6"
            strokeLinecap="round" strokeLinejoin="round"
            pathLength={1} strokeDasharray="1"
            strokeDashoffset={1 - buildP}
          />
          {/* Sign strip */}
          <path
            d="M 20,90 L 280,90 L 280,122 L 20,122 Z"
            stroke={COLORS.energy} strokeWidth="1.6"
            fill="rgba(0,229,255,0.06)"
            pathLength={1} strokeDasharray="1"
            strokeDashoffset={1 - buildP}
          />
          {/* Roof / awning */}
          <path
            d="M 0,96 L 150,38 L 300,96"
            stroke={COLORS.energy} strokeWidth="2.6"
            strokeLinecap="round"
            pathLength={1} strokeDasharray="1"
            strokeDashoffset={1 - roofP}
          />
          {/* Left window */}
          <path
            d="M 34,140 L 34,188 L 108,188 L 108,140 Z"
            stroke={COLORS.energy} strokeWidth="2"
            pathLength={1} strokeDasharray="1"
            strokeDashoffset={1 - winLP}
          />
          {/* Right window */}
          <path
            d="M 192,140 L 192,188 L 266,188 L 266,140 Z"
            stroke={COLORS.energy} strokeWidth="2"
            pathLength={1} strokeDasharray="1"
            strokeDashoffset={1 - winRP}
          />
          {/* Door */}
          <path
            d="M 122,280 L 122,200 Q 122,194 128,194 L 172,194 Q 178,194 178,200 L 178,280"
            stroke={COLORS.energy} strokeWidth="2"
            strokeLinecap="round"
            pathLength={1} strokeDasharray="1"
            strokeDashoffset={1 - doorP}
          />
          {/* Sign text */}
          <text x="150" y="112" textAnchor="middle"
            fill={COLORS.energy} fontSize="13" fontFamily={FONT}
            fontWeight="700" letterSpacing="5"
            opacity={buildP}
          >
            OPEN
          </text>
          {/* Window inner cross-bars */}
          <line x1="71" y1="140" x2="71" y2="188"
            stroke={COLORS.energy} strokeWidth="0.8" opacity={winLP * 0.5} />
          <line x1="229" y1="140" x2="229" y2="188"
            stroke={COLORS.energy} strokeWidth="0.8" opacity={winRP * 0.5} />
        </svg>
      </div>

      {/* ── Location pin ──────────────────────────────────────────────── */}
      <div style={{
        position:     "absolute",
        left:         CX - 30,
        top:          PIN_CY - 76 + pinY,
        pointerEvents: "none",
      }}>
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
          <path
            d="M 30,76 C 30,76 56,50 56,30 C 56,16 44,4 30,4 C 16,4 4,16 4,30 C 4,50 30,76 30,76 Z"
            fill="rgba(0,229,255,0.14)"
            stroke={COLORS.energy} strokeWidth="2.4"
          />
          <circle cx="30" cy="30" r="11" fill={COLORS.energy} />
        </svg>
        <div style={{
          position: "absolute", left: -26, top: -26,
          width: 112, height: 112, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,229,255,0.32) 0%, transparent 65%)",
        }} />
      </div>

      {/* ── Impact ring ───────────────────────────────────────────────── */}
      {frame >= 70 && (
        <div style={{
          position:     "absolute",
          left:         CX - 30 - ringP * 90,
          top:          PIN_CY - ringP * 90,
          width:        60 + ringP * 180,
          height:       60 + ringP * 180,
          borderRadius: "50%",
          border:       `2px solid rgba(0,229,255,${ringOp})`,
          pointerEvents: "none",
        }} />
      )}

      {/* ── Website panel ─────────────────────────────────────────────── */}
      <div style={{
        position:  "absolute",
        left:      68,
        top:       PANEL_TOP,
        width:     W - 136,
        transform: `translateY(${panelY}px)`,
      }}>
        <div style={{
          background:   "rgba(255,255,255,0.04)",
          border:       "1px solid rgba(0,229,255,0.18)",
          borderRadius: 30,
          padding:      "30px 34px 34px",
        }}>
          {/* Browser chrome */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 26 }}>
            {(["rgba(255,59,48,0.7)", "rgba(255,204,0,0.7)", "rgba(40,205,65,0.7)"] as string[]).map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
            ))}
            <div style={{
              flex: 1, height: 12, borderRadius: 7,
              background: "rgba(255,255,255,0.09)", marginLeft: 8,
            }} />
          </div>

          {/* Domain */}
          <div style={{ transform: `translateY(${(1 - row1) * 22}px)`, opacity: row1, marginBottom: 24 }}>
            <div style={{ color: COLORS.energy, fontSize: 28, fontWeight: 700 }}>
              omniflowdigital.com
            </div>
          </div>

          {/* Stat pills */}
          <div style={{ transform: `translateY(${(1 - row2) * 22}px)`, opacity: row2, display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" as const }}>
            {([
              ["#1 on Google", COLORS.energy],
              ["4.9 ★",        "#F59E0B"],
              ["200+ Reviews", "rgba(255,255,255,0.78)"],
            ] as [string, string][]).map(([label, color], i) => (
              <div key={i} style={{
                background:   "rgba(255,255,255,0.06)",
                border:       "1px solid rgba(0,229,255,0.14)",
                borderRadius: 12,
                padding:      "12px 20px",
                color, fontSize: 22, fontWeight: 600,
              }}>
                {label}
              </div>
            ))}
          </div>

          {/* CTA button */}
          <div style={{ transform: `translateY(${(1 - row3) * 22}px)`, opacity: row3 }}>
            <div style={{
              background:   COLORS.energy,
              borderRadius: 18,
              padding:      "20px 0",
              textAlign:    "center",
              color:        "#050B14",
              fontSize:     26,
              fontWeight:   700,
              letterSpacing: 0.4,
            }}>
              Book a Free Call →
            </div>
          </div>
        </div>
      </div>

      {/* ── Flash recession overlay ────────────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "white",
        opacity:    flashRecede,
        pointerEvents: "none",
      }} />
    </div>
  );
};
