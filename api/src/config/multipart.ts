import type { FastifyMultipartOptions } from '@fastify/multipart';

const multipartOptions: FastifyMultipartOptions = {
   limits: {
      fileSize: 10 * 1024 * 1024,
      files: 10
   }
};

export default multipartOptions;
