import dashjs from "dashjs";
import { MediaPlayerClass } from "dashjs";
import * as api from "./api";

function tick(player: MediaPlayerClass) {
    const videoBuffer = player.getDashMetrics().getCurrentBufferLevel('video');
    const audioBuffer = player.getDashMetrics().getCurrentBufferLevel('audio');
    const latency = player.getCurrentLiveLatency();
    console.log(`Buffer [V]: ${videoBuffer} | Buffer [A]: ${audioBuffer} | L: ${latency}`);
    api.sendStatus(videoBuffer, audioBuffer, latency);
}

export function startSendingMetrics(player: MediaPlayerClass) {
    setInterval(tick.bind(player, player), 500);

    player.on(dashjs.MediaPlayer.events.BUFFER_EMPTY, (e) => {
        console.log('Buffer empty ' + e.mediaType);
        api.sendEvent('BUFFER_EMPTY_' + e.mediaType.toUpperCase());
    });

    player.on(dashjs.MediaPlayer.events.BUFFER_LOADED, (e) => {
        console.log('Buffer loaded ' + e.mediaType);
        api.sendEvent('BUFFER_LOADED_' + e.mediaType.toUpperCase());
    });
}
