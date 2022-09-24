import Hls from 'hls.js';
import EventsCollector from './collector';

let hls: Hls | undefined;
let collector: EventsCollector | undefined;

function startHlsPlayer(element: HTMLMediaElement, url: string, liveCatchup: boolean, minBitrate: number) {
    hls = new Hls({
        liveSyncDurationCount: 1,
        minAutoBitrate: minBitrate,
        maxLiveSyncPlaybackRate: liveCatchup ? 1.5 : 1,
    });

    collector = new EventsCollector(hls, element);
    collector.start();

    hls.loadSource(url);

    hls.on(Hls.Events.MANIFEST_PARSED, async () => {
        element.muted = true;
        await element.play();
    });

    hls.attachMedia(element);
}

function resetHlsPlayer() {
    hls?.destroy();
    hls = undefined;
    collector?.stop();
    collector = undefined;
}

export {startHlsPlayer, resetHlsPlayer};
