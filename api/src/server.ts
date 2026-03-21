import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import fastifyCompress from '@fastify/compress';
import fastifyRateLimit from '@fastify/rate-limit';
import {
  sessionOptions,
  corsOptions,
  helmetOptions,
  staticOptions,
  multipartOptions,
  compressOptions,
  fastifyOptions,
} from '~/config';
import registerPlugins from '~/plugins';
import routes from '~/modules';
import { handleError } from '~/middleware';
import registerShutdownHooks from '~/graceful';

const createServer = async () => {
  const server = Fastify(fastifyOptions);
  await server.register(fastifyHelmet, helmetOptions);
  await server.register(fastifyCors, corsOptions);
  await server.register(fastifyCompress, compressOptions);
  await server.register(fastifyStatic, staticOptions);
  await server.register(fastifyCookie);
  await server.register(fastifySession, sessionOptions);
  await server.register(fastifyMultipart, multipartOptions);
  await server.register(fastifyRateLimit, { global: false });
  await server.get('/health', async () => ({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  }));
  await registerPlugins(server);
  await server.register(routes, { prefix: '/api' });
  server.setErrorHandler(handleError);
  registerShutdownHooks(server);
  return server;
};

export default createServer;
