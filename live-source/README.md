This directory contains the code and data to generate the DASH+HLS files for the CDN.

To generate the stream outside the ComNetsEmu emulation, use:

```shell
./abr.sh abr.mp4 ../cdn/www
```

Then start [the CDN server](../cdn).

Make sure you've generated the `abr.mp4` file before (see root README).
