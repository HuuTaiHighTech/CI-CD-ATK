import { type FastifyReply, type FastifyRequest } from 'fastify';
import service from '~/modules/post/service';
import { PostQuerySchema, PostSchema } from '~/modules/post/schema';
import { formData } from '~/utils';

const postController = {
   // GET /api/posts
   get: async (request: FastifyRequest, reply: FastifyReply) => {
      const { lang } = request;
      const query = PostQuerySchema.parse(request.query);
      const posts = await service.paginate(query, lang);
      return reply.json(200, 'OK', posts);
   },

   // GET /api/posts/details
   getAll: async (request: FastifyRequest, reply: FastifyReply) => {
      const { lang } = request;
      const query = PostQuerySchema.parse(request.query);
      const posts = await service.paginate(query, lang, true);
      return reply.json(200, 'OK', posts);
   },

   // GET /api/posts/:slug
   getBySlug: async (
      request: FastifyRequest<{ Params: { slug: string } }>,
      reply: FastifyReply
   ) => {
      const { lang } = request;
      const { slug } = request.params;
      const post = await service.getBySlug(slug, lang);
      return reply.json(200, 'OK', post);
   },

   // GET /api/posts/:id/details
   getById: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      const post = await service.getById(id);
      return reply.json(200, 'OK', post);
   },

   // POST /api/posts
   create: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
         const { data, files } = await formData(request, PostSchema);
         await service.create(data, files[0]);
         return reply.json(201, 'Tạo bài viết thành công');
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // PATCH /api/posts/:id
   update: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      try {
         const { id } = request.params;
         const { data, files } = await formData(request, PostSchema.partial());
         const post = await service.update(id, data, files[0]);
         return reply.json(200, 'Cập nhật bài viết thành công', post);
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // DELETE /api/posts/:id
   delete: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      await service.delete(id);
      return reply.json(200, 'OK');
   }
};

export default postController;
