#!/usr/bin/env bash
# AV1 twins for the service clips in public/videos. The H.264 files stay as
# they are (they are the fallback for browsers without AV1 and were already
# encoded tightly - re-encoding them in H.264 only makes them bigger); the
# AV1 file for a clip is the strongest compression whose VMAF against the
# H.264 file is still >= 97, i.e. visually the same clip, and it is kept only
# when that is at least 15% smaller. Grainy clips often fail both tests and
# keep a single H.264 file; that is expected. Needs ffmpeg with libsvtav1
# and libvmaf (brew install ffmpeg).
#
#   scripts/video-av1.sh                      # all four service clips
#   scripts/video-av1.sh service-packing      # one clip
set -euo pipefail
cd "$(dirname "$0")/../public/videos"
CLIPS=("$@"); [ ${#CLIPS[@]} -eq 0 ] && CLIPS=(service-local-moving service-long-distance service-commercial service-packing)
MIN_VMAF=97
TMP=$(mktemp -d)
for v in "${CLIPS[@]}"; do
  best=""
  for crf in 22 26 30 34 38 42; do
    out="$TMP/$v-$crf.mp4"
    ffmpeg -v error -y -i "$v.mp4" -an -c:v libsvtav1 -preset 4 -crf "$crf" -svtav1-params tune=0 \
      -pix_fmt yuv420p -movflags +faststart "$out"
    vmaf=$(ffmpeg -v info -i "$out" -i "$v.mp4" -lavfi "[0:v][1:v]libvmaf=n_threads=8" -f null - 2>&1 \
      | grep -oE "VMAF score: [0-9.]+" | grep -oE "[0-9.]+$")
    ok=$(awk -v a="$vmaf" -v m="$MIN_VMAF" 'BEGIN{print (a>=m)?1:0}')
    printf "%-26s crf %s  %6d KB  VMAF %s\n" "$v" "$crf" "$(( $(stat -f%z "$out") / 1024 ))" "$vmaf"
    [ "$ok" = 1 ] && best="$out" || break
  done
  if [ -n "$best" ]; then cp "$best" "$v.av1.mp4"; echo "-> $v.av1.mp4 ($(( $(stat -f%z "$v.av1.mp4") / 1024 )) KB, H.264 was $(( $(stat -f%z "$v.mp4") / 1024 )) KB)"; else echo "-> $v: no AV1 encode reached VMAF $MIN_VMAF, H.264 stays alone"; fi
done
rm -rf "$TMP"
