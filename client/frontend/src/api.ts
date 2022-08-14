import type {AppRouter} from '../../src/api/router';
import {createTRPCClient} from '@trpc/client';
import superjson from 'superjson';

const client = createTRPCClient<AppRouter>({
    url: '/trpc',
    transformer: superjson
});

export async function sendBufferEmptyEvent(mediaType: string) {
    await client.mutation('sendBufferEmpty', {
        mediaType
    });
}

export async function sendBufferLoadedEvent(mediaType: string) {
    await client.mutation('sendBufferLoaded', {
        mediaType
    });
}

export async function sendPlaybackStalledEvent() {
    await client.mutation('sendPlaybackStalled');
}

export async function sendPlaybackResumedEvent() {
    await client.mutation('sendPlaybackResumed');
}

export async function sendStatus(videoBuffer: number, audioBuffer: number, latency: number) {
    await client.mutation('sendStatus', {
        videoBuffer,
        audioBuffer,
        latency,
    });
}

export async function startExperiments() {
    await client.mutation('startExperiments');
}
