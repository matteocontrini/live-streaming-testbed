import EventsCollector from './events';
import './style.css';
import {createPlayer} from './ui';
import {startExperiments} from './api';

const player = createPlayer();

document.getElementById('play')!.addEventListener('click', async () => {
    console.log('Starting playback');
    player.play();
    await startExperiments();
});

const collector = new EventsCollector(player);
collector.start();
