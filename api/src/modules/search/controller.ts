import { type FastifyReply, type FastifyRequest } from 'fastify';
import service from '~/modules/search/service';
import { QuerySchema } from '~/modules/search/schema';

const searchController = {
   // GET /api/search
   get: async (request: FastifyRequest, reply: FastifyReply) => {
      const { lang } = request;
      const query = QuerySchema.parse(request.query);
      const entities = await service.get(query, lang);
      return reply.json(200, 'OK', entities);
   }
};

export default searchController;
