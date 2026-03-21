import fp from 'fastify-plugin';
import type {
   FastifyInstance,
   FastifyRequest,
   FastifyReply,
   HookHandlerDoneFunction
} from 'fastify';
import { LangSchema } from '~/schemas';

export default fp(async (fastify: FastifyInstance) => {
   fastify.addHook(
      'onRequest',
      (
         request: FastifyRequest<{ Querystring: { lang: string } }>,
         reply: FastifyReply,
         done: HookHandlerDoneFunction
      ) => {
         const { headers, query } = request;
         let code: string | undefined = query.lang;
         if (!code) {
            const language = headers['accept-language'] || '';
            code = language.match(/^[a-z]{2}/i)?.[0];
         }
         request.lang = LangSchema.default('VI').catch('VI').parse(code);
         done();
      }
   );
});
