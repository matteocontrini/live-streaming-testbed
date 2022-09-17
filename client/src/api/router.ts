import * as trpc from '@trpc/server';
import {z} from 'zod';
import superjson from 'superjson';
import {logEvent} from '../events/events';
import {startExperiments} from '../experiments/runner';
import {getTimestamp} from '../events/timer';

export const appRouter = trpc
    .router()
    .transformer(superjson)
    .mutation('startExperiments', {
        async resolve() {
            // noinspection ES6MissingAwait
            startExperiments();
            return true;
        }
    })
    .mutation('sendBufferEmpty', {
        input: z.object({
            mediaType: z.string(),
        }),
        async resolve({input}) {
            logEvent({
                timestamp: getTimestamp(),
                type: 'BUFFER_EMPTY',
                data: input
            });
            return true;
        },
    })
    .mutation('sendBufferLoaded', {
        input: z.object({
            mediaType: z.string(),
        }),
        async resolve({input}) {
            logEvent({
                timestamp: getTimestamp(),
                type: 'BUFFER_LOADED',
                data: input
            });
            return true;
        },
    })
    .mutation('sendPlaybackStalled', {
        async resolve() {
            logEvent({
                timestamp: getTimestamp(),
                type: 'PLAYBACK_STALLED',
            });
            return true;
        },
    })
    .mutation('sendPlaybackResumed', {
        async resolve() {
            logEvent({
                timestamp: getTimestamp(),
                type: 'PLAYBACK_RESUMED',
            });
            return true;
        },
    })
    .mutation('sendStatus', {
        input: z.object({
            videoBuffer: z.number(),
            audioBuffer: z.number(),
            latency: z.number().or(z.nan()),
            rate: z.number()
        }),
        async resolve({input}) {
            logEvent({
                timestamp: getTimestamp(),
                type: 'STATUS',
                data: input
            });
            return true;
        }
    })
    .mutation('sendFragmentLoaded', {
        input: z.object({
            url: z.string(),
            mediaType: z.string(),
            startTime: z.number(),
            duration: z.number(),
            requestStartDate: z.date(),
            requestEndDate: z.date()
        }),
        async resolve({input}) {
            logEvent({
                timestamp: getTimestamp(),
                type: 'FRAGMENT_LOADED',
                data: input
            });
            return true;
        }
    })
    .mutation('sendRepresentationSwitch', {
        input: z.object({
            videoBitrate: z.number(),
            audioBitrate: z.number()
        }),
        async resolve({input}) {
            logEvent({
                timestamp: getTimestamp(),
                type: 'REPRESENTATION_SWITCH',
                data: input
            });
            return true;
        }
    })
;

export type AppRouter = typeof appRouter;
