# OmniFlow Digital — "Open Doors, Empty Aisles"

A single continuous 24s vertical (1080×1920 @ 30fps, 720 frames) Remotion ad that
recreates the four approved storyboard keyframes as one connected animated world.

- **Composition id:** `OmniFlowOpenDoorsAd`
- **Render:** `npx remotion render src/index.ts OmniFlowOpenDoorsAd out/omniflow-open-doors.mp4`
- **Studio preview:** `npm run dev`

## Scenes (object-led, no slideshow cuts / crossfades)

| Frames | Scene | Beat |
|--------|-------|------|
| 0–179   | Prepared, but invisible      | Lit Crown storefront + editorial copy; storefront morphs into the Scene 2 card |
| 180–359 | They never really saw it     | Your Business vs. Competitor comparison cards; cards travel to become map destinations |
| 360–539 | The demand went somewhere else | City map, shared Customer origin, solid-cyan route to Maplewood, weak gray dotted route to Crown |
| 540–719 | OmniFlow reconnects the customer | Dotted Crown route repairs to solid cyan; Weak-presence bubble expands into the Crown info card |

## Continuity devices

- **Persistent layers** (`OmniFlowOpenDoorsAd.tsx`): night base + `MasterCityMap` live at
  the top level so the world never resets between scenes.
- **Storefront** (`StorefrontPlate`) is the same object scaling from Scene 1 hero → Scene 2
  card thumbnails → Scene 4 hero. Only the text-free right ~55% of the approved reference is
  ever shown (masked environment plate — never a full-screen slide).
- **Cards → map destinations → info card** and **dotted route → solid route** hand off across
  scene seams with matched rects rather than cuts.

## Implementation notes

- Native live React text for all readable copy (exact approved copy + line breaks preserved).
- SVG routes drawn with normalized `pathLength` + `strokeDashoffset` reveal masks (deterministic,
  no runtime measurement); `RoutePulse` shows active signal direction.
- Fonts loaded deterministically from bundled `public/fonts` TTFs (no uncontrolled fallbacks).
- `BrandLogoSlot` imports `public/branding/omniflow-logo.png` when present; the reserved area is
  left blank otherwise (no fabricated logo).
- Dev-only `ReferenceOverlay` / `SafeZoneOverlay` are wired via composition `defaultProps`
  (`showReference`, `showSafeZone`).

## Files created

```
public/references/scene-0{1..4}-*.jpg      approved keyframes (dev overlay / masked plate)
src/omniflow-open-doors/
  OmniFlowOpenDoorsAd.tsx                   master composition
  constants.ts  fonts.ts  anim.ts           design system, fonts, motion helpers
  scenes/Scene0{1..4}.tsx                    four scenes
  components/                                Typography, GoldDivider, StorefrontPlate,
                                             MasterCityMap, Routes, MapElements, Cards, icons, Brand
  overlays/DevOverlays.tsx                   ReferenceOverlay + SafeZoneOverlay
```

Only `src/Root.tsx` was edited among existing files (to register the composition).
