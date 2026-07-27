import { interpolate } from "remotion";

/** Exact route paths (spec, screen coordinates). */
export const ROUTES = {
  s1: "M 170 1335 C 185 1250, 215 1160, 300 1100 C 390 1035, 470 1015, 530 925 C 595 830, 635 760, 610 700 C 585 645, 625 610, 710 590",
  s2: "M 690 1050 C 665 1135, 620 1200, 545 1235 C 465 1270, 385 1225, 325 1165 C 285 1125, 250 1075, 255 1030",
  s3shared: "M 170 1240 C 270 1245, 330 1180, 390 1075 C 440 985, 475 910, 505 835",
  s3comp: "M 505 835 C 555 895, 600 965, 660 1060 C 690 1105, 710 1120, 735 1115",
  s3crown: "M 505 835 C 555 760, 590 700, 570 635 C 550 580, 590 535, 675 505",
  s4: "M 405 1160 C 470 1100, 525 1035, 565 950 C 610 855, 635 790, 605 720 C 575 650, 615 605, 710 580",
} as const;

// Crown local height (base to top incl parapet) for scaling to spec boxes.
export const CROWN_LOCAL_H = 316;

/** Persistent Crown Hardware transform (base-centre x, base y, scale). */
export function crownXf(f: number): { x: number; y: number; scale: number } {
  const kf = [0, 118, 134, 160, 280, 305, 430, 455, 580, 599];
  const xs = [765, 765, 700, 247, 247, 785, 785, 765, 765, 765];
  const ys = [640, 640, 720, 1260, 1260, 620, 620, 645, 645, 645];
  const ss = [1.234, 1.234, 1.05, 1.013, 1.013, 1.044, 1.044, 1.297, 1.297, 1.297];
  const o = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  return { x: interpolate(f, kf, xs, o), y: interpolate(f, kf, ys, o), scale: interpolate(f, kf, ss, o) };
}

/** Continuous master camera (spec §12) — gentle, near-identity at comparisons. */
export function camera(f: number): { scale: number; tx: number; ty: number; rot: number } {
  const o = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const kf = [0, 100, 118, 134, 160, 280, 300, 314, 430, 450, 455, 580, 599];
  const scale = interpolate(f, kf, [1.0, 1.011, 1.016, 1.024, 1.018, 1.018, 1.016, 1.012, 1.013, 1.02, 1.018, 1.019, 1.024], o);
  const tx = interpolate(f, kf, [0, -2, -4, -12, -6, -4, -2, 2, 4, -6, -8, 1, 3], o);
  const ty = interpolate(f, kf, [0, 2, 6, 15, 6, -2, 2, 4, 4, 10, 12, -5, -8], o);
  return { scale, tx, ty, rot: 0 };
}

export function camStr(c: { scale: number; tx: number; ty: number; rot: number }): string {
  return `translate(${c.tx}px, ${c.ty}px) scale(${c.scale}) rotate(${c.rot}deg)`;
}
