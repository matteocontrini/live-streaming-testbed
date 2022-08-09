import EventsCollector from './events';
import './style.css';
import * as ui from './ui';
import {startExperiments} from './api';

ui.init();
const player = ui.createPlayer();

document.getElementById('ready')!.addEventListener('click', async () => {
    await startExperiments();
});

const collector = new EventsCollector(player);
collector.start();

let ws = new WebSocket(`ws://${window.location.host}/ws`);

ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    console.log(message);
    if (message.type == 'reset') {
        ui.resetPlayer(message.source);
    }
});
