// ============================================================================
// Phone screen states. Live React text + editable SVG icons only.
//  - NoResultScreen        (Scene 1, Scene 4)
//  - MissingInfoScreen     (Scene 2, Scene 3)
//  - CompletedProfileScreen(Scene 5)
// A single `t` (0..1) intro progress drives reveals deterministically.
// ============================================================================
import React from "react";
import { COLORS } from "../tokens";
import { SearchField } from "./Phone";
import {
  ClockIcon,
  PinIcon,
  PhoneIcon,
  DirectionsIcon,
  StarRow,
  GlobeIcon,
} from "./icons";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const NoResultScreen: React.FC<{ s: number; t?: number; caret?: boolean }> = ({ s, t = 1, caret = false }) => {
  const mag = clamp01(t * 1.4);
  const txt = clamp01((t - 0.25) * 1.6);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <SearchField s={s} caret={caret} />
      <div style={{ position: "absolute", top: 150 * s, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width={92 * s} height={92 * s} viewBox="0 0 24 24" fill="none" style={{ opacity: 0.35 + 0.65 * mag }}>
          <circle cx="10.5" cy="10.5" r="6.5" stroke={COLORS.mutedGrey} strokeWidth={1.5} />
          <line x1="15.4" y1="15.4" x2="20.8" y2="20.8" stroke={COLORS.mutedGrey} strokeWidth={1.5} strokeLinecap="round" />
        </svg>
        <div style={{ marginTop: 34 * s, textAlign: "center", opacity: txt }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 22 * s, color: COLORS.supportGrey, lineHeight: 1.4 }}>No results found for</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 22 * s, color: COLORS.softWhite, lineHeight: 1.5 }}>&ldquo;Crown Hardware&rdquo;</div>
        </div>
        <div style={{ marginTop: 30 * s, textAlign: "center", opacity: txt }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 20 * s, color: COLORS.mutedGrey, lineHeight: 1.45 }}>Try a different search</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 20 * s, color: COLORS.mutedGrey, lineHeight: 1.45 }}>or check the spelling.</div>
        </div>
      </div>
    </div>
  );
};

type Row = { icon: React.ReactNode; label: string; status: string; statusColor: string };

export const MissingInfoScreen: React.FC<{
  s: number;
  t?: number;
  rows: Row[];
  showNoResultHeader?: boolean;
  showProfileStub?: boolean;
}> = ({ s, t = 1, rows, showNoResultHeader = false, showProfileStub = false }) => {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <SearchField s={s} />
      {showNoResultHeader && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 12 * s }}>
          <svg width={64 * s} height={64 * s} viewBox="0 0 24 24" fill="none" style={{ opacity: 0.6 }}>
            <circle cx="10.5" cy="10.5" r="6.5" stroke={COLORS.mutedGrey} strokeWidth={1.5} />
            <line x1="15.4" y1="15.4" x2="20.8" y2="20.8" stroke={COLORS.mutedGrey} strokeWidth={1.5} strokeLinecap="round" />
          </svg>
          <div style={{ marginTop: 12 * s, textAlign: "center" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 20 * s, color: COLORS.supportGrey }}>No results found for</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 20 * s, color: COLORS.softWhite }}>&ldquo;Crown Hardware&rdquo;</div>
          </div>
        </div>
      )}
      <div style={{ padding: `${(showNoResultHeader ? 20 : 12) * s}px ${18 * s}px 0` }}>
        {rows.map((r, i) => {
          const rt = clamp01((t - i * 0.14) * 2.2);
          return (
            <div
              key={i}
              style={{
                height: 74 * s,
                marginBottom: 12 * s,
                borderRadius: 14 * s,
                background: COLORS.raisedDark,
                border: `1px solid rgba(34,211,238,0.22)`,
                display: "flex",
                alignItems: "center",
                padding: `0 ${20 * s}px`,
                opacity: rt,
                transform: `scaleY(${0.5 + 0.5 * rt})`,
                transformOrigin: "center",
              }}
            >
              <div style={{ width: 26 * s, height: 26 * s, marginRight: 16 * s, display: "flex" }}>{r.icon}</div>
              <div style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: 21 * s, color: COLORS.softWhite, fontWeight: 400 }}>{r.label}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 18 * s, color: r.statusColor, fontWeight: 400 }}>{r.status}</div>
            </div>
          );
        })}
      </div>
      {showProfileStub && (
        <div style={{ padding: `${8 * s}px ${22 * s}px 0`, opacity: clamp01((t - 0.5) * 2) }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 26 * s, color: COLORS.softWhite }}>Crown Hardware</div>
          <div style={{ marginTop: 8 * s }}><StarRow size={16 * s} color={COLORS.mutedGrey} /></div>
          <div style={{ marginTop: 16 * s, display: "flex", flexDirection: "column", gap: 10 * s }}>
            {[0.9, 0.8, 0.6].map((w, i) => (
              <div key={i} style={{ height: 8 * s, width: `${w * 100}%`, borderRadius: 4 * s, background: "rgba(120,132,145,0.28)" }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Default row sets
export const buildRows = (s: number, variant: "scene2" | "scene3"): Row[] => {
  const ic = (Comp: React.FC<{ size?: number; color?: string }>) => <Comp size={24 * s} color={COLORS.supportGrey} />;
  if (variant === "scene2") {
    return [
      { icon: ic(ClockIcon), label: "Hours", status: "?", statusColor: COLORS.mutedGrey },
      { icon: ic(PinIcon), label: "Location", status: "?", statusColor: COLORS.mutedGrey },
      { icon: ic(PhoneIcon), label: "Call", status: "Not available", statusColor: COLORS.mutedGrey },
      { icon: ic(DirectionsIcon), label: "Directions", status: "Not available", statusColor: COLORS.mutedGrey },
    ];
  }
  return [
    { icon: ic(ClockIcon), label: "Hours", status: "Not available", statusColor: COLORS.mutedGrey },
    { icon: ic(PinIcon), label: "Location", status: "Not confirmed", statusColor: COLORS.mutedGrey },
    { icon: ic(PhoneIcon), label: "Call", status: "Not available", statusColor: COLORS.mutedGrey },
    { icon: ic(DirectionsIcon), label: "Directions", status: "Not available", statusColor: COLORS.mutedGrey },
  ];
};

export const CompletedProfileScreen: React.FC<{ s: number; t?: number; t2?: number }> = ({ s, t = 1, t2 = 1 }) => {
  const g1 = clamp01(t);
  const g2 = clamp01(t2);
  const action = (label: string, Icon: React.FC<{ size?: number; color?: string }>) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 * s }}>
      <div style={{ width: 52 * s, height: 52 * s, borderRadius: "50%", border: `1.5px solid rgba(34,211,238,0.5)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={24 * s} color={COLORS.cyan} />
      </div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 16 * s, color: COLORS.cyan }}>{label}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <SearchField s={s} />
      {/* header group */}
      <div style={{ padding: `${6 * s}px ${22 * s}px 0`, opacity: g1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 28 * s, color: COLORS.softWhite }}>Crown Hardware</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 * s, marginTop: 6 * s }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18 * s, color: COLORS.softWhite }}>4.8</span>
              <StarRow size={15 * s} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 16 * s, color: COLORS.supportGrey }}>(128)</span>
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 17 * s, marginTop: 6 * s }}>
              <span style={{ color: COLORS.supportGrey }}>Hardware store · </span>
              <span style={{ color: COLORS.successGreen }}>Open</span>
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 16 * s, color: COLORS.supportGrey, marginTop: 4 * s }}>123 Main Street, Yourtown</div>
          </div>
          {/* thumbnail */}
          <div style={{ width: 74 * s, height: 60 * s, borderRadius: 8 * s, overflow: "hidden", background: "linear-gradient(180deg,#20160d,#0a0705)", flexShrink: 0, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 60%, rgba(255,190,100,0.5), transparent 70%)` }} />
          </div>
        </div>
        {/* tabs */}
        <div style={{ display: "flex", gap: 22 * s, marginTop: 16 * s, borderBottom: `1px solid rgba(255,255,255,0.08)`, paddingBottom: 10 * s }}>
          {["Overview", "Services", "Reviews", "Photos"].map((tab, i) => (
            <span key={tab} style={{ fontFamily: "Inter, sans-serif", fontSize: 17 * s, color: i === 0 ? COLORS.softWhite : COLORS.mutedGrey, borderBottom: i === 0 ? `2px solid ${COLORS.cyan}` : "none", paddingBottom: 6 * s }}>{tab}</span>
          ))}
        </div>
      </div>
      {/* actions + details group */}
      <div style={{ padding: `${18 * s}px ${22 * s}px 0`, opacity: g2 }}>
        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 20 * s }}>
          {action("Call", PhoneIcon)}
          {action("Directions", DirectionsIcon)}
          {action("Website", GlobeIcon)}
        </div>
        {[
          { icon: <ClockIcon size={22 * s} color={COLORS.successGreen} />, main: <><span style={{ color: COLORS.successGreen }}>Open</span><span style={{ color: COLORS.supportGrey }}> · Closes 7:00 PM</span></> },
          { icon: <PinIcon size={22 * s} color={COLORS.cyan} />, main: <span style={{ color: COLORS.softWhite }}>123 Main Street<br />Yourtown, ST 12345</span> },
          { icon: <PhoneIcon size={22 * s} color={COLORS.cyan} />, main: <span style={{ color: COLORS.softWhite }}>(555) 123-4567</span> },
          { icon: <GlobeIcon size={22 * s} color={COLORS.cyan} />, main: <span style={{ color: COLORS.cyan }}>crownhardware.com</span> },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 * s, padding: `${11 * s}px 0`, borderBottom: i < 3 ? `1px solid rgba(255,255,255,0.06)` : "none" }}>
            <div style={{ width: 24 * s, height: 24 * s, display: "flex" }}>{r.icon}</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 17 * s }}>{r.main}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
