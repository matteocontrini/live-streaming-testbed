# Testbed for MPEG-DASH / Apple HLS live streaming

>⚠️ Work in progress :)

This repository contains a testbed for emulating a live video streaming setup based on MPEG-DASH / Apple HLS over resource-constrained networks. It was built for my master thesis.

The testbed is based on the [ComNetsEmu](https://github.com/stevelorenz/comnetsemu) emulator.

## DASH vs HLS

This project was initially built using DASH (and DASH.js as a client library). The reason is that I needed to run the emulation inside a Linux ARM64 virtual machine (Apple Silicon machine), where only Chromium is available and Chromium only [ships](https://www.chromium.org/audio-video/) with royalty-free codecs, like Google's VP9. HLS doesn't support VP9 so DASH was the only choice. 

I later found a way to install non-free codecs with Chromium so I switched to H.264 as a codec.

With H.264 support I was then able to switch to HLS as the ABR protocol, which:

1) is easier to understand and work with, and...
2) the most commonly used library, HLS.js, is written in TypeScript (like this project) and seems to have a higher code quality and extensibility.

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
