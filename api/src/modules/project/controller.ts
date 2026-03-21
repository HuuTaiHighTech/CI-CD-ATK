import { type FastifyReply, type FastifyRequest } from 'fastify';
import service from '~/modules/project/service';
import { ProjectQuerySchema, ProjectSchema } from '~/modules/project/schema';
import { formData } from '~/utils';

const projectController = {
   // GET /api/projects
   get: async (request: FastifyRequest, reply: FastifyReply) => {
      const { lang } = request;
      const query = ProjectQuerySchema.parse(request.query);
      const entities = await service.paginate(query, lang);
      return reply.json(200, 'OK', entities);
   },

   // GET /api/projects/details
   getAll: async (request: FastifyRequest, reply: FastifyReply) => {
      const { lang } = request;
      const query = ProjectQuerySchema.parse(request.query);
      const entities = await service.paginate(query, lang, true);
      return reply.json(200, 'OK', entities);
   },

   // GET /api/projects/:id/details
   getById: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      const entity = await service.getById(id);
      return reply.json(200, 'OK', entity);
   },

   // POST /api/projects
   create: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
         const { data, files } = await formData(request, ProjectSchema);
         await service.create(data, files[0]);
         return reply.json(201, 'Tạo thành công');
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // PATCH /api/projects/:id
   update: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      try {
         const { id } = request.params;
         const { data, files } = await formData(request, ProjectSchema);
         const entity = await service.update(id, data, files[0]);
         return reply.json(200, 'Cập nhật thành công', entity);
      } finally {
         await request.cleanRequestFiles();
      }
   },

   // DELETE /api/projects/:id
   delete: async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
   ) => {
      const { id } = request.params;
      await service.delete(id);
      return reply.json(200, 'OK');
   }
};

export default projectController;
