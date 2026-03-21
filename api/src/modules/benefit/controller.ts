import { type FastifyReply, type FastifyRequest } from 'fastify';
import { BenefitQuerySchema, BenefitSchema } from '~/modules/benefit/schema';
import service from '~/modules/benefit/service';

const benefitController = {
   // GET /api/benefits
   get: async (request: FastifyRequest, reply: FastifyReply) => {
      const { lang } = request;
      const entities = await service.get(lang);
      return reply.json(200, 'OK', entities);
   },

   // GET /api/benefits/details
   getAll: async (request: FastifyRequest, reply: FastifyReply) => {
      const { lang } = request;
      const query = BenefitQuerySchema.parse(request.query);
      const entities = await service.paginate(query, lang);
      return reply.json(200, 'OK', entities);
   },

   // GET /api/benefits/:id/details
   getById: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      const entity = await service.getById(id);
      return reply.json(200, 'OK', entity);
   },

   // POST /api/benefits
   create: async (request: FastifyRequest, reply: FastifyReply) => {
      const data = BenefitSchema.parse(request.body);
      await service.create(data);
      return reply.json(201, 'Tạo thành công');
   },

   // PATCH /api/benefits/:id
   update: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      const data = BenefitSchema.parse(request.body);
      const entity = await service.update(id, data);
      return reply.json(200, 'Cập nhật thành công', entity);
   },

   // DELETE /api/benefits/:id
   delete: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      await service.delete(id);
      return reply.json(200, 'OK');
   }
};

export default benefitController;
