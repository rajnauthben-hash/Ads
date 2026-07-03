import { useCurrentFrame, interpolate, Easing } from "remotion";
import { T, FONT, EO } from "../theme";

// Ghost wireframe website — a business site that exists but is barely there.
export const HologramPanel: React.FC<{
  delay?: number;
  width?: number;
  ghost?: number; // 0..1 how faded/broken (1 = fully ghosted)
}> = ({ delay = 0, width = 700, ghost = 1 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const op = interpolate(f, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  // Irregular flicker — two incommensurate sines + occasional dropout
  const flicker =
    0.9 +
    Math.sin(frame * 0.31) * 0.07 +
    Math.sin(frame * 0.117) * 0.06 -
    (frame % 67 < 2 ? 0.25 : 0);

  // Glitch jitter burst every ~53 frames
  const jitter = frame % 53 === 0 ? 4 : frame % 53 === 1 ? -3 : 0;
  const rgbSplit = frame % 53 <= 1 ? 3 : 0;

  const h = Math.round(width * 0.68);
  const bone = (o: number) => `rgba(168,212,240,${Math.min(1, o * 1.35) * flicker})`;

  return (
    <div
      style={{
        position: "relative",
        width,
        height: h,
        opacity: op * (1 - ghost * 0.1),
        translate: `${jitter}px 0px`,
        filter: `drop-shadow(0 0 24px rgba(34,211,238,${0.14 * flicker}))`,
      }}
    >
      {/* RGB split echo */}
      {rgbSplit > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: `1px solid rgba(255,80,120,0.25)`,
            borderRadius: 18,
            translate: `${rgbSplit}px 0px`,
          }}
        />
      )}

      {/* Frame */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,
          border: `1px solid rgba(120,210,255,${0.5 * flicker})`,
          background: "rgba(10,20,40,0.5)",
          overflow: "hidden",
          backdropFilter: "blur(3px)",
        }}
      >
        {/* Chrome */}
        <div
          style={{
            height: 40,
            borderBottom: `1px solid rgba(120,210,255,${0.2 * flicker})`,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: 6,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", border: `1px solid ${bone(0.4)}` }} />
          ))}
          <div
            style={{
              flex: 1,
              marginLeft: 10,
              height: 20,
              borderRadius: 5,
              border: `1px solid rgba(120,210,255,${0.18 * flicker})`,
              display: "flex",
              alignItems: "center",
              paddingLeft: 8,
              fontFamily: FONT,
              fontSize: 13,
              color: bone(0.5),
              letterSpacing: "0.02em",
            }}
          >
            http://www.yourbusiness.com
          </div>
        </div>

        {/* Nav — real labels, ghost styled */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px" }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: bone(0.62),
            }}
          >
            YOUR BUSINESS
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {["HOME", "ABOUT", "SERVICES", "CONTACT"].map((n) => (
              <div
                key={n}
                style={{
                  fontFamily: FONT,
                  fontSize: 11.5,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                  color: bone(0.42),
                }}
              >
                {n}
              </div>
            ))}
          </div>
        </div>

        {/* Hero skeleton — image block broken (X placeholder) */}
        <div style={{ padding: "6px 20px" }}>
          <div
            style={{
              height: h * 0.3,
              borderRadius: 10,
              border: `1px dashed rgba(120,210,255,${0.28 * flicker})`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
              <line x1="0" y1="0" x2="100%" y2="100%" stroke={bone(0.22)} strokeWidth="1" />
              <line x1="100%" y1="0" x2="0" y2="100%" stroke={bone(0.22)} strokeWidth="1" />
            </svg>
          </div>
          <div style={{ width: "62%", height: 11, borderRadius: 3, background: bone(0.45), marginTop: 14 }} />
          <div style={{ width: "44%", height: 8, borderRadius: 3, background: bone(0.3), marginTop: 8 }} />
          <div
            style={{
              marginTop: 14,
              width: 120,
              height: 30,
              borderRadius: 7,
              border: `1px solid rgba(120,210,255,${0.35 * flicker})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT,
              fontSize: 12,
              color: bone(0.5),
              letterSpacing: "0.06em",
            }}
          >
            CONTACT
          </div>
        </div>

        {/* Crack lines */}
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <path d={`M ${width * 0.72} 0 L ${width * 0.62} ${h * 0.3} L ${width * 0.7} ${h * 0.52}`}
            stroke={`rgba(160,225,255,${0.2 * flicker})`} strokeWidth="1" fill="none" />
          <path d={`M ${width * 0.18} ${h} L ${width * 0.26} ${h * 0.72} L ${width * 0.2} ${h * 0.6}`}
            stroke={`rgba(160,225,255,${0.14 * flicker})`} strokeWidth="1" fill="none" />
        </svg>

        {/* Scan line drifting down */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${((frame * 1.1) % (h + 60)) - 30}px`,
            height: 26,
            background: `linear-gradient(180deg, transparent, rgba(120,210,255,${0.06 * flicker}), transparent)`,
          }}
        />
      </div>
    </div>
  );
};

// The failing Maps listing card.
export const GhostMapCard: React.FC<{ delay?: number; width?: number }> = ({
  delay = 0,
  width = 330,
}) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 26], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const flicker = 0.8 + Math.sin(frame * 0.23 + 2) * 0.12;
  const warnPulse = 0.6 + Math.sin(frame * 0.12) * 0.4;

  return (
    <div
      style={{
        width,
        opacity: op * flicker,
        borderRadius: 16,
        border: "1px solid rgba(120,210,255,0.3)",
        background: "rgba(8,16,34,0.6)",
        backdropFilter: "blur(6px)",
        padding: "18px 20px",
        fontFamily: FONT,
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        {/* Dim pin */}
        <svg width={26} height={30} viewBox="0 0 24 28">
          <path
            d="M12 1 C6 1 2 5.5 2 10.5 C2 17 12 27 12 27 C12 27 22 17 22 10.5 C22 5.5 18 1 12 1 Z"
            fill="rgba(150,200,235,0.4)"
          />
          <circle cx={12} cy={10.5} r={3.6} fill={T.bg} />
        </svg>
        <div style={{ fontSize: 21, fontWeight: 700, color: "rgba(226,240,255,0.85)" }}>Your Business</div>
      </div>
      <div style={{ fontSize: 16.5, color: T.muted, marginBottom: 5 }}>Address not found</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 16.5, color: T.muted }}>Outdated listing</div>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            border: `1.5px solid rgba(245,180,60,${0.7 * warnPulse})`,
            color: `rgba(245,180,60,${0.9 * warnPulse})`,
            fontSize: 14,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          !
        </div>
      </div>
    </div>
  );
};
