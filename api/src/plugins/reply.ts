import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyReply } from 'fastify';

export default fp(async (fastify: FastifyInstance) => {
   fastify.decorateReply(
      'json',
      function (this: FastifyReply, status = 200, message = 'OK', data?: any) {
         return this.status(status).send({
            message,
            data
         });
      }
   );
});
