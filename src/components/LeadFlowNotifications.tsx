import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COL, FONT, EO } from "../lib/constants";

interface NotifProps {
  delay: number;
  type: "inquiry" | "call" | "direction";
  title: string;
  sub: string;
  time: string;
}

const ICONS = {
  inquiry:   { path: "M4 4h16v12H4zM4 4l8 8 8-8", color: COL.cyan   },
  call:      { path: "M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z", color: COL.teal  },
  direction: { path: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", color: COL.blue  },
};

const NotifCard: React.FC<NotifProps> = ({ delay, type, title, sub, time }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const op = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const tx = interpolate(f, [0, 24], [60, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });
  const sc = interpolate(f, [0, 24], [0.95, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  const icon = ICONS[type];
  const dotPulse = interpolate(Math.sin((frame / 25) * Math.PI), [-1, 1], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity: op,
        translate: `${tx}px 0px`,
        scale: sc.toString(),
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "22px 24px",
        borderRadius: 22,
        background: "rgba(10,16,34,0.92)",
        border: `1px solid rgba(255,255,255,0.1)`,
        boxShadow: [
          `0 0 40px ${icon.color}22`,
          `0 20px 48px rgba(0,0,0,0.55)`,
          `inset 0 1px 0 rgba(255,255,255,0.07)`,
        ].join(", "),
        backdropFilter: "blur(24px)",
        width: 500,
        marginBottom: 14,
      }}
    >
      {/* Icon container */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: `${icon.color}18`,
          border: `1px solid ${icon.color}35`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={icon.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={icon.path} />
        </svg>
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 24,
            fontWeight: 700,
            color: COL.white,
            letterSpacing: "-0.015em",
            marginBottom: 5,
            whiteSpace: "nowrap" as const,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 18,
            fontWeight: 400,
            color: COL.muted,
            letterSpacing: "-0.01em",
          }}
        >
          {sub}
        </div>
      </div>

      {/* Right side: live dot + time */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: icon.color,
            boxShadow: `0 0 12px ${icon.color}`,
            opacity: dotPulse,
          }}
        />
        <div
          style={{
            fontFamily: FONT,
            fontSize: 16,
            fontWeight: 500,
            color: COL.muted,
            whiteSpace: "nowrap" as const,
          }}
        >
          {time}
        </div>
      </div>
    </div>
  );
};

export const LeadFlowNotifications: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  return (
    <div>
      <NotifCard
        delay={delay}
        type="inquiry"
        title="New website inquiry"
        sub="Contact form · omniflowdigital.com.au"
        time="Just now"
      />
      <NotifCard
        delay={delay + 18}
        type="call"
        title="Call request"
        sub="Sarah M. · Clicked your profile"
        time="2 min ago"
      />
      <NotifCard
        delay={delay + 36}
        type="direction"
        title="Direction request"
        sub="Nearby customer · Google Maps"
        time="5 min ago"
      />
    </div>
  );
};
