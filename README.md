# Testbed for MPEG-DASH live streaming

This repository contains a testbed for emulating a live video streaming setup based on MPEG-DASH over resource-constrained networks.

The testbed is based on the [ComNetsEmu](https://github.com/stevelorenz/comnetsemu) emulator.

## Why DASH and not HLS?

Not my choice 🥹. The emulation is run in a Chromium instance which only [ships](https://www.chromium.org/audio-video/) with royalty-free codecs, like Google's VP9. And HLS doesn't support VP9, so DASH is the only choice.

What about using Chrome instead of Chromium? Unfortunately I'm on ARM and Chrome provides no builds for Linux ARM64 at the moment.

## Instructions

- Install [ComNetsEmu](https://github.com/stevelorenz/comnetsemu), start the Vagrant VM and SSH into it
- Run `./build.sh`
- Run `./start.sh`

## Development setup

If you use IntelliJ/PyCharm and want Python type hints to work, configure the project interpreter with the Vagrant plugin.
