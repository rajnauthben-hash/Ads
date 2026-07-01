import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Inter loaded from public/fonts/ — fully offline, no external CDN requests.
// To swap brand fonts later, replace the TTF files in public/fonts/ and update these paths.
const waitForFonts = Promise.all([
  loadFont({ family: "Inter", url: staticFile("fonts/inter-400.ttf"), weight: "400" }),
  loadFont({ family: "Inter", url: staticFile("fonts/inter-500.ttf"), weight: "500" }),
  loadFont({ family: "Inter", url: staticFile("fonts/inter-600.ttf"), weight: "600" }),
  loadFont({ family: "Inter", url: staticFile("fonts/inter-700.ttf"), weight: "700" }),
  loadFont({ family: "Inter", url: staticFile("fonts/inter-800.ttf"), weight: "800" }),
]);

export const fontFamily = "Inter";
export { waitForFonts };
