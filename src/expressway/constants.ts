import { Easing } from "remotion";

// ---------------------------------------------------------------------------
// OmniFlow Digital — Ad 3.2 "The Local Search Expressway"
// One continuous 1080x1920 / 30fps / 600-frame night-city world. The customer
// search-route is the visual spine; Crown Hardware is the persistent business.
// ---------------------------------------------------------------------------

export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const DURATION = 600;

export const C = {
  bg: "#060C13",
  bgDeep: "#03070C",
  bg2: "#0A121C",
  navy: "#0C1A2A",

  // Active customer-search route.
  cyan: "#2FC6FF",
  cyanBright: "#8FEBFF",
  cyanCore: "#EAFBFF",
  cyanDim: "rgba(47,198,255,0.5)",
  cyanGlow: "rgba(47,198,255,0.16)",

  // Dead / broken Crown route.
  gray: "#8A929A",
  grayDim: "rgba(150,160,170,0.42)",

  gold: "#F3B84B",
  goldDeep: "#D99B39",
  goldGlow: "rgba(243,184,75,0.30)",

  warm: "#EBA552",
  warmLight: "#F6C778",
  warmDeep: "#B5701F",

  headline: "#F7F8FA",
  support: "#A6ADB4",
  body: "#BEC4CA",

  warn: "#FF5A3C",
};

export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  outSoft: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.5, 0, 0.2, 1),
};

export const SCENE_LEN = 120;
export const SAFE = { left: 60, right: 930, top: 120, bottom: 1690 };

// Return the active scene (1..5) and a boundary blend factor t in [0,1] used to
// interpolate persistent objects into their next-scene state.
export function sceneBlend(frame: number): { scene: number; next: number; t: number } {
  const raw = frame / SCENE_LEN;
  const scene = Math.min(5, Math.floor(raw) + 1);
  const start = (scene - 1) * SCENE_LEN;
  const local = frame - start;
  const t = Math.max(0, Math.min(1, local / 34));
  return { scene, next: Math.min(5, scene + 1 > 5 ? 5 : scene), t };
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Staged transforms for a persistent object across the five scenes. Any scene
// may omit fields; the nearest defined value is carried. Interpolated over a
// 34-frame window at each scene start so objects glide rather than teleport.
export type Xf = { x: number; y: number; s: number; o: number };

export function stageAt(states: Record<number, Xf>, frame: number): Xf {
  const scene = Math.min(5, Math.floor(frame / SCENE_LEN) + 1);
  const cur = states[scene];
  if (scene === 1) return cur;
  const prev = states[scene - 1];
  const start = (scene - 1) * SCENE_LEN;
  const tt = Math.max(0, Math.min(1, (frame - start) / 34));
  const e = E.inOut(tt);
  return {
    x: lerp(prev.x, cur.x, e),
    y: lerp(prev.y, cur.y, e),
    s: lerp(prev.s, cur.s, e),
    o: lerp(prev.o, cur.o, e),
  };
}
