import { type FastifyReply, type FastifyRequest } from 'fastify';
import {
   TopProductQuerySchema,
   TopProductSchema
} from '~/modules/top-product/schema';
import service from '~/modules/top-product/service';
import { formData } from '~/utils';

const topProductController = {
   // GET /api/top-products
   get: async (request: FastifyRequest, reply: FastifyReply) => {
      const { lang } = request;
      const query = TopProductQuerySchema.parse(request.query);
      const entities = await service.paginate(query, lang);
      return reply.json(200, 'OK', entities);
   },

   // GET /api/top-products/:id
   getById: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      const entity = await service.getById(id);
      return reply.json(200, 'OK', entity);
   },

   // POST /api/top-products
   create: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
         const { data, files } = await formData(request, TopProductSchema);
         await service.create(data, files[0]);
         return reply.json(201, 'Tạo thành công');
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // PATCH /api/top-products/:id
   update: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      try {
         const { id } = request.params;
         const { data, files } = await formData(
            request,
            TopProductSchema.partial()
         );
         const entity = await service.update(id, data, files[0]);
         return reply.json(200, 'Cập nhật thành công', entity);
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // DELETE /api/top-products/:id
   delete: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      await service.delete(id);
      return reply.json(200, 'OK');
   }
};

export default topProductController;
