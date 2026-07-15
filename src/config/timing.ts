// ═══════════════════════════════════════════════════════════════════════
// THE INVISIBLE STOREFRONT — scene boundaries + copy layout
// ═══════════════════════════════════════════════════════════════════════

export interface TextSegment {
  text: string;
  color?: "gold" | "cyan";
  /** Frame (local to the block's reveal start) at which the segment finishes
   * blending from primary text color into `color`. Omit for an immediate/static color. */
  colorAt?: number;
}
export type TextLine = TextSegment[];

export interface HeadlineBlock {
  x: number;
  y: number;
  width: number;
  fontSize: number;
  lines: TextLine[];
}

export interface BodyBlock {
  x: number;
  y: number;
  width: number;
  fontSize?: number;
  lines: TextLine[];
}

export interface SceneRange {
  id: number;
  start: number;
  end: number;
}

export const SCENES: SceneRange[] = [
  { id: 1, start: 0, end: 107 },
  { id: 2, start: 108, end: 191 },
  { id: 3, start: 192, end: 269 },
  { id: 4, start: 270, end: 350 },
  { id: 5, start: 351, end: 431 },
  { id: 6, start: 432, end: 521 },
  { id: 7, start: 522, end: 623 },
  { id: 8, start: 624, end: 719 },
  { id: 9, start: 720, end: 803 },
  { id: 10, start: 804, end: 899 },
];

// Frames between successive line reveals within one headline/body block.
export const LINE_STAGGER = 7;
// Frames a scene's foreground content takes to cross-fade in / out at cut points.
export const SCENE_FADE = 14;

const line = (text: string, color?: TextSegment["color"]): TextLine => [
  { text, color },
];

export const COPY = {
  1: {
    headline: [
      {
        x: 68,
        y: 175,
        width: 900,
        fontSize: 78,
        lines: [line("You’re not losing customers"), line("to better businesses.")],
      },
      {
        x: 68,
        y: 465,
        width: 920,
        fontSize: 78,
        lines: [
          line("You’re losing them to the businesses"),
          [{ text: "Google showed first.", color: "gold", colorAt: 16 }],
        ],
      },
    ] as HeadlineBlock[],
    body: {
      x: 68,
      y: 745,
      width: 880,
      lines: [line("The decision may happen before they ever reach your street.")],
    } as BodyBlock,
  },
  2: {
    headline: [
      {
        x: 68,
        y: 175,
        width: 860,
        fontSize: 80,
        lines: [line("Your next customer"), line("usually searches first.")],
      },
    ] as HeadlineBlock[],
    body: {
      x: 68,
      y: 475,
      width: 900,
      lines: [
        line("Before they step outside, they check Google Maps,"),
        line("reviews, photos, and hours."),
      ],
    } as BodyBlock,
  },
  3: {
    headline: [
      {
        x: 68,
        y: 175,
        width: 850,
        fontSize: 84,
        lines: [line("At that moment,"), line("attention compresses.")],
      },
    ] as HeadlineBlock[],
    body: {
      x: 68,
      y: 500,
      width: 920,
      lines: [
        line("Most people compare only a handful of options —"),
        line("usually the first few they see."),
      ],
    } as BodyBlock,
  },
  4: {
    headline: [
      {
        x: 68,
        y: 165,
        width: 870,
        fontSize: 76,
        lines: [
          line("If you are not near"),
          line("the top of the map,"),
          line("you are often skipped."),
        ],
      },
    ] as HeadlineBlock[],
    body: {
      x: 68,
      y: 555,
      width: 870,
      lines: [
        line("Not because your business is weak —"),
        line("because your visibility is."),
      ],
    } as BodyBlock,
  },
  5: {
    headline: [
      {
        x: 68,
        y: 175,
        width: 850,
        fontSize: 80,
        lines: [line("This is the invisible"), line("storefront problem.")],
      },
    ] as HeadlineBlock[],
    body: {
      x: 68,
      y: 495,
      width: 800,
      lines: [line("Open in the real world."), line("Easy to miss in the digital one.")],
    } as BodyBlock,
  },
  6: {
    headline: [
      {
        x: 68,
        y: 175,
        width: 850,
        fontSize: 82,
        lines: [line("Modern walk-ins are"), line("pre-sold online.")],
      },
    ] as HeadlineBlock[],
    body: {
      x: 68,
      y: 485,
      width: 920,
      lines: [
        line("People choose based on reputation, relevance,"),
        line("distance, photos, and consistency."),
      ],
    } as BodyBlock,
  },
  7: {
    headline: [
      {
        x: 68,
        y: 170,
        width: 900,
        fontSize: 74,
        lines: [
          line("Your Google Business"),
          line("Profile is not a listing."),
          line("It is a storefront."),
        ],
      },
    ] as HeadlineBlock[],
    body: {
      x: 68,
      y: 535,
      width: 910,
      lines: [
        line("For local search, it acts like your sign,"),
        [
          { text: "window display, and " },
          { text: "first impression.", color: "cyan" },
        ],
      ],
    } as BodyBlock,
  },
  8: {
    headline: [
      {
        x: 68,
        y: 170,
        width: 900,
        fontSize: 74,
        lines: [
          line("The businesses that win"),
          line("locally send stronger signals."),
        ],
      },
    ] as HeadlineBlock[],
    body: {
      x: 68,
      y: 500,
      width: 920,
      lines: [
        line("Fresh photos. Strong reviews. Clear categories."),
        line("Updated hours. Consistent activity."),
      ],
    } as BodyBlock,
  },
  9: {
    headline: [
      {
        x: 68,
        y: 170,
        width: 900,
        fontSize: 74,
        lines: [
          line("Better local visibility"),
          line("creates measurable outcomes."),
        ],
      },
    ] as HeadlineBlock[],
    body: {
      x: 68,
      y: 495,
      width: 920,
      lines: [
        line("More calls. More direction requests."),
        line("More visits. More revenue opportunities."),
      ],
    } as BodyBlock,
  },
  10: {
    headline: [
      {
        x: 68,
        y: 170,
        width: 920,
        fontSize: 72,
        lines: [
          line("If your physical business"),
          line("looks premium,"),
          line("your digital presence should too."),
        ],
      },
    ] as HeadlineBlock[],
    body: {
      x: 68,
      y: 560,
      width: 900,
      lines: [
        [
          { text: "Be visible where " },
          { text: "local buying decisions", color: "cyan" },
          { text: " begin." },
        ],
      ],
    } as BodyBlock,
  },
} as const;
