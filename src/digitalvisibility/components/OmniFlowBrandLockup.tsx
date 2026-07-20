import { useCurrentFrame } from "remotion";
import { C, F } from "../styles";
import { prog, iv } from "../anim";

/** The OmniFlow flow-mark: concentric cyan arcs + orbiting dots. */
const FlowMark: React.FC<{ size?: number; progress: number }> = ({ size = 62, progress }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} style={{ display: "block" }}>
    <g fill="none" stroke={C.cyan} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress}>
      <path d="M32 10a22 22 0 1 1-15.5 6.4" strokeWidth={5} />
      <path d="M32 20a12 12 0 1 1-8.5 3.5" strokeWidth={4.4} opacity={0.85} />
    </g>
    <g fill={C.cyan} opacity={progress}>
      <circle cx="14" cy="44" r="3.4" />
      <circle cx="22" cy="50" r="2.6" opacity={0.8} />
      <circle cx="32" cy="32" r="3" />
    </g>
  </svg>
);

/**
 * Scene 4 brand lockup (reference 6811, lower-left). Flow mark draws, then
 * "OmniFlow" (white) + "Digital" (cyan, stroke→fill), a divider, and the
 * three-line tagline in white / cyan / gold.
 */
export const OmniFlowBrandLockup: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const mark = prog(frame, delay, 22);
  const omni = prog(frame, delay + 6, 18);
  const digital = prog(frame, delay + 12, 18);
  const divider = prog(frame, delay + 18, 18);

  return (
    <div style={{ width: 440 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <FlowMark size={62} progress={mark} />
        <div style={{ fontFamily: F.head, fontSize: 46, fontWeight: 800, letterSpacing: -0.5, whiteSpace: "pre" }}>
          <span style={{ color: C.white, opacity: omni, filter: `blur(${(1 - omni) * 6}px)` }}>OmniFlow</span>
          <span style={{ color: C.cyan, opacity: digital, filter: `blur(${(1 - digital) * 6}px)`, WebkitTextStroke: digital < 1 ? `1px rgba(0,217,255,${0.8 - 0.4 * digital})` : undefined }}> Digital</span>
        </div>
      </div>
      <div style={{ height: 1.5, background: `linear-gradient(90deg, ${C.panelOutline}, transparent)`, margin: "16px 0 16px", transform: `scaleX(${divider})`, transformOrigin: "left" }} />
      <div style={{ fontFamily: F.head, fontSize: 40, fontWeight: 800, lineHeight: 1.16, letterSpacing: -0.5 }}>
        {[
          { t: "Get Found.", c: C.white },
          { t: "Look Professional.", c: C.cyan },
          { t: "Grow Online.", c: C.gold },
        ].map((l, i) => {
          const t = prog(frame, delay + 22 + i * 4, 18);
          return (
            <div key={l.t} style={{ color: l.c, opacity: t, transform: `translateY(${(1 - t) * 10}px)`, letterSpacing: iv(frame, [delay + 22 + i * 4, delay + 46 + i * 4], [1.5, -0.5]) }}>
              {l.t}
            </div>
          );
        })}
      </div>
    </div>
  );
};
