import type { AppRouter } from '../../src/api/router';
import { createTRPCClient } from '@trpc/client';
import superjson from 'superjson';

const client = createTRPCClient<AppRouter>({
    url: '/trpc',
    transformer: superjson
});

export async function sendBufferEmptyEvent(mediaType: string) {
    await client.mutation('sendBufferEmpty', {
        timestamp: new Date(),
        mediaType
    });
}

export async function sendBufferLoadedEvent(mediaType: string) {
    await client.mutation('sendBufferLoaded', {
        timestamp: new Date(),
        mediaType
    });
}

export async function sendStatus(videoBuffer: number, audioBuffer: number, latency: number) {
    await client.mutation('sendStatus', {
        timestamp: new Date(),
        videoBuffer,
        audioBuffer,
        latency,
    });
}
