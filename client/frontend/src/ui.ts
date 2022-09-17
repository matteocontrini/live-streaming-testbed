import {MediaPlayer, MediaPlayerClass} from 'dashjs';

let player: MediaPlayerClass;
let element: HTMLElement;

function init() {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <video id="player" width="600" height="300" controls></video>
        <button id="ready">READY</button>
    `;
}


function createPlayer(): MediaPlayerClass {
    element = document.getElementById('player')!;
    player = MediaPlayer().create();
    return player;
}

function startPlayer(url: string, liveCatchup: boolean) {
    player.initialize(element);

    player.setMute(true);

    player.updateSettings({
        streaming: {
            delay: {
                liveDelayFragmentCount: 2
            },
            liveCatchup: {
                enabled: liveCatchup
            },
            abr: {
                initialBitrate: {
                    video: 10000, // start with the highest quality
                    audio: 1000
                }
            }
        }
    });

    player.attachSource(url);
}

function resetPlayer() {
    player.reset();
}

export {init, createPlayer, startPlayer, resetPlayer};
