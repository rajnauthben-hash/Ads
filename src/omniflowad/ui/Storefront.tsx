import { useMemo } from "react";
import { S1 } from "../copy";

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Crown Hardware storefront, rebuilt as layered vector art:
 * brick facade, glowing sign board, gooseneck lamps, warm shelved windows,
 * wall lanterns, planters and the WE'RE OPEN a-board.
 *
 * `lightsOn` (0..1) drives every light source so scene 01 can wake it up.
 * viewBox is 760x1000; scale via the width prop on the wrapper.
 */
export const Storefront: React.FC<{ lightsOn?: number; frame?: number; showBoard?: boolean }> = ({
  lightsOn = 1,
  frame = 0,
  showBoard = true,
}) => {
  const L = Math.max(0, Math.min(1, lightsOn));
  const flickerA = 1 - 0.05 * Math.max(0, Math.sin(frame * 0.9) * Math.sin(frame * 0.37));

  // Shelf products — deterministic clutter
  const products = useMemo(() => {
    const rnd = mulberry32(1188);
    const colors = ["#C98F4A", "#8A5B2B", "#D9B06A", "#6E4A22", "#4A6B8A", "#A0522D", "#B08948", "#5E6E4A"];
    const rows: { x: number; y: number; w: number; h: number; c: string }[] = [];
    const shelves = [472, 566, 660, 754];
    for (const sy of shelves) {
      let x = 96;
      while (x < 380) {
        const w = 14 + rnd() * 22;
        const h = 24 + rnd() * 42;
        rows.push({ x, y: sy - h, w, h, c: colors[Math.floor(rnd() * colors.length)] });
        x += w + 4 + rnd() * 14;
      }
      // right (door-side) window shelves, sparser
      let x2 = 468;
      while (x2 < 660) {
        const w = 13 + rnd() * 20;
        const h = 22 + rnd() * 38;
        rows.push({ x: x2, y: sy - h, w, h, c: colors[Math.floor(rnd() * colors.length)] });
        x2 += w + 8 + rnd() * 18;
      }
    }
    return rows;
  }, []);

  const lamp = (x: number) => (
    <g key={x}>
      {/* light cone */}
      <polygon points={`${x},128 ${x - 88},330 ${x + 88},330`} fill="url(#coneGrad)" opacity={0.3 * L * flickerA} />
      {/* gooseneck */}
      <path d={`M${x},152 C${x},118 ${x - 34},116 ${x - 34},140`} stroke="#141210" strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d={`M${x - 16},158 L${x + 16},158 L${x + 10},138 L${x - 10},138 Z`} fill="#191713" />
      <ellipse cx={x} cy={160} rx={13} ry={5} fill="#FFE9B8" opacity={0.55 + 0.45 * L} />
      <circle cx={x} cy={164} r={30} fill="url(#bulbGlow)" opacity={0.9 * L * flickerA} />
    </g>
  );

  const lantern = (x: number) => (
    <g key={`lt${x}`}>
      <rect x={x - 4} y={402} width={8} height={16} fill="#171310" />
      <path d={`M${x - 16},418 L${x + 16},418 L${x + 12},468 L${x - 12},468 Z`} fill="#1B1611" stroke="#242018" strokeWidth={2} />
      <rect x={x - 8} y={426} width={16} height={34} rx={3} fill="#F2C87F" opacity={0.25 + 0.75 * L} />
      <circle cx={x} cy={442} r={26} fill="url(#bulbGlow)" opacity={0.75 * L} />
    </g>
  );

  return (
    <svg viewBox="0 0 760 1000" style={{ display: "block", width: "100%", overflow: "visible" }}>
      <defs>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#33200F" />
          <stop offset="0.45" stopColor="#1E1309" />
          <stop offset="1" stopColor="#0F0905" />
        </linearGradient>
        <linearGradient id="signGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBF0D6" />
          <stop offset="0.55" stopColor="#F3DCA9" />
          <stop offset="1" stopColor="#E2BC76" />
        </linearGradient>
        <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#54341483" />
          <stop offset="0.5" stopColor="#3A241083" />
          <stop offset="1" stopColor="#1c100683" />
        </linearGradient>
        <radialGradient id="bulbGlow">
          <stop offset="0" stopColor="#FFE9B8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFE9B8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="coneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFDF9E" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFDF9E" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="interiorGlow" cx="0.5" cy="0.25" r="0.9">
          <stop offset="0" stopColor="#F7C87D" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F7C87D" stopOpacity="0" />
        </radialGradient>
        <pattern id="brick" width="52" height="24" patternUnits="userSpaceOnUse">
          <rect width="52" height="24" fill="none" />
          <line x1="0" y1="0" x2="52" y2="0" stroke="rgba(0,0,0,0.4)" strokeWidth="2" />
          <line x1="0" y1="12" x2="52" y2="12" stroke="rgba(0,0,0,0.4)" strokeWidth="2" />
          <line x1="14" y1="0" x2="14" y2="12" stroke="rgba(0,0,0,0.32)" strokeWidth="2" />
          <line x1="40" y1="12" x2="40" y2="24" stroke="rgba(0,0,0,0.32)" strokeWidth="2" />
        </pattern>
        <filter id="signBlur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      {/* ---- facade ---- */}
      <rect x={36} y={120} width={688} height={752} fill="url(#wallGrad)" />
      <rect x={36} y={120} width={688} height={752} fill="url(#brick)" opacity={0.5} />
      {/* warm wash from the sign lights */}
      <rect x={36} y={120} width={688} height={420} fill="url(#interiorGlow)" opacity={0.55 * L} />
      {/* cornice */}
      <rect x={28} y={102} width={704} height={24} fill="#261709" />
      <rect x={28} y={102} width={704} height={4} fill="#F5C97B" opacity={0.28 * L} />

      {/* ---- gooseneck lamps ---- */}
      {[150, 380, 610].map(lamp)}

      {/* ---- sign board ---- */}
      <rect x={64} y={176} width={632} height={148} rx={8} fill="#F2C87F" filter="url(#signBlur)" opacity={0.6 * L * flickerA} />
      <rect x={64} y={176} width={632} height={148} rx={8} fill="url(#signGrad)" />
      <rect x={64} y={176} width={632} height={148} rx={8} fill="#0B0805" opacity={0.78 * (1 - L)} />
      <rect x={64} y={176} width={632} height={148} rx={8} fill="none" stroke="#6E4C1E" strokeWidth={3} />
      <text
        x={380}
        y={248}
        textAnchor="middle"
        fontFamily="Inter Tight, Inter, sans-serif"
        fontWeight={800}
        fontSize={62}
        letterSpacing={1}
        fill="#221304"
        opacity={0.35 + 0.65 * L}
      >
        {S1.sign}
      </text>
      <text
        x={380}
        y={296}
        textAnchor="middle"
        fontFamily="Inter Tight, Inter, sans-serif"
        fontWeight={700}
        fontSize={21}
        letterSpacing={2.5}
        fill="#402A0C"
        opacity={0.35 + 0.65 * L}
      >
        {S1.signSub}
      </text>

      {/* ---- window band ---- */}
      {/* left display window */}
      <rect x={60} y={352} width={360} height={468} fill="#0E0A06" />
      <rect x={72} y={364} width={336} height={444} fill="url(#glassGrad)" />
      <rect x={72} y={364} width={336} height={444} fill="url(#interiorGlow)" opacity={L} />
      {/* shelves + products */}
      {[472, 566, 660, 754].map((sy) => (
        <rect key={sy} x={80} y={sy} width={320} height={7} rx={2} fill="#5A3A16" opacity={0.4 + 0.6 * L} />
      ))}
      {products
        .filter((p) => p.x < 430)
        .map((p, i) => (
          <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={3} fill={p.c} opacity={0.35 + 0.6 * L} />
        ))}
      {/* pendant lamps inside */}
      {[150, 250, 340].map((px) => (
        <g key={`p${px}`}>
          <line x1={px} y1={368} x2={px} y2={402} stroke="#241808" strokeWidth={3} />
          <path d={`M${px - 14},402 L${px + 14},402 L${px + 8},388 L${px - 8},388 Z`} fill="#2A1F10" />
          <circle cx={px} cy={408} r={18} fill="url(#bulbGlow)" opacity={0.85 * L} />
        </g>
      ))}
      {/* window frame */}
      <rect x={60} y={352} width={360} height={468} fill="none" stroke="#23180C" strokeWidth={12} />
      <line x1={240} y1={358} x2={240} y2={814} stroke="#23180C" strokeWidth={8} />

      {/* right glass door */}
      <rect x={444} y={352} width={244} height={468} fill="#0E0A06" />
      <rect x={454} y={364} width={224} height={444} fill="url(#glassGrad)" />
      <rect x={454} y={364} width={224} height={444} fill="url(#interiorGlow)" opacity={0.9 * L} />
      {[472, 566, 660].map((sy) => (
        <rect key={`r${sy}`} x={462} y={sy} width={150} height={6} rx={2} fill="#5A3A16" opacity={0.35 + 0.55 * L} />
      ))}
      {products
        .filter((p) => p.x >= 430)
        .map((p, i) => (
          <rect key={`rp${i}`} x={p.x} y={p.y} width={p.w} height={p.h} rx={3} fill={p.c} opacity={0.3 + 0.55 * L} />
        ))}
      <rect x={444} y={352} width={244} height={468} fill="none" stroke="#23180C" strokeWidth={12} />
      <line x1={566} y1={358} x2={566} y2={814} stroke="#23180C" strokeWidth={8} />
      {/* door handle */}
      <rect x={548} y={560} width={7} height={92} rx={3.5} fill="#C9A25A" opacity={0.5 + 0.5 * L} />

      {/* ---- wall lanterns ---- */}
      {lantern(48)}
      {lantern(712)}

      {/* ---- base / sidewalk ---- */}
      <rect x={20} y={868} width={720} height={30} fill="#0B0906" />
      <rect x={20} y={868} width={720} height={4} fill="#F5C97B" opacity={0.14 * L} />

      {/* ---- planters ---- */}
      {[
        { x: 52, s: 1 },
        { x: 706, s: 1.06 },
      ].map(({ x, s }) => (
        <g key={`pl${x}`} transform={`translate(${x}, 0) scale(${s})`}>
          <ellipse cx={0} cy={772} rx={44} ry={40} fill="#152112" />
          <ellipse cx={-18} cy={752} rx={30} ry={28} fill="#1B2A17" />
          <ellipse cx={16} cy={748} rx={26} ry={26} fill="#182615" />
          <ellipse cx={0} cy={738} rx={22} ry={20} fill="#20301B" />
          <path d="M-30,806 L30,806 L22,868 L-22,868 Z" fill="#191009" stroke="#241a10" strokeWidth={2} />
          <ellipse cx={8} cy={760} rx={26} ry={20} fill="#F2C87F" opacity={0.1 * L} />
        </g>
      ))}

      {/* ---- WE'RE OPEN a-board ---- */}
      {showBoard && (
        <g transform="translate(560, 690) rotate(-3)">
          <path d="M-58,178 L-46,178 L-30,60 L-42,60 Z" fill="#12100b" />
          <path d="M58,178 L46,178 L30,60 L42,60 Z" fill="#12100b" />
          <rect x={-66} y={10} width={132} height={172} rx={8} fill="#14100C" stroke="#2E2820" strokeWidth={4} />
          <rect x={-54} y={22} width={108} height={148} rx={4} fill="none" stroke="rgba(230,220,200,0.28)" strokeWidth={2} />
          <text x={0} y={82} textAnchor="middle" fontFamily="Inter Tight, Inter, sans-serif" fontWeight={600} fontSize={30} fill="#EDE6D4" opacity={0.5 + 0.5 * L}>
            {S1.openSign[0]}
          </text>
          <text x={0} y={126} textAnchor="middle" fontFamily="Inter Tight, Inter, sans-serif" fontWeight={700} fontSize={36} fill="#F2EADA" opacity={0.5 + 0.5 * L}>
            {S1.openSign[1]}
          </text>
          <line x1={-26} y1={144} x2={26} y2={144} stroke="#7FD8CE" strokeWidth={3} opacity={0.7} />
          <line x1={-16} y1={152} x2={16} y2={152} stroke="#7FD8CE" strokeWidth={2.4} opacity={0.5} />
        </g>
      )}
    </svg>
  );
};
