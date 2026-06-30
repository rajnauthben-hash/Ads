"""
Mobile hero video generator — staged energy transformation sequence.
1080x1920 @ 30fps, ~5.5s looping MP4.
"""
import numpy as np
from PIL import Image, ImageFilter
import os, subprocess, math, sys

SCRATCHPAD = "/tmp/claude-0/-home-user-Ads/378a3c3e-0ffd-5a42-8c00-f8b47b839967/scratchpad"
FRAMES_DIR  = os.path.join(SCRATCHPAD, "frames")
OUTPUT      = "/home/user/Ads/hero-mobile.mp4"
BEFORE_SRC  = "/root/.claude/uploads/378a3c3e-0ffd-5a42-8c00-f8b47b839967/6aa7a90d-7308.png"
AFTER_SRC   = "/root/.claude/uploads/378a3c3e-0ffd-5a42-8c00-f8b47b839967/0288f800-7309.png"

W, H   = 1080, 1920
FPS    = 30
DUR    = 5.5           # seconds
NF     = int(DUR * FPS)  # 165 frames

# ── Normalised element positions in source landscape image ──────────────────
#   Measured from the before/after images (approx)
PIN_NX,  PIN_NY   = 0.662, 0.447   # map pin head
WEB_NX,  WEB_NY   = 0.757, 0.200   # website panel centre
STORE_NX, STORE_NY = 0.743, 0.720  # storefront centre

os.makedirs(FRAMES_DIR, exist_ok=True)

# ── Smooth-step (Hermite) ───────────────────────────────────────────────────
def ss(t):
    t = float(np.clip(t, 0, 1))
    return t * t * (3 - 2 * t)

def ss3(t):
    """Smooth-step with steeper shoulder (extra punch on snaps)."""
    t = float(np.clip(t, 0, 1))
    return t * t * t * (t * (t * 6 - 15) + 10)

# ── Quadratic bezier ───────────────────────────────────────────────────────
def qbez(t, p0, p1, p2):
    return (1-t)**2 * np.asarray(p0) + 2*(1-t)*t * np.asarray(p1) + t**2 * np.asarray(p2)

# ── Vectorised glow dot ─────────────────────────────────────────────────────
def glow_dot(ovl, cx, cy, radius, color, intensity=1.0):
    if intensity < 0.01 or radius < 0.3:
        return
    r = max(0.3, radius)
    pad = int(r * 3) + 2
    y0 = max(0, int(cy) - pad);  y1 = min(H, int(cy) + pad + 1)
    x0 = max(0, int(cx) - pad);  x1 = min(W, int(cx) + pad + 1)
    if y0 >= y1 or x0 >= x1:
        return
    Y, X = np.ogrid[y0:y1, x0:x1]
    g = np.exp(-((X - cx)**2 + (Y - cy)**2) / (2 * r * r)) * intensity
    for c, cv in enumerate(color):
        ovl[y0:y1, x0:x1, c] += g * cv

# ── Pulse ring ─────────────────────────────────────────────────────────────
def pulse_ring(ovl, cx, cy, radius, thick, color, intensity=1.0):
    if radius <= 0 or intensity < 0.01:
        return
    pad = int(radius) + int(thick * 4) + 2
    y0 = max(0, int(cy) - pad);  y1 = min(H, int(cy) + pad + 1)
    x0 = max(0, int(cx) - pad);  x1 = min(W, int(cx) + pad + 1)
    if y0 >= y1 or x0 >= x1:
        return
    Y, X = np.ogrid[y0:y1, x0:x1]
    dist = np.sqrt((X - cx)**2 + (Y - cy)**2)
    ring = np.exp(-((dist - radius)**2) / (2 * thick * thick)) * intensity
    for c, cv in enumerate(color):
        ovl[y0:y1, x0:x1, c] += ring * cv

# ── Radial flash burst ─────────────────────────────────────────────────────
def flash_burst(ovl, cx, cy, radius, intensity=1.0):
    if radius <= 0 or intensity < 0.01:
        return
    pad = int(radius)
    y0 = max(0, int(cy) - pad);  y1 = min(H, int(cy) + pad + 1)
    x0 = max(0, int(cx) - pad);  x1 = min(W, int(cx) + pad + 1)
    if y0 >= y1 or x0 >= x1:
        return
    Y, X = np.ogrid[y0:y1, x0:x1]
    dist = np.sqrt((X - cx)**2 + (Y - cy)**2)
    burst = np.clip(1.0 - dist / radius, 0, 1) ** 1.5 * intensity * 255.0
    ovl[y0:y1, x0:x1, 0] += burst * 0.55
    ovl[y0:y1, x0:x1, 1] += burst * 0.88
    ovl[y0:y1, x0:x1, 2] += burst * 1.00

# ── Moving energy pulse along bezier path with fading trail ────────────────
def energy_pulse(ovl, p0, p1, p2, pulse_t, trail=0.18,
                 dot_r=13, color=(0, 200, 255), intensity=1.0):
    if pulse_t < 0:
        return
    # Leading dot
    pt = float(np.clip(pulse_t, 0, 1))
    pos = qbez(pt, p0, p1, p2)
    glow_dot(ovl, pos[0], pos[1], dot_r, color, intensity * 2.5)
    # Trail
    n_trail = 18
    for i in range(1, n_trail + 1):
        tt = max(0.0, pt - (i / n_trail) * trail)
        tp = qbez(tt, p0, p1, p2)
        frac = 1.0 - i / n_trail
        glow_dot(ovl, tp[0], tp[1], dot_r * (0.4 + 0.6 * frac),
                 color, intensity * frac * 0.9)

# ── Add bloom post-process ─────────────────────────────────────────────────
def bloom(frame_f, threshold=185, intensity=0.30, radius=8):
    bright = np.clip(frame_f - threshold, 0, 255) * (255.0 / (255.0 - threshold))
    pil = Image.fromarray(bright.astype(np.uint8))
    blurred = np.array(pil.filter(ImageFilter.GaussianBlur(radius=radius))).astype(float)
    return np.clip(frame_f + blurred * intensity, 0, 255)

# ── Load & crop source images ──────────────────────────────────────────────
def load_images():
    bef = Image.open(BEFORE_SRC).convert("RGB")
    aft = Image.open(AFTER_SRC).convert("RGB")
    src_w, src_h = bef.size
    scale = H / src_h
    nw = int(src_w * scale)

    bef_s = bef.resize((nw, H), Image.LANCZOS)
    aft_s = aft.resize((nw, H), Image.LANCZOS)

    # Element px positions in scaled image
    pin_x   = PIN_NX   * nw
    web_x   = WEB_NX   * nw
    store_x = STORE_NX * nw

    # Crop centre: weighted average of content x positions
    cx_centre = int((pin_x + web_x + store_x) / 3)
    crop_x = int(np.clip(cx_centre - W // 2, 0, nw - W))

    bef_arr = np.array(bef_s.crop((crop_x, 0, crop_x + W, H))).astype(float)
    aft_arr = np.array(aft_s.crop((crop_x, 0, crop_x + W, H))).astype(float)

    # Element positions in the cropped frame
    def fx(nx): return int(nx * nw - crop_x)
    def fy(ny): return int(ny * H)

    pin   = (fx(PIN_NX),   fy(PIN_NY))
    web   = (fx(WEB_NX),   fy(WEB_NY))
    store = (fx(STORE_NX), fy(STORE_NY))

    print(f"Source {src_w}x{src_h} → scaled {nw}x{H} → crop_x={crop_x}")
    print(f"Frame coords — pin:{pin}  web:{web}  store:{store}")
    return bef_arr, aft_arr, pin, web, store

# ── Static particle system ─────────────────────────────────────────────────
rng = np.random.default_rng(42)
N_PART = 90
part_x     = rng.integers(60, W - 60, N_PART)
part_y     = rng.integers(60, H - 60, N_PART)
part_r     = rng.uniform(1.0, 3.5, N_PART)
part_speed = rng.uniform(0.8, 2.5, N_PART)
part_phase = rng.uniform(0, math.pi * 2, N_PART)

# ── Render one frame ───────────────────────────────────────────────────────
def render_frame(fi, bef, aft, pin, web, store):
    t = fi / NF          # 0 → <1

    px, py = pin
    wx, wy = web
    sx, sy = store

    # Bezier thread paths (adjusted for better visual arc)
    # Pin → Web panel: sweeps upward-right with leftward arc
    p0_up = np.array([px,       py],       float)
    p1_up = np.array([px - 60,  py - 300], float)   # pull left then up
    p2_up = np.array([wx,       wy + 60],  float)

    # Pin → Storefront: sweeps downward-right with rightward arc
    p0_dn = np.array([px,       py],       float)
    p1_dn = np.array([px + 160, py + 260], float)
    p2_dn = np.array([sx,       sy - 70],  float)

    # ── Stage boundaries (as fractions of t) ─────────────────────────────
    S1  = 0.20   # pin ignition ends
    S2  = 0.50   # energy travel ends
    S3  = 0.80   # activation / flash burst ends
    S4  = 0.92   # hold "after" ends → loop-back begins

    # ── Base blend ────────────────────────────────────────────────────────
    if t < S1:
        blend = 0.0
    elif t < S2:
        # Threads reveal, blend creeps very slightly to hint the "after"
        blend = ss((t - S1) / (S2 - S1)) * 0.08
    elif t < S3:
        blend = 0.08 + ss3((t - S2) / (S3 - S2)) * 0.92
    elif t < S4:
        blend = 1.0
    else:
        # Loop-back: quick fade back to before
        lb = (t - S4) / (1.0 - S4)
        blend = 1.0 - ss(lb)

    frame_f = bef * (1.0 - blend) + aft * blend

    # ── Effect overlay ─────────────────────────────────────────────────────
    ovl = np.zeros((H, W, 3), float)

    CYN  = (0, 200, 255)   # main cyan
    CYN2 = (0, 150, 210)   # dimmer cyan

    # ── STAGE 1: pin ignition ──────────────────────────────────────────────
    if t < S1:
        st = t / S1
        # Pin core glow builds
        glow_dot(ovl, px, py, 20 + st * 18, CYN, ss(st) * 3.0)
        # Two expanding rings, staggered
        for phase in (0.0, 0.5):
            rph = ((st * 1.8) + phase) % 1.0
            ring_r   = rph * 90
            ring_int = (1.0 - rph) * 2.0 * ss(st * 2.5)
            pulse_ring(ovl, px, py, ring_r, 4, CYN, ring_int)

    # ── STAGE 2: energy travel along threads ──────────────────────────────
    if S1 <= t < S2:
        st = (t - S1) / (S2 - S1)

        # Pin stays lit
        glow_dot(ovl, px, py, 28, CYN, 2.5)

        # Upward thread: two pulses staggered 0.35 apart
        for offset in (0.0, 0.35):
            pt = min(1.0, max(0.0, st * 1.6 - offset))
            if pt > 0:
                energy_pulse(ovl, p0_up, p1_up, p2_up, pt,
                             trail=0.20, dot_r=12, color=CYN,
                             intensity=1.0 - abs(pt - 0.55) * 0.4)

        # Downward thread: two pulses, slightly delayed
        for offset in (0.1, 0.45):
            pt = min(1.0, max(0.0, st * 1.6 - offset))
            if pt > 0:
                energy_pulse(ovl, p0_dn, p1_dn, p2_dn, pt,
                             trail=0.20, dot_r=12, color=CYN,
                             intensity=1.0 - abs(pt - 0.55) * 0.4)

        # Thread line: progressively reveal with soft glow dots
        n_seg = 40
        for seg_i in range(n_seg):
            seg_t = seg_i / n_seg
            if seg_t > st:
                break
            alpha = ss(min(1.0, (st - seg_t) * 5)) * 0.35
            pos_u = qbez(seg_t, p0_up, p1_up, p2_up)
            pos_d = qbez(seg_t, p0_dn, p1_dn, p2_dn)
            glow_dot(ovl, pos_u[0], pos_u[1], 3, CYN, alpha)
            glow_dot(ovl, pos_d[0], pos_d[1], 3, CYN, alpha)

    # ── STAGE 3: element activation + flash burst ─────────────────────────
    if S2 <= t < S3:
        st = (t - S2) / (S3 - S2)

        # Pin still glowing
        glow_dot(ovl, px, py, 32, CYN, 2.5)

        # Web panel snap-flash (quick at very start of stage 3)
        wf = max(0.0, 1.0 - st * 5.0) * ss3(min(1.0, st * 6.0))
        if wf > 0.01:
            glow_dot(ovl, wx, wy, 90, CYN, wf * 4.0)
            glow_dot(ovl, wx, wy, 40, (200, 240, 255), wf * 2.5)

        # Storefront snap-flash (delayed by 30% of stage)
        sf_in = max(0.0, st - 0.30) / 0.40
        sf = max(0.0, 1.0 - sf_in * 4.0) * ss3(min(1.0, sf_in * 5.0))
        if sf > 0.01:
            glow_dot(ovl, sx, sy, 90, CYN, sf * 4.0)
            glow_dot(ovl, sx, sy, 40, (200, 240, 255), sf * 2.5)

        # Flash burst: peak at st ≈ 0.50 (≈65% through whole clip)
        fb_peak = 0.50
        fb_width = 0.22
        fb_raw = max(0.0, 1.0 - abs(st - fb_peak) / fb_width)
        if fb_raw > 0.01:
            fb_int = ss(fb_raw) * 1.4
            burst_r = int(250 + fb_raw * 500)
            flash_burst(ovl, px, py, burst_r, fb_int)
            # Extra bright core
            glow_dot(ovl, px, py, 25, (255, 255, 255), fb_int * 1.5)

    # ── STAGE 4: settled "after" state ────────────────────────────────────
    if S3 <= t < S4:
        st = (t - S3) / (S4 - S3)

        # Repeating pulse rings on pin
        ring_period = 0.5          # one ring every 0.5 normalised stage time
        for offset in (0.0, 0.5):
            rph = ((st * 2.0) + offset) % 1.0
            pulse_ring(ovl, px, py, rph * 160, 5, CYN, (1.0 - rph) * 1.8)

        # Ambient glow
        glow_dot(ovl, px, py, 30, CYN, 1.8)
        glow_dot(ovl, wx, wy, 25, CYN, 0.6)
        glow_dot(ovl, sx, sy, 25, CYN, 0.6)

    # ── LOOP-BACK: fade everything out ────────────────────────────────────
    if t >= S4:
        lb = (t - S4) / (1.0 - S4)
        fade = 1.0 - ss(lb)
        # Final pin ring
        pulse_ring(ovl, px, py, lb * 200, 4, CYN, (1.0 - lb) * 1.2 * fade)
        glow_dot(ovl, px, py, 20, CYN, 0.8 * fade)
        ovl *= fade

    # ── PARTICLES: visible stages 3 → S4 (fade in/out) ───────────────────
    if S2 < t < 1.0:
        if t < S3:
            p_vis = ss((t - S2) / (S3 - S2))
        elif t < S4:
            p_vis = 1.0
        else:
            p_vis = 1.0 - ss((t - S4) / (1.0 - S4))

        if p_vis > 0.01:
            for i in range(N_PART):
                tw = 0.45 + 0.55 * math.sin(part_phase[i] + t * part_speed[i] * math.pi * 6)
                p_int = tw * p_vis * 0.9
                if p_int > 0.05:
                    glow_dot(ovl, part_x[i], part_y[i], part_r[i], CYN, p_int)

    # ── Composite overlay + bloom ─────────────────────────────────────────
    frame_f = np.clip(frame_f + ovl, 0, 255)

    if blend > 0.05:
        b_int = 0.28 if t < S4 else 0.18
        frame_f = bloom(frame_f, threshold=188, intensity=b_int, radius=7)

    return frame_f.astype(np.uint8)


# ══════════════════════════════════════════════════════════════════════════════
def main():
    print("Loading & cropping source images …")
    bef, aft, pin, web, store = load_images()

    print(f"Rendering {NF} frames …")
    for fi in range(NF):
        frame = render_frame(fi, bef, aft, pin, web, store)
        out_path = os.path.join(FRAMES_DIR, f"frame_{fi:04d}.png")
        Image.fromarray(frame).save(out_path, compress_level=1)
        if fi % 15 == 0:
            pct = 100 * fi / NF
            print(f"  {fi:3d}/{NF}  ({pct:.0f}%)", flush=True)

    print("Encoding video …")
    cmd = [
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", os.path.join(FRAMES_DIR, "frame_%04d.png"),
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf",    "28",
        "-vf",     "format=yuv420p",
        "-movflags", "+faststart",
        OUTPUT,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("ffmpeg error:", result.stderr[-2000:])
        sys.exit(1)

    size_mb = os.path.getsize(OUTPUT) / 1024 / 1024
    print(f"\nDone → {OUTPUT}")
    print(f"Size: {size_mb:.2f} MB")

    if size_mb > 3.0:
        print("Re-encoding with CRF 32 to reduce size …")
        tmp = OUTPUT + ".tmp.mp4"
        cmd2 = cmd[:-1] + ["-crf", "32", tmp]
        subprocess.run(cmd2, check=True, capture_output=True)
        os.replace(tmp, OUTPUT)
        size_mb2 = os.path.getsize(OUTPUT) / 1024 / 1024
        print(f"Re-encoded size: {size_mb2:.2f} MB")

if __name__ == "__main__":
    main()
