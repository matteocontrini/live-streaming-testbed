# Testbed for MPEG-DASH / HLS live streaming

>⚠️ Work in progress :)

This repository contains a testbed for emulating a live video streaming setup based on MPEG-DASH / HLS over resource-constrained networks. It was built for my master thesis.

The testbed is based on the [ComNetsEmu](https://github.com/stevelorenz/comnetsemu) emulator.

## Why DASH and not HLS?

TODO: now using H.264 and HLS.

Not my choice 🥹. The emulation is run in a Chromium instance which only [ships](https://www.chromium.org/audio-video/) with royalty-free codecs, like Google's VP9. And HLS doesn't support VP9, so DASH is the only choice.

What about using Chrome instead of Chromium? Unfortunately I'm on ARM and Chrome provides no builds for Linux ARM64 at the moment.

## How to run

- Install [ComNetsEmu](https://github.com/stevelorenz/comnetsemu)

- Clone this repository inside the `comnetsemu` directory:

```shell
git clone https://github.com/matteocontrini/live-streaming-testbed.git testbed
```

- Download the video file used for testing (Big Buck Bunny) and encode the renditions:

```shell
cd testbed/live-source
wget https://kodi.mirror.garr.it/demo-files/BBB/bbb_sunflower_1080p_60fps_normal.mp4
./encode.sh
# The output is a single file named dash.mp4
```

- Start the Vagrant machine:

```shell
vagrant up
```

- Start a shell:

```shell
vagrant ssh
```

- Build the Docker images and start the emulation:

```shell
cd comnetsemu/testbed
./build.sh
./start.sh
```

- Then in another shell (within the VM) you can watch the logs of the experiments:

```shell
./logs.sh
```

The emulation outputs are saved in the `client/out` directory.

### Note for Apple Silicon users

ComNetsEmu currently doesn't work if you're using an **Apple Silicon** machine. To make it work, install Parallels Desktop and modify the Vagrantfile by adding the following configuration block:

```
BOX_PARALLELS = "jeffnoxon/ubuntu-20.04-arm64"

# ...

config.vm.provider "parallels" do |prl, override|
   override.vm.box = BOX_PARALLELS
   prl.name = VM_NAME
   prl.cpus = CPUS
   prl.memory = RAM
end
```

## Analysis

Use the R notebook in the `analysis` directory. 

## Development setup

If you use IntelliJ/PyCharm and want Python type hints to work, configure the project interpreter with the Vagrant plugin.

## Credits

For the network dataset:

>D. Raca, J.J. Quinlan, A.H. Zahran, C.J. Sreenan. "Beyond Throughput: a 4G LTE Dataset with Channel and Context Metrics" In Proceedings of ACM Multimedia Systems Conference (MMSys 2018), Amsterdam, The Netherlands, June 12 - 15, 2018.  Further details on our datasets are available in the conference paper. 
