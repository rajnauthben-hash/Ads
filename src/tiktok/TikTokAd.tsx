import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, delayRender, continueRender } from "remotion";
import { useEffect, useRef } from "react";
import { COLORS, F } from "./config";
import { initSpaceGrotesk } from "./fonts";
import { HookScene }    from "./HookScene";
import { BuildupScene } from "./BuildupScene";
import { FlashMoment }  from "./FlashMoment";
import { RevealScene }  from "./scenes/RevealScene";
import { ProofScene }   from "./scenes/ProofScene";
import { LockupScene }  from "./scenes/LockupScene";

function shakeXY(frame: number, amp: number): { x: number; y: number } {
  const t = frame * 0.35;
  return {
    x: (Math.sin(t * 2.7) * 0.6 + Math.sin(t * 5.3) * 0.4) * amp,
    y: (Math.cos(t * 3.1) * 0.6 + Math.cos(t * 7.2) * 0.4) * amp,
  };
}

function punchScale(punchFrame: number): number {
  if (punchFrame <= 0) return 1;
  const t = punchFrame * 0.48;
  return 1 + Math.max(0, Math.sin(t) * Math.exp(-punchFrame * 0.32)) * 0.095;
}

export const TikTokAd: React.FC = () => {
  const fontHandle = useRef<number | null>(null);
  useEffect(() => {
    fontHandle.current = delayRender("space-grotesk-fonts");
    initSpaceGrotesk().then(() => {
      if (fontHandle.current !== null) continueRender(fontHandle.current);
    });
  }, []);

  const frame = useCurrentFrame();

  const shakeAmp = interpolate(
    frame,
    [F.HOOK_END, F.BUILDUP_END - 10, F.FLASH_START, F.FLASH_START + 5, F.FLASH_END, F.FLASH_END + 10],
    [0,          6,                   14,             22,                 0,           0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const { x: sx, y: sy } = shakeXY(frame, shakeAmp);
  const camScale = punchScale(frame - F.FLASH_START);

  return (
    <AbsoluteFill style={{ background: COLORS.void, overflow: "hidden" }}>
      <AbsoluteFill style={{
        transform:       `translate(${sx}px, ${sy}px) scale(${camScale})`,
        transformOrigin: "center center",
      }}>

        <Sequence from={F.HOOK_START} durationInFrames={F.HOOK_END - F.HOOK_START}>
          <AbsoluteFill><HookScene /></AbsoluteFill>
        </Sequence>

        <Sequence from={F.BUILDUP_START} durationInFrames={F.BUILDUP_END - F.BUILDUP_START}>
          <AbsoluteFill><BuildupScene /></AbsoluteFill>
        </Sequence>

        <Sequence from={F.FLASH_START} durationInFrames={F.FLASH_END - F.FLASH_START}>
          <AbsoluteFill><FlashMoment /></AbsoluteFill>
        </Sequence>

        <Sequence from={F.REVEAL_START} durationInFrames={F.REVEAL_END - F.REVEAL_START}>
          <AbsoluteFill><RevealScene /></AbsoluteFill>
        </Sequence>

        <Sequence from={F.PROOF_START} durationInFrames={F.PROOF_END - F.PROOF_START}>
          <AbsoluteFill><ProofScene /></AbsoluteFill>
        </Sequence>

        <Sequence from={F.LOCKUP_START} durationInFrames={F.LOCKUP_END - F.LOCKUP_START}>
          <AbsoluteFill><LockupScene /></AbsoluteFill>
        </Sequence>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
