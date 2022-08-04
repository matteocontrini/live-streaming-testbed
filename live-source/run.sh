#!/bin/bash
SOURCE="/live/bbb_sunflower_1080p_60fps_normal.mp4"
OUT_DIR="/live"

rm -rf $OUT_DIR/*.m4s $OUT_DIR/*.tmp $OUT_DIR/*.mpd

ffmpeg -re -stream_loop -1 -i $SOURCE \
-c:v libvpx-vp9 -pix_fmt yuv420p -r 25 -s 1280x720 -b:v 3500k -bufsize 3500k -minrate 3500k -maxrate 3500k -quality realtime -speed 6 -frame-parallel 1 -row-mt 1 -tile-columns 2 -keyint_min 50 -g 50 \
-c:a libopus -ac 2 -b:a 128k \
-threads 8 \
-utc_timing_url 'https://time.akamai.com/?iso' \
-seg_duration 2 \
-dash_segment_type mp4 \
-use_timeline 0 -media_seg_name 'chunk-stream-$RepresentationID$-$Number%05d$.m4s' \
-init_seg_name 'init-stream1-$RepresentationID$.m4s' \
-adaptation_sets 'id=0,streams=0 id=1,streams=1' -f dash $OUT_DIR/manifest.mpd
