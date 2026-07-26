import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/**
 * Three typographic roles for the InvisibleShortlist ad:
 *   - Editorial headline  -> Inter Tight (variable weight, used Bold/ExtraBold)
 *   - Readable explanation -> Manrope (variable weight, Regular/Medium)
 *   - Technical interface  -> IBM Plex Sans (Regular/Medium)
 *
 * All fonts are loaded from local files in public/fonts so renders are fully
 * deterministic and never depend on network access at render time.
 */

export const FONT_HEADLINE = "Inter Tight";
export const FONT_BODY = "Manrope";
export const FONT_UI = "IBM Plex Sans";

let _promise: Promise<unknown[]> | null = null;

export function initFonts(): Promise<unknown[]> {
  if (!_promise) {
    _promise = Promise.all([
      loadFont({
        family: FONT_HEADLINE,
        url: staticFile("fonts/inter-tight-var.ttf"),
        weight: "700",
      }),
      loadFont({
        family: FONT_HEADLINE,
        url: staticFile("fonts/inter-tight-var.ttf"),
        weight: "800",
      }),
      loadFont({
        family: FONT_BODY,
        url: staticFile("fonts/manrope-var.ttf"),
        weight: "400",
      }),
      loadFont({
        family: FONT_BODY,
        url: staticFile("fonts/manrope-var.ttf"),
        weight: "500",
      }),
      loadFont({
        family: FONT_UI,
        url: staticFile("fonts/ibm-plex-sans-latin.woff2"),
        weight: "400",
      }),
      loadFont({
        family: FONT_UI,
        url: staticFile("fonts/ibm-plex-sans-latin.woff2"),
        weight: "500",
      }),
    ]);
  }
  return _promise;
}
