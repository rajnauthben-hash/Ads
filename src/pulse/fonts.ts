import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Lazy singleton: fonts are loaded once per tab, on demand, so other
// compositions in this project don't pay the cost (same pattern as
// omniflow/fonts.ts).
let promise: Promise<unknown[]> | null = null;

export function initPulseFonts(): Promise<unknown[]> {
  if (!promise) {
    promise = Promise.all([
      // Inter Tight is a variable font — register the full weight range.
      loadFont({
        family: "Inter Tight",
        url: staticFile("fonts/inter-tight-var.ttf"),
        weight: "100 900",
      }),
      loadFont({ family: "Inter", url: staticFile("fonts/inter-400.ttf"), weight: "400" }),
      loadFont({ family: "Inter", url: staticFile("fonts/inter-500.ttf"), weight: "500" }),
      loadFont({
        family: "IBM Plex Mono",
        url: staticFile("fonts/ibm-plex-mono-500.ttf"),
        weight: "500",
      }),
    ]);
  }
  return promise;
}
