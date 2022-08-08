import * as trpc from '@trpc/server';
import {z} from 'zod';
import superjson from 'superjson';
import {logEvent, finish} from '../events/events';

export const appRouter = trpc
    .router()
    .transformer(superjson)
    .mutation('sendBufferEmpty', {
        input: z.object({
            timestamp: z.date(),
            mediaType: z.string(),
        }),
        async resolve({input}) {
            logEvent({
                timestamp: input.timestamp,
                type: 'BUFFER_EMPTY',
                data: {
                    mediaType: input.mediaType
                }
            });
            return true;
        },
    })
    .mutation('sendBufferLoaded', {
        input: z.object({
            timestamp: z.date(),
            mediaType: z.string(),
        }),
        async resolve({input}) {
            logEvent({
                timestamp: input.timestamp,
                type: 'BUFFER_LOADED',
                data: {
                    mediaType: input.mediaType
                }
            });
            return true;
        },
    })
    .mutation('sendStatus', {
        input: z.object({
            timestamp: z.date(),
            videoBuffer: z.number(),
            audioBuffer: z.number(),
            latency: z.number().or(z.nan()),
        }),
        async resolve({input}) {
            logEvent({
                timestamp: input.timestamp,
                type: 'STATUS',
                data: {
                    videoBuffer: input.videoBuffer,
                    audioBuffer: input.audioBuffer,
                    latency: input.latency
                }
            });
            return true;
        }
    })
    .mutation('stop', {
        async resolve() {
            finish();
            return true;
        }
    });

export type AppRouter = typeof appRouter;
