import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { Parallax } from "../components/CameraRig";
import { EnergyRing } from "../components/EnergyRing";
import { CinematicText } from "../components/CinematicText";
import { LogoLockup } from "../../components/LogoLockup";
import { T, FONT, EO } from "../theme";

// Background UI from the reference final frame — real copy, dimmed so the
// CTA stack stays the hero.
const BG_OPACITY = 0.34;

const useDrift = (delay: number, from: number) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  return {
    op: interpolate(f, [0, 20], [0, BG_OPACITY], { extrapolateRight: "clamp" }),
    ty: interpolate(f, [0, 30], [from, 0], { extrapolateRight: "clamp", easing: Easing.bezier(...EO) }),
    bob: Math.sin(frame * 0.024 + delay) * 4,
  };
};

// Final website mockup — "Built for Trust. Designed to Convert."
const FinalSiteMockup: React.FC<{ delay: number }> = ({ delay }) => {
  const { op, ty, bob } = useDrift(delay, 26);
  const W = 560;

  return (
    <div
      style={{
        opacity: op,
        translate: `0px ${ty + bob}px`,
        width: W,
        borderRadius: 16,
        border: "1px solid rgba(148,197,255,0.3)",
        background: "#070E22",
        overflow: "hidden",
        fontFamily: FONT,
        boxShadow: "0 26px 60px rgba(0,0,0,0.55)",
      }}
    >
      {/* Chrome */}
      <div
        style={{
          height: 34,
          background: "rgba(4,8,20,0.98)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 6,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.14)" }} />
        ))}
        <div
          style={{
            flex: 1,
            marginLeft: 10,
            height: 19,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            paddingLeft: 9,
            fontSize: 10.5,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          https://www.yourbusiness.com
        </div>
      </div>
      {/* Nav */}
      <div
        style={{
          padding: "11px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(255,255,255,0.9)" }}>
          YOUR BUSINESS
        </div>
        <div style={{ display: "flex", gap: 11 }}>
          {["HOME", "ABOUT", "SERVICES", "GALLERY", "CONTACT"].map((n, i) => (
            <div
              key={n}
              style={{
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: "0.05em",
                color: i === 0 ? T.cyan : "rgba(255,255,255,0.5)",
              }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>
      {/* Hero */}
      <div
        style={{
          padding: "18px 18px 20px",
          background: "linear-gradient(155deg, rgba(10,22,56,1) 0%, rgba(7,14,34,1) 100%)",
        }}
      >
        <div style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.01em", color: "rgba(255,255,255,0.96)", marginBottom: 8 }}>
          Built for Trust.<br />
          Designed to Convert.
        </div>
        <div style={{ fontSize: 11.5, lineHeight: 1.45, color: "rgba(148,163,184,0.9)", marginBottom: 13 }}>
          Modern websites that represent<br />
          your business the right way.
        </div>
        <div
          style={{
            display: "inline-block",
            padding: "8px 15px",
            borderRadius: 7,
            border: `1px solid ${T.cyan}`,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: T.cyan,
          }}
        >
          GET STARTED
        </div>
      </div>
    </div>
  );
};

// Google business card — with Save action (final-frame variant)
const FinalBizCard: React.FC<{ delay: number }> = ({ delay }) => {
  const { op, ty, bob } = useDrift(delay, 22);

  return (
    <div
      style={{
        opacity: op,
        translate: `0px ${ty + bob}px`,
        width: 330,
        borderRadius: 15,
        border: "1px solid rgba(34,211,238,0.4)",
        background: "rgba(10,26,40,0.95)",
        padding: "16px 18px 13px",
        fontFamily: FONT,
        boxShadow: "0 0 34px rgba(34,211,238,0.14), 0 22px 52px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ fontSize: 19, fontWeight: 800, color: T.white, marginBottom: 5 }}>Your Business</div>
      <div style={{ fontSize: 14, marginBottom: 4 }}>
        <span style={{ color: T.white, fontWeight: 600 }}>4.9 </span>
        <span style={{ color: "#F5B942" }}>★★★★★</span>
        <span style={{ color: T.muted }}> (128)</span>
      </div>
      <div style={{ fontSize: 13.5, marginBottom: 11 }}>
        <span style={{ color: "#34D399", fontWeight: 600 }}>Open</span>
        <span style={{ color: T.muted }}> · Closes 8 PM</span>
      </div>
      <div style={{ display: "flex", gap: 7, borderTop: "1px solid rgba(148,197,255,0.14)", paddingTop: 10 }}>
        {["Call", "Directions", "Website", "Save"].map((a) => (
          <div
            key={a}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "6px 0",
              borderRadius: 16,
              background: "rgba(34,211,238,0.1)",
              border: "1px solid rgba(34,211,238,0.28)",
              fontSize: 11.5,
              fontWeight: 600,
              color: T.cyan,
              whiteSpace: "nowrap",
            }}
          >
            {a}
          </div>
        ))}
      </div>
    </div>
  );
};

// Side stat cards — Local Visibility 98% / Customer Activity 247
const SideStat: React.FC<{
  delay: number; title: string; value: string; sub: string;
}> = ({ delay, title, value, sub }) => {
  const { op, ty, bob } = useDrift(delay, 20);

  return (
    <div
      style={{
        opacity: op,
        translate: `0px ${ty + bob}px`,
        width: 252,
        borderRadius: 15,
        border: "1px solid rgba(148,197,255,0.24)",
        background: T.panel,
        padding: "15px 18px",
        fontFamily: FONT,
        boxShadow: "0 20px 48px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ fontSize: 14.5, fontWeight: 600, color: "rgba(226,240,255,0.85)", marginBottom: 6 }}>{title}</div>
      <div
        style={{
          fontSize: 37,
          fontWeight: 800,
          color: T.cyan,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          marginBottom: 6,
          textShadow: "0 0 20px rgba(34,211,238,0.4)",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12.5, lineHeight: 1.4, color: T.muted }}>{sub}</div>
    </div>
  );
};

// SCENE — final beat: pull-back reveal, brand over the portal, CTA.
export const FinalCTAScene: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();

  const ctaPulse = 0.65 + Math.sin(frame * 0.055) * 0.2;
  const settle = interpolate(frame, [0, dur], [1.0, 1.025], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ scale: settle.toString(), transformOrigin: "50% 45%" }}>

      {/* Portal — fully open, calm */}
      <Parallax depth={0.25} phase={2}>
        <EnergyRing delay={0} beam intensity={1} y={1545} scale={1.12} />
      </Parallax>

      {/* Background UI from the reference — dimmed, parallax layers */}
      <Parallax depth={0.35} phase={3}>
        <div style={{ position: "absolute", top: 96, left: "50%", translate: "-50% 0" }}>
          <FinalSiteMockup delay={6} />
        </div>
      </Parallax>
      <Parallax depth={0.5} phase={5}>
        <div style={{ position: "absolute", top: 1190, left: "50%", translate: "calc(-50% - 350px) 0" }}>
          <SideStat delay={16} title="Local Visibility" value="98%" sub="Your business is visible to nearby customers" />
        </div>
      </Parallax>
      <Parallax depth={0.5} phase={7}>
        <div style={{ position: "absolute", top: 1190, left: "50%", translate: "calc(-50% + 350px) 0" }}>
          <SideStat delay={22} title="Customer Activity" value="247" sub="Interactions this week" />
        </div>
      </Parallax>
      <Parallax depth={0.45} phase={9}>
        <div style={{ position: "absolute", top: 1252, left: "50%", translate: "-50% 0" }}>
          <FinalBizCard delay={28} />
        </div>
      </Parallax>

      {/* Lockup + copy + CTA — verbatim from the original final frame */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 250,
        }}
      >
        <div style={{ marginBottom: 48 }}>
          <LogoLockup delay={4} size="lg" />
        </div>

        <CinematicText delay={14} size={72} weight={800} color="rgba(240,247,255,0.97)">
          Get Found.
        </CinematicText>
        <CinematicText delay={22} size={72} weight={800} color="rgba(240,247,255,0.97)">
          Look Professional.
        </CinematicText>
        <CinematicText delay={30} size={84} gradient glow tracking>
          Grow Online.
        </CinematicText>

        <CinematicText delay={44} size={29} weight={500} color={T.muted} style={{ marginTop: 20 }}>
          Premium Websites  •  Google Maps  •  Local Visibility
        </CinematicText>

        {/* CTA pill */}
        <CTAButton delay={56} pulse={ctaPulse} />

        <CinematicText delay={70} size={22} weight={600} color={T.muted} style={{ marginTop: 26, letterSpacing: "0.3em" }}>
          OMNIFLOW DIGITAL
        </CinematicText>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};

const CTAButton: React.FC<{ delay: number; pulse: number }> = ({ delay, pulse }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delay);
  const op = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const ty = interpolate(f, [0, 26], [36, 0], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...EO),
  });

  return (
    <div
      style={{
        opacity: op,
        translate: `0px ${ty}px`,
        marginTop: 58,
        padding: "24px 58px",
        borderRadius: 60,
        background: `linear-gradient(180deg, #3FE0F5 0%, ${T.cyan} 100%)`,
        fontFamily: FONT,
        fontSize: 40,
        fontWeight: 800,
        letterSpacing: "-0.01em",
        color: "#03121C",
        whiteSpace: "nowrap",
        boxShadow: [
          `0 0 ${70 * pulse}px rgba(34,211,238,${0.6 * pulse})`,
          "0 20px 54px rgba(0,0,0,0.45)",
          "inset 0 1px 0 rgba(255,255,255,0.5)",
        ].join(", "),
      }}
    >
      DM ‘FLOW’ TO START
    </div>
  );
};
