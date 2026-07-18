import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { initAdFonts } from "../../omniflowad/fonts";

// Inter Tight (headlines) is shared with the 32s ad; Manrope and
// IBM Plex Sans are specific to this spec. All local files — no network.
let _promise: Promise<unknown> | null = null;

export function initLvFonts(): Promise<unknown> {
  if (!_promise) {
    _promise = Promise.all([
      initAdFonts(),
      loadFont({ family: "Manrope", url: staticFile("fonts/manrope-400.ttf"), weight: "400" }),
      loadFont({ family: "Manrope", url: staticFile("fonts/manrope-500.ttf"), weight: "500" }),
      loadFont({ family: "Manrope", url: staticFile("fonts/manrope-600.ttf"), weight: "600" }),
      loadFont({ family: "IBM Plex Sans", url: staticFile("fonts/ibm-plex-sans-500.ttf"), weight: "500" }),
    ]);
  }
  return _promise;
}
