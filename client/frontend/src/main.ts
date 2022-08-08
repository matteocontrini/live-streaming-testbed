import EventsCollector from './events';
import './style.css';
import { createPlayer } from './ui';

const player = createPlayer();

document.getElementById('play')!.addEventListener('click', () => {
    console.log('Starting playback');
    player.play();
});

const collector = new EventsCollector(player);
collector.start();
