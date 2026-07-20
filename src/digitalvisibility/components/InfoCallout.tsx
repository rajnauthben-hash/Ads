import { useCurrentFrame } from "remotion";
import { C, F } from "../styles";
import { prog } from "../anim";

/**
 * Scene 2 warning callout (reference 6809, lower-right). The gold "!" grows
 * from a small circle, the border draws, then the copy reveals.
 */
export const InfoCallout: React.FC<{
  lines: readonly string[];
  delay?: number;
  width?: number;
}> = ({ lines, delay = 0, width = 360 }) => {
  const frame = useCurrentFrame();
  const border = prog(frame, delay, 20);
  const icon = prog(frame, delay + 6, 16);
  return (
    <div
      style={{
        width,
        borderRadius: 22,
        border: `2px solid rgba(226,167,70,${0.7 * border})`,
        background: "rgba(9,10,7,0.62)",
        padding: "30px 34px 32px",
        boxShadow: `0 0 50px rgba(226,167,70,${0.1 * border})`,
        opacity: Math.max(border, 0.001),
        transform: `translateY(${(1 - border) * 20}px) scale(${0.97 + 0.03 * border})`,
        fontFamily: F.body,
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            border: `2.5px solid ${C.gold}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${0.4 + 0.6 * icon})`,
            opacity: icon,
          }}
        >
          <span style={{ fontFamily: F.ui, fontSize: 32, fontWeight: 600, color: C.gold }}>!</span>
        </div>
      </div>
      {lines.map((line, i) => {
        const t = prog(frame, delay + 16 + i * 4, 16);
        return (
          <div key={line} style={{ fontSize: 30, lineHeight: 1.42, color: C.white, whiteSpace: "pre", opacity: t, transform: `translateY(${(1 - t) * 8}px)` }}>
            {line}
          </div>
        );
      })}
    </div>
  );
};
