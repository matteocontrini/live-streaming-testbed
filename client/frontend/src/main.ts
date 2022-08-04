import dashjs from 'dashjs';
import './style.css';
import { MediaPlayer } from 'dashjs';

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

setInterval(() => {
  const buffer2 = player.getDashMetrics().getCurrentBufferLevel('video');
  const buffer3 = player.getDashMetrics().getCurrentBufferLevel('audio');
  const latency = player.getCurrentLiveLatency();
  console.log(`Buffer: v ${buffer2} | a ${buffer3} | L: ${latency}`);
}, 1000);

player.on(dashjs.MediaPlayer.events.BUFFER_EMPTY, () => {
  console.log('Buffer empty');
});

player.on(dashjs.MediaPlayer.events.BUFFER_LOADED, (e) => {
  console.log('Buffer loaded ' + e.mediaType);
});

document.getElementById('play')!.addEventListener('click', () => {
  console.log('Starting playback');
  player.play();
});
