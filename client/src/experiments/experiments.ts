import fs from 'fs/promises';
import Papa from 'papaparse';
import {resetPlayer, updateLinkConfig} from './steps';
import {sleep} from '../utils';
import {resetEvents, saveEvents} from '../events/events';
import path from 'path';
import {resetTimer} from '../events/timer';


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

    constructor(name: string, pattern: string, liveCatchup: boolean = false) {
        this.name = name;
        this.pattern = pattern;
        this.liveCatchup = liveCatchup;
    }

    async run() {
        const pattern = await this.loadNetworkPattern();
        resetTimer();
        await resetPlayer(this.liveCatchup);
        await resetEvents();

        for (const point of pattern) {
            await updateLinkConfig(point.dl, point.rtt, point.loss);
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
}

const experiments = [
    new Experiment('lte', 'lte'),
    new Experiment('lte_catchup', 'lte', true),
    new Experiment('hspa+', 'hspa+'),
    new Experiment('hspa+_catchup', 'hspa+', true),
];

export default experiments;
