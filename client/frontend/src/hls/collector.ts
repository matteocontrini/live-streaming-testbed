import Hls, {Events, FragLoadedData, LevelSwitchingData} from 'hls.js';
import * as api from '../api';
import {BufferHelper} from './buffer-helper';

const INTERVAL = 250;

class BufferController extends Hls.DefaultConfig.bufferController {
}

class EventsCollector {
    interval: NodeJS.Timer | undefined;
    hls: Hls;
    element: HTMLMediaElement;
    bufferController: BufferController;
    isStalled: boolean = false;
    isVideoBufferEmpty: boolean = false;
    isAudioBufferEmpty: boolean = false;

    constructor(hls: Hls, video: HTMLMediaElement) {
        this.hls = hls;
        this.element = video;
        this.bufferController = new BufferController(hls);
    }

    start() {
        this.hls.on(Events.FRAG_LOADED, this.onFragLoaded.bind(this));
        this.hls.on(Events.LEVEL_SWITCHING, this.onLevelSwitch.bind(this));

        this.interval = setInterval(this.tick.bind(this), INTERVAL);
    }

    stop() {
        this.hls.off(Events.FRAG_LOADED, this.onFragLoaded.bind(this));
        this.hls.off(Events.LEVEL_SWITCHING, this.onLevelSwitch.bind(this));

        clearInterval(this.interval);
        this.interval = undefined;
        this.isStalled = false;
    }

    async onFragLoaded(_event: Events.FRAG_LOADED, data: FragLoadedData) {
        console.log('Fragment loaded: ' + data.frag.relurl);

        const url = data.frag.url;
        const mediaType = data.frag.type;
        const startTime = data.frag.start;
        const duration = data.frag.duration;
        const requestStartTime = Math.round(data.frag.stats.loading.start) / 1000;
        const requestEndTime = Math.round(data.frag.stats.loading.end) / 1000;

        await api.sendFragmentLoadedEvent(
            url,
            mediaType,
            startTime,
            duration,
            requestStartTime,
            requestEndTime
        );
    }

    async onLevelSwitch(_event: Events.LEVEL_SWITCHING, data: LevelSwitchingData) {
        const videoBitrate = Math.round(data.bitrate / 1000);
        const audioBitrate = Math.round(this.hls.audioTracks[this.hls.audioTrack].bitrate / 1000);
        console.log(`Level switch [${videoBitrate} | ${audioBitrate}]`);
        await api.sendRepresentationSwitchEvent(videoBitrate, audioBitrate);
    }

    async tick() {
        const videoBuffer = this.bufferController.tracks.video?.buffer
            ? BufferHelper.bufferInfo(this.bufferController.tracks.video.buffer, this.element.currentTime, 0.25).len
            : 0;

        const audioBuffer = this.bufferController.tracks.audio?.buffer
            ? BufferHelper.bufferInfo(this.bufferController.tracks.audio.buffer, this.element.currentTime, 0.25).len
            : 0;

        const latency = this.hls.latency;
        const rate = this.element.playbackRate;

        // Status
        console.log(`video=${videoBuffer} | audio=${audioBuffer} | latency=${latency} | rate = ${rate}`);
        await api.sendStatus(videoBuffer, audioBuffer, latency, rate);

        // Stall/resume
        if (this.isStalled && this.element.readyState >= 3) {
            console.log('Playback resumed');
            this.isStalled = false;
            await api.sendPlaybackResumedEvent();
        } else if (!this.isStalled && this.element.readyState < 3) {
            console.log('Playback stalled');
            this.isStalled = true;
            await api.sendPlaybackStalledEvent();
        }

        // Video buffer empty/loaded
        if (!this.isVideoBufferEmpty && videoBuffer < 0.3) {
            this.isVideoBufferEmpty = true;
            console.log('Buffer empty [video]');
            await api.sendBufferEmptyEvent('video');
        } else if (this.isVideoBufferEmpty && videoBuffer >= 0.3) {
            this.isVideoBufferEmpty = false;
            console.log('Buffer loaded [video]');
            await api.sendBufferLoadedEvent('video');
        }

        // Audio buffer empty/loaded
        if (!this.isAudioBufferEmpty && audioBuffer < 0.3) {
            this.isAudioBufferEmpty = true;
            console.log('Buffer empty [audio]');
            await api.sendBufferEmptyEvent('audio');
        } else if (this.isAudioBufferEmpty && audioBuffer >= 0.3) {
            this.isAudioBufferEmpty = false;
            console.log('Buffer loaded [audio]');
            await api.sendBufferLoadedEvent('audio');
        }
    }
}

export default EventsCollector;
