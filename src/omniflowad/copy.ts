/**
 * ALL on-screen copy, verbatim from the spec. Single source of truth —
 * scenes must render these strings and never inline their own copy.
 */

export const S1 = {
  num: "01",
  headline: ["Your business", "is right here.", "People see you", "every day."],
  body1: ["You’ve built something real.", "Your sign is up. Your lights are on.", "Your doors are open."],
  body2: ["Walk past your business", "any time — it looks active,", "professional, and ready."],
  body3: ["So of course you feel visible.", "And you should."],
  icons: ["LIGHTS ON", "DOORS OPEN"],
  sign: "CROWN HARDWARE",
  signSub: "TOOLS • PAINT • PLUMBING • ELECTRICAL",
  openSign: ["WE’RE", "OPEN"],
} as const;

export const S2 = {
  num: "02",
  headline: ["Here’s how", "most people", "shop today."],
  body: ["They’re not driving around.", "They’re on their phone,", "looking for what they need,", "right now, close to them."],
  callout: ["Nearby.", "Convenient.", "Instant."],
  calloutSub: "That’s the new normal.",
  phoneTitle: "Search",
  phoneQuery: "hardware store near me",
  phoneListTitle: "Popular searches",
  phoneList: ["open now", "closest option", "good reviews", "power tools"],
} as const;

export const S3 = {
  num: "03",
  headline: ["They search.", "The map listens."],
  body: ["They type a few simple words.", "The map scans hundreds", "of signals in seconds:"],
  criteria: ["Places nearby", "Open now", "Best match", "Top reviews"],
  bottom: ["In seconds, it decides", "who to show — and", "in what order."],
} as const;

export const S4 = {
  num: "04",
  headline: ["The map can’t read", "your storefront sign."],
  support: ["It reads your business profile —", "the data behind the listing."],
  panelTitle: "Your Business Profile",
  rows: [
    ["Business name", "CROWN HARDWARE"],
    ["Category", "Missing"],
    ["Address", "Incomplete"],
    ["Hours", "Not set"],
    ["Services", "Not added"],
    ["Photos", "None"],
    ["Reviews", "None"],
    ["Website", "Missing"],
  ],
  badValues: ["Missing", "Incomplete", "Not set", "Not added"],
  info1: ["When information is", "missing, incorrect,", "or incomplete, the", "map has nothing", "solid to work with."],
  info2: ["So it can’t match", "your business to", "the search."],
  calloutCompetitor: ["They show up.", "They win the click."],
  calloutCenter: ["Missing information", "leads your customer", "to the competitor."],
  calloutCrown: ["Your store stays hidden", "when the data is missing."],
  labels: { competitor: "COMPETITOR", customer: "YOUR CUSTOMER", crown: "CROWN HARDWARE" },
} as const;

export const S5 = {
  num: "05",
  headline: ["So your business", "gets passed over."],
  body1: ["When the map lacks confidence", "in your information, it can’t", "connect you to the search."],
  body2: ["Your business might exist", "right on that street."],
  body3: "But online, it’s invisible.",
  warning: ["If the map doesn’t", "understand you,", "it won’t show you."],
  results: [
    { name: "Pro Hardware", rating: "4.6", count: "(128)", dist: "0.3 km", stars: 4.6 },
    { name: "Best Tools TT", rating: "4.4", count: "(93)", dist: "0.5 km", stars: 4.4 },
    { name: "Crown Hardware", sub1: "Information incomplete", sub2: "Not showing in results", negative: true },
    { name: "Island Supplies", rating: "4.3", count: "(76)", dist: "0.7 km", stars: 4.3 },
  ],
} as const;

export const S6 = {
  num: "06",
  headline: ["Meanwhile,", "your competitor", "gets the call."],
  body: ["They might not be better.", "They’re just easier for the", "map to understand."],
  call: { title: "Incoming Call", who: "Customer", timer: "00:12" },
  bottom: ["The customer calls the", "business the map showed first."],
} as const;

export const S7 = {
  num: "07",
  headline: ["That means missed", "customers you", "never even knew", "were looking."],
  support1: ["They were nearby.", "They needed what you sell.", "But they never saw you."],
  support2: ["Because the map didn’t", "have enough confidence", "in your information", "to show you."],
  marks: [["Never saw you."], ["Never called you."], ["Chose someone", "else instead."]],
  customer: ["Customer here.", "Searching now."],
} as const;

export const S8 = {
  num: "08",
  headline: "We fix that.",
  body: [
    "OmniFlow Digital builds",
    "and optimizes the digital",
    "version of your business",
    "so the map can finally see you,",
    "trust you, and show you",
    "— to the right customers",
    "at the right time.",
  ],
  checklist: [
    "Complete & accurate profile",
    "Right categories",
    "Correct location",
    "Updated hours",
    "Clear services",
    "Quality photos",
    "More reviews",
  ],
  conclusion: ["Now the map can", "connect the dots.", "You get found.", "You get chosen."],
  brand: ["OmniFlow", "Digital"],
  tagline: "GET FOUND. LOOK PROFESSIONAL. GROW ONLINE.",
} as const;
