// Typography tokens. Three families as locked by the spec:
//  - Editorial headline: Inter Tight
//  - Body / supporting copy: Geist
//  - Technical UI / microcopy: IBM Plex Sans
import { fontFamilies } from "./fonts";

export const FONTS = {
  headline: fontFamilies.interTight,
  body: fontFamilies.geist,
  ui: fontFamilies.ibmPlex,
} as const;

// Headline treatment locks
export const headlineStyle = (size: number, weight = 800) =>
  ({
    fontFamily: FONTS.headline,
    fontWeight: weight,
    fontSize: size,
    color: "#F4F6F8",
    lineHeight: 0.98,
    letterSpacing: "-0.025em",
    margin: 0,
    whiteSpace: "pre-line" as const,
  }) as const;

export const bodyStyle = (size: number, color = "#A4ABB3", lineHeight = 1.38) =>
  ({
    fontFamily: FONTS.body,
    fontWeight: 450,
    fontSize: size,
    color,
    lineHeight,
    margin: 0,
    whiteSpace: "pre-line" as const,
  }) as const;

export const uiStyle = (size: number, color = "#C8CDD2", weight = 500) =>
  ({
    fontFamily: FONTS.ui,
    fontWeight: weight,
    fontSize: size,
    color,
    lineHeight: 1.22,
    margin: 0,
  }) as const;
