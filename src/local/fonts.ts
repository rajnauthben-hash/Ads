import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FONTS } from "./theme";

let _promise: Promise<unknown[]> | null = null;

// Lazily load every weight the ad uses. Resolves once and caches, so no
// dangling delayRender() handles when other compositions render.
export function initLocalFonts(): Promise<unknown[]> {
  if (!_promise) {
    _promise = Promise.all([
      // Inter Tight variable covers the 800–900 headline range.
      loadFont({
        family: FONTS.head,
        url: staticFile("fonts/inter-tight-var.ttf"),
        weight: "100 900",
      }),
      loadFont({ family: FONTS.body, url: staticFile("fonts/ibm-plex-sans-400.ttf"), weight: "400" }),
      loadFont({ family: FONTS.body, url: staticFile("fonts/ibm-plex-sans-500.ttf"), weight: "500" }),
      loadFont({ family: FONTS.body, url: staticFile("fonts/ibm-plex-sans-600.ttf"), weight: "600" }),
    ]);
  }
  return _promise;
}
