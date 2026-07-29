# OmniFlow "Clogged Arteries" — Remotion build

Premium vertical (1080×1920, 30fps, 30s / 900 frames) motion-design ad,
**"The Clogged Arteries of an Unranked Website"**, rebuilt natively in
React + Remotion from the five approved storyboard keyframes.

## Render

```bash
# Studio preview
npm run dev            # open the "OmniFlowCloggedArteries" composition

# Final video
npx remotion render OmniFlowCloggedArteries out/OmniFlowCloggedArteries.mp4

# A reference-perfect settled still
npx remotion still OmniFlowCloggedArteries out/frame_135.png --frame=135
```

> The sandbox routes HTTPS through a proxy whose CA the bundled Chromium does not
> trust; `remotion.config.ts` sets `setChromiumIgnoreCertificateErrors(true)` so
> the Google fonts (Inter Tight / Geist / IBM Plex Sans) load at render time.

## Structure

```
src/framePlan.ts                     # 900-entry FRAME_PLAN + global camera curve
src/omniflow-ad/
  OmniFlowCloggedArteriesAd.tsx      # master composition (Background + camera + 5 scenes)
  styles/  tokens · typography · geometry · fonts
  components/  VirtualCamera, MasterMapWorld, PremiumPanel, MaskedHeadline,
               AnimatedCopy, OmniFlowBrandLockup, SearchPulseRoute, PhoneShell,
               SearchInterface, CrownHardwareStorefront, CrownHardwareCard,
               CompetitorCard, HexObstruction, MiniDiagramCard, PathwayNode,
               ListItems (RequirementRow/DiagnosticMetric/StepCard), Icons,
               DestinationRipple, MapLabel, SafeZoneOverlay, SceneTransition
  scenes/  Scene01WebsiteLive … Scene05OmniFlowSolution
```

Every animated property is driven by `useCurrentFrame()` + `interpolate()` with the
named easings in `styles/geometry.ts`; there is no wall-clock / CSS-keyframe / random
motion. Scenes are joined by a cohesive vertical push (see `SceneTransition`) so the
piece reads as one fluid film rather than five stills.

See `DELIVERY_CHECKLIST.md` for the full acceptance-test status and the platform
safe-area note.
