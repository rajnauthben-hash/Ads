import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Inter Tight matches the narrow editorial grotesk of the reference keyframes.
// Loaded lazily (same pattern as src/omniflow/fonts.ts) so other compositions
// don't pay the delayRender cost.
let _promise: Promise<unknown[]> | null = null;

export function initAdFonts(): Promise<unknown[]> {
  if (!_promise) {
    _promise = Promise.all(
      ["400", "500", "600", "700", "800"].map((weight) =>
        loadFont({
          family: "Inter Tight",
          url: staticFile(`fonts/inter-tight-${weight}.ttf`),
          weight,
        }),
      ),
    );
  }
  return _promise;
}
