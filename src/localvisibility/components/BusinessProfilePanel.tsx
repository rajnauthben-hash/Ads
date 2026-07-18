import { useCurrentFrame } from "remotion";
import { C, F } from "../styles/tokens";
import { prog, reveal } from "../../omniflowad/ui/anim";
import { IconClock, IconPin, IconStar } from "../../omniflowad/ui/icons";
import { IconGlobe, IconImage, IconShopSmall, IconTag, IconWrench } from "./lvicons";

const ROWS = [
  { icon: IconShopSmall, label: "Business name", value: "CROWN HARDWARE", bad: false },
  { icon: IconTag, label: "Category", value: "Missing", bad: true },
  { icon: IconPin, label: "Address", value: "Incomplete", bad: true },
  { icon: IconClock, label: "Hours", value: "Not set", bad: true },
  { icon: IconWrench, label: "Services", value: "Not added", bad: true },
  { icon: IconImage, label: "Photos", value: "None", bad: true },
  { icon: IconStar, label: "Reviews", value: "None", bad: true },
  { icon: IconGlobe, label: "Website", value: "Missing", bad: true },
] as const;

/**
 * Scene 02 profile table: cyan title, icon-led rows, red missing values.
 * The cyan border/separators are the persistent signal made structural.
 */
export const BusinessProfilePanel: React.FC<{ delay?: number; width?: number }> = ({ delay = 0, width = 476 }) => {
  const frame = useCurrentFrame();
  const borderT = prog(frame, delay, 20);
  return (
    <div
      style={{
        width,
        borderRadius: 26,
        background: "rgba(6,10,14,0.85)",
        border: `2px solid rgba(0,216,242,${0.45 * borderT})`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,216,242,${0.08 * borderT})`,
        padding: "28px 30px 14px",
        fontFamily: F.ui,
        ...reveal(frame, delay, 22, 24),
      }}
    >
      <div style={{ fontSize: 33, fontWeight: 600, color: C.cyan, paddingBottom: 16, ...reveal(frame, delay + 4, 18, 8) }}>
        Your Business Profile
      </div>
      {ROWS.map(({ icon: Icon, label, value, bad }, i) => {
        const d = delay + 10 + i * 5;
        const t = prog(frame, d, 16);
        // restrained warning pulse as each missing value lands
        const pulse = bad ? 1 + 0.9 * Math.max(0, 1 - Math.abs(frame - (d + 10)) / 9) : 1;
        return (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              height: 55,
              borderTop: `1px solid rgba(0,216,242,${0.13 * borderT})`,
              opacity: t,
              transform: `translateY(${(1 - t) * 10}px)`,
            }}
          >
            <Icon size={27} color="#AEB6BD" strokeWidth={1.7} />
            <div style={{ fontSize: 25, fontWeight: 500, color: C.gray, flex: 1, whiteSpace: "pre" }}>{label}</div>
            <div
              style={{
                fontSize: value.length > 10 ? 24 : 26,
                whiteSpace: "pre",
                fontWeight: bad ? 500 : 600,
                color: bad ? C.red : C.white,
                filter: `brightness(${pulse})`,
              }}
            >
              {value}
            </div>
          </div>
        );
      })}
    </div>
  );
};
