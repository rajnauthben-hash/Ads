// Font loaders. Uses @remotion/google-fonts so the exact families load
// deterministically at render time. Lazy-initialised to avoid dangling
// delayRender handles when unrelated compositions render.
import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadIBMPlex } from "@remotion/google-fonts/IBMPlexSans";

export const fontFamilies = {
  interTight: "Inter Tight",
  geist: "Geist",
  ibmPlex: "IBM Plex Sans",
} as const;

let initialised = false;

export function initAdFonts() {
  if (initialised) return;
  initialised = true;
  loadInterTight("normal", {
    weights: ["500", "600", "700", "800"],
    subsets: ["latin"],
  });
  loadGeist("normal", {
    weights: ["400", "500", "600"],
    subsets: ["latin"],
  });
  loadIBMPlex("normal", {
    weights: ["400", "500", "600"],
    subsets: ["latin"],
  });
}
