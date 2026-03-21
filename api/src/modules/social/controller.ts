import { type FastifyReply, type FastifyRequest } from 'fastify';
import service from '~/modules/social/service';
import { formData } from '~/utils';
import { QuerySchema } from '~/schemas';
import { SocialSchema } from '~/modules/social/schema';

const socialController = {
   // GET /api/socials
   get: async (request: FastifyRequest, reply: FastifyReply) => {
      const entities = await service.get();
      return reply.json(200, 'OK', entities);
   },

   // GET /api/socials/details
   getAll: async (request: FastifyRequest, reply: FastifyReply) => {
      const query = QuerySchema.parse(request.query);
      const entities = await service.paginate(query);
      return reply.json(200, 'OK', entities);
   },

   // GET /api/socials/:id/details
   getById: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      const entity = await service.getById(id);
      return reply.json(200, 'OK', entity);
   },

   // POST /api/socials
   create: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
         const { data, files } = await formData(request, SocialSchema);
         await service.create(data, files[0]);
         return reply.json(201, 'Tạo thành công');
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // PATCH /api/socials/:id
   update: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      try {
         const { id } = request.params;
         const { data, files } = await formData(
            request,
            SocialSchema.partial()
         );
         const entity = await service.update(id, data, files[0]);
         return reply.json(200, 'Cập nhật thành công', entity);
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // DELETE /api/socials/:id
   delete: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      await service.delete(id);
      return reply.json(200, 'OK');
   }
};

export default socialController;
