import { useCurrentFrame } from "remotion";
import { PAL } from "../theme";
import { iv, pop, prog, reveal, revealX } from "./anim";
import {
  IconBlocked,
  IconCheck,
  IconInfo,
  IconPerson,
  IconPhone,
  IconStar,
  IconWarn,
  IconX,
} from "./icons";
import { S4, S5, S6 } from "../copy";

/* ------------------------------------------------------------------ */
/* Scene 04 — business profile table                                   */
/* ------------------------------------------------------------------ */

export const ProfileTable: React.FC<{ delay?: number; width?: number }> = ({ delay = 0, width = 480 }) => {
  const frame = useCurrentFrame();
  const bad = S4.badValues as readonly string[];
  return (
    <div
      style={{
        width,
        borderRadius: 24,
        background: PAL.card,
        border: `1.5px solid ${PAL.cardBorder}`,
        boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        padding: "30px 34px 12px",
        ...reveal(frame, delay, 24, 26),
      }}
    >
      <div style={{ fontSize: 34, fontWeight: 700, color: PAL.white, paddingBottom: 18, ...reveal(frame, delay + 4, 20, 10) }}>
        {S4.panelTitle}
      </div>
      {S4.rows.map(([label, value], i) => {
        const isBad = bad.includes(value) || value === "None";
        const d = delay + 10 + i * 5;
        const t = prog(frame, d, 18);
        // missing values flash bright red as they land
        const flash = isBad ? 1 + 1.1 * Math.max(0, 1 - Math.abs(frame - (d + 10)) / 8) : 1;
        return (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              columnGap: 26,
              height: 57,
              borderTop: "1px solid rgba(255,255,255,0.07)",
              opacity: t,
              transform: `translateY(${(1 - t) * 10}px)`,
            }}
          >
            <div style={{ fontSize: 27, fontWeight: 400, color: PAL.gray }}>{label}</div>
            <div
              style={{
                fontSize: 27,
                fontWeight: isBad ? 500 : 600,
                color: isBad ? PAL.red : PAL.white,
                filter: `brightness(${flash})`,
              }}
            >
              {value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Dashed-cyan informational callout (scene 04 right box)              */
/* ------------------------------------------------------------------ */

export const InfoCallout: React.FC<{ delay?: number; width?: number }> = ({ delay = 0, width = 420 }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, 26);
  return (
    <div
      style={{
        width,
        borderRadius: 26,
        border: `2px dashed ${PAL.cyanOutline}`,
        background: "rgba(10,14,18,0.55)",
        padding: "34px 34px 30px",
        opacity: t,
        transform: `translateY(${(1 - t) * 22}px) scale(${0.97 + 0.03 * t})`,
        filter: `blur(${(1 - t) * 6}px)`,
      }}
    >
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: `2.5px solid ${PAL.cyan}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginTop: 4,
            ...pop(frame, delay + 8),
          }}
        >
          <IconInfo size={30} color={PAL.cyan} strokeWidth={2.4} />
        </div>
        <div>
          {S4.info1.map((line, i) => (
            <div
              key={line}
              style={{
                fontSize: 30,
                lineHeight: 1.5,
                fontWeight: 400,
                color: i === 4 ? PAL.cyan : PAL.white,
                whiteSpace: "pre",
                ...reveal(frame, delay + 10 + i * 4, 18, 12),
              }}
            >
              {line}
            </div>
          ))}
          <div style={{ height: 22 }} />
          {S4.info2.map((line, i) => (
            <div
              key={line}
              style={{
                fontSize: 30,
                lineHeight: 1.5,
                fontWeight: 400,
                color: PAL.white,
                whiteSpace: "pre",
                ...reveal(frame, delay + 34 + i * 4, 18, 12),
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Small speech-bubble callouts for the scene 04 diagram               */
/* ------------------------------------------------------------------ */

export const Bubble: React.FC<{
  lines: readonly (string | { t: string; c?: string }[])[];
  icon?: "trophy" | "blocked" | "none";
  delay?: number;
  width?: number;
  pointer?: "down" | "none";
  border?: string;
  children?: React.ReactNode;
}> = ({ lines, icon = "none", delay = 0, width = 300, pointer = "none", border = PAL.cyanOutline, children }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, 22);
  return (
    <div
      style={{
        width,
        borderRadius: 20,
        border: `2px solid ${border}`,
        background: "rgba(9,13,17,0.9)",
        padding: "20px 24px",
        boxShadow: "0 18px 44px rgba(0,0,0,0.5)",
        position: "relative",
        opacity: t,
        transform: `translateY(${(1 - t) * 16}px) scale(${0.96 + 0.04 * t})`,
      }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {icon === "trophy" && <IconTrophyBox />}
        {icon === "blocked" && <IconBlocked size={40} color={PAL.red} />}
        <div>
          {lines.map((line, i) => (
            <div key={i} style={{ fontSize: 25, lineHeight: 1.42, fontWeight: 500, color: PAL.white, whiteSpace: "pre" }}>
              {typeof line === "string"
                ? line
                : line.map((s, j) => (
                    <span key={j} style={{ color: s.c ?? PAL.white }}>
                      {s.t}
                    </span>
                  ))}
            </div>
          ))}
        </div>
      </div>
      {pointer === "down" && (
        <div
          style={{
            position: "absolute",
            bottom: -11,
            left: "50%",
            marginLeft: -11,
            width: 22,
            height: 22,
            background: "rgba(9,13,17,0.95)",
            borderRight: `2px solid ${border}`,
            borderBottom: `2px solid ${border}`,
            transform: "rotate(45deg)",
          }}
        />
      )}
      {children}
    </div>
  );
};

const IconTrophyBox: React.FC = () => (
  <div style={{ flexShrink: 0 }}>
    <svg viewBox="0 0 24 24" width={40} height={40} fill="none" stroke={PAL.white} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
      <path d="M8 5H4.5c0 3 1.5 4.6 3.5 5M16 5h3.5c0 3-1.5 4.6-3.5 5" />
      <path d="M12 13v3.5M8.5 20h7M10 16.5h4" />
    </svg>
  </div>
);

/* ------------------------------------------------------------------ */
/* Scene 05 — gold warning box + search result cards                   */
/* ------------------------------------------------------------------ */

export const WarningBox: React.FC<{ delay?: number; width?: number }> = ({ delay = 0, width = 430 }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, 24);
  return (
    <div
      style={{
        width,
        borderRadius: 22,
        border: `2.5px solid rgba(216,162,74,0.75)`,
        background: "rgba(12,10,6,0.72)",
        padding: "28px 30px",
        display: "flex",
        gap: 24,
        alignItems: "center",
        opacity: t,
        transform: `translateY(${(1 - t) * 20}px)`,
        filter: `blur(${(1 - t) * 5}px)`,
        boxShadow: `0 0 60px rgba(216,162,74,${0.12 * t})`,
      }}
    >
      <div style={{ flexShrink: 0, ...pop(frame, delay + 8) }}>
        <IconWarn size={62} color={PAL.gold} strokeWidth={1.9} />
      </div>
      <div>
        {S5.warning.map((line, i) => (
          <div
            key={line}
            style={{
              fontSize: 30,
              lineHeight: 1.42,
              fontWeight: i === 2 ? 600 : 400,
              color: i === 2 ? PAL.gold : PAL.white,
              whiteSpace: "pre",
              ...reveal(frame, delay + 8 + i * 5, 18, 10),
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Tiny vector storefront thumbnail for result cards. */
const Thumb: React.FC<{ hue: number }> = ({ hue }) => (
  <div
    style={{
      width: 100,
      height: 100,
      borderRadius: 16,
      overflow: "hidden",
      flexShrink: 0,
      background: `linear-gradient(180deg, hsl(${hue}, 30%, 9%) 0%, hsl(${hue}, 42%, 14%) 100%)`,
      position: "relative",
    }}
  >
    <div style={{ position: "absolute", left: 10, right: 10, top: 16, height: 16, borderRadius: 3, background: "#E9C889", opacity: 0.85, boxShadow: "0 0 16px rgba(242,200,127,0.6)" }} />
    <div style={{ position: "absolute", left: 10, top: 42, width: 34, height: 40, borderRadius: 3, background: "linear-gradient(180deg,#6B4318,#31200C)" }} />
    <div style={{ position: "absolute", left: 50, top: 42, width: 20, height: 40, borderRadius: 3, background: "linear-gradient(180deg,#5E3A14,#2A1B0A)" }} />
    <div style={{ position: "absolute", right: 10, top: 42, width: 16, height: 40, borderRadius: 3, background: "linear-gradient(180deg,#53350f,#241708)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 14, background: "rgba(240,190,110,0.16)", filter: "blur(4px)" }} />
  </div>
);

export const ResultCard: React.FC<{
  item: (typeof S5.results)[number];
  delay?: number;
  width?: number;
  hue?: number;
}> = ({ item, delay = 0, width = 490, hue = 32 }) => {
  const frame = useCurrentFrame();
  const negative = "negative" in item && item.negative;
  const enter = revealX(frame, delay, 24, 60);
  return (
    <div
      style={{
        width,
        borderRadius: 24,
        padding: "24px 26px",
        display: "flex",
        gap: 24,
        alignItems: "center",
        background: negative ? "rgba(34,12,10,0.5)" : PAL.card,
        border: negative ? `2.5px dashed rgba(255,90,79,0.8)` : `1.5px solid ${PAL.cardBorder}`,
        boxShadow: negative ? "0 0 50px rgba(255,90,79,0.12)" : "0 24px 60px rgba(0,0,0,0.45)",
        ...enter,
      }}
    >
      {negative ? (
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: `3px solid rgba(255,90,79,0.75)`,
            background: "rgba(30,10,8,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <IconX size={46} color={PAL.red} strokeWidth={2.6} />
        </div>
      ) : (
        <Thumb hue={hue} />
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 34, fontWeight: 600, color: PAL.white, whiteSpace: "pre" }}>{item.name}</div>
        {negative ? (
          <>
            <div style={{ fontSize: 26, color: PAL.gray, marginTop: 8 }}>{"sub1" in item ? item.sub1 : ""}</div>
            <div style={{ fontSize: 26, fontWeight: 600, color: PAL.red, marginTop: 4 }}>{"sub2" in item ? item.sub2 : ""}</div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 27, fontWeight: 600, color: PAL.white }}>{"rating" in item ? item.rating : ""}</span>
              <span style={{ display: "flex", gap: 2 }}>
                {[0, 1, 2, 3, 4].map((s) => (
                  <IconStar
                    key={s}
                    size={26}
                    color={s < 4 ? PAL.gold : "rgba(255,255,255,0.28)"}
                    fill={s < 4 ? PAL.gold : "none"}
                    strokeWidth={1.6}
                  />
                ))}
              </span>
              <span style={{ fontSize: 25, color: PAL.grayDim }}>{"count" in item ? item.count : ""}</span>
            </div>
            <div style={{ fontSize: 26, color: PAL.gray, marginTop: 6 }}>
              {"dist" in item ? item.dist : ""} <span style={{ color: PAL.grayDim }}>•</span>{" "}
              <span style={{ color: PAL.cyan, fontWeight: 500 }}>Open</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 06 — incoming call card                                       */
/* ------------------------------------------------------------------ */

export const CallCard: React.FC<{ delay?: number; width?: number }> = ({ delay = 0, width = 470 }) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, 26);
  const ringR = (frame % 40) / 40;
  return (
    <div
      style={{
        width,
        borderRadius: 30,
        background: "rgba(15,19,24,0.9)",
        border: "1.5px solid rgba(255,255,255,0.1)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
        padding: "30px 32px",
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity: t,
        transform: `translateY(${(1 - t) * 34}px) scale(${0.94 + 0.06 * t}) perspective(900px) rotateX(${(1 - t) * 7}deg)`,
        filter: `blur(${(1 - t) * 6}px)`,
      }}
    >
      {/* ringing cyan phone */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: `2.5px solid ${PAL.cyan}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconPhone size={38} fill={PAL.cyan} />
        </div>
        <div
          style={{
            position: "absolute",
            inset: -10 - ringR * 14,
            borderRadius: "50%",
            border: `2px solid ${PAL.cyan}`,
            opacity: 0.5 * (1 - ringR),
          }}
        />
      </div>
      <div style={{ flex: 1, whiteSpace: "pre" }}>
        <div style={{ fontSize: 32, fontWeight: 600, color: PAL.white, ...reveal(frame, delay + 6, 16, 8) }}>{S6.call.title}</div>
        <div style={{ fontSize: 27, fontWeight: 400, color: PAL.gray, marginTop: 4, ...reveal(frame, delay + 10, 16, 8) }}>{S6.call.who}</div>
        <div style={{ fontSize: 25, fontWeight: 500, color: PAL.cyan, marginTop: 4, ...reveal(frame, delay + 14, 16, 8) }}>{S6.call.timer}</div>
      </div>
      <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: PAL.green, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(52,199,89,0.35)", ...pop(frame, delay + 12) }}>
          <IconPhone size={33} fill="#fff" />
        </div>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#E5544B", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(229,84,75,0.35)", ...pop(frame, delay + 16) }}>
          <div style={{ transform: "rotate(135deg)" }}>
            <IconPhone size={33} fill="#fff" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 08 — checklist, customer marker, brand lockup                 */
/* ------------------------------------------------------------------ */

export const Checklist: React.FC<{ items: readonly string[]; delay?: number; stagger?: number }> = ({ items, delay = 0, stagger = 7 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 17 }}>
      {items.map((item, i) => {
        const d = delay + i * stagger;
        const t = prog(frame, d, 20);
        const check = prog(frame, d + 6, 14);
        return (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 22, opacity: t, transform: `translateX(${(1 - t) * -26}px)` }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 11,
                border: `2.5px solid ${PAL.cyan}`,
                background: "rgba(17,217,247,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0 0 20px rgba(17,217,247,${0.22 * check})`,
              }}
            >
              <IconCheck size={26} color={PAL.cyan} strokeWidth={3.2} progress={check} />
            </div>
            <div style={{ fontSize: 31, fontWeight: 400, color: PAL.white, letterSpacing: -0.2 }}>{item}</div>
          </div>
        );
      })}
    </div>
  );
};

export const CustomerMarker: React.FC<{ size?: number; label?: readonly string[]; labelDelay?: number; delay?: number }> = ({
  size = 210,
  label,
  labelDelay = 0,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, 22);
  const ring = (frame % 52) / 52;
  const ring2 = ((frame + 26) % 52) / 52;
  return (
    <div style={{ position: "relative", width: size, height: size, opacity: t, transform: `scale(${0.8 + 0.2 * t})` }}>
      {/* sonar rings */}
      {[ring, ring2].map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: `${(1 - r) * 26 - 26}%`,
            borderRadius: "50%",
            border: `2px solid ${PAL.cyan}`,
            opacity: 0.45 * (1 - r),
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: "8%",
          borderRadius: "50%",
          border: `2.5px solid rgba(17,217,247,0.6)`,
          background: "radial-gradient(circle, rgba(17,217,247,0.16) 0%, rgba(17,217,247,0.04) 70%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 60px rgba(17,217,247,0.25)",
        }}
      >
        <IconPerson size={size * 0.42} fill={PAL.cyan} />
      </div>
      {label && (
        <div style={{ position: "absolute", top: "112%", left: "4%", whiteSpace: "pre" }}>
          {/* dotted leader */}
          <div style={{ position: "absolute", top: -size * 0.1, left: size * 0.16, width: 1.5, height: size * 0.09, borderLeft: "2px dashed rgba(255,255,255,0.3)" }} />
          {label.map((line, i) => (
            <div key={line} style={{ fontSize: 30, color: PAL.gray, lineHeight: 1.45, ...reveal(frame, labelDelay + i * 5, 18, 10) }}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const BrandLockup: React.FC<{ delay?: number; taglineDelay?: number; brand: readonly string[]; tagline: string }> = ({
  delay = 0,
  taglineDelay,
  brand,
  tagline,
}) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, 28);
  const tt = prog(frame, taglineDelay ?? delay + 12, 26);
  const track = iv(frame, [delay, delay + 40], [4, 0]);
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: track,
          opacity: t,
          transform: `translateY(${(1 - t) * 26}px)`,
          filter: `blur(${(1 - t) * 10}px)`,
          whiteSpace: "pre",
        }}
      >
        <span style={{ color: PAL.white }}>{brand[0]}</span>
        <span style={{ color: PAL.cyan, fontWeight: 400 }}> {brand[1]}</span>
      </div>
      <div
        style={{
          marginTop: 18,
          fontSize: 27,
          fontWeight: 600,
          letterSpacing: 7,
          color: "#DCD2C2",
          opacity: tt,
          transform: `translateY(${(1 - tt) * 14}px)`,
        }}
      >
        {tagline}
      </div>
    </div>
  );
};
