import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COL, EO } from "../lib/constants";

// Fixed broken-state offsets (deterministic, no random)
const BROKEN = {
  tilt:     -1.8,              // card rotation
  logoW:    56,                // logo block narrow (vs repaired 92)
  heroW1:   "52%",             // headline block too narrow
  heroW2:   "88%",             // second line too wide
  ctaShift:  18,               // CTA button left-shift
  card1MT:   10,               // middle card elevated (misaligned)
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface Props {
  repairProgress: number; // 0 = broken, 1 = premium
  delay?: number;
  width?: number;
}

export const DualStateWebsite: React.FC<Props> = ({
  repairProgress,
  delay = 0,
  width = 900,
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const op = interpolate(f, [0, 20], [0, 1],  { extrapolateRight: "clamp", easing: Easing.bezier(...EO) });
  const sc = interpolate(f, [0, 30], [0.94, 1], { extrapolateRight: "clamp", easing: Easing.bezier(...EO) });
  const ty = interpolate(f, [0, 30], [40, 0],  { extrapolateRight: "clamp", easing: Easing.bezier(...EO) });

  const t = repairProgress;

  // State interpolations
  const gray     = lerp(0.88, 0, t);
  const bright   = lerp(0.48, 1, t);
  const tilt     = lerp(BROKEN.tilt, 0, t);
  const glowOp   = interpolate(t, [0.5, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // CTA color: amber (#F59E0B) → cyan (#22D3EE)
  const ctaR = Math.round(lerp(245, 34,  t));
  const ctaG = Math.round(lerp(158, 211, t));
  const ctaB = Math.round(lerp(11,  238, t));
  const ctaColor = `rgb(${ctaR},${ctaG},${ctaB})`;

  // Logo accent: amber → cyan
  const logoR = Math.round(lerp(245, 34,  t));
  const logoG = Math.round(lerp(158, 211, t));
  const logoB = Math.round(lerp(11,  238, t));
  const logoColor = `rgb(${logoR},${logoG},${logoB})`;

  // Glitch: brief x-jitter in broken state every ~15 frames
  const glitchJitter = t < 0.1 && frame % 15 === 0 ? 5 : t < 0.1 && frame % 15 === 1 ? -3 : 0;

  const h = Math.round(width * 0.61);

  return (
    <div
      style={{
        position: "relative",
        opacity: op,
        scale: sc.toString(),
        translate: `${glitchJitter}px ${ty}px`,
      }}
    >
      {/* Edge glow — builds on repair */}
      <div
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: 30,
          boxShadow: [
            `0 0 80px rgba(34,211,238,${0.4 * glowOp})`,
            `0 0 160px rgba(34,211,238,${0.14 * glowOp})`,
          ].join(", "),
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      {/* Main card */}
      <div
        style={{
          width,
          height: h,
          borderRadius: 22,
          border: "1px solid rgba(255,255,255,0.12)",
          overflow: "hidden",
          background: "#070E22",
          boxShadow: "0 48px 96px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.09)",
          filter: `grayscale(${gray}) brightness(${bright})`,
          rotate: `${tilt}deg`,
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            height: 50,
            background: "rgba(4,8,20,0.98)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            gap: 7,
          }}
        >
          {[0.18, 0.11, 0.07].map((o, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: `rgba(255,255,255,${o})` }} />
          ))}
          <div
            style={{
              flex: 1,
              marginLeft: 14,
              height: 26,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 7,
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              paddingLeft: 10,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: logoColor, marginRight: 8, opacity: 0.8 }} />
            <div style={{ width: lerp(100, 148, t), height: 6, borderRadius: 2, background: "rgba(255,255,255,0.18)" }} />
          </div>
        </div>

        {/* Website body */}
        <div style={{ background: "#080F24" }}>
          {/* Nav */}
          <div
            style={{
              padding: "16px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 7,
                  background: logoColor,
                  boxShadow: `0 0 14px rgba(${logoR},${logoG},${logoB},0.5)`,
                }}
              />
              <div style={{ width: lerp(BROKEN.logoW, 92, t), height: 8, borderRadius: 3, background: "rgba(255,255,255,0.65)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {[48, 42, 54, 46].map((w, i) => (
                <div key={i} style={{ width: w, height: 6, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} />
              ))}
              <div
                style={{
                  marginLeft: 6,
                  padding: "7px 14px",
                  background: ctaColor,
                  borderRadius: 7,
                  display: "inline-flex",
                }}
              >
                <div style={{ width: 44, height: 6, borderRadius: 2, background: "rgba(0,0,0,0.55)" }} />
              </div>
            </div>
          </div>

          {/* Hero */}
          <div
            style={{
              padding: "30px 24px 22px",
              background: "linear-gradient(155deg, rgba(10,22,56,1) 0%, rgba(7,14,34,1) 100%)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {/* Broken: wrong proportions; repaired: correct */}
            <div
              style={{
                width: t < 0.5 ? BROKEN.heroW1 : "80%",
                height: 20,
                borderRadius: 5,
                background: "rgba(255,255,255,0.9)",
                marginBottom: 9,
              }}
            />
            <div
              style={{
                width: t < 0.5 ? BROKEN.heroW2 : "65%",
                height: 16,
                borderRadius: 4,
                background: "rgba(255,255,255,0.88)",
                marginBottom: 8,
              }}
            />
            <div style={{ width: "46%", height: 10, borderRadius: 3, background: "rgba(255,255,255,0.28)", marginBottom: 5 }} />
            <div style={{ width: "36%", height: 10, borderRadius: 3, background: "rgba(255,255,255,0.16)", marginBottom: 22 }} />
            {/* CTA */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginLeft: lerp(BROKEN.ctaShift, 0, t) }}>
                <div
                  style={{
                    background: ctaColor,
                    borderRadius: 9,
                    padding: "11px 22px",
                    display: "inline-flex",
                    boxShadow: glowOp > 0.3 ? `0 0 28px rgba(34,211,238,0.45)` : "none",
                  }}
                >
                  <div style={{ width: 76, height: 8, borderRadius: 3, background: "rgba(0,0,0,0.55)" }} />
                </div>
              </div>
              {t > 0.5 && (
                <div
                  style={{
                    marginLeft: 12,
                    borderRadius: 9,
                    padding: "11px 22px",
                    border: "1px solid rgba(255,255,255,0.16)",
                    display: "inline-flex",
                  }}
                >
                  <div style={{ width: 56, height: 8, borderRadius: 3, background: "rgba(255,255,255,0.35)" }} />
                </div>
              )}
            </div>
          </div>

          {/* Cards row */}
          <div style={{ display: "flex", gap: 10, padding: "18px 16px" }}>
            {[COL.cyan, COL.blue, COL.violet].map((color, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.025)",
                  border: `1px solid ${t > 0.6 ? color + "2a" : "rgba(255,255,255,0.05)"}`,
                  padding: "16px 12px",
                  // Broken: middle card misaligned
                  marginTop: i === 1 && t < 0.5 ? lerp(BROKEN.card1MT, 0, t * 2) : 0,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: t > 0.6 ? `${color}1e` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${t > 0.6 ? color + "38" : "rgba(255,255,255,0.06)"}`,
                    marginBottom: 10,
                  }}
                />
                <div style={{ width: "80%", height: 7, borderRadius: 2, background: "rgba(255,255,255,0.55)", marginBottom: 5 }} />
                <div style={{ width: "62%", height: 5, borderRadius: 2, background: "rgba(255,255,255,0.22)", marginBottom: 4 }} />
                <div style={{ width: "44%", height: 5, borderRadius: 2, background: "rgba(255,255,255,0.13)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
