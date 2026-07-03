// ————————————————————————————————————————————————————————————————
// TEXT LAYER MAP — extracted from omniflowv3.mp4 (source of truth:
// the 10 poster stills in public/images/v3/ that compose that video).
// Wording, punctuation, and order preserved exactly.
// Times are the ORIGINAL video's beats; "target" is where the text
// lands in the OmniFlowCinematic timeline (frames @ 30fps).
//
// Correction pass: mockup/prop text is now ALSO transferred verbatim —
//   • ghost + repaired site: http://www.yourbusiness.com, YOUR BUSINESS,
//     HOME / ABOUT / SERVICES / CONTACT
//   • premium site: https URL, nav (+WORK), GET STARTED, WELCOME,
//     "We craft digital experiences that drive real growth.", hero
//     paragraph, VIEW OUR WORK, feature tiles with captions
//   • cost beat: Traffic Over Time, Customer Activity, listing card reuse
//   • actions beat: +28% stat pill
//   • growth beat: full PERFORMANCE OVERVIEW dashboard (Apr 1 – Apr 30,
//     2025; Overall Growth +127% vs Mar 1 – Mar 31, 2025; Website Visits
//     4,892 +84%; Profile Views 1,754 +92%; Customer Actions 673 +110%;
//     Top Performing Channels 1,982/1,245/892/623; Engagement Rate 92%
//     +18%; Avg. Time on Site 02:48 +22%; Bounce Rate 28% -16%; Review
//     Rating 4.9 ★★★★★; Ranking Keywords 156 +37%)
//   • final frame: site mockup (nav +GALLERY, "Built for Trust. Designed
//     to Convert.", paragraph, GET STARTED), listing card + Save button,
//     Local Visibility 98%, Customer Activity 247
// ————————————————————————————————————————————————————————————————

export interface TextLayer {
  text: string;
  hierarchy: "kicker" | "headline" | "headline-accent" | "sub" | "card-title" | "card-desc" | "cta" | "label" | "footer";
  originalTime: [number, number];  // seconds in omniflowv3.mp4
  target: { scene: string; from: number };
  placement: string;
  motion: string;
}

export const TEXT_LAYER_MAP: TextLayer[] = [
  // ——— Beat 1 (0.0–2.0s) ———
  { text: "Your business exists online…", hierarchy: "headline", originalTime: [0, 2], target: { scene: "invisible", from: 40 }, placement: "lower third, centered", motion: "masked rise" },
  { text: "but customers can’t find it.", hierarchy: "headline-accent", originalTime: [0, 2], target: { scene: "invisible", from: 72 }, placement: "lower third, centered", motion: "masked rise + tracking settle + glow" },
  { text: "Your Business", hierarchy: "card-title", originalTime: [0, 2], target: { scene: "invisible", from: 34 }, placement: "ghost Maps card", motion: "fade + flicker" },
  { text: "Address not found", hierarchy: "card-desc", originalTime: [0, 2], target: { scene: "invisible", from: 34 }, placement: "ghost Maps card", motion: "fade + flicker" },
  { text: "Outdated listing", hierarchy: "card-desc", originalTime: [0, 2], target: { scene: "invisible", from: 34 }, placement: "ghost Maps card", motion: "fade + flicker" },

  // ——— Beat 2 (2.0–3.8s) ———
  { text: "THE PROBLEM", hierarchy: "kicker", originalTime: [2, 3.8], target: { scene: "problems", from: 74 }, placement: "above headline", motion: "fade + tracking expand" },
  { text: "Outdated Website", hierarchy: "card-title", originalTime: [2, 3.8], target: { scene: "problems", from: 10 }, placement: "floating card, far depth", motion: "emerge + drift" },
  { text: "Old design builds distrust and drives visitors away.", hierarchy: "card-desc", originalTime: [2, 3.8], target: { scene: "problems", from: 10 }, placement: "floating card", motion: "emerge + drift" },
  { text: "Weak Google Visibility", hierarchy: "card-title", originalTime: [2, 3.8], target: { scene: "problems", from: 26 }, placement: "floating card, near depth", motion: "emerge + drift" },
  { text: "Low rankings mean customers choose your competitors.", hierarchy: "card-desc", originalTime: [2, 3.8], target: { scene: "problems", from: 26 }, placement: "floating card", motion: "emerge + drift" },
  { text: "Missed Calls & Leads", hierarchy: "card-title", originalTime: [2, 3.8], target: { scene: "problems", from: 42 }, placement: "floating card, mid depth", motion: "emerge + drift" },
  { text: "Every missed inquiry is revenue you’ll never get back.", hierarchy: "card-desc", originalTime: [2, 3.8], target: { scene: "problems", from: 42 }, placement: "floating card", motion: "emerge + drift" },
  { text: "A weak digital presence costs attention.", hierarchy: "headline", originalTime: [2, 3.8], target: { scene: "problems", from: 82 }, placement: "lower third", motion: "masked rise (two lines)" },

  // ——— Beat 3 (3.8–5.6s) ———
  { text: "WHAT IT COSTS YOU", hierarchy: "kicker", originalTime: [3.8, 5.6], target: { scene: "problems", from: 108 }, placement: "above second headline", motion: "fade + tracking expand" },
  { text: "Every day costs real customers.", hierarchy: "headline-accent", originalTime: [3.8, 5.6], target: { scene: "problems", from: 116 }, placement: "lower third", motion: "masked rise + gradient glow" },

  // ——— Beat 4 (5.6–7.2s) ———
  { text: "We change that.", hierarchy: "headline-accent", originalTime: [5.6, 7.2], target: { scene: "shift", from: 88 }, placement: "lower third, over portal", motion: "masked rise + tracking + glow" },
  { text: "OmniFlow Digital transforms your online presence.", hierarchy: "sub", originalTime: [5.6, 7.2], target: { scene: "shift", from: 108 }, placement: "under headline", motion: "masked rise" },

  // ——— Beat 5 (7.2–9.4s) ———
  { text: "Premium Websites.", hierarchy: "headline", originalTime: [7.2, 9.4], target: { scene: "website", from: 108 }, placement: "lower third", motion: "masked rise" },
  { text: "Built to convert.", hierarchy: "headline-accent", originalTime: [7.2, 9.4], target: { scene: "website", from: 122 }, placement: "lower third", motion: "masked rise + gradient" },
  { text: "Modern design. Powerful performance. Real results.", hierarchy: "sub", originalTime: [7.2, 9.4], target: { scene: "website", from: 140 }, placement: "under headline", motion: "masked rise" },

  // ——— Beat 6 (9.4–11.8s) ———
  { text: "GOOGLE MAPS OPTIMIZATION", hierarchy: "kicker", originalTime: [9.4, 11.8], target: { scene: "visibility", from: 16 }, placement: "top, above headline", motion: "fade + tracking expand" },
  { text: "Show up where customers are searching.", hierarchy: "headline", originalTime: [9.4, 11.8], target: { scene: "visibility", from: 24 }, placement: "top, centered (map owns lower half)", motion: "masked rise, accent on line 2" },
  { text: "Your Business", hierarchy: "card-title", originalTime: [9.4, 11.8], target: { scene: "visibility", from: 34 }, placement: "business card by pin", motion: "rise from floor" },
  { text: "4.9 ★★★★★ (128)", hierarchy: "card-desc", originalTime: [9.4, 11.8], target: { scene: "visibility", from: 34 }, placement: "business card", motion: "rise from floor" },
  { text: "Open · Closes 8 PM", hierarchy: "card-desc", originalTime: [9.4, 11.8], target: { scene: "visibility", from: 34 }, placement: "business card", motion: "rise from floor" },
  { text: "Marketing Agency", hierarchy: "card-desc", originalTime: [9.4, 11.8], target: { scene: "visibility", from: 34 }, placement: "business card", motion: "rise from floor" },
  { text: "Call / Directions / Website", hierarchy: "label", originalTime: [9.4, 11.8], target: { scene: "visibility", from: 34 }, placement: "business card action row", motion: "rise with card" },
  { text: "Top Rated", hierarchy: "label", originalTime: [9.4, 11.8], target: { scene: "visibility", from: 70 }, placement: "bottom chip row", motion: "scale-in" },
  { text: "Locally Trusted", hierarchy: "label", originalTime: [9.4, 11.8], target: { scene: "visibility", from: 78 }, placement: "bottom chip row", motion: "scale-in" },
  { text: "Easily Found", hierarchy: "label", originalTime: [9.4, 11.8], target: { scene: "visibility", from: 86 }, placement: "bottom chip row", motion: "scale-in" },
  { text: "Local Search Growth +127% increase in local search visibility", hierarchy: "card-desc", originalTime: [9.4, 11.8], target: { scene: "visibility", from: 56 }, placement: "stat card, right of pin", motion: "rise from floor" },

  // ——— Beat 7 (11.8–13.8s) ———
  { text: "More actions. More customers.", hierarchy: "headline", originalTime: [11.8, 13.8], target: { scene: "actions", from: 16 }, placement: "upper center", motion: "masked rise, accent line 2" },
  { text: "Calls / Messages / Bookings / Leads", hierarchy: "label", originalTime: [11.8, 13.8], target: { scene: "actions", from: 34 }, placement: "icon tile row, center", motion: "staggered scale-in + float" },
  { text: "REAL ACTIONS. REAL RESULTS. GROW WITH OMNIFLOW.", hierarchy: "footer", originalTime: [11.8, 13.8], target: { scene: "actions", from: 74 }, placement: "bottom, tracked caps", motion: "fade + tracking" },

  // ——— Beat 8 (13.8–15.8s) ———
  { text: "Real growth. Real impact.", hierarchy: "headline", originalTime: [13.8, 15.8], target: { scene: "growth", from: 14 }, placement: "upper center", motion: "masked rise, accent line 2" },
  { text: "Overall Growth +127%", hierarchy: "card-title", originalTime: [13.8, 15.8], target: { scene: "growth", from: 30 }, placement: "stat lockup beside chart", motion: "count-up + glow" },
  { text: "DATA-DRIVEN. RESULTS-FOCUSED. OMNIFLOW DIGITAL", hierarchy: "footer", originalTime: [13.8, 15.8], target: { scene: "growth", from: 66 }, placement: "bottom, tracked caps", motion: "fade + tracking" },

  // ——— Beat 9 (15.8–17.6s) ———
  { text: "One partner. Everything you need.", hierarchy: "headline", originalTime: [15.8, 17.6], target: { scene: "partner", from: 8 }, placement: "top, centered", motion: "masked rise, accent line 2" },
  { text: "Web Design & Development — Modern sites that build trust and convert.", hierarchy: "card-title", originalTime: [15.8, 17.6], target: { scene: "partner", from: 26 }, placement: "service row 1", motion: "slide-in stagger" },
  { text: "Google Maps Optimization — Get found where customers are already searching.", hierarchy: "card-title", originalTime: [15.8, 17.6], target: { scene: "partner", from: 38 }, placement: "service row 2", motion: "slide-in stagger" },
  { text: "Local SEO & Visibility — Improve rankings and attract ready-to-buy customers.", hierarchy: "card-title", originalTime: [15.8, 17.6], target: { scene: "partner", from: 50 }, placement: "service row 3", motion: "slide-in stagger" },
  { text: "Ongoing Growth & Support — Continuous optimization for long-term results.", hierarchy: "card-title", originalTime: [15.8, 17.6], target: { scene: "partner", from: 62 }, placement: "service row 4", motion: "slide-in stagger" },
  { text: "Strategy. Design. Visibility. Growth.", hierarchy: "footer", originalTime: [15.8, 17.6], target: { scene: "partner", from: 84 }, placement: "bottom, tracked caps", motion: "fade + tracking" },

  // ——— Beat 10 (17.6–20.0s) ———
  { text: "Get Found.", hierarchy: "headline", originalTime: [17.6, 20], target: { scene: "cta", from: 14 }, placement: "center stack", motion: "masked rise" },
  { text: "Look Professional.", hierarchy: "headline", originalTime: [17.6, 20], target: { scene: "cta", from: 22 }, placement: "center stack", motion: "masked rise" },
  { text: "Grow Online.", hierarchy: "headline-accent", originalTime: [17.6, 20], target: { scene: "cta", from: 30 }, placement: "center stack, largest", motion: "masked rise + gradient glow" },
  { text: "Premium Websites • Google Maps • Local Visibility", hierarchy: "sub", originalTime: [17.6, 20], target: { scene: "cta", from: 44 }, placement: "under headline stack", motion: "fade rise" },
  { text: "DM ‘FLOW’ TO START", hierarchy: "cta", originalTime: [17.6, 20], target: { scene: "cta", from: 56 }, placement: "CTA pill, center", motion: "rise + glow pulse" },
  { text: "OMNIFLOW DIGITAL", hierarchy: "footer", originalTime: [17.6, 20], target: { scene: "cta", from: 70 }, placement: "under CTA, tracked caps", motion: "fade + tracking" },
];
