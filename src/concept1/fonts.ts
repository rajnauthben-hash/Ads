import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

let _p: Promise<unknown[]> | null = null;

export function initFonts(): Promise<unknown[]> {
  if (!_p) {
    _p = Promise.all([
      loadFont({ family: "Anton", url: staticFile("fonts/anton.ttf"), weight: "400" }),
      loadFont({ family: "Inter", url: staticFile("fonts/inter-400.ttf"), weight: "400" }),
      loadFont({ family: "Inter", url: staticFile("fonts/inter-500.ttf"), weight: "500" }),
      loadFont({ family: "Inter", url: staticFile("fonts/inter-600.ttf"), weight: "600" }),
      loadFont({ family: "Inter", url: staticFile("fonts/inter-700.ttf"), weight: "700" }),
    ]);
  }
  return _p;
}
