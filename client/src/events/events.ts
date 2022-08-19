import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';

type StatusEventData = {
    videoBuffer: number;
    audioBuffer: number;
    latency: number | typeof NaN;
    rate: number;
}

type BufferEventData = {
    mediaType: string;
}

type LinkConfigUpdateEventData = {
    bw: number;
    rtt: number;
    loss: number;
}

type Event = {
    timestamp: number;
    type: 'BUFFER_EMPTY' | 'BUFFER_LOADED' | 'PLAYBACK_STALLED' | 'PLAYBACK_RESUMED' |
        'STATUS' | 'LINK_CONFIG_UPDATE' | 'STOP';
    data?: StatusEventData | BufferEventData | LinkConfigUpdateEventData;
}

let events: Event[] = [];

export function logEvent(event: Event) {
    events.push(event);
    let color = chalk.green;
    switch (event.type) {
        case 'STOP':
            color = chalk.red;
            break
        case 'LINK_CONFIG_UPDATE':
            color = chalk.cyan;
            break
        case 'BUFFER_EMPTY':
        case 'PLAYBACK_STALLED':
            color = chalk.red;
            break
        case 'BUFFER_LOADED':
        case 'PLAYBACK_RESUMED':
            color = chalk.yellow
            break
    }

    console.log(`[${event.timestamp.toFixed(3)}] ${color(event.type)} ${JSON.stringify(event.data) ?? ''}`);
}

export function resetEvents() {
    events = [];
}

export async function saveEvents(name: string) {
    console.log('Saving events to file');
    const file = path.resolve(__dirname, `../../out/experiment_${name}.json`);
    const data = JSON.stringify(events);
    await fs.writeFile(file, data + '\n');
}
