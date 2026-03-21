import { type FastifyReply, type FastifyRequest } from 'fastify';
import service from '~/modules/feedback/service';
import { FeedbackQuerySchema, FeedbackSchema } from '~/modules/feedback/schema';
import { formData } from '~/utils';

const feedbackController = {
   // GET /api/feedbacks
   get: async (request: FastifyRequest, reply: FastifyReply) => {
      const { lang } = request;
      const entities = await service.get(lang);
      return reply.json(200, 'OK', entities);
   },

   // GET /api/feedbacks/details
   getAll: async (request: FastifyRequest, reply: FastifyReply) => {
      const { lang } = request;
      const query = FeedbackQuerySchema.parse(request.query);
      const entities = await service.paginate(query, lang);
      return reply.json(200, 'OK', entities);
   },

   // GET /api/feedbacks/:id
   getById: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      const entity = await service.getById(id);
      return reply.json(200, 'OK', entity);
   },

   // POST /api/feedbacks
   create: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
         const { data, files } = await formData(request, FeedbackSchema);
         await service.create(data, files[0]);
         return reply.json(201, 'Tạo thành công');
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // PATCH /api/feedbacks/:id
   update: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      try {
         const { id } = request.params;
         const { data, files } = await formData(request, FeedbackSchema);
         const entity = await service.update(id, data, files[0]);
         return reply.json(200, 'Cập nhật thành công', entity);
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // DELETE /api/feedbacks/:id
   delete: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      await service.delete(id);
      return reply.json(200, 'OK');
   }
};

export default feedbackController;
