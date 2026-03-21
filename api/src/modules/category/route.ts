import { type FastifyInstance } from 'fastify';
import controller from '~/modules/category/controller';

async function categoryRoutes(route: FastifyInstance) {
   // public routes
   route.get('/', controller.get);
   route.get('/summary', controller.getSummary);
   route.get('/parent', controller.getParent);
   route.get('/:slug/tree', controller.getTree);
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

export default categoryRoutes;
