#!/bin/bash
if [ -z "$1" ]; then
  echo "Missing source file path"
  exit
fi

if [ -z "$1" ]; then
  echo "Missing output directory"
  exit
fi

SOURCE=$1
OUT_DIR=$2

rm -rf $OUT_DIR/*.m4s $OUT_DIR/*.tmp $OUT_DIR/*.mpd

ffmpeg -re -i $SOURCE \
  -map 0 -c copy \
  -utc_timing_url 'https://time.akamai.com/?iso' \
  -seg_duration 2 \
  -dash_segment_type mp4 \
  -use_timeline 0 \
  -media_seg_name 'chunk-stream-$RepresentationID$-$Number%05d$.m4s' \
  -init_seg_name 'init-stream-$RepresentationID$.m4s' \
  -adaptation_sets 'id=0,streams=v id=1,streams=a' \
  -hls_playlist 1 \
  -f dash \
  $OUT_DIR/manifest.mpd
