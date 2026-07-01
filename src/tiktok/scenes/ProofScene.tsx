import { useCurrentFrame, spring, interpolate } from "remotion";
import { COLORS, FONT, W, H, SPRING } from "../config";

const noise = (f: number, s: number) =>
  Math.sin(f * 0.031 + s) * Math.cos(f * 0.053 + s * 1.618);

const AMBIENT = Array.from({ length: 22 }, (_, i) => {
  const phi   = (i * 0.618033988) % 1;
  const theta = (i * 1.618033988) % 1;
  return {
    x:     60 + phi * (W - 120),
    y:     80 + theta * (H - 160),
    size:  1.4 + phi * 2.4,
    phase: phi * Math.PI * 2,
  };
});

const BADGES = [
  { icon: "⭐", text: "4.9 Star Rating",  color: "#F59E0B",                 delay: 8,  fromRight: false },
  { icon: "✓",  text: "Google Verified",  color: COLORS.energy,              delay: 18, fromRight: true  },
  { icon: "💬", text: "200+ Reviews",     color: "rgba(255,255,255,0.85)",   delay: 28, fromRight: false },
];

export const ProofScene: React.FC = () => {
  const frame = useCurrentFrame(); // local 0-74

  const line1Scale = spring({ frame,           fps: 30, config: SPRING.elastic, durationInFrames: 30 });
  const line2Scale = spring({ frame: frame - 18, fps: 30, config: SPRING.elastic, durationInFrames: 30 });

  const glowPulse = 0.55 + 0.45 * Math.sin(frame * 0.09);

  return (
    <div style={{
      width: W, height: H,
      position: "relative", overflow: "hidden", fontFamily: FONT,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>

      {/* ── Ambient background particles ──────────────────────────────── */}
      {AMBIENT.map((p, i) => (
        <div key={i} style={{
          position:     "absolute",
          left:         p.x + noise(frame, p.phase) * 16,
          top:          p.y + noise(frame * 0.7, p.phase + 1) * 11,
          width:        p.size * 4,
          height:       p.size * 4,
          borderRadius: "50%",
          background:   "radial-gradient(circle, rgba(0,229,255,0.2) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
      ))}

      {/* ── Kinetic headline ──────────────────────────────────────────── */}
      <div style={{ textAlign: "center", zIndex: 1, padding: "0 40px" }}>
        <div style={{
          transform:       `scale(${line1Scale})`,
          transformOrigin: "center",
          marginBottom:    10,
        }}>
          <div style={{
            fontSize:     130,
            fontWeight:   700,
            color:        COLORS.energy,
            letterSpacing: -4,
            lineHeight:   1,
            filter:       `drop-shadow(0 0 ${22 + glowPulse * 24}px rgba(0,229,255,${0.32 + glowPulse * 0.26}))`,
          }}>
            GET FOUND.
          </div>
        </div>

        <div style={{
          transform:       `scale(${line2Scale})`,
          transformOrigin: "center",
        }}>
          <div style={{
            fontSize:     130,
            fontWeight:   700,
            color:        "rgba(255,255,255,0.93)",
            letterSpacing: -4,
            lineHeight:   1,
          }}>
            GET NOTICED.
          </div>
        </div>
      </div>

      {/* ── Badge pills ───────────────────────────────────────────────── */}
      <div style={{
        marginTop: 70,
        display:   "flex",
        flexDirection: "column",
        gap:       22,
        width:     W - 120,
        zIndex:    1,
      }}>
        {BADGES.map((b, i) => {
          const badgeSp = spring({ frame: frame - b.delay, fps: 30, config: SPRING.bouncy, durationInFrames: 28 });
          const bx = interpolate(badgeSp, [0, 1], [b.fromRight ? 340 : -340, 0]);
          return (
            <div key={i} style={{
              transform:    `translateX(${bx}px)`,
              display:      "flex",
              alignItems:   "center",
              gap:          18,
              background:   "rgba(255,255,255,0.05)",
              border:       "1.5px solid rgba(0,229,255,0.14)",
              borderRadius: 22,
              padding:      "20px 30px",
            }}>
              <span style={{ fontSize: 34 }}>{b.icon}</span>
              <span style={{ color: b.color, fontSize: 29, fontWeight: 600 }}>{b.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
