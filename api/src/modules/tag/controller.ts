import { type FastifyReply, type FastifyRequest } from 'fastify';
import service from '~/modules/tag/service';
import { TagQuerySchema, TagSchema } from '~/modules/tag/schema';

const tagController = {
  // GET /api/tags
  get: async (request: FastifyRequest, reply: FastifyReply) => {
    const { lang } = request;
    const entities = await service.get(lang);
    return reply.json(200, 'OK', entities);
  },

  // GET /api/tags/hot
  getHot: async (request: FastifyRequest, reply: FastifyReply) => {
    const { lang } = request;
    const entities = await service.getHot(lang);
    return reply.json(200, 'OK', entities);
  },

  // GET /api/tags/details
  paginate: async (request: FastifyRequest, reply: FastifyReply) => {
    const { lang } = request;
    const query = TagQuerySchema.parse(request.query);
    const entities = await service.paginate(query, lang);
    return reply.json(200, 'OK', entities);
  },

  // GET /api/tags/:id/details
  getById: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    const entity = await service.getById(id);
    return reply.json(200, 'OK', entity);
  },

  // GET /api/tags/:slug
  getBySlug: async (
    request: FastifyRequest<{ Params: { slug: string } }>,
    reply: FastifyReply
  ) => {
    const { lang } = request;
    const { slug } = request.params;
    const entity = await service.getBySlug(slug, lang);
    return reply.json(200, 'OK', entity);
  },

  // POST /api/tags
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    const data = TagSchema.parse(request.body);
    const entity = await service.create(data);
    return reply.json(201, 'Tạo nhãn thành công', entity);
  },

  // PATCH /api/tags/:id
  update: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    const data = TagSchema.parse(request.body);
    const entity = await service.update(id, data);
    return reply.json(200, 'Cập nhật nhãn thành công', entity);
  },

  // DELETE /api/tags/:id
  delete: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    await service.delete(id);
    return reply.json(200, 'OK');
  }
};

export default tagController;
