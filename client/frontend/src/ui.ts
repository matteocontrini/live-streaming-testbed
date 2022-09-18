import {MediaPlayer, MediaPlayerClass} from 'dashjs';
import BufferEmptyRule from './BufferEmptyRule';

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

function startPlayer(url: string, liveCatchup: boolean, minBitrate: number) {
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
                    video: 10000, // always start with the highest quality
                    audio: 1000
                },
                minBitrate: {
                    video: minBitrate,
                    audio: -1
                },
                // Throughput-based strategy works better for live
                // https://dl.acm.org/doi/pdf/10.1145/3204949.3204953
                // Dynamic seems broken for live since it *keeps* switching between BOLA and throughput.
                // (it seems that the switch threshold is set to the live latency instead of
                // 10 seconds as suggested by the paper)
                ABRStrategy: 'abrThroughput',
                additionalAbrRules: {
                    // Disabled because it's too conservative in a live scenario
                    // https://github.com/Dash-Industry-Forum/dash.js/blob/e188a1533e8503e3941ce762196c2be92d58119b/src/streaming/rules/abr/InsufficientBufferRule.js#L115
                    insufficientBufferRule: false,
                    // TODO: what's the impact of this
                    // switchHistoryRule: false,
                },
            }
        }
    });

    player.addABRCustomRule('qualitySwitchRules', 'BufferEmptyRule', BufferEmptyRule);

    player.attachSource(url);
}

function resetPlayer() {
    player.reset();
}

export {init, createPlayer, startPlayer, resetPlayer};
