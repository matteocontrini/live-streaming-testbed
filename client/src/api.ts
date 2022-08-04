import Fastify, { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path';

const server: FastifyInstance = Fastify();

server.register(fastifyStatic, {
    root: path.resolve('./frontend/dist')
});

export async function startAPI() {
    const address = await server.listen({ port: 3000 });
    console.log(`Server listening at ${address}`);
}
