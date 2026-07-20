import { useMemo } from "react";
import { F } from "../styles";

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

type Variant = "crown" | "besttools";

/**
 * Miniature 2.5D storefront that sits on the map floor: front face + right
 * side face + roof for isometric depth, a lit sign band with gooseneck
 * lamps, warm shelved windows, a door, WE'RE OPEN sign, two shrubs, a
 * contact shadow and a warm light pool on the map.
 *
 * viewBox is 640×620; place/scale via the wrapper. `lit` (0..1) drives
 * every warm light so scenes can dim an inactive store. Crown Hardware keeps
 * identical geometry across all scenes — only lit/scale/position change.
 */
export const IsoStorefront: React.FC<{
  variant: Variant;
  lit?: number;
  seed?: number;
  showSubline?: boolean;
}> = ({ variant, lit = 1, seed, showSubline = false }) => {
  const L = Math.max(0, Math.min(1, lit));
  const name = variant === "crown" ? "CROWN HARDWARE" : "BEST TOOLS TT";
  const s = seed ?? (variant === "crown" ? 91 : 47);

  // deterministic shelved products behind the windows
  const products = useMemo(() => {
    const rnd = mulberry32(s * 2654435761);
    const cols = ["#C98F4A", "#7FA8C9", "#D9B06A", "#8A5B2B", "#5E8A6B", "#B0645A", "#6E4A22", "#A9B6C4"];
    const out: { x: number; y: number; w: number; h: number; c: string }[] = [];
    const shelves = [318, 372, 426];
    for (const sy of shelves) {
      let x = 96;
      while (x < 300) {
        const w = 10 + rnd() * 16;
        const h = 16 + rnd() * 26;
        out.push({ x, y: sy - h, w, h, c: cols[Math.floor(rnd() * cols.length)] });
        x += w + 3 + rnd() * 9;
      }
    }
    return out;
  }, [s]);

  return (
    <svg viewBox="0 0 640 620" style={{ display: "block", width: "100%", overflow: "visible" }}>
      <defs>
        <linearGradient id={`front-${s}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#241A12" />
          <stop offset="1" stopColor="#140D08" />
        </linearGradient>
        <linearGradient id={`side-${s}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0F0A06" />
          <stop offset="1" stopColor="#060403" />
        </linearGradient>
        <linearGradient id={`roof-${s}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B140D" />
          <stop offset="1" stopColor="#0E0A06" />
        </linearGradient>
        <linearGradient id={`sign-${s}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBEFD3" />
          <stop offset="1" stopColor="#E7C888" />
        </linearGradient>
        <radialGradient id={`glow-${s}`} cx="0.5" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#FFCB7A" stopOpacity="0.6" />
          <stop offset="1" stopColor="#FFCB7A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`bulb-${s}`}>
          <stop offset="0" stopColor="#FFE7B4" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFE7B4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* warm light pool on the map + contact shadow */}
      <ellipse cx={300} cy={556} rx={250} ry={44} fill="#000" opacity={0.5} style={{ filter: "blur(10px)" }} />
      <ellipse cx={324} cy={550} rx={210} ry={46} fill={`url(#glow-${s})`} opacity={0.34 * L} style={{ filter: "blur(12px)" }} />

      {/* base slab */}
      <polygon points="70,470 430,470 556,410 196,410" fill="#0C0906" stroke="rgba(255,255,255,0.04)" strokeWidth={1.5} />
      <polygon points="70,470 430,470 430,486 70,486" fill="#080605" />

      {/* ---- building box ---- */}
      {/* right side face */}
      <polygon points={`430,150 556,90 556,410 430,470`} fill={`url(#side-${s})`} stroke="rgba(255,255,255,0.05)" strokeWidth={1.4} />
      {/* small side windows */}
      <polygon points="470,175 505,158 505,205 470,222" fill="#2A1E10" opacity={0.5 + 0.5 * L} />
      <polygon points="516,152 540,140 540,182 516,194" fill="#241A0E" opacity={0.4 + 0.5 * L} />
      {/* roof */}
      <polygon points={`60,150 430,150 556,90 186,90`} fill={`url(#roof-${s})`} stroke="rgba(255,255,255,0.06)" strokeWidth={1.4} />
      {/* front face */}
      <polygon points="60,150 430,150 430,470 60,470" fill={`url(#front-${s})`} stroke="rgba(255,255,255,0.06)" strokeWidth={1.4} />

      {/* cornice */}
      <polygon points="56,150 434,150 434,164 56,164" fill="#0E0A06" />
      <polygon points="56,150 434,150 434,153 56,153" fill="#F5C97B" opacity={0.28 * L} />

      {/* gooseneck lamps over the sign */}
      {[120, 245, 370].map((x) => (
        <g key={x}>
          <polygon points={`${x},176 ${x - 40},250 ${x + 40},250`} fill="#FFDF9E" opacity={0.22 * L} />
          <path d={`M${x},172 C${x},158 ${x - 16},157 ${x - 16},168`} stroke="#0B0805" strokeWidth={4} fill="none" strokeLinecap="round" />
          <ellipse cx={x} cy={176} rx={8} ry={3.4} fill="#FFE9B8" opacity={0.5 + 0.5 * L} />
          <circle cx={x} cy={178} r={17} fill={`url(#bulb-${s})`} opacity={0.9 * L} />
        </g>
      ))}

      {/* sign band */}
      <rect x={78} y={186} width={334} height={54} rx={4} fill="#FFCB7A" opacity={0.5 * L} style={{ filter: "blur(14px)" }} />
      <rect x={78} y={186} width={334} height={54} rx={4} fill={`url(#sign-${s})`} />
      <rect x={78} y={186} width={334} height={54} rx={4} fill="#0B0805" opacity={0.75 * (1 - L)} />
      <rect x={78} y={186} width={334} height={54} rx={4} fill="none" stroke="#6E4C1E" strokeWidth={2} />
      <text
        x={245}
        y={222}
        textAnchor="middle"
        fontFamily={F.head}
        fontWeight={800}
        fontSize={variant === "crown" ? 33 : 31}
        letterSpacing={0.5}
        fill="#201304"
        opacity={0.35 + 0.65 * L}
      >
        {name}
      </text>
      {showSubline && (
        <text x={245} y={236} textAnchor="middle" fontFamily={F.head} fontWeight={700} fontSize={9.5} letterSpacing={1.4} fill="#3d2a0e" opacity={0.4 + 0.6 * L}>
          TOOLS • PAINT • PLUMBING • ELECTRICAL
        </text>
      )}

      {/* window band */}
      {/* left display window */}
      <rect x={74} y={256} width={158} height={196} fill="#0C0805" />
      <rect x={82} y={264} width={142} height={180} fill="#2E2110" opacity={0.5 + 0.5 * L} />
      <rect x={82} y={264} width={142} height={180} fill={`url(#glow-${s})`} opacity={0.7 * L} />
      {[318, 372, 426].map((sy) => (
        <rect key={sy} x={88} y={sy} width={130} height={5} rx={2} fill="#5A3A16" opacity={0.4 + 0.6 * L} />
      ))}
      {products.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={2} fill={p.c} opacity={0.32 + 0.6 * L} />
      ))}
      {/* pendant lamps inside */}
      {[120, 190].map((px) => (
        <g key={px}>
          <line x1={px} y1={266} x2={px} y2={286} stroke="#241808" strokeWidth={2.4} />
          <circle cx={px} cy={290} r={12} fill={`url(#bulb-${s})`} opacity={0.85 * L} />
        </g>
      ))}
      <rect x={74} y={256} width={158} height={196} fill="none" stroke="#1E1409" strokeWidth={7} />
      <line x1={153} y1={260} x2={153} y2={448} stroke="#1E1409" strokeWidth={5} />

      {/* right glass door */}
      <rect x={244} y={256} width={158} height={196} fill="#0C0805" />
      <rect x={252} y={264} width={142} height={180} fill="#2A1E10" opacity={0.45 + 0.5 * L} />
      <rect x={252} y={264} width={142} height={180} fill={`url(#glow-${s})`} opacity={0.6 * L} />
      {[318, 372, 426].map((sy) => (
        <rect key={`r${sy}`} x={258} y={sy} width={130} height={5} rx={2} fill="#5A3A16" opacity={0.35 + 0.55 * L} />
      ))}
      <rect x={244} y={256} width={158} height={196} fill="none" stroke="#1E1409" strokeWidth={7} />
      <line x1={323} y1={260} x2={323} y2={448} stroke="#1E1409" strokeWidth={5} />
      <rect x={312} y={352} width={5} height={54} rx={2.5} fill="#C9A25A" opacity={0.5 + 0.5 * L} />

      {/* WE'RE OPEN small sign */}
      <g transform="translate(360, 396)">
        <rect x={-30} y={-2} width={62} height={50} rx={3} fill="#0E0B07" stroke="#2A241C" strokeWidth={2} />
        <text x={1} y={18} textAnchor="middle" fontFamily={F.ui} fontWeight={600} fontSize={13} fill="#EDE6D4" opacity={0.5 + 0.5 * L}>
          WE&#39;RE
        </text>
        <text x={1} y={38} textAnchor="middle" fontFamily={F.ui} fontWeight={700} fontSize={16} fill="#F2EADA" opacity={0.5 + 0.5 * L}>
          OPEN
        </text>
      </g>

      {/* wall lanterns */}
      {[66, 408].map((x) => (
        <g key={`lt${x}`}>
          <rect x={x - 5} y={262} width={10} height={26} rx={2} fill="#1B1611" />
          <rect x={x - 3} y={266} width={6} height={18} rx={1.5} fill="#F2C87F" opacity={0.3 + 0.7 * L} />
          <circle cx={x} cy={274} r={15} fill={`url(#bulb-${s})`} opacity={0.7 * L} />
        </g>
      ))}

      {/* two shrubs */}
      {[46, 424].map((x, i) => (
        <g key={`sh${x}`} transform={`translate(${x}, 452)`}>
          <path d="M-15,20 L15,20 L11,54 L-11,54 Z" fill="#160E07" stroke="#241810" strokeWidth={1.5} />
          <circle cx={0} cy={6} r={19} fill={i === 0 ? "#1C2A16" : "#20301B"} />
          <circle cx={-9} cy={-2} r={13} fill="#233619" />
          <circle cx={9} cy={0} r={12} fill="#1E2E17" />
          <circle cx={4} cy={2} r={13} fill="#FFB65C" opacity={0.06 * L} />
        </g>
      ))}
    </svg>
  );
};
