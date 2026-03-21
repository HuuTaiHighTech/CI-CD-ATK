import { type FastifyInstance } from 'fastify';
import controller from '~/modules/search/controller';

async function searchRoutes(route: FastifyInstance) {
   route.get('/', controller.get);
}

export default searchRoutes;
