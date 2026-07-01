import { useCurrentFrame, interpolate, Easing } from "remotion";
import { W, H } from "./config";

const CX = W / 2;
const CY = H / 2;

// Diagonal of frame — radius needed to fully cover from center
const COVER_R = Math.sqrt(CX * CX + CY * CY) + 50; // ~1115px + margin

export const FlashMoment: React.FC = () => {
  const frame = useCurrentFrame(); // local: 0-14

  // ── White radial expands from center in 3 frames ─────────────────
  const expand = interpolate(frame, [0, 3], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0, 0, 0.15, 1), // near-instant expansion
  });

  // ── Opacity: instant peak, long tail ─────────────────────────────
  const flashOpacity = interpolate(frame, [0, 1, 4, 14], [0, 1, 0.85, 0], {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
    easing:           Easing.bezier(0.4, 0, 0.8, 0),
  });

  // ── Afterglow: cyan tint that lingers longer than the white ───────
  const afterglowOpacity = interpolate(frame, [3, 6, 14], [0, 0.45, 0], {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
  });

  // Size of the expanding circle
  const flashSize = COVER_R * 2 * expand;

  return (
    <div style={{ width: W, height: H, position: "relative", overflow: "hidden" }}>

      {/* ── Main white radial burst ────────────────────────────────── */}
      <div style={{
        position:     "absolute",
        left:         CX - flashSize / 2,
        top:          CY - flashSize / 2,
        width:        flashSize,
        height:       flashSize,
        borderRadius: "50%",
        background:   `radial-gradient(circle,
          rgba(255,255,255,1)   0%,
          rgba(255,255,255,0.9) 12%,
          rgba(0,229,255,0.7)   30%,
          rgba(0,229,255,0.25)  55%,
          transparent           72%)`,
        opacity:    flashOpacity,
        pointerEvents: "none",
      }} />

      {/* ── Cyan afterglow — lingers after white fades ────────────── */}
      <div style={{
        position:  "absolute",
        inset:     0,
        background: `radial-gradient(ellipse 75% 60% at 50% 50%,
          rgba(0,229,255,0.35) 0%,
          rgba(0,137,178,0.15) 45%,
          transparent          70%)`,
        opacity: afterglowOpacity,
        pointerEvents: "none",
      }} />
    </div>
  );
};
