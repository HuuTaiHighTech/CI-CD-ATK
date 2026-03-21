import 'fastify';
import type { Language, Role } from '@prisma/client';
import type { User } from '~/types';

declare module 'fastify' {
   interface FastifyReply {
      json: (status?: number, message?: string, data?: any) => this;
   }

   interface FastifyRequest {
      user: User | null;
      lang: Language;

      assertUser(): asserts this is FastifyRequest & { user: User };
   }

   interface Session {
      user?: User;
   }

   interface FastifyInstance {
      authenticate: (
         request: FastifyRequest,
         reply: FastifyReply
      ) => Promise<void>;
      authorize: (
         ...roles: Role[]
      ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
   }
}
