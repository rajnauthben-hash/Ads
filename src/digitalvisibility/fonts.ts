import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// All three families are bundled locally so renders never touch the network.
let _promise: Promise<unknown> | null = null;

export function initDvFonts(): Promise<unknown> {
  if (!_promise) {
    _promise = Promise.all([
      loadFont({ family: "Inter Tight", url: staticFile("fonts/inter-tight-700.ttf"), weight: "700" }),
      loadFont({ family: "Inter Tight", url: staticFile("fonts/inter-tight-800.ttf"), weight: "800" }),
      loadFont({ family: "Manrope", url: staticFile("fonts/manrope-400.ttf"), weight: "400" }),
      loadFont({ family: "Manrope", url: staticFile("fonts/manrope-500.ttf"), weight: "500" }),
      loadFont({ family: "Manrope", url: staticFile("fonts/manrope-600.ttf"), weight: "600" }),
      loadFont({ family: "IBM Plex Sans", url: staticFile("fonts/ibm-plex-sans-400.ttf"), weight: "400" }),
      loadFont({ family: "IBM Plex Sans", url: staticFile("fonts/ibm-plex-sans-500.ttf"), weight: "500" }),
      loadFont({ family: "IBM Plex Sans", url: staticFile("fonts/ibm-plex-sans-600.ttf"), weight: "600" }),
    ]);
  }
  return _promise;
}
