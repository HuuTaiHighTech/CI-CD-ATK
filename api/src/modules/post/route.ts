import { type FastifyInstance } from 'fastify';
import controller from '~/modules/post/controller';

async function postRoutes(route: FastifyInstance) {
   // public routes
   route.get('/', controller.get);
   route.get('/:slug', controller.getBySlug);

   // protected routes (require auth + role)
   route.register(async (route) => {
      route.addHook('onRequest', route.authenticate);
      route.addHook('onRequest', route.authorize('EDITOR', 'ADMIN'));

      route.get('/details', controller.getAll);
      route.get('/:id/details', controller.getById);
      route.post('/', controller.create);
      route.patch('/:id', controller.update);
      route.delete('/:id', controller.delete);
   });
}

export default postRoutes;
