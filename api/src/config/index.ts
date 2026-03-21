import prisma from '~/config/prisma';
import env from '~/config/env';
import fastifyOptions from '~/config/fastify';
import sessionOptions from '~/config/session';
import corsOptions from '~/config/cors';
import helmetOptions from '~/config/helmet';
import staticOptions from '~/config/static';
import multipartOptions from '~/config/multipart';
import compressOptions from '~/config/compress';
import sheets from '~/config/sheet';

export {
  prisma,
  env,
  fastifyOptions,
  sessionOptions,
  corsOptions,
  helmetOptions,
  staticOptions,
  multipartOptions,
  compressOptions,
  sheets
};
