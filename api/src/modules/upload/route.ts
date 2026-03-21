import { type FastifyInstance } from 'fastify';
import controller from '~/modules/upload/controller';

async function uploadRoutes(route: FastifyInstance) {
   route.addHook('onRequest', route.authenticate);
   route.addHook('onRequest', route.authorize('EDITOR', 'ADMIN'));

   route.post('/', controller.upload);
}

export default uploadRoutes;
