import dashjs, {BufferEvent} from 'dashjs';
import {MediaPlayerClass} from 'dashjs';
import * as api from './api';

const INTERVAL = 250;

class EventsCollector {
    interval: NodeJS.Timer | undefined;
    player: MediaPlayerClass;

    constructor(player: MediaPlayerClass) {
        this.player = player;
    }

    start() {
        this.player.on(dashjs.MediaPlayer.events.BUFFER_EMPTY, this.onBufferEmpty);
        this.player.on(dashjs.MediaPlayer.events.BUFFER_LOADED, this.onBufferLoaded);
        this.player.on(dashjs.MediaPlayer.events.PLAYBACK_WAITING, this.onPlaybackWaiting);
        this.player.on(dashjs.MediaPlayer.events.PLAYBACK_PLAYING, this.onPlaybackPlaying);
        this.interval = setInterval(this.tick.bind(this), INTERVAL);
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

    async tick() {
        const videoBuffer = this.player.getDashMetrics().getCurrentBufferLevel('video');
        const audioBuffer = this.player.getDashMetrics().getCurrentBufferLevel('audio');
        const latency = this.player.getCurrentLiveLatency();
        const rate = this.player.getPlaybackRate();
        console.log(`video=${videoBuffer} | audio=${audioBuffer} | latency=${latency} | rate = ${rate}`);
        await api.sendStatus(videoBuffer, audioBuffer, latency, rate);
    }
}

export default EventsCollector;
