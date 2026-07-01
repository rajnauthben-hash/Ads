import { useCurrentFrame, interpolate, Easing } from "remotion";
import { C, E } from "../constants";
import { fontFamily } from "../fonts";

export const WebsiteMockup: React.FC<{
  delay?: number;
  width?: number;
  height?: number;
}> = ({ delay = 0, width = 500, height = 340 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);

  const opacity = interpolate(f, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(f, [0, 28], [0.92, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });
  const slideY = interpolate(f, [0, 28], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...E.out),
  });

  return (
    <div
      style={{
        fontFamily,
        opacity,
        scale: scale.toString(),
        translate: `0px ${slideY}px`,
        width,
        height,
        borderRadius: 18,
        border: `1.5px solid rgba(255,255,255,0.1)`,
        overflow: "hidden",
        background: "#080F22",
        boxShadow: `0 0 60px rgba(0,100,255,0.12), 0 24px 60px rgba(0,0,0,0.6)`,
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          height: 36,
          background: "rgba(5,12,28,0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.09)" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div
          style={{
            flex: 1,
            marginLeft: 12,
            height: 20,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 6,
          }}
        />
      </div>

      {/* Page content */}
      <div style={{ padding: "28px 30px" }}>
        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: C.cyan, opacity: 0.8 }} />
            <div style={{ width: 80, height: 10, borderRadius: 3, background: "rgba(255,255,255,0.18)" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[60, 48, 56, 44].map((w, i) => (
              <div key={i} style={{ width: w, height: 8, borderRadius: 3, background: "rgba(255,255,255,0.08)" }} />
            ))}
          </div>
        </div>

        {/* Hero section */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(0,40,90,0.6) 0%, rgba(10,20,50,0.8) 100%)",
            borderRadius: 12,
            padding: "24px 26px",
            border: "1px solid rgba(0,212,255,0.12)",
            marginBottom: 20,
          }}
        >
          <div style={{ width: "70%", height: 14, borderRadius: 4, background: C.white, opacity: 0.85, marginBottom: 10 }} />
          <div style={{ width: "50%", height: 9, borderRadius: 3, background: "rgba(255,255,255,0.3)", marginBottom: 6 }} />
          <div style={{ width: "40%", height: 9, borderRadius: 3, background: "rgba(255,255,255,0.2)", marginBottom: 20 }} />
          {/* CTA button */}
          <div
            style={{
              display: "inline-flex",
              background: C.cyan,
              borderRadius: 7,
              padding: "8px 18px",
            }}
          >
            <div style={{ width: 70, height: 8, borderRadius: 2, background: "rgba(0,0,0,0.5)" }} />
          </div>
        </div>

        {/* Service cards row */}
        <div style={{ display: "flex", gap: 12 }}>
          {[C.cyanGlow, C.blueGlow, C.cyanGlow].map((bg, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                borderRadius: 8,
                background: bg,
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "12px 12px",
              }}
            >
              <div style={{ width: 20, height: 20, borderRadius: 5, background: "rgba(255,255,255,0.12)", marginBottom: 8 }} />
              <div style={{ width: "80%", height: 7, borderRadius: 2, background: "rgba(255,255,255,0.2)", marginBottom: 5 }} />
              <div style={{ width: "60%", height: 6, borderRadius: 2, background: "rgba(255,255,255,0.1)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
