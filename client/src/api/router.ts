import * as trpc from '@trpc/server';
import {z} from 'zod';
import superjson from 'superjson';
import {logEvent} from '../events/events';
import {startExperiments} from '../experiments/runner';
import {getTimestamp} from '../events/timer';

export const appRouter = trpc
    .router()
    .transformer(superjson)
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
    .mutation('startExperiments', {
        async resolve() {
            // noinspection ES6MissingAwait
            startExperiments();
            return true;
        }
    });

export type AppRouter = typeof appRouter;
