import { MediaPlayer, MediaPlayerClass } from "dashjs";

export function createPlayer() : MediaPlayerClass {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <video id="player" width="600" height="300" controls></video>
        <button id="play">Play</button>
    `;

    const url = 'https://livesim.dashif.org/livesim/testpic_2s/Manifest.mpd';
    // const url = 'https://cdn.local/manifest.mpd';

    const player = MediaPlayer().create();
    player.initialize(document.querySelector<HTMLVideoElement>('#player')!, url);

    player.setVolume(0);

    player.updateSettings({
        streaming: {
            delay: {
                liveDelayFragmentCount: 2
            }
        }
    });

    return player;
};
