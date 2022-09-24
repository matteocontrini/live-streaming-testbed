import dashjs, {BufferEvent, FragmentLoadingCompletedEvent} from 'dashjs';
import {MediaPlayerClass} from 'dashjs';
import * as api from '../api';

const INTERVAL = 250;

class EventsCollector {
    interval: NodeJS.Timer | undefined;
    player: MediaPlayerClass;
    currentVideoBitrate: number | undefined;
    currentAudioBitrate: number | undefined;

    constructor(player: MediaPlayerClass) {
        this.player = player;
    }

    start() {
        this.player.on(dashjs.MediaPlayer.events.BUFFER_EMPTY, this.onBufferEmpty);
        this.player.on(dashjs.MediaPlayer.events.BUFFER_LOADED, this.onBufferLoaded);
        this.player.on(dashjs.MediaPlayer.events.PLAYBACK_WAITING, this.onPlaybackWaiting);
        this.player.on(dashjs.MediaPlayer.events.PLAYBACK_PLAYING, this.onPlaybackPlaying);
        this.player.on(dashjs.MediaPlayer.events.FRAGMENT_LOADING_COMPLETED, this.onFragmentLoadingCompleted);
        this.player.on(dashjs.MediaPlayer.events.REPRESENTATION_SWITCH, this.onRepresentationSwitch.bind(this));
        this.interval = setInterval(this.tick.bind(this), INTERVAL);
    }

    stop() {
        this.player.off(dashjs.MediaPlayer.events.BUFFER_EMPTY, this.onBufferEmpty);
        this.player.off(dashjs.MediaPlayer.events.BUFFER_LOADED, this.onBufferLoaded);
        this.player.off(dashjs.MediaPlayer.events.PLAYBACK_WAITING, this.onPlaybackWaiting);
        this.player.off(dashjs.MediaPlayer.events.PLAYBACK_PLAYING, this.onPlaybackPlaying);
        this.player.off(dashjs.MediaPlayer.events.FRAGMENT_LOADING_COMPLETED, this.onFragmentLoadingCompleted);
        this.player.off(dashjs.MediaPlayer.events.REPRESENTATION_SWITCH, this.onRepresentationSwitch.bind(this));
        clearInterval(this.interval);
        this.interval = undefined;
    }

    async onBufferEmpty(e: BufferEvent) {
        console.log('Buffer empty ' + e.mediaType);
        await api.sendBufferEmptyEvent(e.mediaType);
    }

    async onBufferLoaded(e: BufferEvent) {
        console.log('Buffer loaded ' + e.mediaType);
        await api.sendBufferLoadedEvent(e.mediaType);
    }

    async onPlaybackWaiting() {
        console.log('Playback stalled');
        await api.sendPlaybackStalledEvent();
    }

    async onPlaybackPlaying() {
        console.log('Playback resumed');
        await api.sendPlaybackResumedEvent();
    }

    async onFragmentLoadingCompleted(e: FragmentLoadingCompletedEvent) {
        if (e.request.type == 'InitializationSegment') {
            return;
        }
        console.log('Fragment loaded: ' + e.request.url);
        await api.sendFragmentLoadedEvent(
            e.request.url,
            e.request.mediaType,
            e.request.startTime,
            e.request.duration,
            e.request.requestStartDate.getTime() / 1000,
            e.request.requestEndDate!.getTime() / 1000
        );
    }

    async onRepresentationSwitch(e: any) {
        if (e.mediaType == 'video') {
            this.currentVideoBitrate = Math.round(e.currentRepresentation.bandwidth / 1000);
        } else if (e.mediaType == 'audio') {
            this.currentAudioBitrate = Math.round(e.currentRepresentation.bandwidth / 1000);
        }

        if (!this.currentVideoBitrate || !this.currentAudioBitrate) {
            return;
        }

        console.log(`Representation switch [${this.currentVideoBitrate} | ${this.currentAudioBitrate}]`);
        await api.sendRepresentationSwitchEvent(this.currentVideoBitrate, this.currentAudioBitrate);
    }

    async tick() {
        if (!this.player.isReady()) {
            return;
        }
        const videoBuffer = this.player.getDashMetrics().getCurrentBufferLevel('video');
        const audioBuffer = this.player.getDashMetrics().getCurrentBufferLevel('audio');
        const latency = this.player.getCurrentLiveLatency();
        const rate = this.player.getPlaybackRate();
        console.log(`video=${videoBuffer} | audio=${audioBuffer} | latency=${latency} | rate = ${rate}`);
        await api.sendStatus(videoBuffer, audioBuffer, latency, rate);
    }
}

export default EventsCollector;
