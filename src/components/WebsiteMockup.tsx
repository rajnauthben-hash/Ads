import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COL, EO } from "../lib/constants";

// The "after" state — premium glassmorphic website
export const WebsiteMockup: React.FC<{
  delay?: number;
  width?: number;
}> = ({ delay = 0, width = 920 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const op    = interpolate(f, [0, 20], [0, 1],          { extrapolateRight: "clamp", easing: Easing.bezier(...EO) });
  const ty    = interpolate(f, [0, 32], [48, 0],          { extrapolateRight: "clamp", easing: Easing.bezier(...EO) });
  const sc    = interpolate(f, [0, 32], [0.94, 1],        { extrapolateRight: "clamp", easing: Easing.bezier(...EO) });

  // Staged build-in: chrome → nav → hero → cards
  const chromeOp = interpolate(f, [4,  20], [0, 1],  { extrapolateRight: "clamp" });
  const navOp    = interpolate(f, [12, 28], [0, 1],  { extrapolateRight: "clamp" });
  const heroOp   = interpolate(f, [20, 38], [0, 1],  { extrapolateRight: "clamp" });
  const heroTy   = interpolate(f, [20, 38], [18, 0], { extrapolateRight: "clamp", easing: Easing.bezier(...EO) });
  const cardsOp  = interpolate(f, [32, 50], [0, 1],  { extrapolateRight: "clamp" });
  const cardsTy  = interpolate(f, [32, 50], [14, 0], { extrapolateRight: "clamp", easing: Easing.bezier(...EO) });

  // Edge glow builds after card appears
  const glowOp = interpolate(f, [24, 54], [0, 1], { extrapolateRight: "clamp" });

  const height = Math.round(width * 0.62);

  return (
    <div style={{ position: "relative", opacity: op, scale: sc.toString(), translate: `0px ${ty}px` }}>
      {/* Outer edge glow */}
      <div
        style={{
          position: "absolute",
          inset: -3,
          borderRadius: 30,
          boxShadow: `0 0 80px rgba(34,211,238,${0.32 * glowOp}), 0 0 160px rgba(34,211,238,${0.12 * glowOp})`,
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      {/* Main frame */}
      <div
        style={{
          width,
          height,
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.13)",
          overflow: "hidden",
          background: "#070E22",
          boxShadow: [
            "0 48px 96px rgba(0,0,0,0.75)",
            "inset 0 1px 0 rgba(255,255,255,0.09)",
          ].join(", "),
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
            opacity: chromeOp,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,255,255,0.18)" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,255,255,0.11)" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
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
              gap: 8,
            }}
          >
            <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
              <rect x="1" y="4" width="6" height="5.5" rx="1" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <path d="M2.5 4V2.5a1.5 1.5 0 013 0V4" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            </svg>
            <div style={{ width: 140, height: 6, borderRadius: 2, background: "rgba(255,255,255,0.18)" }} />
          </div>
        </div>

        {/* Website body */}
        <div style={{ background: "#080F24" }}>
          {/* Nav bar */}
          <div
            style={{
              padding: "18px 26px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              opacity: navOp,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: COL.cyan,
                  boxShadow: `0 0 16px rgba(34,211,238,0.5)`,
                }}
              />
              <div style={{ width: 92, height: 9, borderRadius: 3, background: "rgba(255,255,255,0.68)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {[50, 44, 56, 48].map((w, i) => (
                <div key={i} style={{ width: w, height: 7, borderRadius: 2, background: "rgba(255,255,255,0.22)" }} />
              ))}
              <div
                style={{
                  marginLeft: 6,
                  padding: "8px 16px",
                  background: COL.cyan,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  boxShadow: `0 0 18px rgba(34,211,238,0.4)`,
                }}
              >
                <div style={{ width: 46, height: 6, borderRadius: 2, background: "rgba(0,0,0,0.55)" }} />
              </div>
            </div>
          </div>

          {/* Hero section */}
          <div
            style={{
              padding: "34px 26px 26px",
              background: "linear-gradient(158deg, rgba(10,22,56,1) 0%, rgba(7,14,34,1) 100%)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              opacity: heroOp,
              translate: `0px ${heroTy}px`,
            }}
          >
            <div style={{ marginBottom: 22 }}>
              <div style={{ width: "80%", height: 20, borderRadius: 5, background: "rgba(255,255,255,0.9)",  marginBottom: 10 }} />
              <div style={{ width: "64%", height: 16, borderRadius: 4, background: "rgba(255,255,255,0.88)", marginBottom: 10 }} />
              <div style={{ width: "48%", height: 10, borderRadius: 3, background: "rgba(255,255,255,0.3)",  marginBottom: 6  }} />
              <div style={{ width: "38%", height: 10, borderRadius: 3, background: "rgba(255,255,255,0.18)", marginBottom: 24 }} />
              {/* CTAs */}
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div
                  style={{
                    background: COL.cyan,
                    borderRadius: 10,
                    padding: "12px 24px",
                    display: "inline-flex",
                    alignItems: "center",
                    boxShadow: `0 0 32px rgba(34,211,238,0.45)`,
                  }}
                >
                  <div style={{ width: 80, height: 8, borderRadius: 3, background: "rgba(0,0,0,0.58)" }} />
                </div>
                <div
                  style={{
                    borderRadius: 10,
                    padding: "12px 24px",
                    border: "1px solid rgba(255,255,255,0.18)",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: 60, height: 8, borderRadius: 3, background: "rgba(255,255,255,0.38)" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Service cards */}
          <div
            style={{
              display: "flex",
              gap: 10,
              padding: "20px 18px",
              opacity: cardsOp,
              translate: `0px ${cardsTy}px`,
            }}
          >
            {[
              { color: COL.cyan,   w1: 82, w2: 64 },
              { color: COL.blue,   w1: 74, w2: 57 },
              { color: COL.violet, w1: 78, w2: 60 },
            ].map(({ color, w1, w2 }, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.025)",
                  border: `1px solid ${color}2a`,
                  padding: "18px 14px",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    background: `${color}1e`,
                    border: `1px solid ${color}38`,
                    marginBottom: 12,
                  }}
                />
                <div style={{ width: `${w1}%`, height: 8,  borderRadius: 2, background: "rgba(255,255,255,0.58)", marginBottom: 6 }} />
                <div style={{ width: `${w2}%`, height: 6,  borderRadius: 2, background: "rgba(255,255,255,0.24)", marginBottom: 4 }} />
                <div style={{ width:    "45%", height: 5,  borderRadius: 2, background: "rgba(255,255,255,0.14)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
