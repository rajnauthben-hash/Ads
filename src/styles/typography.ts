import { CSSProperties } from "react";
import { FONT_BODY, FONT_HEADLINE, FONT_UI } from "./fonts";
import { COLORS } from "./tokens";

/**
 * Three clear typographic roles. Sizes are tuned for comfortable mobile
 * readability at 1080x1920 (9:16). Never shrink below these to solve layout.
 */

export const headline = (size = 62): CSSProperties => ({
  fontFamily: FONT_HEADLINE,
  fontWeight: 800,
  fontSize: size,
  lineHeight: 1.02,
  letterSpacing: "-0.02em",
  color: COLORS.white,
  margin: 0,
});

export const headlineMd = (size = 50): CSSProperties => ({
  fontFamily: FONT_HEADLINE,
  fontWeight: 700,
  fontSize: size,
  lineHeight: 1.06,
  letterSpacing: "-0.015em",
  color: COLORS.white,
  margin: 0,
});

export const body = (size = 30): CSSProperties => ({
  fontFamily: FONT_BODY,
  fontWeight: 400,
  fontSize: size,
  lineHeight: 1.32,
  letterSpacing: "0em",
  color: COLORS.grey,
  margin: 0,
});

export const bodyStrong = (size = 30): CSSProperties => ({
  fontFamily: FONT_BODY,
  fontWeight: 500,
  fontSize: size,
  lineHeight: 1.3,
  color: COLORS.white,
  margin: 0,
});

export const ui = (size = 22): CSSProperties => ({
  fontFamily: FONT_UI,
  fontWeight: 400,
  fontSize: size,
  lineHeight: 1.25,
  letterSpacing: "0em",
  color: COLORS.white,
  margin: 0,
});

export const uiMedium = (size = 22): CSSProperties => ({
  fontFamily: FONT_UI,
  fontWeight: 500,
  fontSize: size,
  lineHeight: 1.25,
  color: COLORS.white,
  margin: 0,
});

export const uiLabel = (size = 18): CSSProperties => ({
  fontFamily: FONT_UI,
  fontWeight: 500,
  fontSize: size,
  lineHeight: 1.2,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: COLORS.grey,
  margin: 0,
});
