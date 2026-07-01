import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontFamily = "Inter";

// Lazy — only loads when initInterFonts() is called (inside OmniFlowPremiumAd).
// This prevents dangling delayRender() handles when other compositions render.
let _promise: Promise<unknown[]> | null = null;

export function initInterFonts(): Promise<unknown[]> {
  if (!_promise) {
    _promise = Promise.all([
      loadFont({ family: "Inter", url: staticFile("fonts/inter-400.ttf"), weight: "400" }),
      loadFont({ family: "Inter", url: staticFile("fonts/inter-500.ttf"), weight: "500" }),
      loadFont({ family: "Inter", url: staticFile("fonts/inter-600.ttf"), weight: "600" }),
      loadFont({ family: "Inter", url: staticFile("fonts/inter-700.ttf"), weight: "700" }),
      loadFont({ family: "Inter", url: staticFile("fonts/inter-800.ttf"), weight: "800" }),
    ]);
  }
  return _promise;
}
