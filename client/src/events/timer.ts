let startTime: Date | null = null;

export function resetTimer() {
    startTime = new Date();
}

export function getTimestamp() {
    if (!startTime) {
        throw new Error('Timer not started');
    }

    return (Date.now() - startTime.getTime()) / 1000;
}
