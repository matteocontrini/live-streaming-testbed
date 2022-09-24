import fs from 'fs/promises';
import Papa from 'papaparse';
import {resetPlayer, startPlayer, updateLinkConfig} from './steps';
import {sleep} from '../utils';
import {resetEvents, saveEvents} from '../events/events';
import path from 'path';
import {resetTimer} from '../events/timer';
import HttpVersion from './httpversion';
import ABRProtocol from './ABRProtocol';


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
    protocol: ABRProtocol;
    httpVersion: HttpVersion;
    minBitrate: number;
    liveCatchup: boolean;

    constructor(name: string,
                pattern: string,
                protocol: ABRProtocol,
                httpVersion: HttpVersion,
                minBitrate: number = -1,
                liveCatchup: boolean = false) {
        this.name = name;
        this.pattern = pattern;
        this.protocol = protocol;
        this.httpVersion = httpVersion;
        this.minBitrate = minBitrate;
        this.liveCatchup = liveCatchup;
    }

    async run() {
        const pattern = await this.loadNetworkPattern();
        resetTimer();
        await startPlayer(this.protocol, this.httpVersion, this.minBitrate, this.liveCatchup);
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
    // new Experiment('lte_h1', 'lte', ABRProtocol.DASH, HttpVersion.HTTP1_1, 3000),
    // new Experiment('lte_h2', 'lte', ABRProtocol.DASH, HttpVersion.HTTP2, 3000),
    // new Experiment('lte_h3', 'lte', ABRProtocol.DASH, HttpVersion.HTTP3, 3000),
    // new Experiment('hspa+_h1', 'hspa+', ABRProtocol.DASH, HttpVersion.HTTP1_1, 3000),
    // new Experiment('hspa+_h2', 'hspa+', ABRProtocol.DASH, HttpVersion.HTTP2, 3000),
    // new Experiment('hspa+_h3', 'hspa+', ABRProtocol.DASH, HttpVersion.HTTP3, 3000),
    // new Experiment('lte_catchup', 'lte', ABRProtocol.DASH, HttpVersion.HTTP3, 3000, true),
    // new Experiment('hspa+_catchup', 'hspa+', ABRProtocol.DASH, HttpVersion.HTTP3, 3000, true),
    new Experiment('cascade_h3', 'cascade', ABRProtocol.HLS, HttpVersion.HTTP3),
    new Experiment('spike_h3', 'spike', ABRProtocol.HLS, HttpVersion.HTTP3),
    // TODO: slow jitters and fast jitters
    // https://github.com/twitchtv/acm-mmsys-2020-grand-challenge/blob/master/normal-network-patterns.js
];

export default experiments;
