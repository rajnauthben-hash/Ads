import React from "react";

/**
 * Tiny stroke-based glyphs used inside pins and signal nodes. Each glyph
 * is drawn in a ~24x24 box centred on (0,0).
 */
export type IconName =
  | "fork"
  | "coffee"
  | "bag"
  | "star"
  | "dumbbell"
  | "case"
  | "camera"
  | "grid"
  | "clock"
  | "pencil"
  | "walk"
  | "pin";

export const Glyph: React.FC<{ name: IconName; color: string; scale?: number; strokeWidth?: number }> = ({
  name,
  color,
  scale = 1,
  strokeWidth = 2,
}) => {
  const s = { stroke: color, strokeWidth, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let body: React.ReactNode = null;
  switch (name) {
    case "fork":
      body = (
        <>
          <path d="M -6 -10 L -6 -3 M -9 -10 L -9 -4 C -9 -1 -6 -1 -6 -3 M -3 -10 L -3 -4 C -3 -1 -6 -1 -6 -3 M -6 -1 L -6 10" {...s} />
          <path d="M 6 10 L 6 -2 C 3 -3 3 -8 6 -10 L 6 -2" {...s} />
        </>
      );
      break;
    case "coffee":
      body = (
        <>
          <path d="M -8 -4 L -8 4 C -8 8 -4 9 0 9 C 4 9 7 8 7 4 L 7 -4 Z" {...s} />
          <path d="M 7 -2 C 11 -2 11 4 7 4" {...s} />
          <path d="M -4 -7 C -4 -9 -2 -9 -2 -7 M 2 -7 C 2 -9 4 -9 4 -7" {...s} strokeWidth={1.4} />
        </>
      );
      break;
    case "bag":
      body = (
        <>
          <rect x={-8} y={-4} width={16} height={13} rx={2.5} {...s} />
          <path d="M -4 -4 C -4 -11 4 -11 4 -4" {...s} />
        </>
      );
      break;
    case "star":
      body = <path d="M 0 -10 L 2.9 -3.2 L 10 -2.8 L 4.6 2 L 6.2 9.2 L 0 5.4 L -6.2 9.2 L -4.6 2 L -10 -2.8 L -2.9 -3.2 Z" fill={color} stroke="none" />;
      break;
    case "dumbbell":
      body = (
        <>
          <path d="M -5 0 L 5 0" {...s} strokeWidth={2.4} />
          <rect x={-10} y={-5} width={4.5} height={10} rx={1.4} fill={color} stroke="none" />
          <rect x={5.5} y={-5} width={4.5} height={10} rx={1.4} fill={color} stroke="none" />
        </>
      );
      break;
    case "case":
      body = (
        <>
          <rect x={-9} y={-5} width={18} height={13} rx={2.5} {...s} />
          <path d="M -4 -5 L -4 -9 L 4 -9 L 4 -5" {...s} />
        </>
      );
      break;
    case "camera":
      body = (
        <>
          <rect x={-11} y={-6} width={22} height={15} rx={3} {...s} />
          <circle cx={0} cy={1.5} r={4.5} {...s} />
          <path d="M -5 -6 L -3 -10 L 3 -10 L 5 -6" {...s} />
        </>
      );
      break;
    case "grid":
      body = (
        <>
          <rect x={-10} y={-10} width={8.5} height={8.5} rx={1.6} {...s} />
          <rect x={1.5} y={-10} width={8.5} height={8.5} rx={1.6} {...s} />
          <rect x={-10} y={1.5} width={8.5} height={8.5} rx={1.6} {...s} />
          <rect x={1.5} y={1.5} width={8.5} height={8.5} rx={1.6} {...s} />
        </>
      );
      break;
    case "clock":
      body = (
        <>
          <circle cx={0} cy={0} r={10} {...s} />
          <path d="M 0 -5 L 0 0.5 L 4.5 3" {...s} />
        </>
      );
      break;
    case "pencil":
      body = (
        <>
          <path d="M -9 9 L -7.5 3.5 L 4.5 -8.5 L 9 -4 L -3 8 L -9 9 Z" {...s} />
          <path d="M 2 -6 L 6.5 -1.5" {...s} strokeWidth={1.4} />
        </>
      );
      break;
    case "walk":
      body = (
        <>
          <circle cx={0.5} cy={-8} r={2.6} fill={color} stroke="none" />
          <path d="M 0 -4.5 L -1 2 L -4.5 9 M -1 2 L 3 5 L 3.5 9.5 M -3 -2 L -5.5 1.5 M 0.5 -3.5 L 4.5 -1" {...s} />
        </>
      );
      break;
    case "pin":
      body = (
        <>
          <path d="M 0 9 C -5 3 -8 0 -8 -3.5 C -8 -8 -4.5 -10.5 0 -10.5 C 4.5 -10.5 8 -8 8 -3.5 C 8 0 5 3 0 9 Z" {...s} />
          <circle cx={0} cy={-3.5} r={2.6} {...s} strokeWidth={1.6} />
        </>
      );
      break;
  }
  return <g transform={`scale(${scale})`}>{body}</g>;
};
