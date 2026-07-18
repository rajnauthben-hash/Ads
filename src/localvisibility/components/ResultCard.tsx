import { useCurrentFrame } from "remotion";
import { C, F } from "../styles/tokens";
import { revealX } from "../../omniflowad/ui/anim";
import { IconStar, IconX } from "../../omniflowad/ui/icons";

/**
 * Scene 03 result cards. Positive: mini storefront thumbnail, rating row,
 * distance • Open. Negative: red-dashed border with an X thumbnail.
 */
export const ResultCard: React.FC<{
  variant: "best-tools" | "crown-negative";
  delay?: number;
  width?: number;
}> = ({ variant, delay = 0, width = 396 }) => {
  const frame = useCurrentFrame();
  const negative = variant === "crown-negative";
  return (
    <div
      style={{
        width,
        borderRadius: 22,
        padding: "20px 24px",
        display: "flex",
        gap: 22,
        alignItems: "center",
        fontFamily: F.ui,
        background: negative ? "rgba(30,10,8,0.55)" : C.card,
        border: negative ? `2.5px dashed rgba(255,79,67,0.8)` : `1.5px solid ${C.cardBorder}`,
        boxShadow: negative ? "0 0 44px rgba(255,79,67,0.12)" : "0 22px 55px rgba(0,0,0,0.45)",
        ...revealX(frame, delay, 22, 54),
      }}
    >
      {negative ? (
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: 16,
            border: `2px solid rgba(255,79,67,0.4)`,
            background: "rgba(20,10,9,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
              border: `2.5px solid ${C.red}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconX size={32} color={C.red} strokeWidth={2.6} />
          </div>
        </div>
      ) : (
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: 16,
            overflow: "hidden",
            flexShrink: 0,
            background: "linear-gradient(180deg, #101825 0%, #1C2433 55%, #2A2418 100%)",
            position: "relative",
          }}
        >
          {/* mini storefront photo impression */}
          <div style={{ position: "absolute", left: 8, right: 8, top: 14, height: 15, borderRadius: 3, background: "#E9E2D2", opacity: 0.9 }} />
          <div style={{ position: "absolute", left: 8, top: 38, width: 26, height: 38, background: "linear-gradient(180deg,#5E4318,#2A1D0A)", borderRadius: 2 }} />
          <div style={{ position: "absolute", left: 40, top: 38, width: 20, height: 38, background: "linear-gradient(180deg,#503A14,#241708)", borderRadius: 2 }} />
          <div style={{ position: "absolute", right: 8, top: 38, width: 18, height: 38, background: "linear-gradient(180deg,#46330f,#1e1406)", borderRadius: 2 }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 12, background: "rgba(255,182,92,0.2)", filter: "blur(4px)" }} />
        </div>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 31, fontWeight: 600, color: C.white, whiteSpace: "pre" }}>
          {negative ? "Crown Hardware" : "Best Tools TT"}
        </div>
        {negative ? (
          <>
            <div style={{ fontSize: 24, color: C.gray, marginTop: 7, whiteSpace: "pre" }}>Information incomplete</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: C.red, marginTop: 3, whiteSpace: "pre" }}>Not showing in results</div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 7 }}>
              <span style={{ fontSize: 25, fontWeight: 600, color: C.white }}>4.4</span>
              <span style={{ display: "flex", gap: 2 }}>
                {[0, 1, 2, 3, 4].map((s) => (
                  <IconStar key={s} size={24} color={s < 4 ? C.gold : "rgba(255,255,255,0.28)"} fill={s < 4 ? C.gold : "none"} strokeWidth={1.6} />
                ))}
              </span>
              <span style={{ fontSize: 23, color: C.muted }}>(93)</span>
            </div>
            <div style={{ fontSize: 25, color: C.gray, marginTop: 5 }}>
              0.5 km <span style={{ color: C.muted }}>•</span> <span style={{ color: C.cyan, fontWeight: 500 }}>Open</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
