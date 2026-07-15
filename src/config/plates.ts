// ═══════════════════════════════════════════════════════════════════════
// Per-scene overlay geometry for the reference plates, in 1080×1920 px.
// Coordinates traced from the upscaled reference images; overlays are
// additive light (screen blend) on top of the painted artwork, so they
// tolerate a few px of drift.
// ═══════════════════════════════════════════════════════════════════════

export interface Pt {
  x: number;
  y: number;
}

export interface PulseSpec {
  x: number;
  y: number;
  color: "gold" | "cyan";
  at: number; // scene-local activation frame
  radius?: number;
}

export interface RouteSpec {
  points: Pt[];
  at: number; // scene-local frame the draw/highlight begins
  color?: "gold" | "cyan";
  width?: number;
}

export interface SceneOverlays {
  routes: RouteSpec[];
  pulses: PulseSpec[];
  /** Storefront signal-ring center, if the scene has one. */
  store?: { x: number; y: number; at: number; strength?: number };
}

export const OVERLAYS: Record<number, SceneOverlays> = {
  1: {
    routes: [
      {
        at: 14,
        points: [
          { x: 270, y: 1270 },
          { x: 400, y: 1360 },
          { x: 600, y: 1490 },
          { x: 660, y: 1650 },
          { x: 860, y: 1600 },
          { x: 910, y: 1400 },
          { x: 930, y: 1160 },
          { x: 860, y: 1080 },
          { x: 790, y: 1000 },
          { x: 740, y: 910 },
          { x: 740, y: 860 },
        ],
      },
    ],
    pulses: [
      { x: 740, y: 872, color: "gold", at: 26 },
      { x: 920, y: 1150, color: "gold", at: 36 },
      { x: 880, y: 1580, color: "gold", at: 46 },
    ],
    store: { x: 230, y: 1290, at: 10, strength: 0.55 },
  },
  2: {
    routes: [
      { at: 16, points: [{ x: 460, y: 852 }, { x: 560, y: 900 }, { x: 640, y: 1060 }, { x: 680, y: 1130 }] },
      { at: 22, points: [{ x: 460, y: 1010 }, { x: 580, y: 1050 }, { x: 680, y: 1130 }] },
      { at: 28, points: [{ x: 460, y: 1135 }, { x: 680, y: 1130 }] },
      { at: 34, points: [{ x: 460, y: 1370 }, { x: 590, y: 1300 }, { x: 680, y: 1140 }] },
      { at: 40, points: [{ x: 680, y: 1130 }, { x: 760, y: 1000 }, { x: 800, y: 890 }] },
    ],
    pulses: [
      { x: 800, y: 880, color: "gold", at: 44 },
      { x: 1010, y: 995, color: "gold", at: 52 },
      { x: 733, y: 1290, color: "gold", at: 60 },
    ],
  },
  3: {
    routes: [
      {
        at: 12,
        points: [
          { x: 210, y: 1380 },
          { x: 330, y: 1300 },
          { x: 430, y: 1150 },
          { x: 420, y: 990 },
          { x: 375, y: 900 },
          { x: 373, y: 810 },
        ],
      },
      {
        at: 20,
        points: [
          { x: 430, y: 1150 },
          { x: 480, y: 1000 },
          { x: 528, y: 900 },
          { x: 528, y: 810 },
        ],
      },
      {
        at: 28,
        points: [
          { x: 430, y: 1150 },
          { x: 560, y: 1030 },
          { x: 660, y: 930 },
          { x: 685, y: 830 },
        ],
      },
    ],
    pulses: [
      { x: 373, y: 800, color: "gold", at: 30 },
      { x: 528, y: 800, color: "gold", at: 38 },
      { x: 685, y: 810, color: "gold", at: 46 },
    ],
    store: { x: 180, y: 1420, at: 8, strength: 0.8 },
  },
  4: {
    routes: [
      {
        at: 10,
        points: [
          { x: 260, y: 1330 },
          { x: 420, y: 1240 },
          { x: 500, y: 1090 },
          { x: 560, y: 920 },
          { x: 660, y: 820 },
          { x: 725, y: 765 },
        ],
      },
      {
        at: 24,
        points: [
          { x: 260, y: 1370 },
          { x: 480, y: 1420 },
          { x: 700, y: 1250 },
          { x: 830, y: 1100 },
          { x: 912, y: 1015 },
        ],
      },
      {
        at: 38,
        points: [
          { x: 250, y: 1420 },
          { x: 420, y: 1560 },
          { x: 650, y: 1580 },
          { x: 820, y: 1470 },
          { x: 890, y: 1390 },
        ],
      },
    ],
    pulses: [
      { x: 729, y: 760, color: "gold", at: 30 },
      { x: 918, y: 1010, color: "gold", at: 44 },
      { x: 895, y: 1385, color: "gold", at: 58 },
    ],
    store: { x: 240, y: 1350, at: 8, strength: 0.4 },
  },
  5: {
    routes: [
      {
        at: 30,
        points: [
          { x: 420, y: 1750 },
          { x: 390, y: 1580 },
          { x: 310, y: 1420 },
          { x: 280, y: 1280 },
        ],
      },
    ],
    pulses: [{ x: 809, y: 1022, color: "cyan", at: 999 }],
    store: { x: 270, y: 1230, at: 20, strength: 1 },
  },
  6: {
    routes: [
      { at: 40, points: [{ x: 810, y: 1160 }, { x: 905, y: 1120 }, { x: 930, y: 990 }, { x: 934, y: 900 }] },
    ],
    pulses: [{ x: 936, y: 860, color: "gold", at: 54 }],
  },
  7: {
    routes: [
      {
        at: 30,
        points: [
          { x: 535, y: 1190 },
          { x: 650, y: 1230 },
          { x: 700, y: 1330 },
          { x: 760, y: 1300 },
          { x: 790, y: 1180 },
          { x: 850, y: 1120 },
        ],
      },
    ],
    pulses: [{ x: 855, y: 1085, color: "cyan", at: 48 }],
    store: { x: 855, y: 1120, at: 44, strength: 0.9 },
  },
  8: {
    routes: [
      { at: 12, points: [{ x: 200, y: 960 }, { x: 350, y: 1050 }, { x: 540, y: 1150 }] },
      { at: 20, points: [{ x: 540, y: 800 }, { x: 540, y: 980 }, { x: 540, y: 1150 }] },
      { at: 28, points: [{ x: 880, y: 960 }, { x: 720, y: 1060 }, { x: 540, y: 1150 }] },
      { at: 36, points: [{ x: 250, y: 1400 }, { x: 400, y: 1300 }, { x: 540, y: 1160 }] },
      { at: 44, points: [{ x: 820, y: 1400 }, { x: 680, y: 1300 }, { x: 540, y: 1160 }] },
    ],
    pulses: [
      { x: 147, y: 933, color: "gold", at: 12 },
      { x: 539, y: 752, color: "gold", at: 20 },
      { x: 930, y: 936, color: "gold", at: 28 },
      { x: 197, y: 1424, color: "gold", at: 36 },
      { x: 867, y: 1424, color: "gold", at: 44 },
    ],
    store: { x: 540, y: 1155, at: 8, strength: 1 },
  },
  9: {
    routes: [
      {
        at: 10,
        points: [
          { x: 34, y: 1372 },
          { x: 170, y: 1310 },
          { x: 300, y: 1250 },
          { x: 420, y: 1180 },
          { x: 540, y: 1110 },
          { x: 660, y: 1030 },
          { x: 780, y: 950 },
          { x: 900, y: 880 },
          { x: 1010, y: 830 },
        ],
      },
      {
        at: 26,
        points: [
          { x: 280, y: 1600 },
          { x: 480, y: 1660 },
          { x: 700, y: 1600 },
          { x: 760, y: 1440 },
          { x: 880, y: 1330 },
          { x: 970, y: 1290 },
        ],
      },
    ],
    pulses: [
      { x: 169, y: 896, color: "cyan", at: 18 },
      { x: 410, y: 855, color: "cyan", at: 28 },
      { x: 643, y: 772, color: "cyan", at: 38 },
      { x: 899, y: 706, color: "cyan", at: 48 },
      { x: 517, y: 1400, color: "gold", at: 34 },
      { x: 752, y: 1350, color: "gold", at: 44 },
      { x: 964, y: 1218, color: "gold", at: 54 },
    ],
    store: { x: 247, y: 1585, at: 8, strength: 0.9 },
  },
  10: {
    routes: [
      {
        at: 10,
        points: [
          { x: 240, y: 1220 },
          { x: 400, y: 1330 },
          { x: 560, y: 1410 },
          { x: 700, y: 1300 },
          { x: 750, y: 1090 },
          { x: 750, y: 940 },
        ],
      },
      { at: 30, points: [{ x: 750, y: 930 }, { x: 870, y: 990 }, { x: 968, y: 1000 }] },
      { at: 36, points: [{ x: 560, y: 1410 }, { x: 760, y: 1480 }, { x: 886, y: 1395 }] },
      { at: 24, points: [{ x: 750, y: 930 }, { x: 660, y: 830 }, { x: 570, y: 800 }] },
    ],
    pulses: [
      { x: 752, y: 900, color: "gold", at: 42, radius: 110 },
      { x: 756, y: 705, color: "gold", at: 52 },
      { x: 529, y: 790, color: "gold", at: 56 },
      { x: 972, y: 995, color: "gold", at: 48 },
      { x: 886, y: 1385, color: "gold", at: 50 },
    ],
    store: { x: 218, y: 1195, at: 8, strength: 1 },
  },
};
