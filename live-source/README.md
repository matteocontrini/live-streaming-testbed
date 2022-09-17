This directory contains the code and data to generate the DASH files for the CDN.

To generate the DASH stream outside the ComNetsEmu emulation, use:

```shell
./dash.sh dash.mp4 ../cdn/www
```

Then start [the CDN server](../cdn).

Make sure you've generated the `dash.mp4` file before (see root README).
