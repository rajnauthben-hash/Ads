# OmniFlow — "The Clogged Arteries of an Unranked Website"
## Delivery checklist

Composition id: `OmniFlowCloggedArteries` (registered in `src/Root.tsx`)
Render: `npx remotion render OmniFlowCloggedArteries out/OmniFlowCloggedArteries.mp4`

### Output lock
- [x] Canvas exactly 1080 × 1920
- [x] 30 FPS
- [x] Exactly 900 frames (0–899), 30.000s
- [x] MP4 / H.264 / yuv420p (Remotion defaults)
- [x] No blank / black reset / fade-to-black frames; final frame is the completed Scene 5
- [x] Scene ranges: S1 0–179, S2 180–359, S3 360–539, S4 540–719, S5 720–899

### Reference-perfect settled frames
- [x] Frame 135 matches Reference 01 (Website live)
- [x] Frame 315 matches Reference 02 (A website needs more than a URL)
- [x] Frame 495 matches Reference 03 (Customers still searching / blocked)
- [x] Frame 675 matches Reference 04 (Blocked traffic redirected)
- [x] Frame 870 matches Reference 05 (OmniFlow clears the route)

### Reading holds
- [x] Scenes 1–4 complete all reveals by local 119, hold 120–149 (30f)
- [x] Scene 5 completes by local 119, final hold 120–179 (60f)
- [x] Transitions begin only at/after local 150 (exit push begins local 180)

### Shared / persistent objects
- [x] One `CrownHardwareCard` component relocated across all five scenes
- [x] One `CrownHardwareStorefront` (consistent façade, sign, windows, warm light)
- [x] Crown business data constant (`0.9 mi · ★ 3.7 (28)`, Hardware store, Open · Closes 7PM, In-store shopping)
- [x] Competitor names/data constant per spec
- [x] Search query always `hardware store near me`
- [x] One `SearchPulseRoute` device transforms through every scene; route direction correct per scene
- [x] Routes follow visible roads / turn at intersections on maps

### Story beats
- [x] S1 live website, weak visibility
- [x] S2 required search-pathway signals (two warning nodes)
- [x] S3 route strikes controlled amber hex obstruction (no flash / no glitch)
- [x] S4 traffic redirected to competitors; Crown NOT activated (dim, gray pin)
- [x] S5 corrected route reaches Crown; competitors NOT activated

### Motion discipline
- [x] All animation derived from `useCurrentFrame()` + `interpolate()` + `FRAME_PLAN` + fixed tokens
- [x] Named easings only (premium / settle / linear / softInOut); no bounce/elastic/overshoot >2px
- [x] No unseeded randomness (12 impact particles are fixed offsets)
- [x] No full-screen crossfade, slideshow cut, generic wipe, Ken Burns, glitch, flash, RGB split
- [x] Scene-to-scene transitions are a cohesive vertical PUSH (object motion, both scenes tiled — never black)
- [x] Text is live React text; approved copy & line breaks preserved; no cropping
- [x] Cyan/gold glows restrained; route glow never obscures text
- [x] No scene numbers rendered in the final video

### Architecture
- Centralised tokens/typography/geometry in `src/omniflow-ad/styles/`
- `FRAME_PLAN` (900 entries) + global camera curve in `src/framePlan.ts`
- Reusable components in `src/omniflow-ad/components/`
- Scenes in `src/omniflow-ad/scenes/`
- `SafeZoneOverlay` is dev-only (`safeZones` prop, default false) — not in the final render

### Platform safe-area note (no master-layout change)
The approved reference layout is preserved exactly. Under platform chrome:
- TikTok/Reels **bottom** UI (~520px) overlaps the bottom takeaway/brand panels
  (S1 diagnostics, S2 takeaway, S3 takeaway, S4 bottom statement, S5 brand promises).
- Right-rail action buttons may overlap the right edge of the right-hand panels.
Recommendation: for in-feed placements, letterbox or scale the master 6% rather than
redesigning any frame. The master composition keeps the reference layout as approved.
