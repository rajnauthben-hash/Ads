/**
 * Geometry traced over the approved plates (1080x1920 space), read off a
 * calibration grid. Route paths follow the baked routes so the live pulse
 * rides the same roads. Marker/glow anchors match the reference frames.
 */

// Scene 1 — lower-left → up through streets → Crown (upper-right)
export const S1_ROUTE =
  "M 210 1600 C 360 1520 420 1410 470 1310 C 535 1200 500 1100 560 1035 C 612 988 662 1000 692 903 C 710 845 660 780 700 720 C 716 692 710 668 716 656";
export const S1_STORE_GLOW = { x: 720, y: 470, r: 190 };

// Scene 2 — phone search node → down → left → Crown (lower-left)
export const S2_ROUTE =
  "M 665 1255 C 610 1370 545 1430 470 1475 C 380 1530 300 1470 250 1360 C 210 1275 195 1150 186 1055";
export const S2_SEARCH_NODE = { x: 665, y: 1250 };
export const S2_STORE_GLOW = { x: 180, y: 1000, r: 150 };

// Scene 3 — two routes from one customer
export const S3_CUSTOMER = { x: 185, y: 1590 };
export const S3_COMP_RING = { x: 838, y: 1414 };
// main (failed) branch: customer → junction → up wavy → Missed connection near Crown
export const S3_MAIN_ROUTE =
  "M 185 1590 C 320 1650 450 1620 570 1555 C 700 1490 800 1440 838 1414 C 812 1290 690 1200 636 1120 C 598 1060 622 1002 700 962 C 792 920 842 918 850 902 C 902 800 952 726 902 682 C 878 660 862 645 855 624";
// competitor branch: junction → competitor door (successful)
export const S3_COMP_ROUTE = "M 838 1414 C 852 1424 868 1434 882 1444";
export const S3_COMP_DOOR = { x: 884, y: 1446 };
export const S3_COMP_GLOW = { x: 880, y: 1360, r: 110 };
export const S3_CROWN_GLOW = { x: 730, y: 720, r: 130 };

// Scene 4 — origin (lower-left) → up → Crown doorway (upper-right)
export const S4_ORIGIN = { x: 315, y: 1490 };
export const S4_ROUTE =
  "M 315 1490 C 400 1430 450 1360 480 1280 C 520 1180 560 1130 640 1075 C 700 1035 720 985 700 930 C 685 885 760 900 830 900 C 875 900 860 815 852 770 C 846 735 862 715 872 704";
export const S4_DOOR = { x: 872, y: 700 };
export const S4_STORE_GLOW = { x: 880, y: 500, r: 200 };
