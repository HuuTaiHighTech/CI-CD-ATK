import { type FastifyInstance } from 'fastify';
import controller from '~/modules/banner/controller';

async function bannerRoutes(route: FastifyInstance) {
   // public routes
   route.get('/:key', controller.getByKey);

   // protected routes (require auth + role)
   route.register(async (route) => {
      route.addHook('onRequest', route.authenticate);
      route.addHook('onRequest', route.authorize('EDITOR', 'ADMIN'));

      route.get('/', controller.get);
      route.post('/', controller.create);
      route.get('/:id/details', controller.getById);
      route.patch('/:id', controller.update);
      route.delete('/:id', controller.delete);
   });
}

export default bannerRoutes;
