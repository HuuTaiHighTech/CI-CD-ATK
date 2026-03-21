import { type FastifyInstance } from 'fastify';
import controller from '~/modules/top-product/controller';

async function topProductRoutes(route: FastifyInstance) {
   route.addHook('onRequest', route.authenticate);
   route.addHook('onRequest', route.authorize('EDITOR', 'ADMIN'));

   route.get('/', controller.get);
   route.get('/:id', controller.getById);
   route.post('/', controller.create);
   route.patch('/:id', controller.update);
   route.delete('/:id', controller.delete);
}

export default topProductRoutes;
