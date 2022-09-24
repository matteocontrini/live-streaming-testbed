import './style.css';
import * as ui from './ui';
import {startExperiments} from './api';
import {resetDashPlayer, startDashPlayer} from './dash/player';
import {resetHlsPlayer, startHlsPlayer} from './hls/player';

ui.init();

document.getElementById('ready')!.addEventListener('click', async () => {
    await startExperiments();
});

const element = document.getElementById('player')! as HTMLMediaElement;
let protocol: 'hls' | 'dash' | undefined;

let ws = new WebSocket(`ws://${window.location.host}/ws`);

ws.addEventListener('message', (event) => {
    console.log(event.data);
    const message = JSON.parse(event.data);

    if (message.type == 'start') {
        protocol = message.protocol;
        if (protocol == 'dash') {
            startDashPlayer(element, message.url, message.liveCatchup, message.minBitrate);
        } else {
            startHlsPlayer(element, message.url, message.liveCatchup, message.minBitrate);
        }
    } else if (message.type == 'reset') {
        if (protocol == 'dash') {
            resetDashPlayer();
        } else {
            resetHlsPlayer();
        }
    }
});
