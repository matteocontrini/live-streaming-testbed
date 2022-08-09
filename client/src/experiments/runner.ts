import {saveEvents, logEvent} from '../events/events';
import {request} from 'undici';
import {sleep} from '../utils';

const API_HOST = process.env.API_HOST || 'localhost';
const PREFIX = `http://${API_HOST}`;

async function startExperiments() {
    console.log('Starting experiments');
    await sleep(5);
    await updateLinkConfig(1, '10ms', 0);
    await sleep(10);
    await requestStop();
    await saveEvents();
}

async function updateLinkConfig(bw: number, delay: string, loss: number) {
    let resp = await request(PREFIX + '/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bw,
            delay,
            loss
        })
    });

    if (resp.statusCode !== 200) {
        throw new Error(`Failed to update link config: ${resp.statusCode}`);
    }

    logEvent({
        timestamp: new Date(),
        type: 'LINK_CONFIG_UPDATE',
        data: {
            bw: bw,
            delay: delay,
            loss: loss,
        }
    })
}

async function requestStop() {
    let resp = await request(PREFIX + '/stop', {
        method: 'POST',
    });

    if (resp.statusCode !== 200) {
        throw new Error(`Failed to stop: ${resp.statusCode}`);
    }

    logEvent({
        timestamp: new Date(),
        type: 'STOP',
    })
}

export {startExperiments};
