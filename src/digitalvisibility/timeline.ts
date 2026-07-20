/**
 * Central timeline configuration. All scene frame ranges and the master
 * camera keyframes live here so motion stays deterministic and tunable.
 *
 * 600 frames @30fps = 20s. Scenes overlap ~8f so element hand-offs finish
 * beneath the incoming scene (no hard cuts, no full-screen crossfades).
 *
 * Every scene's reveal choreography is unchanged from the 16s cut; each scene
 * simply holds its fully-assembled state ~1s (30f) longer before handing off.
 */

export const FPS = 30;
export const DURATION = 600;

export const SCENES = {
  s1: { start: 0, end: 134 },
  s2: { start: 135, end: 284 },
  s3: { start: 285, end: 434 },
  s4: { start: 435, end: 599 },
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
    { f: 134, x: -24, y: -14, s: 1.03 }, // push toward phone/store
    { f: 284, x: 30, y: 18, s: 1.05 }, // shift to panel/broken route/store
    { f: 434, x: 64, y: -6, s: 1.06 }, // pan toward Best Tools TT
    { f: 599, x: 20, y: -22, s: 1.09 }, // glide back / push into Crown
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
