import fs from 'fs/promises';
import Papa from 'papaparse';
import {resetPlayer, updateLinkConfig} from './steps';
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
    liveCatchup: boolean;
    httpVersion: HttpVersion;

    constructor(name: string,
                pattern: string,
                liveCatchup: boolean = false,
                httpVersion: HttpVersion = HttpVersion.HTTP3) {
        this.name = name;
        this.pattern = pattern;
        this.liveCatchup = liveCatchup;
        this.httpVersion = httpVersion;
    }

    async run() {
        const pattern = await this.loadNetworkPattern();
        resetTimer();
        await resetPlayer(this.liveCatchup, this.httpVersion);
        await resetEvents();

        for (const point of pattern) {
            await updateLinkConfig(point.dl, this.randomizeLatency(point.rtt), point.loss);
            await sleep(1);
        }

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
    new Experiment('lte_h1', 'lte', false, HttpVersion.HTTP1_1),
    new Experiment('lte_h2', 'lte', false, HttpVersion.HTTP2),
    new Experiment('lte_h3', 'lte', false, HttpVersion.HTTP3),
    new Experiment('hspa+_h1', 'hspa+', false, HttpVersion.HTTP1_1),
    new Experiment('hspa+_h2', 'hspa+', false, HttpVersion.HTTP2),
    new Experiment('hspa+_h3', 'hspa+', false, HttpVersion.HTTP3),
    new Experiment('lte_catchup', 'lte', true),
    new Experiment('hspa+_catchup', 'hspa+', true),
];

export default experiments;
