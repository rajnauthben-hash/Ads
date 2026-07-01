// Sequence positions in the main 540-frame composition.
// Scenes overlap by 20 frames for crossfade transitions.
export const SEQ = {
  s1: { from: 0,   dur: 70  }, // comp 0–70
  s2: { from: 50,  dur: 80  }, // comp 50–130
  s3: { from: 110, dur: 80  }, // comp 110–190
  s4: { from: 170, dur: 110 }, // comp 170–280
  s5: { from: 260, dur: 110 }, // comp 260–370
  s6: { from: 350, dur: 110 }, // comp 350–460
  s7: { from: 440, dur: 100 }, // comp 440–540
} as const;

export const FADE_IN  = 12;
export const FADE_OUT = 12;
