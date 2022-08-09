import {sleep} from '../utils';
import {request} from 'undici';
import {logEvent, saveEvents} from '../events/events';

const API_HOST = process.env.API_HOST || 'localhost';
const PREFIX = `http://${API_HOST}`;

abstract class ExperimentStep {
    abstract run(): Promise<void>;
}

class SleepStep extends ExperimentStep {
    constructor(private duration: number) {
        super();
    }

    async run() {
        await sleep(this.duration);
    }
}

class UpdateLinkConfigStep extends ExperimentStep {
    constructor(private bw: number, private delay: string, private loss: number) {
        super();
    }

    async run() {
        let resp = await request(PREFIX + '/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bw: this.bw,
                delay: this.delay,
                loss: this.loss
            })
        });

        if (resp.statusCode !== 200) {
            throw new Error(`Failed to update link config: ${resp.statusCode}`);
        }

        logEvent({
            timestamp: new Date(),
            type: 'LINK_CONFIG_UPDATE',
            data: {
                bw: this.bw,
                delay: this.delay,
                loss: this.loss,
            }
        })
    }
}

class SaveEventsStep extends ExperimentStep {
    async run() {
        await saveEvents();
    }
}

class StopStep extends ExperimentStep {
    async run() {
        let resp = await request(PREFIX + '/stop', {
            method: 'POST',
        });

        if (resp.statusCode !== 200) {
            throw new Error(`Failed to stop: ${resp.statusCode}`);
        }

        logEvent({
            timestamp: new Date(),
            type: 'STOP',
        })
    }
}

const experiments = [
    {
        name: 'Test',
        steps: [
            new SleepStep(5),
            new UpdateLinkConfigStep(1, '10ms', 0),
            new SleepStep(10),
            new SaveEventsStep(),
            new StopStep(),
        ]
    }
];

export default experiments;
