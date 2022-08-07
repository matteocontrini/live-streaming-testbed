import path from 'path';
import fs from 'fs/promises';

type StatusEventData = {
    videoBuffer: number;
    audioBuffer: number;
    latency: number | typeof NaN;
}

type BufferEventData = {
    mediaType: string;
}

type Event = {
    timestamp: Date;
    type: 'BUFFER_EMPTY' | 'BUFFER_LOADED' | 'STATUS';
    data?: StatusEventData | BufferEventData;
}

const events: Event[] = [];

export function logEvent(event: Event) {
    console.log(event);
    events.push(event);
};

export async function finish() {
    console.log('Stop requested, saving events to file');
    const file = path.resolve(__dirname, '../../out/player_events.json');
    const data = JSON.stringify(events);
    await fs.writeFile(file, data);
};
