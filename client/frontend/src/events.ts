import dashjs, {BufferEvent} from "dashjs";
import {MediaPlayerClass} from "dashjs";
import * as api from "./api";

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

    async tick() {
        const videoBuffer = this.player.getDashMetrics().getCurrentBufferLevel('video');
        const audioBuffer = this.player.getDashMetrics().getCurrentBufferLevel('audio');
        const latency = this.player.getCurrentLiveLatency();
        console.log(`video=${videoBuffer} | audio=${audioBuffer} | latency=${latency}`);
        await api.sendStatus(videoBuffer, audioBuffer, latency);
    }
}

export default EventsCollector;
