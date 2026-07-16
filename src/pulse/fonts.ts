import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FONTS } from "./theme";

let _promise: Promise<unknown[]> | null = null;

export function initPulseFonts(): Promise<unknown[]> {
  if (!_promise) {
    _promise = Promise.all([
      // Variable font covers the 500–600 headline range.
      loadFont({
        family: FONTS.headline,
        url: staticFile("fonts/inter-tight-var.ttf"),
        weight: "100 900",
      }),
      loadFont({
        family: FONTS.body,
        url: staticFile("fonts/inter-400.ttf"),
        weight: "400",
      }),
      loadFont({
        family: FONTS.body,
        url: staticFile("fonts/inter-500.ttf"),
        weight: "500",
      }),
      loadFont({
        family: FONTS.mono,
        url: staticFile("fonts/ibm-plex-mono-500.ttf"),
        weight: "500",
      }),
    ]);
  }
  return _promise;
}
