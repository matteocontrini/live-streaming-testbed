import dashjs, { BufferEvent } from "dashjs";
import { MediaPlayerClass } from "dashjs";
import * as api from "./api";

const INTERVAL = 500;

class EventsCollector {
    interval: NodeJS.Timer | undefined;
    player: MediaPlayerClass;

    constructor(player: MediaPlayerClass) {
        this.player = player;
    }

    start() {
        this.player.on(dashjs.MediaPlayer.events.BUFFER_EMPTY, this.onBufferEmpty);
        this.player.on(dashjs.MediaPlayer.events.BUFFER_LOADED, this.onBufferLoaded);
        this.interval = setInterval(this.tick.bind(this), INTERVAL);
    }

    onBufferEmpty(e: BufferEvent) {
        console.log('Buffer empty ' + e.mediaType);
        api.sendBufferEmptyEvent(e.mediaType);
    }

    onBufferLoaded(e: BufferEvent) {
        console.log('Buffer loaded ' + e.mediaType);
        api.sendBufferLoadedEvent(e.mediaType);
    }

    tick() {
        const videoBuffer = this.player.getDashMetrics().getCurrentBufferLevel('video');
        const audioBuffer = this.player.getDashMetrics().getCurrentBufferLevel('audio');
        const latency = this.player.getCurrentLiveLatency();
        console.log(`video=${videoBuffer} | audio=${audioBuffer} | latency=${latency}`);
        api.sendStatus(videoBuffer, audioBuffer, latency);
    }

    stop() {
        console.log('Stopping simulation');
        this.player.off(dashjs.MediaPlayer.events.BUFFER_EMPTY, this.onBufferEmpty);
        this.player.off(dashjs.MediaPlayer.events.BUFFER_LOADED, this.onBufferLoaded);
        clearInterval(this.interval);
        this.player.destroy();
        api.stop();
    }
}

export default EventsCollector;
