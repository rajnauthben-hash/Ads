import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COL, EO, SAFE } from "../lib/constants";
import { SearchSystem } from "../components/SearchSystem";
import { LeadFlowNotifications } from "../components/LeadFlowNotifications";
import { SceneWrapper, LineReveal, FadeUp, TStyle } from "../components/TextReveal";

const TOTAL = 120;

// Abstract map dots as atmospheric background
const MapBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const W = 1080;
  const H = 1920;

  return (
    <AbsoluteFill style={{ opacity: op * 0.18, pointerEvents: "none" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* Dot grid */}
        {Array.from({ length: 18 }).map((_, row) =>
          Array.from({ length: 10 }).map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={col * (W / 9) + 40}
              cy={row * (H / 17) + 40}
              r={2}
              fill={COL.cyan}
              opacity="0.4"
            />
          ))
        )}
        {/* Soft route lines */}
        <path
          d={`M ${W * 0.15} ${H * 0.3} Q ${W * 0.4} ${H * 0.25} ${W * 0.7} ${H * 0.35}`}
          stroke={COL.blue}
          strokeWidth="1.2"
          opacity="0.6"
          fill="none"
        />
        <path
          d={`M ${W * 0.1} ${H * 0.55} Q ${W * 0.45} ${H * 0.5} ${W * 0.85} ${H * 0.6}`}
          stroke={COL.teal}
          strokeWidth="1"
          opacity="0.5"
          fill="none"
        />
        <path
          d={`M ${W * 0.3} ${H * 0.72} Q ${W * 0.5} ${H * 0.68} ${W * 0.75} ${H * 0.75}`}
          stroke={COL.cyan}
          strokeWidth="1"
          opacity="0.4"
          fill="none"
        />
        {/* Coverage ellipses */}
        <ellipse cx={W * 0.5} cy={H * 0.45} rx={W * 0.35} ry={H * 0.18} fill={COL.cyan} opacity="0.04" />
        <ellipse cx={W * 0.5} cy={H * 0.45} rx={W * 0.22} ry={H * 0.11} fill={COL.cyan} opacity="0.06" />
        <ellipse cx={W * 0.5} cy={H * 0.45} rx={W * 0.1}  ry={H * 0.05} fill={COL.cyan} opacity="0.08" />
      </svg>
    </AbsoluteFill>
  );
};

// Notification activity cards for growth — incoming leads
const ActivityFeed: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const op = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const tx = interpolate(f, [0, 22], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  return (
    <div
      style={{
        opacity: op,
        translate: `${tx}px 0px`,
      }}
    >
      <LeadFlowNotifications delay={delay} />
    </div>
  );
};

export const V2S4Growth: React.FC = () => {
  const frame = useCurrentFrame();

  const ambientGlow = interpolate(frame, [20, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneWrapper totalFrames={TOTAL} fadeIn={12} fadeOut={12}>
      <AbsoluteFill>

        {/* Atmospheric map background */}
        <MapBackground />

        {/* Cyan ambient glow */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 65% 50% at 50% 44%, rgba(34,211,238,${ambientGlow * 0.08}) 0%, transparent 65%)`,
            pointerEvents: "none",
          }}
        />

        {/* Search system — upper center */}
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: SAFE.top + 60,
          }}
        >
          <SearchSystem delay={8} />
        </AbsoluteFill>

        {/* Activity notifications — mid center */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 200,
            paddingBottom: SAFE.bottom + 240,
          }}
        >
          <ActivityFeed delay={50} />
        </AbsoluteFill>

        {/* Text — lower third */}
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: `0 ${SAFE.h}px ${SAFE.bottom + 20}px`,
          }}
        >
          <FadeUp delay={78} dur={18} style={{ marginBottom: 10 }}>
            <div style={{ ...TStyle.label }}>Real results</div>
          </FadeUp>
          <LineReveal delay={86} dur={22}>
            <div style={{ ...TStyle.hook }}>More clicks.</div>
          </LineReveal>
          <LineReveal delay={94} dur={22} style={{ marginTop: 4 }}>
            <div style={{ ...TStyle.hook }}>More calls.</div>
          </LineReveal>
          <LineReveal delay={102} dur={22} style={{ marginTop: 4 }}>
            <div
              style={{
                ...TStyle.hook,
                background: `linear-gradient(90deg, ${COL.cyan} 0%, ${COL.teal} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              More customers.
            </div>
          </LineReveal>
        </AbsoluteFill>

      </AbsoluteFill>
    </SceneWrapper>
  );
};
