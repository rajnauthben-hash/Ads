import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../theme";
import { SearchResultCard, type ResultData } from "./SearchResultCard";

const RESULTS: ResultData[] = [
  { rank: 1, name: "Brightview Hardware", rating: "4.7", reviews: "286", distance: "0.3 mi", status: "Open", hours: "Closes 8 PM", extra: "In stock  •  Curbside pickup", highlight: true },
  { rank: 2, name: "Hometown Supply", rating: "4.3", reviews: "143", distance: "0.7 mi", status: "Open", hours: "Closes 7 PM" },
  { rank: 3, name: "Pro Build Center", rating: "4.2", reviews: "98", distance: "1.2 mi", status: "Open", hours: "Closes 8 PM" },
  { rank: 4, name: "Your Business", rating: "4.1", reviews: "56", distance: "2.4 mi", status: "Open", hours: "Closes 6 PM", note: "Limited visibility in local results", dim: true },
];

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  appear: number;
  // Frame the query finishes typing.
  queryDone: number;
  // Base frame results begin populating.
  resultsFrom: number;
  // 0..1 — fragments the UI into horizontal strips for the exit.
  fragment?: number;
};

const QUERY = "hardware store near me";

// Native phone: rounded black body, metallic edge, dark screen, status bar,
// search bar (with typing query + heartbeat tail), tabs, result cards.
export const PhoneSearchUI: React.FC<Props> = ({ x, y, width: w, height: h, appear, queryDone, resultsFrom, fragment = 0 }) => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [appear, appear + 18], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const focus = interpolate(frame, [appear, appear + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const typed = Math.floor(interpolate(frame, [appear + 6, queryDone], [0, QUERY.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const caret = Math.floor(frame / 14) % 2 === 0;
  const screenPad = w * 0.045;
  const screenW = w - screenPad * 2;

  const tabs = ["All", "Maps", "Shopping", "Images", "News"];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `translate3d(0, ${rise}px, 0)`,
        opacity: focus,
        filter: fragment > 0 ? `blur(${fragment * 4}px)` : `blur(${(1 - focus) * 6}px)`,
      }}
    >
      {/* Fragmenting into horizontal interface strips on exit */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          clipPath: fragment > 0.02 ? undefined : undefined,
        }}
      >
        {/* Body */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 62,
            background: "linear-gradient(160deg, #16181C, #050607)",
            border: "3px solid #23262B",
            boxShadow: "0 40px 90px rgba(0,0,0,0.6), inset 0 0 0 2px #0A0B0D",
            transform: fragment > 0 ? `scaleY(${1 - fragment * 0.06})` : undefined,
          }}
        />
        {/* Screen */}
        <div
          style={{
            position: "absolute",
            left: screenPad,
            top: screenPad,
            width: screenW,
            height: h - screenPad * 2,
            borderRadius: 48,
            background: "#080A0D",
            overflow: "hidden",
          }}
        >
          {/* Status bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "26px 40px 8px" }}>
            <span style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 26, color: COLORS.white }}>9:41</span>
            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <svg width="26" height="18" viewBox="0 0 26 18"><rect x="0" y="10" width="4" height="8" rx="1" fill={COLORS.white} /><rect x="6" y="7" width="4" height="11" rx="1" fill={COLORS.white} /><rect x="12" y="4" width="4" height="14" rx="1" fill={COLORS.white} /><rect x="18" y="1" width="4" height="17" rx="1" fill={COLORS.white} opacity="0.5" /></svg>
              <svg width="24" height="18" viewBox="0 0 24 18"><path d="M12 15 A 9 9 0 0 1 3 8 A 13 13 0 0 1 21 8 Z" fill="none" stroke={COLORS.white} strokeWidth="1.6" opacity="0.85" /><circle cx="12" cy="13" r="1.6" fill={COLORS.white} /></svg>
              <svg width="34" height="18" viewBox="0 0 34 18"><rect x="1" y="2" width="28" height="14" rx="4" fill="none" stroke={COLORS.white} strokeWidth="1.6" /><rect x="3" y="4" width="22" height="10" rx="2" fill={COLORS.white} /><rect x="30" y="6" width="3" height="6" rx="1.5" fill={COLORS.white} /></svg>
            </span>
          </div>

          {/* Search bar */}
          <div style={{ margin: "12px 30px 0", height: 74, borderRadius: 37, background: "#12151A", border: `1.5px solid ${focus > 0.5 ? "rgba(31,199,255,0.4)" : "rgba(98,108,119,0.3)"}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 14, position: "relative", overflow: "visible" }}>
            <svg width="26" height="26" viewBox="0 0 26 26"><circle cx="11" cy="11" r="7.5" fill="none" stroke={COLORS.gray} strokeWidth="2.2" /><line x1="17" y1="17" x2="23" y2="23" stroke={COLORS.gray} strokeWidth="2.4" strokeLinecap="round" /></svg>
            <span style={{ fontFamily: FONTS.body, fontWeight: 400, fontSize: 25, color: COLORS.white, whiteSpace: "nowrap" }}>
              {QUERY.slice(0, typed)}
              {typed < QUERY.length && caret && <span style={{ color: COLORS.cyan }}>|</span>}
            </span>
            <span style={{ marginLeft: "auto" }}>
              <svg width="22" height="26" viewBox="0 0 22 26"><rect x="7" y="2" width="8" height="14" rx="4" fill="none" stroke={COLORS.gray} strokeWidth="1.8" /><path d="M4 12 A 7 7 0 0 0 18 12 M11 19 L11 23" fill="none" stroke={COLORS.gray} strokeWidth="1.8" /></svg>
            </span>
            {/* Heartbeat tail exiting the bar once query is done */}
            {frame >= queryDone && (
              <svg width="120" height="60" viewBox="0 0 120 60" style={{ position: "absolute", right: -70, top: 8, overflow: "visible" }}>
                <path d="M0 30 L30 30 L40 12 L52 48 L62 22 L72 30 L120 30" fill="none" stroke={COLORS.cyan} strokeWidth="3" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px rgba(31,199,255,0.7))" }} pathLength={100} strokeDasharray={100} strokeDashoffset={interpolate(frame, [queryDone, queryDone + 12], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
              </svg>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 30, padding: "22px 30px 0" }}>
            {tabs.map((tab, i) => (
              <span key={tab} style={{ fontFamily: FONTS.body, fontWeight: i === 0 ? 600 : 400, fontSize: 24, color: i === 0 ? COLORS.white : COLORS.grayMuted, borderBottom: i === 0 ? `2px solid ${COLORS.white}` : "none", paddingBottom: 6 }}>
                {tab}
              </span>
            ))}
          </div>

          {/* Results header */}
          <div style={{ padding: "20px 30px 6px" }}>
            <div style={{ fontFamily: FONTS.body, fontWeight: 400, fontSize: 21, color: COLORS.gray }}>Results near you</div>
            <div style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 22, color: COLORS.cyan, marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 9, height: 9, borderRadius: 5, background: COLORS.cyan, display: "inline-block" }} /> Current location
            </div>
          </div>

          {/* Result cards */}
          <div style={{ padding: "10px 30px 0" }}>
            {RESULTS.map((r, i) => (
              <SearchResultCard key={r.name} data={r} appear={resultsFrom + i * 6} width={screenW - 60} />
            ))}
            {/* More places */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderRadius: 16, background: "rgba(12,20,30,0.6)", opacity: interpolate(frame, [resultsFrom + 36, resultsFrom + 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              <span style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: 23, color: COLORS.gray }}>More places</span>
              <svg width="20" height="20" viewBox="0 0 20 20"><path d="M7 4 L13 10 L7 16" fill="none" stroke={COLORS.gray} strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
