import { type FastifyInstance } from 'fastify';
import controller from '~/modules/analytics/controller';

async function analyticRoutes(route: FastifyInstance) {
  route.addHook('onRequest', route.authenticate);
  route.addHook('onRequest', route.authorize('EDITOR', 'ADMIN'));

  route.get('/overview', controller.overview);
  route.get('/devices', controller.devices);
  route.get('/locations', controller.locations);
  route.get('/top-pages', controller.topPages);
  route.get('/traffic-sources', controller.trafficSources);
}

export default analyticRoutes;
