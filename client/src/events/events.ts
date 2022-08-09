import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';

type StatusEventData = {
    videoBuffer: number;
    audioBuffer: number;
    latency: number | typeof NaN;
}

type BufferEventData = {
    mediaType: string;
}

type LinkConfigUpdateEventData = {
    bw: number;
    delay: string;
    loss: number;
}

type Event = {
    timestamp: Date;
    type: 'BUFFER_EMPTY' | 'BUFFER_LOADED' | 'STATUS' | 'LINK_CONFIG_UPDATE' | 'STOP';
    data?: StatusEventData | BufferEventData | LinkConfigUpdateEventData;
}

const events: Event[] = [];

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
            color = chalk.yellow;
            break
    }
    console.log(`[${event.timestamp.toLocaleTimeString()}] ${color(event.type)} ${JSON.stringify(event.data) ?? ''}`);
}

export async function saveEvents() {
    console.log('Saving events to file');
    const file = path.resolve(__dirname, '../../out/player_events.json');
    const data = JSON.stringify(events);
    await fs.writeFile(file, data);
}
