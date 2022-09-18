import dashjs from "dashjs";

function BufferEmptyRule() {

    let factory = dashjs.FactoryMaker;
    let Debug = factory.getSingletonFactoryByName('Debug');
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let DashMetrics = factory.getSingletonFactoryByName('DashMetrics');
    let EventBus = factory.getSingletonFactoryByName('EventBus');

    const SEGMENT_IGNORE_COUNT = 2;

    const context = this.context;

    let instance, logger, eventBus, dashMetrics, bufferStateDict;

    function setup() {
        logger = Debug(context).getInstance().getLogger(instance);
        eventBus = EventBus(context).getInstance();
        dashMetrics = DashMetrics(context).getInstance();
        resetInitialSettings();
        eventBus.on(dashjs.MediaPlayer.events.PLAYBACK_SEEKING, _onPlaybackSeeking, instance);
        eventBus.on('bytesAppendedEndFragment', _onBytesAppended, instance);
    }

    /**
     * If a BUFFER_EMPTY event happens, then BufferEmptyRule returns switchRequest.quality=0 until BUFFER_LOADED happens.
     * @param rulesContext
     * @return {object}
     */
    function getMaxIndex(rulesContext) {
        const switchRequest = SwitchRequest(context).create();

        if (!rulesContext || !rulesContext.hasOwnProperty('getMediaType')) {
            return switchRequest;
        }

        const mediaType = rulesContext.getMediaType();
        const currentBufferState = dashMetrics.getCurrentBufferState(mediaType);
        const representationInfo = rulesContext.getRepresentationInfo();
        const fragmentDuration = representationInfo.fragmentDuration;

        if (shouldIgnore(mediaType) || !fragmentDuration) {
            console.log('BufferEmptyRule: shouldIgnore');
            return switchRequest;
        }

        console.log('[' + mediaType + '] BufferEmptyRule: buffer state is ' + currentBufferState.state);

        if (currentBufferState && currentBufferState.state === 'bufferStalled') {
            console.log('[' + mediaType + '] BufferEmptyRule: switch to index 0.');
            logger.warning('[' + mediaType + '] BufferEmptyRule: switch to index 0.');
            switchRequest.quality = 0;
            switchRequest.reason = 'BufferEmptyRule: Buffer is empty';
        }

        return switchRequest;

    }

    function shouldIgnore(mediaType) {
        return bufferStateDict[mediaType].ignoreCount > 0;
    }

    function resetInitialSettings() {
        bufferStateDict = {};
        bufferStateDict['video'] = {ignoreCount: SEGMENT_IGNORE_COUNT};
        bufferStateDict['audio'] = {ignoreCount: SEGMENT_IGNORE_COUNT};
    }

    function _onPlaybackSeeking() {
        resetInitialSettings();
    }

    function _onBytesAppended(e) {
        if (!isNaN(e.startTime) && (e.mediaType === 'audio' || e.mediaType === 'video')) {
            if (bufferStateDict[e.mediaType].ignoreCount > 0) {
                bufferStateDict[e.mediaType].ignoreCount--;
            }
        }
    }

    function reset() {
        resetInitialSettings();
        eventBus.off(dashjs.MediaPlayer.events.PLAYBACK_SEEKING, _onPlaybackSeeking, instance);
        eventBus.off('bytesAppendedEndFragment', _onBytesAppended, instance);
    }

    instance = {
        getMaxIndex,
        reset
    };

    setup();

    return instance;
}

BufferEmptyRule.__dashjs_factory_name = 'BufferEmptyRule';
export default dashjs.FactoryMaker.getClassFactory(BufferEmptyRule);
