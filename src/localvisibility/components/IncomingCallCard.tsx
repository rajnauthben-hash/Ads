import { useCurrentFrame } from "remotion";
import { C, F } from "../styles/tokens";
import { pop, prog, reveal } from "../../omniflowad/ui/anim";
import { IconPerson, IconPhone } from "../../omniflowad/ui/icons";

/**
 * Scene 03 incoming-call card, vertical layout per the reference:
 * muted title, cyan avatar + Customer / 00:12, red decline + green accept.
 * Breathes at 1–2% scale while ringing.
 */
export const IncomingCallCard: React.FC<{ delay?: number; width?: number }> = ({ delay = 0, width = 410 }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, 26);
  const breathe = 1 + 0.012 * Math.sin(frame / 10);
  const ringR = (frame % 42) / 42;
  return (
    <div
      style={{
        width,
        borderRadius: 30,
        background: "rgba(13,17,22,0.92)",
        border: `1.5px solid rgba(0,216,242,0.22)`,
        boxShadow: "0 36px 90px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 50px rgba(0,216,242,0.06)",
        padding: "26px 30px 30px",
        fontFamily: F.ui,
        opacity: t,
        transform: `translateY(${(1 - t) * 30}px) scale(${(0.94 + 0.06 * t) * breathe}) perspective(900px) rotateX(${(1 - t) * 6}deg)`,
        filter: `blur(${(1 - t) * 6}px)`,
      }}
    >
      <div style={{ textAlign: "center", fontSize: 28, fontWeight: 500, color: C.muted, ...reveal(frame, delay + 5, 14, 8) }}>
        Incoming Call
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 22 }}>
        {/* ringing avatar */}
        <div style={{ position: "relative", flexShrink: 0, ...pop(frame, delay + 8) }}>
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: "50%",
              background: "rgba(0,216,242,0.14)",
              border: `2.5px solid rgba(0,216,242,0.75)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconPerson size={46} fill={C.cyan} />
          </div>
          <div
            style={{
              position: "absolute",
              inset: -8 - ringR * 12,
              borderRadius: "50%",
              border: `2px solid ${C.cyan}`,
              opacity: 0.5 * (1 - ringR),
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: 40, fontWeight: 600, color: C.white, ...reveal(frame, delay + 10, 14, 8) }}>Customer</div>
          <div style={{ fontSize: 27, fontWeight: 500, color: C.muted, marginTop: 4, ...reveal(frame, delay + 14, 14, 8) }}>00:12</div>
        </div>
      </div>
      {/* decline / accept */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "26px 26px 0" }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: "#E5544B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 26px rgba(229,84,75,0.35)",
            ...pop(frame, delay + 18),
          }}
        >
          <div style={{ transform: "rotate(135deg)" }}>
            <IconPhone size={38} fill="#fff" />
          </div>
        </div>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: "#2FB552",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 26px rgba(47,181,82,0.35)",
            ...pop(frame, delay + 22),
          }}
        >
          <IconPhone size={38} fill="#fff" />
        </div>
      </div>
    </div>
  );
};
