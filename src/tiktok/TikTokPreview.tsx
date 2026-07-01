import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, delayRender, continueRender } from "remotion";
import { useEffect, useRef } from "react";
import { COLORS, F } from "./config";
import { initSpaceGrotesk } from "./fonts";
import { HookScene }    from "./HookScene";
import { BuildupScene } from "./BuildupScene";
import { FlashMoment }  from "./FlashMoment";

// Total frames for the preview composition (Hook + Buildup + Flash)
export const PREVIEW_FRAMES = F.FLASH_END; // 135

// Shake noise — deterministic pseudo-random from frame
function shakeXY(frame: number, amp: number): { x: number; y: number } {
  const t = frame * 0.35;
  return {
    x: (Math.sin(t * 2.7) * 0.6 + Math.sin(t * 5.3) * 0.4) * amp,
    y: (Math.cos(t * 3.1) * 0.6 + Math.cos(t * 7.2) * 0.4) * amp,
  };
}

// Camera punch at flash impact — damped sinusoidal, peaks at frame ~3
function punchScale(punchFrame: number): number {
  if (punchFrame <= 0) return 1;
  const t   = punchFrame * 0.48;
  const val = Math.sin(t) * Math.exp(-punchFrame * 0.32);
  return 1 + Math.max(0, val) * 0.095;
}

export const TikTokPreview: React.FC = () => {
  const fontHandle = useRef<number | null>(null);
  useEffect(() => {
    fontHandle.current = delayRender("space-grotesk-fonts");
    initSpaceGrotesk().then(() => {
      if (fontHandle.current !== null) continueRender(fontHandle.current);
    });
  }, []);

  const frame = useCurrentFrame(); // global: 0-134

  // ── Global camera shake (escalates through buildup, spikes at flash) ─
  const shakeAmp = interpolate(
    frame,
    [F.HOOK_END, F.BUILDUP_END - 5, F.FLASH_START, F.FLASH_START + 5, F.FLASH_END],
    [0,          6,                  14,             22,                 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const { x: sx, y: sy } = shakeXY(frame, shakeAmp);

  // ── Camera punch-in at flash moment ──────────────────────────────
  const camScale = punchScale(frame - F.FLASH_START);

  return (
    <AbsoluteFill style={{ background: COLORS.void, overflow: "hidden" }}>
      {/* Camera motion wrapper — shake + punch applied globally */}
      <AbsoluteFill style={{
        transform:       `translate(${sx}px, ${sy}px) scale(${camScale})`,
        transformOrigin: "center center",
      }}>
        {/* ── Hook (frames 0-59) ─────────────────────────────────── */}
        <Sequence from={F.HOOK_START} durationInFrames={F.HOOK_END - F.HOOK_START}>
          <AbsoluteFill>
            <HookScene />
          </AbsoluteFill>
        </Sequence>

        {/* ── Buildup (frames 60-119) ────────────────────────────── */}
        <Sequence from={F.BUILDUP_START} durationInFrames={F.BUILDUP_END - F.BUILDUP_START}>
          <AbsoluteFill>
            <BuildupScene />
          </AbsoluteFill>
        </Sequence>

        {/* ── Flash moment (frames 120-134) ──────────────────────── */}
        <Sequence from={F.FLASH_START} durationInFrames={F.FLASH_END - F.FLASH_START}>
          <AbsoluteFill>
            <FlashMoment />
          </AbsoluteFill>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
