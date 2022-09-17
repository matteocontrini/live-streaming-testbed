import fs from 'fs/promises';
import Papa from 'papaparse';
import {resetPlayer, startPlayer, updateLinkConfig} from './steps';
import {sleep} from '../utils';
import {resetEvents, saveEvents} from '../events/events';
import path from 'path';
import {resetTimer} from '../events/timer';
import HttpVersion from './httpversion';


type NetworkPatternPoint = {
    network: string
    dl: number
    ul: number
    rtt: number
    loss: number
}

class Experiment {
    name: string;
    pattern: string;
    httpVersion: HttpVersion;
    minBitrate: number;
    liveCatchup: boolean;

    constructor(name: string,
                pattern: string,
                httpVersion: HttpVersion,
                minBitrate: number = -1,
                liveCatchup: boolean = false) {
        this.name = name;
        this.pattern = pattern;
        this.httpVersion = httpVersion;
        this.minBitrate = minBitrate;
        this.liveCatchup = liveCatchup;
    }

    async run() {
        const pattern = await this.loadNetworkPattern();
        resetTimer();
        await startPlayer(this.liveCatchup, this.httpVersion, this.minBitrate);
        await resetEvents();

        for (const point of pattern) {
            await updateLinkConfig(point.dl, this.randomizeLatency(point.rtt), point.loss);
            await sleep(1);
        }

        await resetPlayer();
        await saveEvents(this.name);
    }

    private async loadNetworkPattern(): Promise<NetworkPatternPoint[]> {
        let filePath = path.resolve(__dirname, `../assets/patterns/${this.pattern}.csv`);
        let csv = await fs.readFile(filePath, 'utf8');
        return Papa.parse<NetworkPatternPoint>(csv, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
        }).data;
    }

    private randomizeLatency(value: number): number {
        // +/- 10
        return value + Math.floor(Math.random() * 30) - 15;
    }
}

const experiments = [
    new Experiment('lte_h1', 'lte', HttpVersion.HTTP1_1, 3000),
    new Experiment('lte_h2', 'lte', HttpVersion.HTTP2, 3000),
    new Experiment('lte_h3', 'lte', HttpVersion.HTTP3, 3000),
    new Experiment('hspa+_h1', 'hspa+', HttpVersion.HTTP1_1, 3000),
    new Experiment('hspa+_h2', 'hspa+', HttpVersion.HTTP2, 3000),
    new Experiment('hspa+_h3', 'hspa+', HttpVersion.HTTP3, 3000),
    new Experiment('lte_catchup', 'lte', HttpVersion.HTTP3, 3000, true),
    new Experiment('hspa+_catchup', 'hspa+', HttpVersion.HTTP3, 3000, true),
];

export default experiments;
