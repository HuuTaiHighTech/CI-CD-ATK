import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { UnauthorizedException } from '~/exceptions';

export default fp(async (fastify: FastifyInstance) => {
   fastify.decorateRequest('assertUser', function (this: FastifyRequest) {
      if (!this.user) {
         throw new UnauthorizedException();
      }
   });
});
