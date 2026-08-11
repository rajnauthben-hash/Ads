import { Easing } from "remotion";

// ---------------------------------------------------------------------------
// OmniFlow Digital — Ad 3.1 "Building on an Empty Road"
// Shared design tokens, scene boundaries and route geometry.
// The advertisement is one continuous 1080x1920 / 30fps / 600-frame world.
// ---------------------------------------------------------------------------

export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const DURATION = 600;

// Palette straight from the approved design system.
export const C = {
  bg: "#071016",
  bgDeep: "#040A0F",
  bg2: "#0B141B",

  cyan: "#29D9FF",
  cyanBright: "#78EAFF",
  cyanDim: "rgba(41, 217, 255, 0.55)",
  cyanGlow: "rgba(41, 217, 255, 0.16)",

  gold: "#F3B84B",
  goldDeep: "#D99B39",
  goldGlow: "rgba(243, 184, 75, 0.30)",

  storefront: "#EBA552",
  storefrontDeep: "#B5701F",

  headline: "#F7F8FA",
  support: "#A6ADB4",
  body: "#BEC4CA",
};

// Easing curves (as bezier tuples).
export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  outSoft: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  inOutSoft: Easing.bezier(0.5, 0, 0.2, 1),
};

// Five equal narrative scenes, 120 frames each.
export const SCENE_LEN = 120;
export const SCENES = [
  { i: 1, start: 0, end: 120 },
  { i: 2, start: 120, end: 240 },
  { i: 3, start: 240, end: 360 },
  { i: 4, start: 360, end: 480 },
  { i: 5, start: 480, end: 600 },
] as const;

// Mobile-safe copy bounds.
export const SAFE = { left: 72, right: 900, top: 150, bottom: 1680 };

// ---------------------------------------------------------------------------
// The electric-cyan search highway. A single believable winding road that
// sweeps up from the foreground street (bottom) into the distant city (top).
// Every downstream layer (pins, traffic, on-ramp) references this geometry so
// the route stays the connective thread of the whole ad.
// ---------------------------------------------------------------------------
export const MAIN_ROUTE =
  "M 700 2010 " +
  "C 892 1792 908 1600 802 1442 " +
  "C 706 1298 660 1178 742 1030 " +
  "C 818 892 892 800 818 656 " +
  "C 762 546 786 472 836 372 " +
  "C 860 322 852 286 842 246";

// The Scene-5 on-ramp: branches off the main route in the lower map and curves
// left along believable road geometry toward the storefront door.
export const ON_RAMP =
  "M 804 1458 " +
  "C 668 1528 520 1556 432 1538 " +
  "C 384 1528 352 1516 338 1504";
// Endpoint + approach direction of the on-ramp, for the arrowhead at the door.
export const ON_RAMP_END = { x: 338, y: 1504, angleDeg: 215 };

// Pin anchor points that sit alongside the route. Coordinates are in world
// (SVG viewBox) space. Each business owns a per-scene target so it can travel
// into place instead of teleporting between compositions.
export type PinKey =
  | "salon"
  | "dentist"
  | "coffee"
  | "pharmacy"
  | "plumber"
  | "cleaners"
  | "vet";

export type PinState = { x: number; y: number; o: number; rating?: boolean };

export const PIN_LABELS: Record<PinKey, string[]> = {
  salon: ["TOP RATED", "SALON"],
  dentist: ["NEARBY", "DENTIST"],
  coffee: ["BEST COFFEE", "NEAR ME"],
  pharmacy: ["OPEN NOW", "PHARMACY"],
  plumber: ["HIGHLY RATED", "PLUMBER"],
  cleaners: ["LOCAL", "CLEANERS"],
  vet: ["24/7", "VET CARE"],
};

// Per-scene pin placements (world space). Hidden pins keep their nearest
// position with opacity 0 so they slide rather than pop.
export const PIN_LAYOUTS: Record<number, Partial<Record<PinKey, PinState>>> = {
  // Scene 1 — five results distributed along the route.
  1: {
    salon: { x: 838, y: 262, o: 1 },
    dentist: { x: 846, y: 404, o: 1 },
    coffee: { x: 728, y: 590, o: 1 },
    pharmacy: { x: 812, y: 742, o: 1 },
    plumber: { x: 836, y: 898, o: 1 },
    cleaners: { x: 838, y: 262, o: 0 },
    vet: { x: 838, y: 240, o: 0 },
  },
  // Scene 2 — demand feels denser: seven pins stacked down the road.
  2: {
    vet: { x: 838, y: 186, o: 1 },
    cleaners: { x: 792, y: 296, o: 1 },
    salon: { x: 828, y: 360, o: 1 },
    dentist: { x: 762, y: 470, o: 1 },
    coffee: { x: 706, y: 588, o: 1 },
    plumber: { x: 792, y: 706, o: 1 },
    pharmacy: { x: 812, y: 968, o: 1 },
  },
  // Scene 3 — destination results with rating chips.
  3: {
    salon: { x: 838, y: 268, o: 1, rating: true },
    dentist: { x: 846, y: 430, o: 1, rating: true },
    coffee: { x: 726, y: 596, o: 1, rating: true },
    pharmacy: { x: 806, y: 772, o: 1, rating: true },
    plumber: { x: 830, y: 962, o: 1, rating: true },
    cleaners: { x: 792, y: 296, o: 0 },
    vet: { x: 838, y: 186, o: 0 },
  },
  // Scene 4 — calmer, results settle back to the base arrangement.
  4: {
    salon: { x: 838, y: 262, o: 1 },
    dentist: { x: 846, y: 404, o: 1 },
    coffee: { x: 728, y: 590, o: 1 },
    pharmacy: { x: 812, y: 742, o: 1 },
    plumber: { x: 836, y: 898, o: 1 },
    cleaners: { x: 792, y: 296, o: 0 },
    vet: { x: 838, y: 186, o: 0 },
  },
  // Scene 5 — same active road while the on-ramp is drawn.
  5: {
    salon: { x: 838, y: 262, o: 1 },
    dentist: { x: 846, y: 404, o: 1 },
    coffee: { x: 728, y: 590, o: 1 },
    pharmacy: { x: 812, y: 742, o: 1 },
    plumber: { x: 836, y: 898, o: 1 },
    cleaners: { x: 792, y: 296, o: 0 },
    vet: { x: 838, y: 186, o: 0 },
  },
};

export const ALL_PINS: PinKey[] = [
  "salon",
  "dentist",
  "coffee",
  "pharmacy",
  "plumber",
  "cleaners",
  "vet",
];
