import React from "react";
import { Img, staticFile, continueRender, delayRender } from "remotion";
import { COLORS, FONTS } from "../constants";

/**
 * BrandLogoSlot — imports the supplied OmniFlow logo from
 * public/branding/omniflow-logo.png. Per strict scope lock: if that file is
 * absent, the reserved logo area is left blank — no substitute logo is drawn.
 */
export const BrandLogoSlot: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
}> = ({ x, y, width, height, opacity = 1 }) => {
  const [exists, setExists] = React.useState<boolean | null>(null);
  const [handle] = React.useState(() => delayRender("check-logo"));

  React.useEffect(() => {
    let alive = true;
    fetch(staticFile("branding/omniflow-logo.png"))
      .then((r) => {
        if (alive) setExists(r.ok);
      })
      .catch(() => {
        if (alive) setExists(false);
      })
      .finally(() => continueRender(handle));
    return () => {
      alive = false;
    };
  }, [handle]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      {exists && (
        <Img
          src={staticFile("branding/omniflow-logo.png")}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      )}
      {/* Absent -> reserved area stays blank (no fabricated logo). */}
    </div>
  );
};

/** Tagline — "Get Found. Look Professional. Grow Online." */
export const Tagline: React.FC<{
  x: number;
  y: number;
  width: number;
  fontSize: number;
  text: string;
  style?: React.CSSProperties;
}> = ({ x, y, width, fontSize, text, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      fontFamily: FONTS.support,
      fontWeight: 500,
      fontSize,
      letterSpacing: "0.01em",
      color: COLORS.mutedText,
      ...style,
    }}
  >
    {text}
  </div>
);
