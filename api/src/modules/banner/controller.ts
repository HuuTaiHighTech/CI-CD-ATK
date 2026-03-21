import { type FastifyReply, type FastifyRequest } from 'fastify';
import { BannerSchema } from '~/modules/banner/schema';
import service from '~/modules/banner/service';
import { QuerySchema } from '~/schemas';
import { formData } from '~/utils';

const bannerController = {
   // GET /api/banners/
   get: async (request: FastifyRequest, reply: FastifyReply) => {
      const { lang } = request;
      const query = QuerySchema.parse(request.query);
      const entities = await service.paginate(query, lang);
      return reply.json(200, 'OK', entities);
   },

   // GET /api/banners/:key
   getByKey: async (
      request: FastifyRequest<{ Params: { key: string } }>,
      reply: FastifyReply
   ) => {
      const { key } = request.params;
      const entity = await service.getByKey(key);
      return reply.json(200, 'OK', entity);
   },

   // GET /api/banners/:id/details
   getById: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      const entity = await service.getById(id);
      return reply.json(200, 'OK', entity);
   },

   // POST /api/banners
   create: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
         const { data, files } = await formData(request, BannerSchema);
         await service.create(data, files);
         return reply.json(201, 'Tạo thành công');
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // PATCH /api/banners/:id
   update: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      try {
         const { id } = request.params;
         const { data, files } = await formData(
            request,
            BannerSchema.partial()
         );
         const entity = await service.update(id, data, files);
         return reply.json(200, 'Cập nhật thành công', entity);
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // DELETE /api/banners/:id
   delete: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      await service.delete(id);
      return reply.json(200, 'OK');
   }
};

export default bannerController;
