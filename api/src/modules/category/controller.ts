import { type FastifyReply, type FastifyRequest } from 'fastify';
import service from '~/modules/category/service';
import { CategoryQuerySchema, CategorySchema } from '~/modules/category/schema';
import { formData } from '~/utils';

const categoryController = {
   // GET /api/categories
   get: async (request: FastifyRequest, reply: FastifyReply) => {
      const { lang } = request;
      const query = CategoryQuerySchema.parse(request.query);
      const entities = await service.paginate(query, lang);
      return reply.json(200, 'OK', entities);
   },

   // GET /api/categories/details
   getAll: async (request: FastifyRequest, reply: FastifyReply) => {
      const { lang } = request;
      const query = CategoryQuerySchema.parse(request.query);
      const entities = await service.paginate(query, lang, true);
      return reply.json(200, 'OK', entities);
   },

   // GET /api/categories/tree
   getTree: async (
      request: FastifyRequest<{ Params: { slug: string } }>,
      reply: FastifyReply
   ) => {
      const { lang } = request;
      const { slug } = request.params;
      const entities = await service.getTree(slug, lang);
      return reply.json(200, 'OK', entities);
   },

   // GET /api/categories/summary
   getSummary: async (
      request: FastifyRequest<{ Querystring: { excludeId: string } }>,
      reply: FastifyReply
   ) => {
      const { lang } = request;
      const { excludeId } = request.query;
      const entities = await service.getSummary(excludeId, lang);
      return reply.json(200, 'OK', entities);
   },

   // GET /api/categories/parent
   getParent: async (request: FastifyRequest, reply: FastifyReply) => {
      const { lang } = request;
      const entities = await service.getParent(lang);
      return reply.json(200, 'OK', entities);
   },

   // GET /api/categories/:id/details
   getById: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      const entity = await service.getById(id);
      return reply.json(200, 'OK', entity);
   },

   // GET /api/categories/:slug
   getBySlug: async (
      request: FastifyRequest<{ Params: { slug: string } }>,
      reply: FastifyReply
   ) => {
      const { lang } = request;
      const { slug } = request.params;
      const entity = await service.getBySlug(slug, lang);
      return reply.json(200, 'OK', entity);
   },

   // POST /api/categories
   create: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
         const { data, files } = await formData(request, CategorySchema);
         await service.create(data, files[0]);
         return reply.json(201, 'Tạo danh mục thành công');
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // PATCH /api/categories/:id
   update: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      try {
         const { id } = request.params;
         const { data, files } = await formData(request, CategorySchema);
         const entity = await service.update(id, data, files[0]);
         return reply.json(200, 'Cập nhật danh mục thành công', entity);
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // DELETE /api/categories/:id
   delete: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      await service.delete(id);
      return reply.json(200, 'OK');
   }
};

export default categoryController;
