import { type FastifyReply, type FastifyRequest } from 'fastify';
import service from '~/modules/pin-product/service';
import { PinProductSchema } from '~/modules/pin-product/schema';
import { QuerySchema } from '~/schemas';
import { formData } from '~/utils';

const pinProductController = {
   // GET /api/pin-products
   get: async (request: FastifyRequest, reply: FastifyReply) => {
      const { lang } = request;
      const query = QuerySchema.parse(request.query);
      const entities = await service.paginate(query, lang);
      return reply.json(200, 'OK', entities);
   },

   // GET /api/pin-products/:id
   getById: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      const entity = await service.getById(id);
      return reply.json(200, 'OK', entity);
   },

   // POST /api/pin-products
   create: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
         const { data, files } = await formData(request, PinProductSchema);
         await service.create(data, files[0]);
         return reply.json(201, 'Tạo thành công');
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // PATCH /api/pin-products/:id
   update: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      try {
         const { id } = request.params;
         const { data, files } = await formData(request, PinProductSchema);
         const entity = await service.update(id, data, files[0]);
         return reply.json(200, 'Cập nhật thành công', entity);
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // DELETE /api/pin-products/:id
   delete: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      await service.delete(id);
      return reply.json(200, 'OK');
   }
};

export default pinProductController;
