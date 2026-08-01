OMNIFLOW "ZERO PRESENCE" AD — DELIVERY INDEX
=============================================

COMPOSITION
  id:            OmniFlowZeroPresenceAd            (final render, no dev overlays)
  id:            OmniFlowZeroPresenceAdSafeOverlay (dev-only safe-area preview)
  1080 x 1920 · 9:16 · 30fps · 720 frames · 24s · H.264 · yuv420p · no audio

SOURCE CODE (fully editable React + Remotion)
  src/zeropresence/
    tokens.ts            design tokens (colours, fonts, safe zones)
    framePlan.ts         FRAME_PLAN: scene ranges, object keyframes, easing + reveal helpers
    fonts.ts             font loading
    OmniFlowZeroPresenceAd.tsx   master composition
    components/          VirtualCamera, AtmosphericBackground, SafeAreaOverlay,
                         CrownHardware (facade+interior), Phone (shell/screen/status),
                         PhoneScreens, PhoneContent, Signals, SignalStrand, icons, text
    scenes/             Scene1..Scene5 copy/overlay layers

DELIVERABLES (out/)
  OmniFlowZeroPresenceAd.mp4     final 1080x1920 H.264 video
  review/frame_94.png            still — Scene 1 settled (ref: search_your_business_name_first)
  review/frame_224.png           still — Scene 2 settled (ref: your_doors_may_be_open...)
  review/frame_378.png           still — Scene 3 settled (ref: your_business_needs_to_be_found)
  review/frame_516.png           still — Scene 4 settled (ref: the_digital_silence_of_an_empty_shop)
  review/frame_672.png           still — Scene 5 settled (ref: omniflow_digital_improving_business_visibility)
  transitions/t_109-145.mp4      transition preview S1->S2
  transitions/t_241-282.mp4      transition preview S2->S3
  transitions/t_396-437.mp4      transition preview S3->S4
  transitions/t_530-570.mp4      transition preview S4->S5
  safe_overlay.png               safe-area overlay preview (dev overlay, never in final render)
  ACCEPTANCE_TEST_REPORT.txt     acceptance-test checklist
  MISMATCH_REPORT.txt            review corrections + deviations

CONFIRMATIONS
  - Scenes 1-4 contain NO OmniFlow branding; branding appears only in Scene 5.
  - No supplied logo asset was provided -> Scene 5 uses a TEXT-ONLY wordmark; no logo invented/redrawn.
  - No storyboard image is used as a full-screen timeline slide; all readable text, cards, icons and
    routes are recreated as live React / SVG layers.

PREVIEW / RE-RENDER
  npm run dev                                   # open Remotion Studio
  npx remotion render OmniFlowZeroPresenceAd out/OmniFlowZeroPresenceAd.mp4 --codec=h264 --pixel-format=yuv420p
