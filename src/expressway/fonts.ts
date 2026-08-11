import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Lazy loader — mirrors the pattern used by OmniFlowPremiumAd so that font
// delayRender() handles are only created while THIS composition renders.
let _promise: Promise<unknown[]> | null = null;

export function initFonts(): Promise<unknown[]> {
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
