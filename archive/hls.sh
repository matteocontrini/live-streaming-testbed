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

ffmpeg -re -stream_loop -1 -i $SOURCE \
  -map 0 -c copy \
  -var_stream_map "a:0 v:0 v:1 v:2 v:3" \
  -hls_segment_type fmp4 \
  -hls_flags independent_segments \
  -hls_playlist_type event \
  -hls_time 2 \
  -master_pl_name master.m3u8 \
  -hls_segment_filename $OUT_DIR/chunk-stream-%v-%03d.m4s \
  -hls_fmp4_init_filename init-stream-%v.m4s \
  -f hls $OUT_DIR/stream-%v.m3u8
