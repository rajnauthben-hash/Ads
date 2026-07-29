import React from "react";

// Native (CSS/SVG) recreation of the shared Crown Hardware storefront.
// Dark charcoal façade, wide amber sign band reading CROWN HARDWARE, three
// warm-lit window/door bays, evening presentation. Same geometry everywhere.
export const CrownHardwareStorefront: React.FC<{
  width: number;
  height: number;
  radius?: number;
  showSign?: boolean;
  signText?: string;
}> = ({ width, height, radius = 8, showSign = true, signText = "CROWN HARDWARE" }) => {
  const signH = height * 0.26;
  const bayTop = signH + height * 0.04;
  const bayH = height - bayTop - height * 0.06;
  const bayGap = width * 0.03;
  const bayW = (width - bayGap * 4) / 3;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(#1a1512, #0d0b09)",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.6)",
      }}
    >
      {/* sign band */}
      {showSign && (
        <div
          style={{
            position: "absolute",
            top: height * 0.02,
            left: width * 0.04,
            right: width * 0.04,
            height: signH,
            background: "linear-gradient(#24160b, #160d06)",
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 1px 2px rgba(0,0,0,0.6)",
          }}
        >
          <span
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontWeight: 700,
              fontSize: Math.min(signH * 0.5, width / 9.5),
              letterSpacing: "0.02em",
              color: "#E8A64C",
              textShadow: "0 0 8px rgba(232,166,76,0.55)",
              whiteSpace: "nowrap",
            }}
          >
            {signText}
          </span>
        </div>
      )}
      {/* three warm-lit bays */}
      <div
        style={{
          position: "absolute",
          top: bayTop,
          left: bayGap,
          display: "flex",
          gap: bayGap,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: bayW,
              height: bayH,
              background:
                "linear-gradient(180deg, rgba(240,180,90,0.9), rgba(190,120,45,0.75) 60%, rgba(120,70,25,0.6))",
              border: "1.5px solid #000",
              borderRadius: 2,
              boxShadow: "0 0 12px rgba(230,160,70,0.35), inset 0 0 10px rgba(255,210,140,0.4)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* mullion */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: 1.5,
                background: "rgba(0,0,0,0.55)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "42%",
                height: 1.5,
                background: "rgba(0,0,0,0.4)",
              }}
            />
          </div>
        ))}
      </div>
      {/* warm glow floor reflection */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: height * 0.06,
          background: "linear-gradient(rgba(180,110,40,0.25), transparent)",
        }}
      />
    </div>
  );
};
