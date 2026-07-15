import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONT_HEADLINE = "Inter Tight";
export const FONT_BODY = "Inter";
export const FONT_MONO = "JetBrains Mono";

let _promise: Promise<unknown[]> | null = null;

export const fontsReady = (): Promise<unknown[]> => {
  if (!_promise) {
    _promise = Promise.all([
      loadFont({
        family: FONT_HEADLINE,
        url: staticFile("fonts/inter-tight-500.woff2"),
        weight: "500",
      }),
      loadFont({
        family: FONT_HEADLINE,
        url: staticFile("fonts/inter-tight-600.woff2"),
        weight: "600",
      }),
      loadFont({
        family: FONT_BODY,
        url: staticFile("fonts/inter-400.ttf"),
        weight: "400",
      }),
      loadFont({
        family: FONT_BODY,
        url: staticFile("fonts/inter-500.ttf"),
        weight: "500",
      }),
      loadFont({
        family: FONT_MONO,
        url: staticFile("fonts/jetbrains-mono-500.woff2"),
        weight: "500",
      }),
    ]);
  }
  return _promise;
};
