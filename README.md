# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## OmniFlow — "Invisible Shortlist" ad (`OmniFlowInvisibleShortlist`)

A strictly frame-controlled 26s vertical ad (1080×1920, 30fps, 780 frames).
Every visual property is derived from `useCurrentFrame()` — there are no CSS
keyframes, transitions, timers or uncontrolled springs. One continuous camera,
a persistent isometric city and a single persistent `YOUR BUSINESS` storefront
carry across all six scenes; each transition morphs the last object of one
scene into the first object of the next.

Key files:

- `src/compositions/OmniFlowInvisibleShortlist.tsx` — top-level composition
- `src/timeline/framePlan.ts` — all frame ranges, timing helpers, camera + storefront state
- `src/scenes/Scene0{1..6}*.tsx` — the six scenes
- `src/components/*` — reusable city / UI / route / text components
- `src/styles/{tokens,typography,fonts}.ts` — shared visual system
- `scripts/audit.sh` — extracts the audit frames + builds the contact sheet

Fonts (Inter Tight / Manrope / IBM Plex Sans) load from `public/fonts/` so
renders are fully deterministic and never touch the network.

**Render the ad:**

```console
npx remotion render src/index.ts OmniFlowInvisibleShortlist out/omniflow-invisible-shortlist.mp4 --codec=h264 --crf=16
```

**Frame audit + contact sheet (internal dev only):**

```console
bash scripts/audit.sh   # -> out/audit/audit_*.png + out/audit/contact-sheet.html
```

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
