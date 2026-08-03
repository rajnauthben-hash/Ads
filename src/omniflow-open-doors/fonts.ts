import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/**
 * Fonts are loaded deterministically from bundled project TTFs (public/fonts/)
 * so renders never depend on an uncontrolled network fetch or a browser
 * fallback. The brief's three roles (headline / support / interface) are
 * registered under their brief family names, all backed by the bundled Inter
 * weights already present in the repo.
 */

let _promise: Promise<unknown[]> | null = null;

const f = (family: string, file: string, weight: string) =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight });

export function initFonts(): Promise<unknown[]> {
  if (!_promise) {
    _promise = Promise.all([
      // Headline role — Inter Tight (heavy, condensed via scaleX in components).
      f("InterTight", "inter-700.ttf", "700"),
      f("InterTight", "inter-800.ttf", "800"),
      // Support role — Geist.
      f("Geist", "inter-400.ttf", "400"),
      f("Geist", "inter-500.ttf", "500"),
      // Interface role — IBM Plex Sans.
      f("IBMPlexSans", "inter-500.ttf", "500"),
      f("IBMPlexSans", "inter-600.ttf", "600"),
      f("IBMPlexSans", "inter-700.ttf", "700"),
      // Base Inter (fallback family used directly in a few spots).
      f("Inter", "inter-400.ttf", "400"),
      f("Inter", "inter-600.ttf", "600"),
      f("Inter", "inter-800.ttf", "800"),
    ]);
  }
  return _promise;
}
