import { useCurrentFrame } from "remotion";
import { C, F } from "../styles";
import { prog } from "../anim";

/**
 * Scene 3 comparison result cards (reference 6810). Best Tools TT is the
 * confident, cyan-outlined winner; Crown Hardware is the red-dashed
 * "not shown with confidence" loser.
 */
export const ComparisonCard: React.FC<{ variant: "besttools" | "crown"; delay?: number; width?: number }> = ({ variant, delay = 0, width = 420 }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, 22);
  const border = prog(frame, delay + 6, 18);
  const neg = variant === "crown";
  const arrow = prog(frame, delay + 20, 14);

  return (
    <div
      style={{
        width,
        borderRadius: 22,
        padding: "22px 24px",
        display: "flex",
        gap: 20,
        alignItems: "center",
        fontFamily: F.ui,
        background: neg ? "rgba(30,10,9,0.5)" : C.panel,
        border: neg ? `2.5px dashed rgba(255,87,77,${0.85 * border})` : `2px solid rgba(0,217,255,${0.55 * border})`,
        boxShadow: neg ? "0 0 40px rgba(255,87,77,0.1)" : "0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,217,255,0.08)",
        opacity: t,
        transform: `translateY(${(1 - t) * 12}px) scale(${0.97 + 0.03 * t})`,
      }}
    >
      {neg ? (
        <div style={{ width: 84, height: 84, borderRadius: 16, border: `2px solid rgba(255,87,77,0.4)`, background: "rgba(20,9,8,0.7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: 54, height: 54, borderRadius: "50%", border: `2.5px solid ${C.red}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke={C.red} strokeWidth={2.6} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </div>
        </div>
      ) : (
        <div style={{ width: 84, height: 84, borderRadius: 16, overflow: "hidden", flexShrink: 0, background: "linear-gradient(180deg,#101825,#2A2418)", position: "relative" }}>
          <div style={{ position: "absolute", left: 8, right: 8, top: 12, height: 14, borderRadius: 3, background: "#E9E2D2", opacity: 0.9 }} />
          <div style={{ position: "absolute", left: 8, top: 34, width: 22, height: 36, background: "linear-gradient(180deg,#5E4318,#2A1D0A)", borderRadius: 2 }} />
          <div style={{ position: "absolute", left: 34, top: 34, width: 18, height: 36, background: "linear-gradient(180deg,#503A14,#241708)", borderRadius: 2 }} />
          <div style={{ position: "absolute", right: 8, top: 34, width: 16, height: 36, background: "linear-gradient(180deg,#46330f,#1e1406)", borderRadius: 2 }} />
        </div>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 30, fontWeight: 600, color: C.white }}>{neg ? "Crown Hardware" : "Best Tools TT"}</div>
        {neg ? (
          <>
            <div style={{ fontSize: 24, color: C.gray, marginTop: 6 }}>Information incomplete</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: C.red, marginTop: 3 }}>Not shown with confidence</div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 25, fontWeight: 600, color: C.white }}>4.4</span>
              <svg viewBox="0 0 24 24" width={22} height={22}><path d="M12 3l2.6 5.4 5.9.7-4.3 4.1 1.1 5.8L12 16.9 6.7 19l1.1-5.8-4.3-4.1 5.9-.7z" fill={C.gold} /></svg>
              <span style={{ color: C.grayMute }}>·</span>
              <span style={{ fontSize: 25, color: C.cyan, fontWeight: 500 }}>Open now</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 7, opacity: arrow }}>
              <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke={C.cyan} strokeWidth={2} style={{ transform: `translateX(${(1 - arrow) * -6}px)` }}><path d="M3 11l18-8-8 18-2-8z" strokeLinejoin="round" /></svg>
              <span style={{ fontSize: 25, color: C.cyan, fontWeight: 500 }}>Directions available</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
