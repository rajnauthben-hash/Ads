import { interpolate } from "remotion";
import { project, projectNodes, Pt } from "./projection";
import { EASE } from "./theme";

/**
 * Central spatial design. All four scenes live in ONE city; the camera and
 * the Crown Hardware anchor move continuously, and routes are authored on the
 * shared street grid so they always follow roads.
 */

// ---- Camera: subtle continuous push / drift across the whole 600 frames ----
export type Cam = { x: number; y: number; s: number };

export function camera(f: number): Cam {
  const s = interpolate(
    f,
    [0, 135, 300, 450, 600],
    [1.03, 1.09, 1.05, 1.06, 1.11],
    { easing: (t) => t, extrapolateRight: "clamp" },
  );
  const x = interpolate(
    f,
    [0, 135, 300, 450, 600],
    [10, -12, 6, -8, 4],
    { extrapolateRight: "clamp" },
  );
  const y = interpolate(
    f,
    [0, 135, 300, 450, 600],
    [0, -16, 4, -10, -22],
    { extrapolateRight: "clamp" },
  );
  return { x, y, s };
}

export function camTransform(c: Cam): string {
  // scale about composition centre, then translate
  return `translate(${540 + c.x} ${960 + c.y}) scale(${c.s}) translate(${-540} ${-960})`;
}

// ---- Crown Hardware anchor (screen/world space, pre-camera) ----
export type StoreXf = { x: number; y: number; scale: number; lit: number };

const CROWN_KF = {
  f: [0, 120, 160, 292, 332, 448, 600],
  x: [744, 744, 250, 250, 706, 760, 796],
  y: [648, 648, 1150, 1150, 600, 584, 566],
  scale: [0.56, 0.56, 0.34, 0.34, 0.44, 0.52, 0.6],
  lit: [0.72, 0.94, 0.86, 0.86, 0.76, 0.84, 1.0],
};

export function crownXf(f: number): StoreXf {
  const kf = CROWN_KF.f;
  const opt = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  return {
    x: interpolate(f, kf, CROWN_KF.x, opt),
    y: interpolate(f, kf, CROWN_KF.y, opt),
    scale: interpolate(f, kf, CROWN_KF.scale, opt),
    lit: interpolate(f, kf, CROWN_KF.lit, opt),
  };
}

// ---- Scene 1 route: lower-left → through streets → Crown ----
export const S1_ROUTE: Pt[] = [
  ...projectNodes([
    [-1.0, 0.02],
    [-1.0, 0.2],
    [-0.28, 0.2],
    [-0.28, 0.42],
    [0.4, 0.42],
    [0.4, 0.54],
  ]),
  { x: 702, y: 662 }, // approach Crown doorstep (matches S1 crown anchor)
];

// Scene 1 small callout anchor (beside the route)
export const S1_CALLOUT: Pt = project(-0.28, 0.28);

// ---- Scene 2 route: phone search button → streets → Crown (lower-left) ----
// Built at render time from the phone button world position; see Scene2.
export function s2Route(b: Pt): Pt[] {
  return [
    b,
    { x: b.x - 24, y: b.y + 128 },
    { x: 606, y: 1374 },
    { x: 324, y: 1374 },
    { x: 324, y: 1208 },
    { x: 252, y: 1150 }, // Crown doorstep (S2 crown anchor ~ x250,y1150)
  ];
}

// ---- Scene 3 anchors + two routes ----
export const S3_CUSTOMER: Pt = project(-0.5, 0.06);
export const S3_JUNCTION: Pt = project(0.32, 0.2); // shared split point
export const S3_COMPETITOR = { x: 762, y: 1236, scale: 0.5 };
export const S3_COMP_DOOR: Pt = { x: 742, y: 1150 };

// Competitor route (solid): customer → junction → competitor
export const S3_COMP_ROUTE: Pt[] = [
  S3_CUSTOMER,
  ...projectNodes([
    [-0.5, 0.06],
    [-0.5, 0.14],
    [0.06, 0.14],
    [0.32, 0.14],
  ]),
  S3_JUNCTION,
  S3_COMP_DOOR,
];

// Crown branch (dotted, stops short): junction → toward Crown → missed point
export const S3_MISSED: Pt = { x: 800, y: 640 };
export const S3_CROWN_ROUTE: Pt[] = [
  S3_JUNCTION,
  ...projectNodes([
    [0.32, 0.2],
    [0.32, 0.4],
    [0.62, 0.4],
    [0.62, 0.52],
  ]),
  S3_MISSED, // stops beside missed-connection marker, before Crown
];

// ---- Scene 4 route: same customer origin → streets → Crown entrance ----
export const S4_ORIGIN: Pt = S3_CUSTOMER; // one consistent customer
export const S4_ROUTE: Pt[] = [
  S4_ORIGIN,
  ...projectNodes([
    [-0.5, 0.06],
    [-0.5, 0.18],
    [0.06, 0.18],
    [0.4, 0.18],
    [0.4, 0.4],
    [0.62, 0.4],
    [0.62, 0.52],
  ]),
  { x: 764, y: 566 }, // Crown entrance (S4 crown anchor ~ x796,y566)
];

export { EASE };
