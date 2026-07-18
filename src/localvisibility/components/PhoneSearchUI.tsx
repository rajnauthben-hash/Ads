import { useCurrentFrame } from "remotion";
import { F } from "../styles/tokens";
import { prog, reveal, revealX } from "../../omniflowad/ui/anim";
import { IconArrowLeft, IconChat, IconClock, IconMagnifier, IconPin, IconStar } from "../../omniflowad/ui/icons";

const ROWS = [
  { label: "open now", Icon: IconClock },
  { label: "closest option", Icon: IconPin },
  { label: "best rated", Icon: IconStar },
  { label: "good reviews", Icon: IconChat },
] as const;

/**
 * Scene 01 phone: white search pill + popular searches, per the reference.
 * The query types in with a clip reveal; rows cascade one-by-one.
 */
export const PhoneSearchUI: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const queryT = prog(frame, delay + 10, 24);

  return (
    <div
      style={{
        width: 424,
        height: 820,
        borderRadius: 62,
        background: "linear-gradient(160deg, #14181D 0%, #0A0D11 60%)",
        border: "3px solid #2A2F36",
        boxShadow: "0 50px 110px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.13)",
        padding: 14,
        position: "relative",
        fontFamily: F.ui,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 48,
          overflow: "hidden",
          background: "linear-gradient(180deg, #0A0D11 0%, #0C1015 100%)",
          position: "relative",
        }}
      >
        {/* notch */}
        <div style={{ position: "absolute", top: 10, left: "50%", marginLeft: -70, width: 140, height: 24, borderRadius: 13, background: "#04060A" }} />

        {/* status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 34px 0", alignItems: "center" }}>
          <div style={{ fontSize: 25, fontWeight: 600, color: "#E8ECEF" }}>9:41</div>
          <svg width={84} height={22} viewBox="0 0 102 26" style={{ display: "block" }}>
            <g fill="#E8ECEF">
              <rect x="0" y="14" width="4" height="8" rx="1" />
              <rect x="7" y="10" width="4" height="12" rx="1" />
              <rect x="14" y="6" width="4" height="16" rx="1" />
              <rect x="21" y="2" width="4" height="20" rx="1" />
            </g>
            <path d="M34 12 a14 14 0 0 1 20 0 M38 17 a8 8 0 0 1 12 0 M43.4 21.6 a2.4 2.4 0 0 1 3.2 0" stroke="#E8ECEF" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <rect x="64" y="6" width="30" height="14" rx="4" fill="none" stroke="#E8ECEF" strokeWidth="2" />
            <rect x="67" y="9" width="20" height="8" rx="2" fill="#E8ECEF" />
          </svg>
        </div>

        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px 0", ...reveal(frame, delay, 18, 12) }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid #3A4046", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconArrowLeft size={24} color="#C7CDD3" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#EFF2F4" }}>Search</div>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid #3A4046", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: 3, background: "#C7CDD3" }} />
              ))}
            </div>
          </div>
        </div>

        {/* search pill */}
        <div style={{ padding: "24px 24px 0", ...reveal(frame, delay + 6, 20, 14) }}>
          <div
            style={{
              height: 76,
              borderRadius: 38,
              background: "#F1F3F4",
              display: "flex",
              alignItems: "center",
              padding: "0 22px",
              gap: 14,
              boxShadow: "0 8px 26px rgba(0,0,0,0.35)",
            }}
          >
            <IconMagnifier size={28} color="#3A4046" strokeWidth={2.6} />
            <div
              style={{
                fontSize: 27,
                fontWeight: 500,
                color: "#22272C",
                flex: 1,
                clipPath: `inset(0 ${(1 - queryT) * 100}% 0 0)`,
                whiteSpace: "pre",
              }}
            >
              hardware store near me
            </div>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#B9C0C6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, color: "#F1F3F4", fontWeight: 700 }}>
              ✕
            </div>
          </div>
        </div>

        {/* popular searches */}
        <div style={{ padding: "28px 30px 0", fontSize: 25, fontWeight: 500, color: "#98A1A8", ...reveal(frame, delay + 18, 18, 12) }}>
          Popular searches
        </div>
        <div style={{ padding: "16px 24px 0", display: "flex", flexDirection: "column", gap: 15 }}>
          {ROWS.map(({ label, Icon }, i) => (
            <div
              key={label}
              style={{
                height: 82,
                borderRadius: 18,
                background: "rgba(255,255,255,0.05)",
                border: "1.5px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "0 24px",
                ...revealX(frame, delay + 24 + i * 8, 18, 30),
              }}
            >
              <Icon size={28} color="#C7CDD3" strokeWidth={2} />
              <div style={{ fontSize: 28, fontWeight: 400, color: "#E4E8EB" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* screen sheen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(115deg, rgba(255,255,255,0.05) 0%, transparent 26%, transparent 72%, rgba(0,216,242,0.03) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};
