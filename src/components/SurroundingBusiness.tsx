import React from "react";
import { IsometricBuilding } from "./IsometricBuilding";
import { Pt } from "../utils/routeGeometry";

/**
 * A surrounding (competitor-category) business in the city. Same designed
 * isometric language as the hero storefront but muted and unbranded, with an
 * engraved category label (HAIR SALON, PIZZERIA, ...).
 */
export const SurroundingBusiness: React.FC<{
  origin: Pt;
  label?: string;
  a?: number;
  b?: number;
  h?: number;
  dim?: number; // 0..1 extra dimming
}> = ({ origin, label, a = 1.5, b = 1.3, h = 1.1, dim = 0 }) => {
  const k = 1 - dim * 0.5;
  return (
    <IsometricBuilding
      origin={origin}
      a={a}
      b={b}
      h={h}
      roof={shade("#171d25", k)}
      right={shade("#12171e", k)}
      left={shade("#0d1218", k)}
      stroke="rgba(255,255,255,0.045)"
      label={label}
      labelColor={`rgba(139,148,158,${0.55 * k})`}
    />
  );
};

function shade(hex: string, k: number): string {
  const h = hex.replace("#", "");
  const r = Math.round(parseInt(h.substring(0, 2), 16) * k);
  const g = Math.round(parseInt(h.substring(2, 4), 16) * k);
  const b = Math.round(parseInt(h.substring(4, 6), 16) * k);
  return `rgb(${r}, ${g}, ${b})`;
}
