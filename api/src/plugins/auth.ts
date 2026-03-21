import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { type Role } from '@prisma/client';
import { ForbiddenException, UnauthorizedException } from '~/exceptions';

export default fp(async (fastify: FastifyInstance) => {
   fastify.decorateRequest('user', null);

   fastify.decorate(
      'authenticate',
      async function (request: FastifyRequest, reply: FastifyReply) {
         const { user } = request.session;
         if (!user) throw new UnauthorizedException();
         request.user = user;
      }
   );

   fastify.decorate('authorize', function (...roles: Role[]) {
      return async function (request: FastifyRequest, reply: FastifyReply) {
         const { user } = request;
         if (!user) throw new UnauthorizedException();
         if (!roles.includes(user.role)) throw new ForbiddenException();
      };
   });
});
