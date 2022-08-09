import experiments from './experiments';

async function startExperiments() {
    console.log('Starting experiments');

    for (const experiment of experiments) {
        console.log(`Running experiment: ${experiment.name}`);
        for (const step of experiment.steps) {
            await step.run();
        }
    }
}

export {startExperiments};
