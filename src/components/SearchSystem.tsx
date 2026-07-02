import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COL, FONT, EO } from "../lib/constants";

// Cursor blink
const Cursor: React.FC<{ frame: number }> = ({ frame }) => {
  const vis = Math.floor(frame / 18) % 2 === 0;
  return (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height: "1.1em",
        background: COL.cyan,
        marginLeft: 2,
        verticalAlign: "middle",
        opacity: vis ? 1 : 0,
      }}
    />
  );
};

// Typing animation for the search bar
export const SearchSystem: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  // Bar slides in from bottom
  const barOp = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const barTy = interpolate(f, [0, 24], [32, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  // Typing: character by character over 50 frames
  const fullText = "best plumber near me";
  const charCount = Math.floor(interpolate(f, [8, 58], [0, fullText.length], { extrapolateRight: "clamp" }));
  const typedText = fullText.slice(0, charCount);
  const isTyping = charCount < fullText.length;

  // Result card appears after typing
  const resultOp = interpolate(f, [64, 80], [0, 1], { extrapolateRight: "clamp" });
  const resultTy = interpolate(f, [64, 80], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  // Rank badge: starts at #7 then jumps to #1
  const showTop = f > 90;

  // Result item glow pulse
  const pulse = 0.8 + Math.sin((frame / 40) * Math.PI) * 0.2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 560 }}>
      {/* Search bar */}
      <div
        style={{
          opacity: barOp,
          translate: `0px ${barTy}px`,
          width: "100%",
          padding: "18px 22px",
          borderRadius: 18,
          background: "rgba(8,14,32,0.96)",
          border: `1px solid ${COL.border}`,
          boxShadow: "0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        {/* Search icon */}
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <circle cx={11} cy={11} r={7} stroke={COL.muted} strokeWidth="1.8" />
          <line x1={17} y1={17} x2={22} y2={22} stroke={COL.muted} strokeWidth="1.8" strokeLinecap="round" />
        </svg>

        {/* Typed text */}
        <div
          style={{
            fontFamily: FONT,
            fontSize: 24,
            fontWeight: 500,
            color: COL.white,
            letterSpacing: "-0.01em",
            flex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          {typedText || (
            <span style={{ color: COL.muted, opacity: 0.5 }}>Search...</span>
          )}
          {isTyping && <Cursor frame={frame} />}
        </div>

        {/* Google Maps logo placeholder */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "rgba(34,211,238,0.15)",
            border: "1px solid rgba(34,211,238,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: COL.cyan }} />
        </div>
      </div>

      {/* Result card */}
      <div
        style={{
          opacity: resultOp,
          translate: `0px ${resultTy}px`,
          width: "100%",
          padding: "20px 24px",
          borderRadius: 18,
          background: showTop ? "rgba(34,211,238,0.08)" : "rgba(8,14,32,0.92)",
          border: `1px solid ${showTop ? "rgba(34,211,238,0.35)" : COL.border}`,
          boxShadow: showTop
            ? `0 0 40px rgba(34,211,238,${0.18 * pulse}), 0 20px 48px rgba(0,0,0,0.4)`
            : "0 12px 36px rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          gap: 18,
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Rank badge */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: showTop ? COL.cyan : "rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 800,
            color: showTop ? "#04060E" : COL.muted,
            flexShrink: 0,
            boxShadow: showTop ? `0 0 24px rgba(34,211,238,0.5)` : "none",
          }}
        >
          #{showTop ? 1 : 7}
        </div>

        {/* Business info skeleton */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div
              style={{
                width: 160,
                height: 10,
                borderRadius: 4,
                background: showTop ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
              }}
            />
            {showTop && (
              <div
                style={{
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: "rgba(34,211,238,0.18)",
                  border: "1px solid rgba(34,211,238,0.4)",
                  fontFamily: FONT,
                  fontSize: 14,
                  fontWeight: 600,
                  color: COL.cyan,
                  whiteSpace: "nowrap" as const,
                }}
              >
                Top Result
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 5 }}>
            {["★", "★", "★", "★", "★"].map((s, i) => (
              <span
                key={i}
                style={{
                  fontSize: 16,
                  color: showTop ? "#F59E0B" : "rgba(255,255,255,0.15)",
                }}
              >
                {s}
              </span>
            ))}
            <span style={{ fontFamily: FONT, fontSize: 16, color: COL.muted }}>
              (124)
            </span>
          </div>
          <div
            style={{
              width: "60%",
              height: 7,
              borderRadius: 3,
              background: "rgba(255,255,255,0.14)",
            }}
          />
        </div>

        {/* Call button */}
        {showTop && (
          <div
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              background: COL.cyan,
              fontFamily: FONT,
              fontSize: 18,
              fontWeight: 700,
              color: "#04060E",
              whiteSpace: "nowrap" as const,
              flexShrink: 0,
              boxShadow: `0 0 20px rgba(34,211,238,0.4)`,
            }}
          >
            Call Now
          </div>
        )}
      </div>
    </div>
  );
};
