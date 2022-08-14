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

    constructor(name: string) {
        this.name = name;
    }

    async run() {
        const pattern = await this.loadNetworkPattern();
        resetTimer();
        await resetPlayer();
        await resetEvents();

        for (const point of pattern) {
            await updateLinkConfig(point.dl, point.rtt, point.loss);
            await sleep(1);
        }

        await saveEvents(this.name);
    }

    private async loadNetworkPattern(): Promise<NetworkPatternPoint[]> {
        let filePath = path.resolve(__dirname, `../assets/patterns/${this.name}.csv`);
        let csv = await fs.readFile(filePath, 'utf8');
        return Papa.parse<NetworkPatternPoint>(csv, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true
        }).data;
    }
}

const experiments = [
    new Experiment('lte'),
    new Experiment('hspa+'),
];

export default experiments;
