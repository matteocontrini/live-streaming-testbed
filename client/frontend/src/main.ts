import { startSendingMetrics } from './metrics';
import './style.css';
import { createPlayer } from './ui';

const player = createPlayer();

document.getElementById('play')!.addEventListener('click', () => {
    console.log('Starting playback');
    player.play();
});

startSendingMetrics(player);
