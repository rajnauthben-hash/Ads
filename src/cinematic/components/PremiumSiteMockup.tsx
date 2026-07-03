import { useCurrentFrame, interpolate, Easing } from "remotion";
import { T, FONT, EO } from "../theme";

// The premium website — real copy verbatim from the reference ad,
// assembling piece by piece (chrome → nav → hero → feature cards).
export const PremiumSiteMockup: React.FC<{
  delay?: number;
  width?: number;
}> = ({ delay = 0, width = 780 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const op = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(...EO) });
  const ty = interpolate(f, [0, 32], [48, 0], { extrapolateRight: "clamp", easing: Easing.bezier(...EO) });
  const sc = interpolate(f, [0, 32], [0.94, 1], { extrapolateRight: "clamp", easing: Easing.bezier(...EO) });

  const stage = (from: number, to: number) =>
    interpolate(f, [from, to], [0, 1], { extrapolateRight: "clamp" });
  const chromeOp = stage(4, 18);
  const navOp = stage(12, 26);
  const heroOp = stage(20, 38);
  const heroTy = interpolate(f, [20, 38], [16, 0], { extrapolateRight: "clamp", easing: Easing.bezier(...EO) });
  const cardsOp = stage(34, 52);
  const cardsTy = interpolate(f, [34, 52], [14, 0], { extrapolateRight: "clamp", easing: Easing.bezier(...EO) });
  const glowOp = stage(26, 56);

  const height = Math.round(width * 0.82);

  return (
    <div style={{ position: "relative", opacity: op, scale: sc.toString(), translate: `0px ${ty}px` }}>
      {/* Outer edge glow */}
      <div
        style={{
          position: "absolute",
          inset: -3,
          borderRadius: 26,
          boxShadow: `0 0 80px rgba(34,211,238,${0.32 * glowOp}), 0 0 160px rgba(34,211,238,${0.12 * glowOp})`,
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      {/* Frame */}
      <div
        style={{
          width,
          height,
          borderRadius: 22,
          border: "1px solid rgba(255,255,255,0.13)",
          overflow: "hidden",
          background: "#070E22",
          boxShadow: "0 48px 96px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.09)",
          fontFamily: FONT,
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            opacity: chromeOp,
            height: 44,
            background: "rgba(4,8,20,0.98)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 7,
          }}
        >
          {[0.18, 0.11, 0.07].map((o, i) => (
            <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: `rgba(255,255,255,${o})` }} />
          ))}
          <div
            style={{
              flex: 1,
              marginLeft: 12,
              height: 24,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 7,
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              paddingLeft: 10,
              gap: 7,
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.cyan, opacity: 0.8 }} />
            <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", letterSpacing: "0.02em" }}>
              https://www.yourbusiness.com
            </span>
          </div>
        </div>

        {/* Nav */}
        <div
          style={{
            opacity: navOp,
            padding: "14px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(255,255,255,0.92)" }}>
            YOUR BUSINESS
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {["HOME", "ABOUT", "SERVICES", "WORK", "CONTACT"].map((n, i) => (
              <div
                key={n}
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  color: i === 0 ? T.cyan : "rgba(255,255,255,0.52)",
                  borderBottom: i === 0 ? `1.5px solid ${T.cyan}` : "none",
                  paddingBottom: 2,
                }}
              >
                {n}
              </div>
            ))}
            <div
              style={{
                marginLeft: 4,
                padding: "7px 13px",
                borderRadius: 7,
                border: `1px solid ${T.cyan}`,
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: T.cyan,
              }}
            >
              GET STARTED
            </div>
          </div>
        </div>

        {/* Hero */}
        <div
          style={{
            opacity: heroOp,
            translate: `0px ${heroTy}px`,
            padding: "24px 24px 20px",
            background: "linear-gradient(155deg, rgba(10,22,56,1) 0%, rgba(7,14,34,1) 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            display: "flex",
            gap: 18,
          }}
        >
          <div style={{ flex: 1.2 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.28em", color: T.cyan, marginBottom: 10 }}>
              WELCOME
            </div>
            <div style={{ fontSize: 27, fontWeight: 800, lineHeight: 1.16, letterSpacing: "-0.015em", color: "rgba(255,255,255,0.96)", marginBottom: 10 }}>
              We craft digital<br />
              experiences that<br />
              drive <span style={{ color: T.cyan }}>real growth.</span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.45, color: "rgba(148,163,184,0.9)", marginBottom: 16 }}>
              Premium websites built for speed,<br />
              visibility, and conversions.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div
                style={{
                  padding: "10px 18px",
                  borderRadius: 8,
                  background: T.cyan,
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: "#04121E",
                  boxShadow: "0 0 22px rgba(34,211,238,0.45)",
                }}
              >
                GET STARTED
              </div>
              <div
                style={{
                  padding: "10px 18px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.2)",
                  fontSize: 11.5,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                VIEW OUR WORK
              </div>
            </div>
          </div>
          {/* Hero visual — mountain scene placeholder art */}
          <div
            style={{
              flex: 0.8,
              borderRadius: 12,
              background: "linear-gradient(180deg, #0B1B3E 0%, #060D22 100%)",
              border: "1px solid rgba(255,255,255,0.07)",
              position: "relative",
              overflow: "hidden",
              minHeight: 150,
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 240 170" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", inset: 0 }}>
              <circle cx={185} cy={38} r={14} fill="rgba(148,197,255,0.35)" />
              <path d="M0 170 L70 74 L110 120 L150 58 L240 170 Z" fill="rgba(30,58,110,0.9)" />
              <path d="M70 74 L92 103 L110 120 L88 120 Z" fill="rgba(200,225,255,0.28)" />
              <path d="M150 58 L172 90 L150 96 L134 82 Z" fill="rgba(200,225,255,0.3)" />
            </svg>
          </div>
        </div>

        {/* Feature cards — verbatim copy */}
        <div style={{ opacity: cardsOp, translate: `0px ${cardsTy}px`, display: "flex", gap: 10, padding: "16px 16px" }}>
          {[
            { icon: "speed",  title: "Fast Loading",     desc: "Lightning fast websites that keep visitors engaged." },
            { icon: "mobile", title: "Mobile Friendly",  desc: "Seamless experience on any device." },
            { icon: "chart",  title: "Built to Convert", desc: "Strategic design that turns visitors into customers." },
          ].map((c) => (
            <div
              key={c.title}
              style={{
                flex: 1,
                borderRadius: 12,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(34,211,238,0.16)",
                padding: "14px 13px",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "rgba(34,211,238,0.12)",
                  border: "1px solid rgba(34,211,238,0.3)",
                  marginBottom: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {c.icon === "speed" && (
                  <svg width={16} height={16} viewBox="0 0 24 24">
                    <circle cx={12} cy={13} r={8} fill="none" stroke={T.cyan} strokeWidth={1.8} />
                    <line x1={12} y1={13} x2={16} y2={9} stroke={T.cyan} strokeWidth={1.8} strokeLinecap="round" />
                  </svg>
                )}
                {c.icon === "mobile" && (
                  <svg width={16} height={16} viewBox="0 0 24 24">
                    <rect x={7} y={3} width={10} height={18} rx={2.5} fill="none" stroke={T.cyan} strokeWidth={1.8} />
                    <line x1={10.5} y1={17.5} x2={13.5} y2={17.5} stroke={T.cyan} strokeWidth={1.8} strokeLinecap="round" />
                  </svg>
                )}
                {c.icon === "chart" && (
                  <svg width={16} height={16} viewBox="0 0 24 24">
                    <path d="M4 18 L10 11 L14 14 L20 6" fill="none" stroke={T.cyan} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 6 H20 V10" fill="none" stroke={T.cyan} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "rgba(255,255,255,0.94)", marginBottom: 5 }}>
                {c.title}
              </div>
              <div style={{ fontSize: 11.5, lineHeight: 1.4, color: "rgba(148,163,184,0.85)" }}>
                {c.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
