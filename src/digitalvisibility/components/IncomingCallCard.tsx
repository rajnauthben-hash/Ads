import { useCurrentFrame } from "remotion";
import { C, F } from "../styles";
import { prog } from "../anim";

const Phone: React.FC<{ size?: number; rot?: number }> = ({ size = 34, rot = 0 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#fff" style={{ transform: `rotate(${rot}deg)` }}>
    <path d="M6.8 3.2c.7-.4 1.6-.2 2.1.5l1.7 2.5c.4.6.4 1.5-.1 2l-1.2 1.3c.5 1.2 2.4 3.6 4.4 4.7l1.5-1c.6-.4 1.4-.4 1.9.1l2.2 2c.6.6.7 1.5.2 2.2l-1 1.4c-.5.7-1.4 1-2.2.8C10.6 21.4 6.2 16 5.2 10.6c-.2-.9.2-1.8 1-2.3z" />
  </svg>
);

/**
 * Scene 3 incoming-call card (reference 6810). Assembles from parts: avatar
 * ring draws, "Incoming call" then "Customer", then the decline/answer
 * buttons; the green answer button does one restrained soft pulse.
 */
export const IncomingCallCard: React.FC<{ delay?: number; width?: number }> = ({ delay = 0, width = 400 }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, 22);
  const avatar = prog(frame, delay + 6, 16);
  const title = prog(frame, delay + 10, 14);
  const nm = prog(frame, delay + 14, 14);
  const btnR = prog(frame, delay + 14, 12);
  const btnG = prog(frame, delay + 17, 12);
  const pulse = 1 + 0.04 * Math.max(0, Math.sin((frame - delay - 24) / 8)) * (frame > delay + 24 ? 1 : 0);

  return (
    <div
      style={{
        width,
        borderRadius: 26,
        background: "rgba(9,14,19,0.9)",
        border: "1.5px solid rgba(255,255,255,0.09)",
        boxShadow: "0 34px 90px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
        padding: "24px 30px 28px",
        fontFamily: F.ui,
        opacity: t,
        transform: `translateY(${(1 - t) * 24}px) scale(${(0.95 + 0.05 * t)})`,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 500, color: C.grayMute, opacity: title }}>Incoming call</div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 14 }}>
        <div style={{ width: 84, height: 84, borderRadius: "50%", background: "rgba(0,217,255,0.12)", border: `2.5px solid rgba(0,217,255,${0.75 * avatar})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transform: `scale(${0.6 + 0.4 * avatar})` }}>
          <svg viewBox="0 0 24 24" width={44} height={44} fill={C.cyan}><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5c.6-4 3.6-6 7.5-6s6.9 2 7.5 6z" /></svg>
        </div>
        <div style={{ fontSize: 42, fontWeight: 600, color: C.white, opacity: nm, transform: `translateX(${(1 - nm) * -10}px)` }}>Customer</div>
      </div>
      <div style={{ display: "flex", gap: 22, marginTop: 24 }}>
        <div style={{ width: 82, height: 82, borderRadius: "50%", background: "#E5544B", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 26px rgba(229,84,75,0.35)", opacity: btnR, transform: `scale(${0.5 + 0.5 * btnR})` }}>
          <Phone size={36} rot={135} />
        </div>
        <div style={{ width: 82, height: 82, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 26px rgba(69,217,130,0.4)", opacity: btnG, transform: `scale(${(0.5 + 0.5 * btnG) * pulse})` }}>
          <Phone size={36} />
        </div>
      </div>
    </div>
  );
};
