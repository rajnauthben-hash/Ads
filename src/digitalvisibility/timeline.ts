/**
 * Central timeline configuration. All scene frame ranges and the master
 * camera keyframes live here so motion stays deterministic and tunable.
 *
 * 480 frames @30fps = 16s. Scenes overlap ~15f so element hand-offs finish
 * beneath the incoming scene (no hard cuts, no full-screen crossfades).
 */

export const FPS = 30;
export const DURATION = 480;

export const SCENES = {
  s1: { start: 0, end: 104 },
  s2: { start: 105, end: 224 },
  s3: { start: 225, end: 344 },
  s4: { start: 345, end: 479 },
} as const;

// Overlap tail: each scene stays mounted this many frames past its `end`
// so its outgoing elements can hand off under the next scene.
export const TAIL = 8;

/**
 * Master camera path in the shared map coordinate space. The camera pushes
 * and drifts toward the important object of each scene. Values are in map-px;
 * parallax layers scale these by their depth factor.
 *
 * x/y = lateral/vertical drift, z = push (scale), rot = perspective yaw.
 */
export const CAMERA = {
  // [frame, x, y, scale]
  keys: [
    { f: 0, x: 0, y: 0, s: 1.0 },
    { f: 104, x: -24, y: -14, s: 1.03 }, // push toward phone/store
    { f: 224, x: 30, y: 18, s: 1.05 }, // shift to panel/broken route/store
    { f: 344, x: 64, y: -6, s: 1.06 }, // pan toward Best Tools TT
    { f: 479, x: 20, y: -22, s: 1.09 }, // glide back / push into Crown
  ],
} as const;

export const PARALLAX = {
  grid: 0.3,
  blocks: 0.55,
  route: 0.8,
  stores: 1.0,
  ui: 1.0,
  phone: 1.15,
} as const;
