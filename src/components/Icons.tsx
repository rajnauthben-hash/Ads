import React from "react";

export type IconName =
  | "storefront"
  | "coffee"
  | "bag"
  | "fork"
  | "star"
  | "medal"
  | "crown"
  | "lock"
  | "cart"
  | "people"
  | "car"
  | "walker"
  | "phone"
  | "compass"
  | "chartUp"
  | "camera"
  | "list"
  | "clock"
  | "search"
  | "pin"
  | "bookmark"
  | "globe"
  | "photo"
  | "chevron";

const paths: Record<IconName, React.ReactNode> = {
  storefront: (
    <>
      <path d="M3 9 L4 4 H16 L17 9" />
      <path d="M3 9 V17 H17 V9" />
      <path d="M3 9 H17" />
      <path d="M8 17 V12 H12 V17" />
    </>
  ),
  coffee: (
    <>
      <path d="M4 8 H14 V13 A5 5 0 0 1 4 13 Z" />
      <path d="M14 9 H16 A2 2 0 0 1 16 13 H14" />
      <path d="M6 3 Q7 5 6 6" />
      <path d="M10 3 Q11 5 10 6" />
    </>
  ),
  bag: (
    <>
      <path d="M5 7 H15 L14 17 H6 Z" />
      <path d="M7.5 7 V5 A2.5 2.5 0 0 1 12.5 5 V7" />
    </>
  ),
  fork: (
    <>
      <path d="M6 2 V9" />
      <path d="M4 2 V6 Q4 8 6 8 Q8 8 8 6 V2" />
      <path d="M6 8 V18" />
      <path d="M14 2 V18" />
      <path d="M12 2 V7 Q12 9 14 9" />
    </>
  ),
  star: (
    <path d="M10 2 L12.3 7.2 L18 7.8 L13.7 11.5 L15 17 L10 14 L5 17 L6.3 11.5 L2 7.8 L7.7 7.2 Z" />
  ),
  medal: (
    <>
      <circle cx="10" cy="12" r="6" />
      <path d="M7.5 2 L9 8.5" />
      <path d="M12.5 2 L11 8.5" />
      <path d="M8.5 12 L9.6 13.2 L11.6 10.6" />
    </>
  ),
  crown: (
    <path d="M3 15 L2 6 L7 10 L10 4 L13 10 L18 6 L17 15 Z" />
  ),
  lock: (
    <>
      <rect x="4" y="9" width="12" height="9" rx="1.5" />
      <path d="M6.5 9 V6 A3.5 3.5 0 0 1 13.5 6 V9" />
    </>
  ),
  cart: (
    <>
      <path d="M2 3 H4 L6.5 13 H15 L17 6 H5.5" />
      <circle cx="7.5" cy="17" r="1.4" />
      <circle cx="14" cy="17" r="1.4" />
    </>
  ),
  people: (
    <>
      <circle cx="7" cy="6" r="2.6" />
      <circle cx="14" cy="7.5" r="2.1" />
      <path d="M2 18 Q2 12.5 7 12.5 Q12 12.5 12 18" />
      <path d="M12.5 13 Q17.5 13 17.5 18" />
    </>
  ),
  car: (
    <>
      <path d="M3 13 L4.3 8 A2 2 0 0 1 6.2 6.5 H13.8 A2 2 0 0 1 15.7 8 L17 13" />
      <path d="M3 13 H17 V16 H14.5 V14.3 H5.5 V16 H3 Z" />
      <circle cx="6.2" cy="16" r="1.5" />
      <circle cx="13.8" cy="16" r="1.5" />
    </>
  ),
  walker: (
    <>
      <circle cx="11" cy="3.4" r="1.8" />
      <path d="M9 8 L11 6 L14 7.5 L16 6" />
      <path d="M11 6 L9.5 12 L6 15" />
      <path d="M11 6 L12.5 12 L14 18" />
      <path d="M9.5 12 L13.2 13.5" />
    </>
  ),
  phone: (
    <path d="M4 3 H7 L8.5 7 L6.5 8.5 Q8 12 11.5 13.5 L13 11.5 L17 13 V16 A1.5 1.5 0 0 1 15.5 17.5 C8 17.5 2.5 12 2.5 4.5 A1.5 1.5 0 0 1 4 3 Z" />
  ),
  compass: (
    <>
      <circle cx="10" cy="10" r="8" />
      <path d="M13.5 6.5 L11 11 L6.5 13.5 L9 9 Z" />
    </>
  ),
  chartUp: (
    <>
      <path d="M2 17 H18" />
      <path d="M2 17 L7 11 L11 14 L18 5" />
      <path d="M13 5 H18 V10" />
    </>
  ),
  camera: (
    <>
      <path d="M2 6.5 H6 L7.3 4.5 H12.7 L14 6.5 H18 V16 H2 Z" />
      <circle cx="10" cy="11" r="3.4" />
    </>
  ),
  list: (
    <>
      <circle cx="3" cy="5" r="1.2" />
      <circle cx="3" cy="10" r="1.2" />
      <circle cx="3" cy="15" r="1.2" />
      <path d="M7 5 H18" />
      <path d="M7 10 H18" />
      <path d="M7 15 H14" />
    </>
  ),
  clock: (
    <>
      <circle cx="10" cy="10" r="8" />
      <path d="M10 5.5 V10 L13.5 12" />
    </>
  ),
  search: (
    <>
      <circle cx="8.5" cy="8.5" r="6" />
      <path d="M13 13 L18 18" />
    </>
  ),
  pin: (
    <path d="M10 1 C14 1 17 4 17 8 C17 13 10 19 10 19 C10 19 3 13 3 8 C3 4 6 1 10 1 Z M10 11 A3 3 0 1 0 10 5 A3 3 0 0 0 10 11 Z" />
  ),
  bookmark: <path d="M5 2.5 H15 V17.5 L10 14 L5 17.5 Z" />,
  globe: (
    <>
      <circle cx="10" cy="10" r="8" />
      <path d="M2 10 H18" />
      <path d="M10 2 C13 5.5 13 14.5 10 18 C7 14.5 7 5.5 10 2 Z" />
    </>
  ),
  photo: (
    <>
      <rect x="2.5" y="3.5" width="15" height="13" rx="1" />
      <circle cx="7" cy="8" r="1.6" />
      <path d="M2.5 15 L7.5 10.5 L10.5 13 L14 9 L17.5 13.5" />
    </>
  ),
  chevron: <path d="M6 8 L10 12 L14 8" />,
};

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
}> = ({ name, size = 20, color = "currentColor", strokeWidth = 1.6, filled = false }) => {
  const fillNames: IconName[] = ["star", "crown", "pin", "bookmark"];
  const useFill = filled || fillNames.includes(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill={useFill ? color : "none"}
      stroke={useFill ? "none" : color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
};
