import { useCurrentFrame } from "remotion";
import { C, F } from "../styles";
import { prog } from "../anim";

type P = { size?: number; color?: string; sw?: number };
const I = (s: number) => ({ width: s, height: s, display: "block" }) as const;
const Person: React.FC<P> = ({ size = 24, color = "#9BA5AB", sw = 1.8 }) => (<svg viewBox="0 0 24 24" style={I(size)} fill="none" stroke={color} strokeWidth={sw}><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20c.6-3.6 3.2-5.4 6.5-5.4s5.9 1.8 6.5 5.4" strokeLinecap="round" /></svg>);
const Tag: React.FC<P> = ({ size = 24, color = "#9BA5AB", sw = 1.8 }) => (<svg viewBox="0 0 24 24" style={I(size)} fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round"><path d="M3.5 11V3.5H11l9.5 9.5-7.5 7.5z" /><circle cx="7.6" cy="7.6" r="1.3" /></svg>);
const Loc: React.FC<P> = ({ size = 24, color = "#9BA5AB", sw = 1.8 }) => (<svg viewBox="0 0 24 24" style={I(size)} fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round"><path d="M12 21c4-4.4 6-7.6 6-10.5A6 6 0 0 0 6 10.5C6 13.4 8 16.6 12 21z" /><circle cx="12" cy="10.3" r="2.2" /></svg>);
const Clk: React.FC<P> = ({ size = 24, color = "#9BA5AB", sw = 1.8 }) => (<svg viewBox="0 0 24 24" style={I(size)} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><circle cx="12" cy="12" r="8.4" /><path d="M12 7.4V12l3.2 2" /></svg>);
const Img: React.FC<P> = ({ size = 24, color = "#9BA5AB", sw = 1.8 }) => (<svg viewBox="0 0 24 24" style={I(size)} fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><circle cx="9" cy="9.5" r="1.6" /><path d="M4.5 17.5 10 12.5l3.4 3 3-2.6 3.1 3" /></svg>);
const Shield: React.FC<P> = ({ size = 24, color = "#9BA5AB", sw = 1.8 }) => (<svg viewBox="0 0 24 24" style={I(size)} fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round"><path d="M12 3l7 2.5v5c0 5-3.2 8.4-7 10-3.8-1.6-7-5-7-10v-5z" /><path d="M9 12l2 2 4-4" /></svg>);

const ROWS = [
  { Icon: Person, label: "Clear profile" },
  { Icon: Tag, label: "Correct category" },
  { Icon: Loc, label: "Confirmed location" },
  { Icon: Clk, label: "Updated hours" },
  { Icon: Img, label: "Better photos" },
  { Icon: Shield, label: "A route the map can trust" },
] as const;

const Check: React.FC<{ progress: number }> = ({ progress }) => (
  <div style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${C.cyan}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 0 ${16 * progress}px rgba(0,217,255,${0.4 * progress})` }}>
    <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke={C.cyan} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
    </svg>
  </div>
);

/**
 * Scene 4 checklist (reference 6811). Panel outline + title draw first, then
 * each row's check activates in sequence with 5–8f offsets. Returns a
 * per-row activation value so the scene can emit route pulses in sync.
 */
export const ChecklistPanel: React.FC<{ delay?: number; width?: number }> = ({ delay = 0, width = 470 }) => {
  const frame = useCurrentFrame();
  const border = prog(frame, delay, 16);
  const titleCheck = prog(frame, delay + 12, 12);

  return (
    <div
      style={{
        width,
        borderRadius: 24,
        background: `rgba(5,12,18,${0.88 * border})`,
        border: `2px solid rgba(0,217,255,${0.5 * border})`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 50px rgba(0,217,255,${0.06 * border})`,
        padding: "24px 26px",
        fontFamily: F.ui,
        transform: `scaleY(${0.92 + 0.08 * border})`,
        transformOrigin: "top",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: prog(frame, delay + 6, 14) }}>
        <span style={{ fontSize: 32, fontWeight: 600, color: C.cyan, fontFamily: F.body }}>Your Business Profile</span>
        <Check progress={titleCheck} />
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "16px 0 8px" }} />
      {ROWS.map(({ Icon, label }, i) => {
        const d = delay + 16 + i * 6;
        const row = prog(frame, d, 12);
        const chk = prog(frame, d + 4, 12);
        return (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "13px 16px",
              marginTop: 10,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
              opacity: row,
              transform: `translateX(${(1 - row) * -20}px)`,
            }}
          >
            <Icon size={24} color="#AEB6BD" />
            <span style={{ flex: 1, fontSize: 26, fontWeight: 400, color: C.white }}>{label}</span>
            <Check progress={chk} />
          </div>
        );
      })}
    </div>
  );
};
