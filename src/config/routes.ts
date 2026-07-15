import type { Pt } from "../components/pathMath";

export const STORE_POS: Pt = { x: 230, y: 1300 };

/**
 * The persistent cyan "spine" route — one waypoint list per scene describing
 * the shape of the single continuous route as it passes through that scene.
 * RouteSystem crossfades between the outgoing and incoming shapes at cut points,
 * giving the whole film one continuous, drifting artery rather than ten
 * disconnected diagrams.
 */
export const SPINE_PATHS: Record<number, Pt[]> = {
  1: [
    { x: 230, y: 1300 },
    { x: 430, y: 1360 },
    { x: 590, y: 1190 },
    { x: 630, y: 980 },
    { x: 700, y: 830 },
    { x: 760, y: 900 },
    { x: 830, y: 1150 },
    { x: 870, y: 1420 },
  ],
  2: [
    { x: 60, y: 1480 },
    { x: 280, y: 1400 },
    { x: 480, y: 1260 },
    { x: 620, y: 1160 },
    { x: 780, y: 1040 },
    { x: 930, y: 970 },
  ],
  3: [
    { x: 230, y: 1300 },
    { x: 360, y: 1220 },
    { x: 460, y: 1080 },
    { x: 560, y: 990 },
    { x: 700, y: 950 },
    { x: 850, y: 950 },
  ],
  4: [
    { x: 230, y: 1300 },
    { x: 460, y: 1260 },
    { x: 560, y: 1010 },
    { x: 640, y: 850 },
    { x: 720, y: 830 },
    { x: 790, y: 950 },
    { x: 870, y: 1420 },
  ],
  5: [
    { x: 230, y: 1300 },
    { x: 300, y: 1480 },
    { x: 400, y: 1630 },
    { x: 500, y: 1730 },
  ],
  6: [
    { x: 40, y: 1620 },
    { x: 260, y: 1500 },
    { x: 480, y: 1350 },
    { x: 660, y: 1150 },
    { x: 780, y: 940 },
    { x: 800, y: 800 },
  ],
  7: [
    { x: 660, y: 1250 },
    { x: 740, y: 1150 },
    { x: 790, y: 1090 },
    { x: 830, y: 1120 },
  ],
  8: [
    { x: 260, y: 1400 },
    { x: 420, y: 1250 },
    { x: 540, y: 1150 },
    { x: 660, y: 1250 },
    { x: 830, y: 1400 },
  ],
  9: [
    { x: 150, y: 1680 },
    { x: 230, y: 1480 },
    { x: 430, y: 1380 },
    { x: 620, y: 1250 },
    { x: 790, y: 1080 },
    { x: 980, y: 860 },
  ],
  10: [
    { x: 230, y: 1300 },
    { x: 430, y: 1360 },
    { x: 590, y: 1190 },
    { x: 640, y: 1080 },
    { x: 700, y: 1090 },
    { x: 830, y: 1150 },
    { x: 890, y: 1080 },
    { x: 960, y: 1120 },
  ],
};
