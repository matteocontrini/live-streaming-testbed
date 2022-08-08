import Fastify, {FastifyInstance} from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';
import {fastifyTRPCPlugin} from '@trpc/server/adapters/fastify';
import {appRouter} from './router';
import {createContext} from './context';

const server: FastifyInstance = Fastify({
    maxParamLength: 5000,
});

server.register(fastifyStatic, {
    root: path.resolve('./frontend/dist')
});

server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {router: appRouter, createContext},
});

export async function startServer() {
    const address = await server.listen({port: 3000});
    console.log(`Server listening at ${address}`);
}
