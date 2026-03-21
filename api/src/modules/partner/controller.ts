import { type FastifyReply, type FastifyRequest } from 'fastify';
import service from '~/modules/partner/service';
import { QuerySchema } from '~/schemas';
import { PartnerSchema } from '~/modules/partner/schema';
import { formData } from '~/utils';

const partnerController = {
   // GET /api/partners
   get: async (request: FastifyRequest, reply: FastifyReply) => {
      const entities = await service.get();
      return reply.json(200, 'OK', entities);
   },

   // GET /api/partners/details
   getAll: async (request: FastifyRequest, reply: FastifyReply) => {
      const query = QuerySchema.parse(request.query);
      const entities = await service.paginate(query);
      return reply.json(200, 'OK', entities);
   },

   // GET /api/partners/:id/details
   getById: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      const entity = await service.getById(id);
      return reply.json(200, 'OK', entity);
   },

   // POST /api/partners
   create: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
         const { data, files } = await formData(request, PartnerSchema);
         await service.create(data, files[0]);
         return reply.json(201, 'Tạo thành công');
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // PATCH /api/partners/:id
   update: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      try {
         const { id } = request.params;
         const { data, files } = await formData(
            request,
            PartnerSchema.partial()
         );
         const entity = await service.update(id, data, files[0]);
         return reply.json(200, 'Cập nhật thành công', entity);
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // DELETE /api/partners/:id
   delete: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      await service.delete(id);
      return reply.json(200, 'OK');
   }
};

export default partnerController;
