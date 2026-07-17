import { useCurrentFrame } from "remotion";
import { PAL } from "../theme";
import { prog, revealX, reveal } from "./anim";
import { IconArrowLeft, IconMagnifier, IconStar } from "./icons";
import { S2 } from "../copy";

/**
 * Scene 02 phone: device frame + live search UI.
 * All screen elements cascade in relative to `delay`.
 */
export const PhoneMockup: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();

  const queryT = prog(frame, delay + 14, 26);
  const rowIcons = [IconMagnifier, IconMagnifier, IconStar, IconMagnifier];

  return (
    <div
      style={{
        width: 540,
        height: 1110,
        borderRadius: 78,
        background: "linear-gradient(160deg, #15191E 0%, #0B0E12 60%)",
        border: "3px solid #2C3138",
        boxShadow:
          "0 60px 120px rgba(0,0,0,0.65), 0 10px 34px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.14)",
        padding: 17,
        position: "relative",
      }}
    >
      {/* side buttons */}
      <div style={{ position: "absolute", left: -6, top: 260, width: 5, height: 74, borderRadius: 3, background: "#33383F" }} />
      <div style={{ position: "absolute", left: -6, top: 356, width: 5, height: 74, borderRadius: 3, background: "#33383F" }} />
      <div style={{ position: "absolute", right: -6, top: 300, width: 5, height: 110, borderRadius: 3, background: "#33383F" }} />

      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 62,
          overflow: "hidden",
          background: "linear-gradient(180deg, #0A0D11 0%, #0D1116 100%)",
          position: "relative",
        }}
      >
        {/* notch */}
        <div style={{ position: "absolute", top: 14, left: "50%", marginLeft: -92, width: 184, height: 30, borderRadius: 16, background: "#04060A" }} />

        {/* status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "22px 44px 0", alignItems: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: "#E8ECEF" }}>9:41</div>
          <svg width={102} height={26} viewBox="0 0 102 26" style={{ display: "block" }}>
            <g fill="#E8ECEF">
              <rect x="0" y="14" width="4" height="8" rx="1" />
              <rect x="7" y="10" width="4" height="12" rx="1" />
              <rect x="14" y="6" width="4" height="16" rx="1" />
              <rect x="21" y="2" width="4" height="20" rx="1" />
            </g>
            <path d="M34 12 a14 14 0 0 1 20 0 M38 17 a8 8 0 0 1 12 0 M43.4 21.6 a2.4 2.4 0 0 1 3.2 0" stroke="#E8ECEF" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <rect x="64" y="6" width="30" height="14" rx="4" fill="none" stroke="#E8ECEF" strokeWidth="2" />
            <rect x="67" y="9" width="20" height="8" rx="2" fill="#E8ECEF" />
            <rect x="96" y="10" width="4" height="6" rx="2" fill="#E8ECEF" />
          </svg>
        </div>

        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 34px 0", ...reveal(frame, delay + 2, 20, 14) }}>
          <div style={{ width: 62, height: 62, borderRadius: "50%", border: "2px solid #3A4046", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconArrowLeft size={30} color="#C7CDD3" />
          </div>
          <div style={{ fontSize: 40, fontWeight: 600, color: "#EFF2F4" }}>{S2.phoneTitle}</div>
          <div style={{ width: 62, height: 62, borderRadius: "50%", border: "2px solid #3A4046", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 5 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: "#C7CDD3" }} />
              ))}
            </div>
          </div>
        </div>

        {/* search field */}
        <div style={{ padding: "30px 30px 0", ...reveal(frame, delay + 8, 22, 18) }}>
          <div
            style={{
              height: 92,
              borderRadius: 46,
              background: "#F1F3F4",
              display: "flex",
              alignItems: "center",
              padding: "0 26px",
              gap: 18,
              boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
            }}
          >
            <IconMagnifier size={34} color="#3A4046" strokeWidth={2.6} />
            <div
              style={{
                fontSize: 31,
                fontWeight: 500,
                color: "#22272C",
                flex: 1,
                clipPath: `inset(0 ${(1 - queryT) * 100}% 0 0)`,
                whiteSpace: "pre",
              }}
            >
              {S2.phoneQuery}
            </div>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#B9C0C6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#F1F3F4", fontWeight: 700 }}>
              ✕
            </div>
          </div>
        </div>

        {/* popular searches */}
        <div style={{ padding: "34px 38px 0", fontSize: 30, fontWeight: 500, color: "#98A1A8", ...reveal(frame, delay + 22, 20, 14) }}>
          {S2.phoneListTitle}
        </div>
        <div style={{ padding: "18px 30px 0", display: "flex", flexDirection: "column", gap: 18 }}>
          {S2.phoneList.map((item, i) => {
            const Ic = rowIcons[i];
            return (
              <div
                key={item}
                style={{
                  height: 96,
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.05)",
                  border: "1.5px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  padding: "0 28px",
                  ...revealX(frame, delay + 30 + i * 9, 20, 34),
                }}
              >
                <Ic size={32} color="#C7CDD3" />
                <div style={{ fontSize: 33, fontWeight: 400, color: "#E4E8EB" }}>{item}</div>
              </div>
            );
          })}
        </div>

        {/* home indicator */}
        <div style={{ position: "absolute", bottom: 16, left: "50%", marginLeft: -84, width: 168, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.55)" }} />

        {/* screen sheen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(115deg, rgba(255,255,255,0.06) 0%, transparent 24%, transparent 70%, rgba(17,217,247,0.03) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

/** Small phone outline used in the scene 02 callout box. */
export const PhoneOutline: React.FC<{ size?: number; color?: string }> = ({ size = 84, color = PAL.cyan }) => (
  <svg viewBox="0 0 44 72" width={size * 0.62} height={size} style={{ display: "block" }}>
    <rect x="2" y="2" width="40" height="68" rx="7" fill="none" stroke={color} strokeWidth="2.6" />
    <line x1="14" y1="8" x2="30" y2="8" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="22" cy="61" r="3.4" fill="none" stroke={color} strokeWidth="2" />
  </svg>
);
