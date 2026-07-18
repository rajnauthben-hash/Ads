import { useCurrentFrame } from "remotion";
import { C, F } from "../styles/tokens";
import { pop, prog, reveal } from "../../omniflowad/ui/anim";

const PARA_1 = ["When information is", "missing, incorrect,", "or incomplete, the", "map has nothing", "solid to work with."];
const PARA_2 = ["So it can’t match", "your business to", "the search."];

/**
 * Scene 02 gold warning card: circled "!" on top, two grouped paragraphs.
 */
export const WarningPanel: React.FC<{ delay?: number; width?: number }> = ({ delay = 0, width = 306 }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, 24);
  return (
    <div
      style={{
        width,
        borderRadius: 26,
        border: `2.5px solid rgba(215,161,68,0.8)`,
        background: "rgba(10,9,5,0.72)",
        padding: "30px 30px 26px",
        fontFamily: F.body,
        boxShadow: `0 0 60px rgba(215,161,68,${0.14 * t})`,
        opacity: t,
        transform: `translateY(${(1 - t) * 22}px) scale(${0.97 + 0.03 * t})`,
        filter: `blur(${(1 - t) * 5}px)`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, ...pop(frame, delay + 8) }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: `2.5px solid ${C.gold}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: F.label,
            fontSize: 34,
            fontWeight: 500,
            color: C.gold,
          }}
        >
          !
        </div>
      </div>
      {PARA_1.map((line, i) => (
        <div key={line} style={{ fontSize: 28, lineHeight: 1.48, color: C.white, whiteSpace: "pre", ...reveal(frame, delay + 12 + i * 4, 16, 10) }}>
          {line}
        </div>
      ))}
      <div style={{ height: 20 }} />
      {PARA_2.map((line, i) => (
        <div key={line} style={{ fontSize: 28, lineHeight: 1.48, color: C.white, whiteSpace: "pre", ...reveal(frame, delay + 34 + i * 4, 16, 10) }}>
          {line}
        </div>
      ))}
    </div>
  );
};
