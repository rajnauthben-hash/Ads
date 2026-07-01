import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FONT } from "./config";

let _promise: Promise<unknown[]> | null = null;

export function initSpaceGrotesk(): Promise<unknown[]> {
  if (!_promise) {
    _promise = Promise.all([
      loadFont({ family: FONT, url: staticFile("fonts/space-grotesk-500.ttf"), weight: "500" }),
      loadFont({ family: FONT, url: staticFile("fonts/space-grotesk-600.ttf"), weight: "600" }),
      loadFont({ family: FONT, url: staticFile("fonts/space-grotesk-700.ttf"), weight: "700" }),
    ]);
  }
  return _promise;
}
