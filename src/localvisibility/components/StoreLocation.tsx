import { useCurrentFrame } from "remotion";
import { C, F } from "../styles/tokens";
import { prog } from "../../omniflowad/ui/anim";

/** Map pin dropped above a diagram object. */
export const MapPin: React.FC<{ color?: string; size?: number; delay?: number }> = ({ color = C.cyan, size = 56, delay = 0 }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, 16);
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 68 88"
      style={{ display: "block", opacity: t, transform: `translateY(${(1 - t) * -18}px)` }}
    >
      <path
        d="M34 4 C50 4 64 17 64 34 C64 52 48 62 34 84 C20 62 4 52 4 34 C4 17 18 4 34 4 Z"
        fill={color === C.cyan ? "rgba(0,140,160,0.9)" : "rgba(30,34,40,0.95)"}
        stroke={color}
        strokeWidth={3}
        style={{ filter: color === C.cyan ? "drop-shadow(0 0 10px rgba(0,216,242,0.5))" : undefined }}
      />
      <circle cx={34} cy={34} r={11} fill={color === C.cyan ? "#DFFBFF" : "rgba(255,255,255,0.35)"} />
    </svg>
  );
};

/**
 * Small dimensional storefront for the scene 02 map diagram.
 */
export const StoreLocation: React.FC<{
  sign: string;
  signColor?: string;
  signText?: string;
  awning?: boolean;
  label: string;
  ring?: string | null;
  lit?: number;
  frame?: number;
}> = ({ sign, signColor = "#EDE3CE", signText = "#221607", awning, label, ring = C.cyan, lit = 1 }) => {
  const frame = useCurrentFrame();
  const ringPulse = 0.75 + 0.25 * Math.sin(frame / 11);
  return (
    <div style={{ position: "relative" }}>
      <svg viewBox="0 0 300 250" style={{ display: "block", width: "100%", overflow: "visible" }}>
        {ring && (
          <g opacity={ringPulse}>
            <ellipse cx={150} cy={212} rx={104} ry={26} fill="none" stroke={ring} strokeWidth={3} opacity={0.75} />
            <ellipse cx={150} cy={212} rx={122} ry={32} fill="none" stroke={ring} strokeWidth={1.6} opacity={0.35} />
          </g>
        )}
        {/* side + roof + front */}
        <polygon points="226,88 258,68 258,168 226,200" fill="#0A0908" stroke="rgba(255,255,255,0.05)" strokeWidth={1.5} />
        <polygon points="62,88 94,60 258,68 226,88" fill="#12100D" stroke="rgba(255,255,255,0.06)" strokeWidth={1.5} />
        <rect x={62} y={88} width={164} height={112} fill="#16130F" stroke="rgba(255,255,255,0.07)" strokeWidth={1.5} />
        {/* sign band */}
        <rect x={70} y={94} width={148} height={30} rx={4} fill={signColor} stroke="rgba(0,0,0,0.4)" strokeWidth={1.4} />
        <text x={144} y={115} textAnchor="middle" fontFamily={F.headline} fontWeight={800} fontSize={sign.length > 12 ? 14.5 : 17} letterSpacing={sign.length > 12 ? 0.2 : 0.6} fill={signText}>
          {sign}
        </text>
        {awning && (
          <g>
            {Array.from({ length: 8 }, (_, i) => (
              <polygon
                key={i}
                points={`${72 + i * 18},128 ${90 + i * 18},128 ${94 + i * 18},144 ${76 + i * 18},144`}
                fill={i % 2 === 0 ? "#B0392C" : "#E8E2D8"}
              />
            ))}
          </g>
        )}
        {/* windows + door, warm */}
        <rect x={76} y={awning ? 150 : 134} width={56} height={awning ? 44 : 60} rx={3} fill="#3A2410" opacity={0.5 + 0.5 * lit} />
        <rect x={140} y={awning ? 150 : 134} width={30} height={awning ? 44 : 60} rx={3} fill="#33200E" opacity={0.45 + 0.5 * lit} />
        <rect x={178} y={awning ? 150 : 134} width={36} height={awning ? 44 : 60} rx={3} fill="#2E1B08" opacity={0.55 + 0.45 * lit} />
        <rect x={70} y={132} width={150} height={66} fill="#FFB65C" opacity={0.1 * lit} />
        <rect x={114} y={200} width={64} height={6} rx={2} fill="#0D0B09" />
      </svg>
      <div
        style={{
          position: "absolute",
          top: "102%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: F.label,
          fontSize: 25,
          fontWeight: 500,
          letterSpacing: 2,
          color: C.white,
          whiteSpace: "pre",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/**
 * The customer as a small warm-windowed building on cyan sonar rings.
 */
export const CustomerLocation: React.FC<{ label?: string }> = ({ label = "YOUR CUSTOMER" }) => {
  const frame = useCurrentFrame();
  const r1 = (frame % 52) / 52;
  const r2 = ((frame + 26) % 52) / 52;
  return (
    <div style={{ position: "relative" }}>
      <svg viewBox="0 0 300 260" style={{ display: "block", width: "100%", overflow: "visible" }}>
        {/* sonar rings */}
        {[r1, r2].map((r, i) => (
          <ellipse
            key={i}
            cx={150}
            cy={216}
            rx={70 + r * 90}
            ry={(70 + r * 90) * 0.28}
            fill="none"
            stroke={C.cyan}
            strokeWidth={2.5}
            opacity={0.55 * (1 - r)}
          />
        ))}
        <ellipse cx={150} cy={216} rx={64} ry={18} fill="rgba(0,216,242,0.1)" stroke={C.cyan} strokeWidth={2.5} opacity={0.85} />
        {/* building: two faces + roof */}
        <polygon points="188,92 224,74 224,180 188,208" fill="#0B0A09" stroke="rgba(255,255,255,0.05)" strokeWidth={1.5} />
        <polygon points="96,92 132,74 224,74 188,92" fill="#131110" stroke="rgba(255,255,255,0.06)" strokeWidth={1.5} />
        <rect x={96} y={92} width={92} height={116} fill="#171411" stroke="rgba(255,255,255,0.08)" strokeWidth={1.5} />
        {/* warm windows */}
        {[
          [104, 102], [138, 102], [104, 138], [138, 138], [104, 174],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width={26} height={26} rx={2} fill="#FFB65C" opacity={i % 2 === 0 ? 0.75 : 0.45} />
        ))}
        <rect x={138} y={166} width={26} height={42} rx={2} fill="#3A2712" />
        {/* side-face window hints */}
        <rect x={196} y={108} width={18} height={20} rx={2} fill="#FFB65C" opacity={0.28} transform="skewY(-26)" transform-origin="196 108" />
      </svg>
      <div
        style={{
          position: "absolute",
          top: "104%",
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: F.label,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: 2,
          color: C.white,
          whiteSpace: "pre",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/** Bordered diagram callout with optional pointer leader. */
export const Callout: React.FC<{
  lines: readonly string[];
  color?: string;
  delay?: number;
  width?: number;
  align?: "left" | "center";
}> = ({ lines, color = C.cyanOutline, delay = 0, width = 280, align = "left" }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, 20);
  return (
    <div
      style={{
        width,
        borderRadius: 18,
        border: `2px solid ${color}`,
        background: "rgba(7,11,15,0.92)",
        padding: "18px 22px",
        fontFamily: F.body,
        boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
        opacity: t,
        transform: `translateY(${(1 - t) * 14}px) scale(${0.96 + 0.04 * t})`,
        textAlign: align,
      }}
    >
      {lines.map((line) => (
        <div key={line} style={{ fontSize: 25, lineHeight: 1.42, fontWeight: 500, color: C.white, whiteSpace: "pre" }}>
          {line}
        </div>
      ))}
    </div>
  );
};
