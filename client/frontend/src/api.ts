import type { AppRouter } from '../../src/api/router';
import { createTRPCClient } from '@trpc/client';
import superjson from 'superjson';

const client = createTRPCClient<AppRouter>({
    url: '/trpc',
    transformer: superjson
});

export async function sendEvent(name: string) {
    await client.mutation('sendEvent', {
        timestamp: new Date(),
        name,
    });
};

export async function sendStatus(videoBuffer: number, audioBuffer: number, latency: number) {
    await client.mutation('sendStatus', {
        timestamp: new Date(),
        videoBuffer,
        audioBuffer,
        latency,
    });
};
