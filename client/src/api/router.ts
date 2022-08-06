import * as trpc from '@trpc/server';
import { z } from 'zod';
import superjson from 'superjson';

export const appRouter = trpc
    .router()
    .transformer(superjson)
    .mutation('sendEvent', {
        input: z.object({
            timestamp: z.date(),
            name: z.string(),
        }),
        async resolve({ input }) {
            console.log(input);
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
        async resolve({ input }) {
            console.log(input);
            return true;
        }
    });

export type AppRouter = typeof appRouter;
