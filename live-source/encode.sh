#!/bin/bash
INPUT="bbb_sunflower_1080p_60fps_normal.mp4"

ffmpeg -i $INPUT \
  -c:v libvpx-vp9 -pix_fmt yuv420p -r 25 -quality realtime -speed 6 -frame-parallel 1 -row-mt 1 -tile-columns 2 -keyint_min 50 -g 50 \
  -c:a libopus -ac 2 -b:a 128k \
  -map 0:a:0 -map 0:v:0 -map 0:v:0 -map 0:v:0 -map 0:v:0 \
  -s:v:0 1280x720 -b:v:0 3500k -bufsize:v:0 3500k -minrate:v:0 3500k -maxrate:v:0 3500k \
  -s:v:1 960x540 -b:v:1 2500k -bufsize:v:1 2500k -minrate:v:1 2500k -maxrate:v:1 2500k \
  -s:v:2 640x360 -b:v:2 1500k -bufsize:v:2 1500k -minrate:v:2 1500k -maxrate:v:2 1500k \
  -s:v:3 480x270 -b:v:3 800k -bufsize:v:3 800k -minrate:v:3 800k -maxrate:v:3 800k \
  -threads 8 -y \
  dash.mp4
