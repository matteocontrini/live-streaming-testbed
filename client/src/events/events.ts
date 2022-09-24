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

type FragmentEventData = {
    url: string;
    mediaType: string;
    startTime: number;
    duration: number;
    requestStartTime: number;
    requestEndTime: number;
}

type RepresentationSwitchEventData = {
    videoBitrate: number;
    audioBitrate: number;
}

type Event = {
    timestamp: number;
    type: 'BUFFER_EMPTY' | 'BUFFER_LOADED' | 'PLAYBACK_STALLED' | 'PLAYBACK_RESUMED' |
        'FRAGMENT_REQUESTED' | 'FRAGMENT_LOADED' |
        'STATUS' | 'LINK_CONFIG_UPDATE' | 'STOP' | 'REPRESENTATION_SWITCH';
    data?: StatusEventData | BufferEventData | LinkConfigUpdateEventData |
        FragmentEventData | RepresentationSwitchEventData;
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
        case 'REPRESENTATION_SWITCH':
            color = chalk.yellow
            break
    }

    let eventData = event.data ? formatEventData(event.data) : '';

    console.log(`[${event.timestamp.toFixed(3)}] ${color(event.type)} ${eventData}`);
}

function formatEventData(data: StatusEventData | BufferEventData | LinkConfigUpdateEventData | FragmentEventData | RepresentationSwitchEventData) {
    let keys = Object.keys(data ?? {});
    return keys.map(key => `${key}=${(data as any)[key]}`).join(' ');
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
