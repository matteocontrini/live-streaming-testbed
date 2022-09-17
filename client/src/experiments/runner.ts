import experiments from './experiments';
import {stop} from './steps';
import {sleep} from '../utils';

async function startExperiments() {
    console.log('Starting experiments');

    for (const experiment of experiments) {
        console.log();
        console.log('+++++');
        console.log(`Running experiment: ${experiment.name}`);
        console.log('+++++');
        console.log();
        await sleep(1);
        await experiment.run();
    }

    await stop();
}

export {startExperiments};
