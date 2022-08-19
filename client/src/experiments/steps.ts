import {request} from 'undici';
import chalk from 'chalk';
import {logEvent} from '../events/events';
import {sendMessage} from '../api/server';
import {getTimestamp} from '../events/timer';

const API_HOST = process.env.API_HOST || 'localhost:3000';
const PREFIX = `http://${API_HOST}`;

async function resetPlayer(liveCatchup: boolean) {
    const url = 'https://cdn.local/manifest.mpd';
    const msg = {type: 'reset', source: url, liveCatchup};
    await sendMessage(msg);
}

async function stop() {
    let resp = await request(PREFIX + '/stop', {
        method: 'POST',
    });

    if (resp.statusCode !== 200) {
        console.log(chalk.red(`Error stopping: ${resp.statusCode}`));
    }

    logEvent({
        timestamp: getTimestamp(),
        type: 'STOP',
    })
}

async function updateLinkConfig(bw: number, rtt: number, loss: number) {
    let resp = await request(PREFIX + '/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({bw, rtt, loss}),
    });

    if (resp.statusCode !== 200) {
        console.log(chalk.red(`Error updating link config: ${resp.statusCode}`));
    }

    logEvent({
        timestamp: getTimestamp(),
        type: 'LINK_CONFIG_UPDATE',
        data: {bw, rtt, loss}
    })
}

export {resetPlayer, stop, updateLinkConfig};
