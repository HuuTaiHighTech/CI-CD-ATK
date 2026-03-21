import { type FastifyReply, type FastifyRequest } from 'fastify';
import service from '~/modules/product/service';
import { ProductQuerySchema, ProductSchema } from '~/modules/product/schema';
import { formData } from '~/utils';

const productController = {
  // GET /api/products
  get: async (request: FastifyRequest, reply: FastifyReply) => {
    const { lang } = request;
    const query = ProductQuerySchema.parse(request.query);
    const entities = await service.paginate(query, lang);
    return reply.json(200, 'OK', entities);
  },

  // GET /api/products/details
  getAll: async (request: FastifyRequest, reply: FastifyReply) => {
    const { lang } = request;
    const query = ProductQuerySchema.parse(request.query);
    const entities = await service.paginate(query, lang, true);
    return reply.json(200, 'OK', entities);
  },

  // GET /api/products/summary
  getSummary: async (request: FastifyRequest, reply: FastifyReply) => {
    const { lang } = request;
    const entities = await service.getSummary(lang);
    return reply.json(200, 'OK', entities);
  },

  // GET /api/products/top
  getTop: async (request: FastifyRequest, reply: FastifyReply) => {
    const { lang } = request;
    const entities = await service.getTop(lang);
    return reply.json(200, 'OK', entities);
  },

  // GET /api/products/pins
  getPinned: async (request: FastifyRequest, reply: FastifyReply) => {
    const { lang } = request;
    const entities = await service.getPinned(lang);
    return reply.json(200, 'OK', entities);
  },

  // GET /api/products/:slug
  getBySlug: async (
    request: FastifyRequest<{ Params: { slug: string } }>,
    reply: FastifyReply
  ) => {
    const { lang } = request;
    const { slug } = request.params;
    const product = await service.getBySlug(slug, lang);
    return reply.json(200, 'OK', product);
  },

  // GET /api/products/:id/details
  getById: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    const product = await service.getById(id);
    return reply.json(200, 'OK', product);
  },

  // POST /api/products
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { data, files } = await formData(request, ProductSchema);
      const product = await service.create(data, files);
      return reply.json(201, 'Thêm sản phẩm thành công', product);
    } finally {
      await request.cleanRequestFiles();
    }
  },

  // PATCH /api/products/:id
  update: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = request.params;
      const { data, files } = await formData(request, ProductSchema);
      const product = await service.update(id, data, files);
      return reply.json(200, 'Cập nhật sản phẩm thành công', product);
    } finally {
      await request.cleanRequestFiles();
    }
  },

  // DELETE /api/products/:id
  delete: async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    await service.delete(id);
    return reply.json(200, 'OK');
  }
};

export default productController;
