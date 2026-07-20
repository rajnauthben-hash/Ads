import { useCurrentFrame } from "remotion";
import { C, F } from "../styles";
import { prog } from "../anim";

type Result = {
  name: string;
  dist: string;
  stars: number;
  count: string;
  cat: string;
};

const RESULTS: Result[] = [
  { name: "Crown Hardware", dist: "0.4 mi", stars: 5, count: "(128)", cat: "Hardware store · Tools · Paint" },
  { name: "Neighborhood Hardware", dist: "0.7 mi", stars: 4, count: "(86)", cat: "Hardware store · Tools · Paint" },
  { name: "Home Supply Co.", dist: "1.2 mi", stars: 4, count: "(63)", cat: "Hardware store · Tools · Paint" },
];
const RATING = ["4.6", "4.2", "4.1"];

const Pin: React.FC<{ color: string; size?: number }> = ({ color, size = 26 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ display: "block" }}>
    <path d="M12 2c3.9 0 7 3 7 6.8 0 4.3-4.6 9.4-6.3 11.2a1 1 0 0 1-1.4 0C9.6 18.2 5 13.1 5 8.8 5 5 8.1 2 12 2z" />
    <circle cx="12" cy="8.6" r="2.4" fill={C.bg} />
  </svg>
);

const Stars: React.FC<{ filled: number; size?: number }> = ({ filled, size = 20 }) => (
  <span style={{ display: "inline-flex", gap: 1 }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <svg key={i} viewBox="0 0 24 24" width={size} height={size} style={{ display: "block" }}>
        <path
          d="M12 2.8l2.6 5.5 6 .7-4.4 4.1 1.1 5.9L12 16.9l-5.3 2.9 1.1-5.9L3.4 9l6-.7z"
          fill={i < filled ? C.gold : "rgba(255,255,255,0.22)"}
        />
      </svg>
    ))}
  </span>
);

const TABS = [
  { label: "All", active: true },
  { label: "Maps", active: false },
  { label: "Shopping", active: false },
  { label: "Images", active: false },
  { label: "More", active: false },
];

/**
 * Scene 1 phone (reference 6808): live search for "hardware store near me"
 * with three results and a mini map. Search text types in over ~18f; result
 * rows populate with 4-frame offsets.
 */
export const PhoneSearchUI: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const queryT = prog(frame, delay + 8, 18);

  return (
    <div
      style={{
        width: 470,
        height: 940,
        borderRadius: 58,
        background: "linear-gradient(155deg, #1A1E24 0%, #0A0D11 62%)",
        border: "3px solid #2C323A",
        boxShadow: "0 60px 120px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.12)",
        padding: 13,
        position: "relative",
        fontFamily: F.ui,
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: 46, overflow: "hidden", background: "#0A0D11", position: "relative" }}>
        {/* notch */}
        <div style={{ position: "absolute", top: 9, left: "50%", marginLeft: -66, width: 132, height: 22, borderRadius: 12, background: "#04060A" }} />
        {/* status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 30px 0", alignItems: "center" }}>
          <div style={{ fontSize: 23, fontWeight: 600, color: "#E8ECEF" }}>9:41</div>
          <svg width={78} height={20} viewBox="0 0 102 26"><g fill="#E8ECEF">
            <rect x="0" y="14" width="4" height="8" rx="1" /><rect x="7" y="10" width="4" height="12" rx="1" /><rect x="14" y="6" width="4" height="16" rx="1" /><rect x="21" y="2" width="4" height="20" rx="1" />
          </g>
            <path d="M34 12 a14 14 0 0 1 20 0 M38 17 a8 8 0 0 1 12 0" stroke="#E8ECEF" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <rect x="64" y="6" width="30" height="14" rx="4" fill="none" stroke="#E8ECEF" strokeWidth="2" /><rect x="67" y="9" width="21" height="8" rx="2" fill="#E8ECEF" />
          </svg>
        </div>

        {/* search bar */}
        <div style={{ padding: "20px 22px 0", opacity: prog(frame, delay, 16) }}>
          <div style={{ height: 68, borderRadius: 20, background: "#151A20", border: "1.5px solid #262D35", display: "flex", alignItems: "center", padding: "0 20px", gap: 14 }}>
            <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="#8C959D" strokeWidth={2.4} strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6.2" /><path d="M15.2 15.2 L20 20" /></svg>
            <div style={{ flex: 1, fontSize: 26, fontWeight: 400, color: C.white, whiteSpace: "pre", clipPath: `inset(0 ${(1 - queryT) * 100}% 0 0)` }}>hardware store near me</div>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#262D35", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#8C959D" }}>✕</div>
          </div>
        </div>

        {/* tabs */}
        <div style={{ display: "flex", gap: 20, padding: "20px 24px 0", opacity: prog(frame, delay + 6, 16) }}>
          {TABS.map((tab) => (
            <div key={tab.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Pin color={tab.active ? C.cyan : "#66727A"} size={22} />
              </div>
              <span style={{ fontSize: 18, fontWeight: tab.active ? 600 : 400, color: tab.active ? C.cyan : "#66727A" }}>{tab.label}</span>
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "16px 24px 0" }} />

        {/* results */}
        <div style={{ padding: "6px 24px 0" }}>
          {RESULTS.map((r, i) => {
            const t = prog(frame, delay + 14 + i * 4, 16);
            const first = i === 0;
            return (
              <div key={r.name} style={{ padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", opacity: t, transform: `translateY(${(1 - t) * 12}px)`, display: "flex", gap: 14 }}>
                <div style={{ paddingTop: 3 }}><Pin color={first ? C.cyan : "#66727A"} size={26} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 27, fontWeight: 600, color: C.white }}>{r.name}</div>
                  <div style={{ fontSize: 21, marginTop: 5, color: C.gray }}>
                    {r.dist} <span style={{ color: "#5b636a" }}>·</span> <span style={{ color: C.green, fontWeight: 500 }}>Open</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 5 }}>
                    <span style={{ fontSize: 21, fontWeight: 600, color: C.white }}>{RATING[i]}</span>
                    <Stars filled={r.stars} size={19} />
                    <span style={{ fontSize: 20, color: C.grayMute }}>{r.count}</span>
                  </div>
                  <div style={{ fontSize: 20, color: C.grayMute, marginTop: 4 }}>{r.cat}</div>
                </div>
                <div style={{ color: "#4a525a", fontSize: 26, alignSelf: "center" }}>›</div>
              </div>
            );
          })}
        </div>

        {/* mini map */}
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 20, height: 150, borderRadius: 18, overflow: "hidden", background: "#0E1319", border: "1px solid rgba(255,255,255,0.06)", opacity: prog(frame, delay + 26, 16) }}>
          <svg width="100%" height="100%" viewBox="0 0 420 150" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 10 }, (_, i) => <line key={`v${i}`} x1={i * 48} y1={0} x2={i * 48} y2={150} stroke="rgba(226,167,70,0.16)" strokeWidth={1.4} />)}
            {Array.from({ length: 5 }, (_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={420} y2={i * 40} stroke="rgba(226,167,70,0.16)" strokeWidth={1.4} />)}
            <path d="M40 130 Q160 90 210 80 T400 40" stroke="rgba(0,217,255,0.4)" strokeWidth={3} fill="none" />
          </svg>
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 96, height: 96, borderRadius: "50%", border: `2px solid ${C.panelOutline}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Pin color={C.cyan} size={40} />
          </div>
          <svg viewBox="0 0 24 24" width={26} height={26} style={{ position: "absolute", right: 14, bottom: 14 }} fill="none" stroke={C.cyanSoft} strokeWidth={2}><path d="M3 11l18-8-8 18-2-8z" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  );
};
