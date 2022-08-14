import {MediaPlayer, MediaPlayerClass} from 'dashjs';

export function init() {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <video id="player" width="600" height="300" controls></video>
        <button id="ready">READY</button>
    `;
}

let player: MediaPlayerClass;

export function createPlayer(): MediaPlayerClass {
    let element = document.getElementById('player')!;

    player = MediaPlayer().create();

    player.initialize(element);

    player.setMute(true);

    player.updateSettings({
        streaming: {
            delay: {
                liveDelayFragmentCount: 2
            }
        }
    });

    return player;
}

export function resetPlayer(url: string) {
    player.attachSource(url);
}
