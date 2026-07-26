#!/usr/bin/env bash
# Frame-audit tool (internal dev only). Extracts the specified audit frames from
# the rendered MP4 and builds an HTML contact sheet. Not part of the ad.
set -e
cd "$(dirname "$0")/.."
MP4="out/omniflow-invisible-shortlist.mp4"
OUT="out/audit"
mkdir -p "$OUT"

FRAMES=(0 17 39 57 87 111 119 120 137 159 179 202 218 230 245 246 285 305 326 341 357 371 372 391 411 435 458 466 483 503 504 535 553 576 593 615 627 644 645 679 699 720 738 750 765 779)

for f in "${FRAMES[@]}"; do
  # frame-accurate output seeking
  ts=$(awk "BEGIN{printf \"%.5f\", ($f + 0.5)/30}")
  npx remotion ffmpeg -y -loglevel error -ss "$ts" -i "$MP4" -frames:v 1 "$OUT/audit_$(printf '%03d' "$f").png"
  echo "extracted frame $f"
done

# Build HTML contact sheet
CS="$OUT/contact-sheet.html"
{
  echo '<!doctype html><meta charset="utf-8"><title>InvisibleShortlist — Audit Contact Sheet</title>'
  echo '<style>body{background:#05080C;color:#F5F7FA;font-family:sans-serif;margin:24px}'
  echo 'h1{font-size:20px}.grid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}'
  echo '.cell{background:#0D0F12;border:1px solid #1a2029;border-radius:8px;padding:6px;text-align:center}'
  echo '.cell img{width:100%;border-radius:4px;display:block}.cap{font-size:12px;color:#8B949E;margin-top:4px}</style>'
  echo '<h1>InvisibleShortlist — Frame Audit (internal dev only)</h1><div class="grid">'
  for f in "${FRAMES[@]}"; do
    printf '<div class="cell"><img src="audit_%03d.png"><div class="cap">frame %d</div></div>\n' "$f" "$f"
  done
  echo '</div>'
} > "$CS"
echo "contact sheet -> $CS"
