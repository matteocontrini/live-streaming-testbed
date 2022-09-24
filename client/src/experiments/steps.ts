import {request} from 'undici';
import chalk from 'chalk';
import {logEvent} from '../events/events';
import {sendMessage} from '../api/server';
import {getTimestamp} from '../events/timer';
import HttpVersion from './httpversion';
import ABRProtocol from './ABRProtocol';

const API_HOST = process.env.API_HOST || 'localhost:3000';
const PREFIX = `http://${API_HOST}`;

async function startPlayer(abrProtocol: ABRProtocol, httpVersion: HttpVersion, minBitrate: number, liveCatchup: boolean) {
    let manifestFileName;
    switch (abrProtocol) {
        case ABRProtocol.DASH:
            manifestFileName = 'manifest.mpd';
            break
        case ABRProtocol.HLS:
            manifestFileName = 'master.m3u8';
            break
    }

    let baseUrl;
    switch (httpVersion) {
        case HttpVersion.HTTP1_1:
            baseUrl = 'http://cdn.local';
            break;
        case HttpVersion.HTTP2:
            baseUrl = 'https://cdn.local';
            break;
        case HttpVersion.HTTP3:
            baseUrl = 'https://cdn.local:444';
            break;
    }

    let url = `${baseUrl}/${manifestFileName}`;

    const msg = {type: 'start', url, protocol: abrProtocol, liveCatchup, minBitrate};
    await sendMessage(msg);
}

async function resetPlayer() {
    await sendMessage({type: 'reset'});
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

export {startPlayer, resetPlayer, stop, updateLinkConfig};
