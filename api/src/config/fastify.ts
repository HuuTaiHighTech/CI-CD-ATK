import { type FastifyServerOptions } from 'fastify';
import env from '~/config/env';

const fastifyOptions: FastifyServerOptions = {
  logger: {
    level: env.LOG_LEVEL
  },
  requestIdHeader: 'x-request-id',
  requestIdLogLabel: 'reqId',
  disableRequestLogging: false,
  trustProxy: true,
  connectionTimeout: 30000,
  keepAliveTimeout: 60000,
  requestTimeout: 30000,
  routerOptions: {
    ignoreTrailingSlash: true
  }
};

export default fastifyOptions;
