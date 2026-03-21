import { type FastifyCompressOptions } from '@fastify/compress';

const compressOptions: FastifyCompressOptions = {
   global: true,
   threshold: 1024,
   inflateIfDeflated: true
};

export default compressOptions;
