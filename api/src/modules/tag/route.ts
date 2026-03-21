import { type FastifyInstance } from 'fastify';
import controller from '~/modules/tag/controller';

async function tagRoutes(route: FastifyInstance) {
  // public routes
  route.get('/', controller.get);
  route.get('/hot', controller.getHot);
  route.get('/:slug', controller.getBySlug);

  // protected routes (require auth + role)
  route.register(async (route) => {
    route.addHook('onRequest', route.authenticate);
    route.addHook('onRequest', route.authorize('EDITOR', 'ADMIN'));

    route.get('/details', controller.paginate);
    route.get('/:id/details', controller.getById);
    route.post('/', controller.create);
    route.patch('/:id', controller.update);
    route.delete('/:id', controller.delete);
  });
}

export default tagRoutes;
