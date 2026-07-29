// Deterministic frame plan for the OmniFlow "Clogged Arteries" ad.
//
// FRAME_PLAN has exactly 900 entries, one for every frame 0..899. Each entry
// is derived only from the fixed scene ranges and the camera keyframes in the
// written specification. Scenes read their own internal animation from
// interpolate() over the documented local-frame intervals; this plan governs
// the shared per-frame values (scene index, local frame, and the global
// virtual-camera transform) so that no frame is unspecified.

export interface FramePlanEntry {
  frame: number;
  scene: 1 | 2 | 3 | 4 | 5;
  localFrame: number; // 0..179 within the scene
  camera: {
    scale: number;
    x: number;
    y: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
  };
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Cubic-bezier sampler matching Remotion's Easing.bezier for camera curves.
function bezier(p1x: number, p1y: number, p2x: number, p2y: number) {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const solveX = (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const x2 = sampleX(t) - x;
      const d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(d) < 1e-6) break;
      t -= x2 / d;
    }
    return t;
  };
  return (x: number) => sampleY(solveX(clamp(x, 0, 1)));
}

const premium = bezier(0.22, 1, 0.36, 1);
const softIO = bezier(0.45, 0, 0.55, 1);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Gentle, restrained camera motion. Each scene eases from a small entry offset
// into a neutral settled pose during the reading hold, then leans slightly
// toward the next scene during its transition window (local 150..179).
function cameraFor(scene: number, local: number) {
  // Settle-in (0..30) then hold neutral. Transition drift (150..179).
  const settle = premium(clamp(local / 30, 0, 1));
  const transT = softIO(clamp((local - 150) / 29, 0, 1));

  // Per-scene entry offset and transition lean.
  const entry: Record<number, { scale: number; x: number; y: number; ry: number }> = {
    1: { scale: 1.025, x: -8, y: 4, ry: 0 },
    2: { scale: 1.03, x: 0, y: -6, ry: -1.6 },
    3: { scale: 1.035, x: 6, y: 10, ry: 0.6 },
    4: { scale: 1.03, x: -6, y: 4, ry: 1.2 },
    5: { scale: 1.025, x: 4, y: 6, ry: -0.8 },
  };
  const trans: Record<number, { scale: number; x: number; y: number; ry: number }> = {
    1: { scale: 1.01, x: 0, y: -6, ry: 0 },
    2: { scale: 1.0, x: 0, y: 14, ry: 0 },
    3: { scale: 1.0, x: 10, y: 6, ry: 0.8 },
    4: { scale: 1.0, x: 0, y: -10, ry: 0 },
    5: { scale: 1.0, x: 0, y: 0, ry: 0 },
  };
  const e = entry[scene];
  const t = trans[scene];

  const scale = lerp(lerp(e.scale, 1.0, settle), t.scale, transT);
  const x = lerp(lerp(e.x, 0, settle), t.x, transT);
  const y = lerp(lerp(e.y, 0, settle), t.y, transT);
  const rotateY = lerp(lerp(e.ry, 0, settle), t.ry, transT);

  return {
    scale: clamp(scale, 0.98, 1.04),
    x,
    y,
    rotateX: 0,
    rotateY: clamp(rotateY, -2, 2),
    rotateZ: 0,
  };
}

function buildPlan(): FramePlanEntry[] {
  const plan: FramePlanEntry[] = [];
  for (let frame = 0; frame < 900; frame++) {
    const scene = (Math.floor(frame / 180) + 1) as FramePlanEntry["scene"];
    const localFrame = frame % 180;
    plan.push({ frame, scene, localFrame, camera: cameraFor(scene, localFrame) });
  }
  return plan;
}

export const FRAME_PLAN: FramePlanEntry[] = buildPlan();

export const getFrameEntry = (frame: number): FramePlanEntry =>
  FRAME_PLAN[clamp(frame, 0, 899)];
