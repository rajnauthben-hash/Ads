import { useCurrentFrame, spring, interpolate } from "remotion";
import { COLORS, COPY, FONT, HOOK, W, H } from "./config";

// Deterministic noise — frame + seed → [-1, 1]
const noise = (f: number, s: number) =>
  Math.sin(f * 23.7 + s) * Math.cos(f * 7.3 + s * 1.618);

// SearchIcon SVG
const SearchIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="11" cy="11" r="7.5" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
    <path d="M20 20L15.5 15.5" stroke="rgba(255,255,255,0.4)" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Search bar fade-in (spring, local frames 0-8) ─────────────────
  const barIn = spring({ frame, fps: 30, config: { damping: 18, mass: 0.8, stiffness: 160 }, durationInFrames: 18 });
  const flicker = 0.82 + 0.18 * Math.abs(noise(frame, 0));

  const showBar     = frame < HOOK.RESULTS_CUT;
  const showResults = frame >= HOOK.RESULTS_CUT;

  // ── Typewriter ────────────────────────────────────────────────────
  const chars        = COPY.searchQuery.split("");
  const visibleCount = frame < HOOK.TYPE_START
    ? 0
    : Math.min(chars.length, Math.floor((frame - HOOK.TYPE_START) * HOOK.TYPE_RATE));
  const visibleText  = chars.slice(0, visibleCount).join("");
  const allTyped     = visibleCount >= chars.length;
  const cursorBlink  = Math.sin(frame * 0.28) > 0 ? 1 : 0;

  // ── Glitch jitter on bar (frames 44-49) ──────────────────────────
  const isGlitch = frame >= HOOK.GLITCH_START && frame < HOOK.RESULTS_CUT;
  const gx       = isGlitch ? noise(frame, 1) * 9 : 0;
  const gy       = isGlitch ? noise(frame, 2) * 5 : 0;
  const gOp      = isGlitch ? 0.45 + 0.55 * Math.abs(noise(frame, 3)) : 1;

  // ── 0 RESULTS: RGB chromatic split + screen tear ──────────────────
  const resultsIn = spring({
    frame: frame - HOOK.RESULTS_CUT,
    fps: 30,
    config: { damping: 12, mass: 0.7, stiffness: 280 },
  });
  const splitAmt = interpolate(frame, [49, 51, 54, 58], [0, 1, 0.55, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const splitX = splitAmt * 12;
  const splitY = splitAmt * noise(frame, 7) * 6;

  // Screen-tear bands: 2-3 horizontal chunks that shift left/right
  const tearBands = [
    { top: "22%", h: "4%",  shift: noise(frame, 11) * 22 * splitAmt },
    { top: "51%", h: "2.5%", shift: noise(frame, 13) * 18 * splitAmt },
    { top: "73%", h: "3.5%", shift: noise(frame, 17) * 26 * splitAmt },
  ];

  return (
    <div style={{
      width: W, height: H,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT, position: "relative", overflow: "hidden",
    }}>

      {/* ── Search bar phase ──────────────────────────────────────── */}
      {showBar && (
        <div style={{
          transform:  `translate(${gx}px, ${gy}px)`,
          opacity:    barIn * flicker * gOp,
          display:    "flex",
          flexDirection: "column",
          alignItems: "center",
          gap:        20,
        }}>
          {/* Platform label */}
          <div style={{
            color:          "rgba(255,255,255,0.35)",
            fontSize:       26,
            fontWeight:     600,
            letterSpacing:  3,
            textTransform:  "uppercase",
          }}>
            Google Search
          </div>

          {/* Search bar */}
          <div style={{
            width:        868,
            height:       86,
            borderRadius: 43,
            background:   "rgba(255,255,255,0.07)",
            border:       "1.5px solid rgba(255,255,255,0.13)",
            display:      "flex",
            alignItems:   "center",
            padding:      "0 28px",
            gap:          14,
          }}>
            <SearchIcon />
            <span style={{
              color:      "rgba(255,255,255,0.86)",
              fontSize:   33,
              fontWeight: 500,
              flex:       1,
              letterSpacing: 0.3,
            }}>
              {visibleText}
              <span style={{
                opacity: allTyped ? cursorBlink * 0.6 : cursorBlink,
                color:   allTyped ? "rgba(255,255,255,0.5)" : COLORS.energy,
              }}>|</span>
            </span>
            {/* Mic icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <rect x="9" y="2" width="6" height="11" rx="3" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" />
              <path d="M5 10.5C5 14.09 7.91 17 11.5 17H12.5C16.09 17 19 14.09 19 10.5"
                stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="12" y1="17" x2="12" y2="21"
                stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>

          {/* Hint: no results below bar */}
          {allTyped && (
            <div style={{
              color:         "rgba(255,255,255,0.22)",
              fontSize:      24,
              fontWeight:    500,
              letterSpacing: 0.5,
            }}>
              No results found
            </div>
          )}
        </div>
      )}

      {/* ── 0 RESULTS phase ───────────────────────────────────────── */}
      {showResults && (
        <div style={{ textAlign: "center", opacity: resultsIn }}>
          {/* RGB split stack */}
          <div style={{ position: "relative", display: "inline-block" }}>
            {/* Red channel — shift left */}
            <div style={{
              position:    "absolute",
              inset:       0,
              color:       COLORS.glitchRed,
              fontSize:    148,
              fontWeight:  700,
              lineHeight:  1,
              transform:   `translate(${-splitX}px, ${splitY}px)`,
              mixBlendMode:"screen" as const,
              opacity:     splitAmt * 0.9,
            }}>
              0 RESULTS
            </div>
            {/* Blue channel — shift right */}
            <div style={{
              position:    "absolute",
              inset:       0,
              color:       COLORS.glitchBlue,
              fontSize:    148,
              fontWeight:  700,
              lineHeight:  1,
              transform:   `translate(${splitX}px, ${-splitY * 0.6}px)`,
              mixBlendMode:"screen" as const,
              opacity:     splitAmt * 0.9,
            }}>
              0 RESULTS
            </div>
            {/* Primary text */}
            <div style={{
              color:       COLORS.red,
              fontSize:    148,
              fontWeight:  700,
              lineHeight:  1,
              letterSpacing: -2,
              filter:      `drop-shadow(0 0 40px rgba(255,59,48,0.55))`,
            }}>
              0 RESULTS
            </div>
          </div>

          <div style={{
            color:         "rgba(255,255,255,0.42)",
            fontSize:      30,
            fontWeight:    500,
            marginTop:     18,
            letterSpacing: 1,
          }}>
            Your business is invisible online
          </div>
        </div>
      )}

      {/* ── Screen-tear bands (during glitch transition) ──────────── */}
      {tearBands.map((b, i) => (
        <div key={i} style={{
          position:   "absolute",
          left:       0,
          top:        b.top,
          width:      W,
          height:     b.h,
          background: COLORS.void,
          transform:  `translateX(${b.shift}px)`,
          opacity:    splitAmt * 0.85,
          pointerEvents: "none",
        }} />
      ))}
    </div>
  );
};
