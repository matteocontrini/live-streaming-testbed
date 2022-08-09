import Fastify, {FastifyInstance} from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import {fastifyTRPCPlugin} from '@trpc/server/adapters/fastify';
import {appRouter} from './router';
import {createContext} from './context';
import wsPlugin, {SocketStream} from '@fastify/websocket';

const server: FastifyInstance = Fastify({
    maxParamLength: 5000,
});

let websocketClient: SocketStream;

server.register(fastifyStatic, {
    root: path.resolve('./frontend/dist')
});

server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {router: appRouter, createContext},
});

server.register(wsPlugin);

server.register(async (fastify) => {
    fastify.get('/ws', {websocket: true}, (conn) => {
        websocketClient = conn;
    });
});

export async function startServer() {
    const address = await server.listen({port: 3000});
    console.log(`Server listening at ${address}`);
}

export async function sendMessage(message: any) {
    if (websocketClient) {
        await websocketClient.socket.send(JSON.stringify(message));
    }
}
