import { useCurrentFrame } from "remotion";
import { C, F } from "../styles";
import { prog } from "../anim";

type P = { size?: number; color?: string; sw?: number };
const I = (size: number) => ({ width: size, height: size, display: "block" }) as const;
const Tag: React.FC<P> = ({ size = 24, color = "#9BA5AB", sw = 1.8 }) => (<svg viewBox="0 0 24 24" style={I(size)} fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round"><path d="M3.5 11V3.5H11l9.5 9.5-7.5 7.5z" /><circle cx="7.6" cy="7.6" r="1.3" /></svg>);
const Loc: React.FC<P> = ({ size = 24, color = "#9BA5AB", sw = 1.8 }) => (<svg viewBox="0 0 24 24" style={I(size)} fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round"><path d="M12 21c4-4.4 6-7.6 6-10.5A6 6 0 0 0 6 10.5C6 13.4 8 16.6 12 21z" /><circle cx="12" cy="10.3" r="2.2" /></svg>);
const Clk: React.FC<P> = ({ size = 24, color = "#9BA5AB", sw = 1.8 }) => (<svg viewBox="0 0 24 24" style={I(size)} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"><circle cx="12" cy="12" r="8.4" /><path d="M12 7.4V12l3.2 2" /></svg>);
const Wr: React.FC<P> = ({ size = 24, color = "#9BA5AB", sw = 1.8 }) => (<svg viewBox="0 0 24 24" style={I(size)} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 6.2a4 4 0 0 1 5.3-3.8l-2.8 2.8.8 2.4 2.4.8 2.8-2.8A4 4 0 0 1 19.4 11L8.6 20.2a1.9 1.9 0 0 1-2.8-2.8l9-9a4 4 0 0 1-.3-2.2z" transform="scale(.82) translate(2 2)" /></svg>);
const Img: React.FC<P> = ({ size = 24, color = "#9BA5AB", sw = 1.8 }) => (<svg viewBox="0 0 24 24" style={I(size)} fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><circle cx="9" cy="9.5" r="1.6" /><path d="M4.5 17.5 10 12.5l3.4 3 3-2.6 3.1 3" /></svg>);
const Star: React.FC<P> = ({ size = 24, color = "#9BA5AB", sw = 1.8 }) => (<svg viewBox="0 0 24 24" style={I(size)} fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round"><path d="M12 3l2.6 5.4 5.9.7-4.3 4.1 1.1 5.8L12 16.9 6.7 19l1.1-5.8-4.3-4.1 5.9-.7z" /></svg>);
const Glb: React.FC<P> = ({ size = 24, color = "#9BA5AB", sw = 1.8 }) => (<svg viewBox="0 0 24 24" style={I(size)} fill="none" stroke={color} strokeWidth={sw}><circle cx="12" cy="12" r="8.4" /><path d="M3.6 12h16.8M12 3.6c-4.6 4.6-4.6 12.2 0 16.8 4.6-4.6 4.6-12.2 0-16.8z" /></svg>);

const ROWS = [
  { Icon: Tag, label: "Category", value: "Missing", color: C.red },
  { Icon: Loc, label: "Address", value: "Incomplete", color: C.red },
  { Icon: Clk, label: "Hours", value: "Inconsistent", color: C.red2 },
  { Icon: Wr, label: "Services", value: "Not listed", color: C.red2 },
  { Icon: Img, label: "Photos", value: "Limited", color: C.gold },
  { Icon: Star, label: "Reviews", value: "None", color: C.red },
  { Icon: Glb, label: "Website", value: "Missing", color: C.red },
] as const;

/**
 * Scene 2 profile panel (reference 6809). Assembles from parts: the outline
 * draws first, then the header, business name, and rows populate in sequence
 * with status words arriving 3f after their labels.
 */
export const BusinessProfilePanel: React.FC<{ delay?: number; width?: number }> = ({ delay = 0, width = 470 }) => {
  const frame = useCurrentFrame();
  const border = prog(frame, delay, 16);
  const header = prog(frame, delay + 12, 14);
  const name = prog(frame, delay + 18, 14);

  return (
    <div
      style={{
        width,
        borderRadius: 24,
        background: `rgba(5,12,18,${0.88 * border})`,
        border: `2px solid rgba(0,217,255,${0.55 * border})`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(0,217,255,${0.07 * border})`,
        padding: "26px 30px 18px",
        // panel scales open vertically as the outline draws
        transform: `scaleY(${0.9 + 0.1 * border})`,
        transformOrigin: "top",
        fontFamily: F.ui,
      }}
    >
      <div style={{ fontSize: 34, fontWeight: 600, color: C.cyan, opacity: header, transform: `translateY(${(1 - header) * -8}px)`, fontFamily: F.body }}>
        Business Profile
      </div>
      <div style={{ fontSize: 27, fontWeight: 600, color: C.white, letterSpacing: 0.4, marginTop: 12, opacity: name }}>
        CROWN HARDWARE
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "14px 0 4px" }} />
      {ROWS.map(({ Icon, label, value, color }, i) => {
        const d = delay + 24 + i * 4;
        const rt = prog(frame, d, 12);
        const vt = prog(frame, d + 3, 10);
        // restrained red pulse as each error value lands
        const pulse = 1 + 0.7 * Math.max(0, 1 - Math.abs(frame - (d + 12)) / 8);
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 16, height: 53, opacity: rt, transform: `translateY(${(1 - rt) * 12}px)` }}>
            <Icon size={24} color="#8C959D" />
            <div style={{ flex: 1, fontSize: 26, fontWeight: 400, color: C.gray }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 500, color, opacity: vt, filter: `brightness(${pulse})` }}>{value}</div>
          </div>
        );
      })}
    </div>
  );
};
