import { useCurrentFrame, interpolate, Easing } from "remotion";
import { C, E } from "../constants";
import { fontFamily } from "../fonts";

export const AnalyticsCard: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const opacity = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Animate the line drawing progress
  const lineProgress = interpolate(f, [10, 50], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });

  // Chart points (normalized 0–1, y is inverted: higher = visually higher)
  const points: [number, number][] = [
    [0, 0.55],
    [0.18, 0.45],
    [0.35, 0.6],
    [0.52, 0.38],
    [0.68, 0.25],
    [0.82, 0.15],
    [1, 0.05],
  ];

  const W = 200;
  const H = 70;

  // Build SVG path up to lineProgress
  const getVisiblePoints = () => {
    const result: [number, number][] = [];
    for (let i = 0; i < points.length; i++) {
      const t = points[i][0];
      if (t <= lineProgress) {
        result.push(points[i]);
      } else if (i > 0) {
        // Interpolate partial segment
        const prev = points[i - 1];
        const segProgress = (lineProgress - prev[0]) / (t - prev[0]);
        result.push([
          lineProgress,
          prev[1] + (points[i][1] - prev[1]) * segProgress,
        ]);
        break;
      }
    }
    return result;
  };

  const visible = getVisiblePoints();
  const svgPath = visible
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0] * W} ${p[1] * H}`)
    .join(" ");

  // Area fill path
  const areaPath =
    visible.length > 0
      ? `${svgPath} L ${visible[visible.length - 1][0] * W} ${H} L 0 ${H} Z`
      : "";

  return (
    <div
      style={{
        fontFamily,
        opacity,
        background: C.cardBg,
        border: `1px solid ${C.cardBorder}`,
        borderRadius: 20,
        padding: "22px 24px",
        width: 260,
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ color: C.textSub, fontSize: 18, fontWeight: 500, marginBottom: 12 }}>
        Online growth
      </div>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ overflow: "visible", display: "block" }}
      >
        {areaPath && (
          <path
            d={areaPath}
            fill="url(#analytics-grad)"
          />
        )}
        {svgPath && (
          <path
            d={svgPath}
            fill="none"
            stroke={C.cyan}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        <defs>
          <linearGradient id="analytics-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.cyan} stopOpacity={0.18} />
            <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ color: C.cyan, fontSize: 22, fontWeight: 700, marginTop: 10 }}>
        Trending upward
      </div>
    </div>
  );
};
